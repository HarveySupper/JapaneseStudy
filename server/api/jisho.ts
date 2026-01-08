// Jisho.org API 代理
// 解决 CORS 问题，并转换数据格式

interface JishoWord {
  slug: string
  japanese: Array<{
    word?: string
    reading: string
  }>
  senses: Array<{
    english_definitions: string[]
    parts_of_speech: string[]
    tags: string[]
  }>
  jlpt: string[]
  is_common: boolean
}

interface JishoResponse {
  data: JishoWord[]
}

interface VocabularyItem {
  kanji: string
  hiragana: string
  katakana: string
  romaji: string
  meaning: string
  example_sentence: string
  example_meaning: string
  level: string
  is_common: boolean
}

// 平假名转片假名
const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60)
  })
}

// 简单的罗马音转换（基础版）
const toRomaji = (hiragana: string): string => {
  const map: Record<string, string> = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
    'っ': '', // 促音，需要特殊处理
    'ー': '-',
  }

  let result = ''
  let i = 0
  while (i < hiragana.length) {
    // 尝试匹配两个字符的组合（拗音）
    if (i + 1 < hiragana.length) {
      const twoChar = hiragana.substring(i, i + 2)
      if (map[twoChar]) {
        result += map[twoChar]
        i += 2
        continue
      }
    }

    // 处理促音
    if (hiragana[i] === 'っ' && i + 1 < hiragana.length) {
      const nextChar = hiragana[i + 1]
      const nextRomaji = map[nextChar!] || nextChar
      if (nextRomaji && nextRomaji.length > 0) {
        result += nextRomaji[0] // 双写下一个辅音
      }
      i++
      continue
    }

    // 单字符匹配
    const char = hiragana[i]!
    result += map[char] || char
    i++
  }

  return result
}

// 转换 Jisho 数据为我们的格式
const transformWord = (word: JishoWord): VocabularyItem | null => {
  const japanese = word.japanese[0]
  if (!japanese) return null

  const kanji = japanese.word || japanese.reading
  const hiragana = japanese.reading
  const sense = word.senses[0]

  if (!sense) return null

  // 获取中文释义（Jisho 返回英文，这里先用英文）
  const meaning = sense.english_definitions.slice(0, 3).join('; ')

  // 获取 JLPT 级别
  const jlptLevel = word.jlpt[0] || ''
  const level = jlptLevel.replace('jlpt-', '').toUpperCase() || 'N5'

  return {
    kanji,
    hiragana,
    katakana: hiraganaToKatakana(hiragana),
    romaji: toRomaji(hiragana),
    meaning,
    example_sentence: '', // Jisho API 不直接提供例句
    example_meaning: '',
    level,
    is_common: word.is_common,
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const keyword = query.keyword as string || '#jlpt-n5'
  const page = parseInt(query.page as string) || 1

  try {
    // 调用 Jisho API
    const response = await $fetch<JishoResponse>(
      `https://jisho.org/api/v1/search/words`,
      {
        query: {
          keyword,
          page,
        },
      }
    )

    // 转换数据格式
    const words = response.data
      .map(transformWord)
      .filter((w): w is VocabularyItem => w !== null)

    return {
      success: true,
      data: words,
      total: words.length,
      page,
      keyword,
    }
  } catch (error: any) {
    console.error('Jisho API error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch from Jisho',
      data: [],
    }
  }
})
