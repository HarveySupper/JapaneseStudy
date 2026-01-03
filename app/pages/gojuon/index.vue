<script setup lang="ts">
// 50音数据
const gojuonData = [
  { row: 'あ行', chars: [
    { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
    { hiragana: 'い', katakana: 'イ', romaji: 'i' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
    { hiragana: 'え', katakana: 'エ', romaji: 'e' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o' },
  ]},
  { row: 'か行', chars: [
    { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
    { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
    { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
  ]},
  { row: 'さ行', chars: [
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
    { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su' },
    { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
  ]},
  { row: 'た行', chars: [
    { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
    { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te' },
    { hiragana: 'と', katakana: 'ト', romaji: 'to' },
  ]},
  { row: 'な行', chars: [
    { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
    { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
    { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
  ]},
  { row: 'は行', chars: [
    { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
    { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
    { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
  ]},
  { row: 'ま行', chars: [
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
    { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
    { hiragana: 'め', katakana: 'メ', romaji: 'me' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
  ]},
  { row: 'や行', chars: [
    { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
  ]},
  { row: 'ら行', chars: [
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
    { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
    { hiragana: 'れ', katakana: 'レ', romaji: 're' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
  ]},
  { row: 'わ行', chars: [
    { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' },
  ]},
  { row: 'ん', chars: [
    { hiragana: 'ん', katakana: 'ン', romaji: 'n' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: '', katakana: '', romaji: '' },
    { hiragana: '', katakana: '', romaji: '' },
  ]},
]

// 显示模式：hiragana 平假名, katakana 片假名, both 两者
const displayMode = ref<'hiragana' | 'katakana' | 'both'>('both')

// 当前播放的字符
const playingChar = ref('')

// 使用全局语音 composable
const { speak: speechSpeak } = useSpeech()

// 播放发音
const speak = (char: { hiragana: string; katakana: string; romaji: string }) => {
  if (!char.hiragana) return

  playingChar.value = char.hiragana
  speechSpeak(char.hiragana, { rate: 0.8 })

  // 延迟清除播放状态
  setTimeout(() => {
    playingChar.value = ''
  }, 800)
}

// 列标题
const columnHeaders = ['a', 'i', 'u', 'e', 'o']
</script>

<template>
  <div class="min-h-screen pb-20">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white px-5 pt-6 pb-8 md:rounded-2xl md:mx-0 md:mt-0">
      <div class="flex items-center gap-3 mb-4">
        <NuxtLink to="/" class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-xl font-bold">五十音图</h1>
          <p class="text-white/70 text-sm">点击假名听发音</p>
        </div>
      </div>

      <!-- 显示模式切换 -->
      <div class="flex gap-2 mt-4">
        <button
          v-for="mode in [
            { value: 'hiragana', label: '平假名' },
            { value: 'katakana', label: '片假名' },
            { value: 'both', label: '两者' },
          ]"
          :key="mode.value"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          :class="displayMode === mode.value
            ? 'bg-white text-rose-500'
            : 'bg-white/20 text-white hover:bg-white/30'"
          @click="displayMode = mode.value as any"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <!-- 50音表 -->
    <div class="px-4 py-6">
      <!-- 介绍卡片 -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
        <h2 class="font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
          关于五十音
        </h2>
        <p class="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
          五十音是日语的基础发音系统，由平假名（ひらがな）和片假名（カタカナ）组成。
          平假名用于书写日语原生词汇，片假名主要用于外来语。掌握五十音是学习日语的第一步！
        </p>
      </div>

      <!-- 测验入口 -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <NuxtLink
          to="/gojuon/quiz"
          class="block bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <div class="flex items-center gap-3 pointer-events-none">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-pencil-square" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold">顺序测验</h3>
              <p class="text-white/70 text-xs mt-0.5">检验学习成果</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/gojuon/records"
          class="block bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <div class="flex items-center gap-3 pointer-events-none">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold">学习记录</h3>
              <p class="text-white/70 text-xs mt-0.5">查看历史成绩</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 列标题 -->
      <div class="grid grid-cols-6 gap-2 mb-2">
        <div class="text-center text-sm text-gray-400"></div>
        <div
          v-for="header in columnHeaders"
          :key="header"
          class="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
        >
          {{ header }}
        </div>
      </div>

      <!-- 50音行 -->
      <div class="space-y-2">
        <div
          v-for="row in gojuonData"
          :key="row.row"
          class="grid grid-cols-6 gap-2"
        >
          <!-- 行标题 -->
          <div class="flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ row.row }}
          </div>

          <!-- 字符卡片 -->
          <button
            v-for="(char, index) in row.chars"
            :key="index"
            class="aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200"
            :class="[
              char.hiragana
                ? 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-gray-100 dark:border-gray-700 cursor-pointer'
                : 'bg-gray-50 dark:bg-gray-800/50',
              playingChar === char.hiragana && char.hiragana ? 'ring-2 ring-rose-500 scale-105 bg-rose-50 dark:bg-rose-900/30' : ''
            ]"
            :disabled="!char.hiragana"
            @click="speak(char)"
          >
            <template v-if="char.hiragana">
              <!-- 平假名 -->
              <span
                v-if="displayMode === 'hiragana' || displayMode === 'both'"
                class="text-2xl md:text-3xl font-medium text-gray-800 dark:text-white"
                :class="displayMode === 'both' ? 'text-xl md:text-2xl' : ''"
              >
                {{ char.hiragana }}
              </span>

              <!-- 片假名 -->
              <span
                v-if="displayMode === 'katakana' || displayMode === 'both'"
                class="text-gray-500 dark:text-gray-400"
                :class="[
                  displayMode === 'katakana' ? 'text-2xl md:text-3xl font-medium text-gray-800 dark:text-white' : 'text-xs md:text-sm',
                ]"
              >
                {{ char.katakana }}
              </span>

              <!-- 罗马音 -->
              <span class="text-[10px] md:text-xs text-rose-500 mt-0.5">
                {{ char.romaji }}
              </span>
            </template>
          </button>
        </div>
      </div>

      <!-- 浊音和半浊音 -->
      <h3 class="text-lg font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-speaker-wave" class="w-5 h-5 text-rose-500" />
        浊音・半浊音
      </h3>

      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          在清音基础上加上浊点「゛」变成浊音，加上半浊点「゜」变成半浊音。
        </p>

        <!-- 浊音表 -->
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="char in [
              { hiragana: 'が', katakana: 'ガ', romaji: 'ga' },
              { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi' },
              { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu' },
              { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge' },
              { hiragana: 'ご', katakana: 'ゴ', romaji: 'go' },
              { hiragana: 'ざ', katakana: 'ザ', romaji: 'za' },
              { hiragana: 'じ', katakana: 'ジ', romaji: 'ji' },
              { hiragana: 'ず', katakana: 'ズ', romaji: 'zu' },
              { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze' },
              { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo' },
              { hiragana: 'だ', katakana: 'ダ', romaji: 'da' },
              { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji' },
              { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu' },
              { hiragana: 'で', katakana: 'デ', romaji: 'de' },
              { hiragana: 'ど', katakana: 'ド', romaji: 'do' },
              { hiragana: 'ば', katakana: 'バ', romaji: 'ba' },
              { hiragana: 'び', katakana: 'ビ', romaji: 'bi' },
              { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu' },
              { hiragana: 'べ', katakana: 'ベ', romaji: 'be' },
              { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo' },
              { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa' },
              { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi' },
              { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu' },
              { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe' },
              { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po' },
            ]"
            :key="char.romaji"
            class="aspect-square rounded-xl flex flex-col items-center justify-center bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-100 dark:border-gray-600"
            :class="playingChar === char.hiragana ? 'ring-2 ring-rose-500 scale-105 bg-rose-50 dark:bg-rose-900/30' : ''"
            @click="speak(char)"
          >
            <span
              v-if="displayMode === 'hiragana' || displayMode === 'both'"
              class="font-medium text-gray-800 dark:text-white"
              :class="displayMode === 'both' ? 'text-lg' : 'text-xl'"
            >
              {{ char.hiragana }}
            </span>
            <span
              v-if="displayMode === 'katakana' || displayMode === 'both'"
              :class="[
                displayMode === 'katakana' ? 'text-xl font-medium text-gray-800 dark:text-white' : 'text-xs text-gray-500 dark:text-gray-400',
              ]"
            >
              {{ char.katakana }}
            </span>
            <span class="text-[10px] text-rose-500">{{ char.romaji }}</span>
          </button>
        </div>
      </div>

      <!-- 拗音 -->
      <h3 class="text-lg font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-musical-note" class="w-5 h-5 text-purple-500" />
        拗音
      </h3>

      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          拗音是「い」段假名与小写的「や」「ゆ」「よ」组合而成的发音。
        </p>

        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="char in [
              { hiragana: 'きゃ', katakana: 'キャ', romaji: 'kya' },
              { hiragana: 'きゅ', katakana: 'キュ', romaji: 'kyu' },
              { hiragana: 'きょ', katakana: 'キョ', romaji: 'kyo' },
              { hiragana: 'しゃ', katakana: 'シャ', romaji: 'sha' },
              { hiragana: 'しゅ', katakana: 'シュ', romaji: 'shu' },
              { hiragana: 'しょ', katakana: 'ショ', romaji: 'sho' },
              { hiragana: 'ちゃ', katakana: 'チャ', romaji: 'cha' },
              { hiragana: 'ちゅ', katakana: 'チュ', romaji: 'chu' },
              { hiragana: 'ちょ', katakana: 'チョ', romaji: 'cho' },
              { hiragana: 'にゃ', katakana: 'ニャ', romaji: 'nya' },
              { hiragana: 'にゅ', katakana: 'ニュ', romaji: 'nyu' },
              { hiragana: 'にょ', katakana: 'ニョ', romaji: 'nyo' },
              { hiragana: 'ひゃ', katakana: 'ヒャ', romaji: 'hya' },
              { hiragana: 'ひゅ', katakana: 'ヒュ', romaji: 'hyu' },
              { hiragana: 'ひょ', katakana: 'ヒョ', romaji: 'hyo' },
              { hiragana: 'みゃ', katakana: 'ミャ', romaji: 'mya' },
              { hiragana: 'みゅ', katakana: 'ミュ', romaji: 'myu' },
              { hiragana: 'みょ', katakana: 'ミョ', romaji: 'myo' },
              { hiragana: 'りゃ', katakana: 'リャ', romaji: 'rya' },
              { hiragana: 'りゅ', katakana: 'リュ', romaji: 'ryu' },
              { hiragana: 'りょ', katakana: 'リョ', romaji: 'ryo' },
              { hiragana: 'ぎゃ', katakana: 'ギャ', romaji: 'gya' },
              { hiragana: 'ぎゅ', katakana: 'ギュ', romaji: 'gyu' },
              { hiragana: 'ぎょ', katakana: 'ギョ', romaji: 'gyo' },
              { hiragana: 'じゃ', katakana: 'ジャ', romaji: 'ja' },
              { hiragana: 'じゅ', katakana: 'ジュ', romaji: 'ju' },
              { hiragana: 'じょ', katakana: 'ジョ', romaji: 'jo' },
              { hiragana: 'びゃ', katakana: 'ビャ', romaji: 'bya' },
              { hiragana: 'びゅ', katakana: 'ビュ', romaji: 'byu' },
              { hiragana: 'びょ', katakana: 'ビョ', romaji: 'byo' },
              { hiragana: 'ぴゃ', katakana: 'ピャ', romaji: 'pya' },
              { hiragana: 'ぴゅ', katakana: 'ピュ', romaji: 'pyu' },
              { hiragana: 'ぴょ', katakana: 'ピョ', romaji: 'pyo' },
            ]"
            :key="char.romaji"
            class="aspect-[4/3] rounded-xl flex flex-col items-center justify-center bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-100 dark:border-gray-600"
            :class="playingChar === char.hiragana ? 'ring-2 ring-purple-500 scale-105 bg-purple-50 dark:bg-purple-900/30' : ''"
            @click="speak(char)"
          >
            <span
              v-if="displayMode === 'hiragana' || displayMode === 'both'"
              class="font-medium text-gray-800 dark:text-white"
              :class="displayMode === 'both' ? 'text-base' : 'text-lg'"
            >
              {{ char.hiragana }}
            </span>
            <span
              v-if="displayMode === 'katakana' || displayMode === 'both'"
              :class="[
                displayMode === 'katakana' ? 'text-lg font-medium text-gray-800 dark:text-white' : 'text-xs text-gray-500 dark:text-gray-400',
              ]"
            >
              {{ char.katakana }}
            </span>
            <span class="text-[10px] text-purple-500">{{ char.romaji }}</span>
          </button>
        </div>
      </div>

      <!-- 学习提示 -->
      <div class="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 class="font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
          <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
          学习建议
        </h3>
        <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>1. 先熟悉平假名，再学习片假名</li>
          <li>2. 每天练习一行，循序渐进</li>
          <li>3. 多听多读，培养语感</li>
          <li>4. 结合单词记忆，事半功倍</li>
        </ul>
      </div>
    </div>
  </div>
</template>
