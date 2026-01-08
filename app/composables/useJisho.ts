/**
 * Jisho.org API composable
 * 用于从 Jisho 获取日语单词数据
 */

export interface JishoVocabulary {
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

interface JishoApiResponse {
  success: boolean
  data: JishoVocabulary[]
  total: number
  page: number
  keyword: string
  error?: string
}

export function useJisho() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 按 JLPT 级别获取单词
   * @param level - JLPT 级别 (n5, n4, n3, n2, n1)
   * @param page - 页码
   */
  const fetchByLevel = async (level: string = 'n5', page: number = 1): Promise<JishoVocabulary[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<JishoApiResponse>('/api/jisho', {
        query: {
          keyword: `#jlpt-${level.toLowerCase()}`,
          page,
        },
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch')
      }

      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch words'
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 按关键词搜索单词
   * @param keyword - 搜索关键词（日语或英语）
   */
  const searchWord = async (keyword: string): Promise<JishoVocabulary[]> => {
    if (!keyword.trim()) return []

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<JishoApiResponse>('/api/jisho', {
        query: { keyword },
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch')
      }

      return response.data
    } catch (e: any) {
      error.value = e.message || 'Search failed'
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取常用单词
   * @param page - 页码
   */
  const fetchCommonWords = async (page: number = 1): Promise<JishoVocabulary[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<JishoApiResponse>('/api/jisho', {
        query: {
          keyword: '#common',
          page,
        },
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch')
      }

      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch common words'
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 批量获取多页单词并保存到数据库
   * @param level - JLPT 级别
   * @param pages - 获取的页数
   */
  const fetchAndSaveWords = async (level: string = 'n5', pages: number = 5): Promise<number> => {
    const supabase = useSupabaseClient()
    let savedCount = 0

    for (let page = 1; page <= pages; page++) {
      const words = await fetchByLevel(level, page)

      if (words.length === 0) break

      // 保存到数据库
      for (const word of words) {
        try {
          // 检查是否已存在
          const { data: existing } = await (supabase as any)
            .from('vocabularies')
            .select('id')
            .eq('kanji', word.kanji)
            .eq('hiragana', word.hiragana)
            .single()

          if (!existing) {
            await (supabase as any)
              .from('vocabularies')
              .insert({
                kanji: word.kanji,
                hiragana: word.hiragana,
                katakana: word.katakana,
                romaji: word.romaji,
                meaning: word.meaning,
                example_sentence: word.example_sentence,
                example_meaning: word.example_meaning,
                level: word.level,
                difficulty_order: savedCount,
              })
            savedCount++
          }
        } catch (e) {
          console.error('Failed to save word:', word.kanji, e)
        }
      }

      // 避免请求过快
      await new Promise(r => setTimeout(r, 500))
    }

    return savedCount
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchByLevel,
    searchWord,
    fetchCommonWords,
    fetchAndSaveWords,
  }
}
