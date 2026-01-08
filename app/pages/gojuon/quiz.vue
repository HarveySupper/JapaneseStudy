<script setup lang="ts">
const supabase = useSupabaseClient()
const { user, isLoggedIn } = useAuth()

// 获取用户ID
const getUserId = () => user.value?.id || user.value?.sub

// 五十音行顺序数据（横向：あいうえお、かきくけこ...）
const gojuonRowOrder = [
  { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
  { hiragana: 'い', katakana: 'イ', romaji: 'i' },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
  { hiragana: 'え', katakana: 'エ', romaji: 'e' },
  { hiragana: 'お', katakana: 'オ', romaji: 'o' },
  { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
  { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to' },
  { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
  { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me' },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
  { hiragana: 'れ', katakana: 'レ', romaji: 're' },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' },
  { hiragana: 'ん', katakana: 'ン', romaji: 'n' },
]

// 五十音列顺序数据（纵向：あかさたなはまやらわ、いきしちにひみり...）
const gojuonColumnOrder = [
  // あ段
  { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
  { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
  { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
  { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
  // い段
  { hiragana: 'い', katakana: 'イ', romaji: 'i' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
  // う段
  { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
  { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
  // え段
  { hiragana: 'え', katakana: 'エ', romaji: 'e' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te' },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me' },
  { hiragana: 'れ', katakana: 'レ', romaji: 're' },
  // お段
  { hiragana: 'お', katakana: 'オ', romaji: 'o' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to' },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' },
  // ん
  { hiragana: 'ん', katakana: 'ン', romaji: 'n' },
]

// 测验模式
type QuizMode = 'hiragana' | 'katakana'
type OrderMode = 'row' | 'column'
type QuizType = 'order' | 'random' // 顺序测验 或 随机测验
const quizType = ref<QuizType>('order')
const quizMode = ref<QuizMode>('hiragana')
const orderMode = ref<OrderMode>('row')

// 获取当前使用的顺序数组
const currentOrder = computed(() => orderMode.value === 'row' ? gojuonRowOrder : gojuonColumnOrder)

// 读音播放开关
const soundEnabled = ref(true)

// 使用全局语音 composable
const { speak } = useSpeech()

// 播放当前题目读音
const playCurrentSound = () => {
  if (!soundEnabled.value) return
  const char = currentOrder.value[currentIndex.value]
  if (char) {
    speak(char.hiragana, { rate: 0.8 })
  }
}

// 测验状态
const gameState = ref<'idle' | 'playing' | 'finished'>('idle')
const currentIndex = ref(0)
const score = ref(0)
const wrongAttempts = ref<Set<number>>(new Set()) // 当前题目的错误尝试
const completedChars = ref<number[]>([]) // 已完成的字符索引
const errorChars = ref<Set<number>>(new Set()) // 答错过的字符索引

// 打乱的选项顺序
const shuffledOptions = ref<number[]>([])

// ========== 随机测验相关状态 ==========
const RANDOM_QUIZ_TOTAL = 20 // 随机测验题目数量
type RandomKanaMode = 'hiragana' | 'katakana' | 'mixed' // 平假名 / 片假名 / 混合
const randomKanaMode = ref<RandomKanaMode>('mixed')
const randomQuizQuestions = ref<Array<{
  char: { hiragana: string; katakana: string; romaji: string }
  isHiragana: boolean // true: 显示平假名, false: 显示片假名
  options: string[] // 4个罗马音选项
  correctIndex: number // 正确答案的索引
}>>([])
const randomCurrentQuestion = ref(0)
const randomScore = ref(0)
const randomAnswered = ref(false) // 当前题目是否已回答
const randomSelectedIndex = ref<number | null>(null) // 用户选择的索引

// 初始化打乱顺序
const shuffleOptions = () => {
  const indices = currentOrder.value.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = indices[i]
    indices[i] = indices[j]!
    indices[j] = temp!
  }
  shuffledOptions.value = indices
}

// 开始测验
const startQuiz = (mode: QuizMode, order: OrderMode = 'row') => {
  quizType.value = 'order'
  quizMode.value = mode
  orderMode.value = order
  gameState.value = 'playing'
  currentIndex.value = 0
  score.value = currentOrder.value.length // 满分开始
  wrongAttempts.value = new Set()
  completedChars.value = []
  errorChars.value = new Set()
  shuffleOptions()
}

// 退出测验
const quitQuiz = () => {
  if (confirm('确定要退出测验吗？当前进度将不会保存。')) {
    gameState.value = 'idle'
    currentIndex.value = 0
    score.value = 0
    wrongAttempts.value = new Set()
    completedChars.value = []
    errorChars.value = new Set()
  }
}

// 获取当前显示的字符
const getCurrentChar = computed(() => {
  if (currentIndex.value >= currentOrder.value.length) return null
  const char = currentOrder.value[currentIndex.value]
  if (!char) return null
  return quizMode.value === 'hiragana' ? char.hiragana : char.katakana
})

// 获取当前提示（罗马音）
const getCurrentHint = computed(() => {
  if (currentIndex.value >= currentOrder.value.length) return ''
  const char = currentOrder.value[currentIndex.value]
  return char?.romaji || ''
})

// 选择答案
const selectAnswer = (optionIndex: number) => {
  if (gameState.value !== 'playing') return
  if (completedChars.value.includes(optionIndex)) return // 已选过的不能再选

  if (optionIndex === currentIndex.value) {
    // 正确答案
    completedChars.value.push(optionIndex)
    wrongAttempts.value = new Set()

    // 播放当前题目的读音
    playCurrentSound()

    currentIndex.value++

    // 检查是否完成
    if (currentIndex.value >= currentOrder.value.length) {
      finishQuiz()
    }
  } else {
    // 错误答案
    if (!wrongAttempts.value.has(optionIndex)) {
      wrongAttempts.value.add(optionIndex)
      errorChars.value.add(optionIndex)
      score.value = Math.max(0, score.value - 1)
    }
  }
}

// 完成测验
const finishQuiz = async () => {
  gameState.value = 'finished'

  // 保存到数据库
  if (isLoggedIn.value) {
    const userId = getUserId()
    if (userId) {
      try {
        // 构建测验类型标识
        const quizTypePrefix = quizMode.value === 'hiragana' ? 'hiragana' : 'katakana'
        const orderSuffix = orderMode.value === 'row' ? 'row_order' : 'column_order'
        await supabase.from('quiz_records').insert({
          user_id: userId,
          quiz_type: `${quizTypePrefix}_${orderSuffix}`,
          score: score.value,
          total: currentOrder.value.length,
        } as any)
      } catch (e) {
        console.error('Failed to save quiz record:', e)
      }
    }
  }
}

// 重新开始
const restart = () => {
  gameState.value = 'idle'
}

// 获取选项的字符
const getOptionChar = (index: number) => {
  const char = currentOrder.value[index]
  if (!char) return ''
  return quizMode.value === 'hiragana' ? char.hiragana : char.katakana
}

// 获取选项状态
const getOptionState = (optionIndex: number) => {
  if (completedChars.value.includes(optionIndex)) {
    return 'completed'
  }
  if (wrongAttempts.value.has(optionIndex)) {
    return 'wrong'
  }
  return 'normal'
}

// 进度百分比
const progress = computed(() => {
  return Math.round((currentIndex.value / currentOrder.value.length) * 100)
})

// 得分百分比
const scorePercent = computed(() => {
  return Math.round((score.value / currentOrder.value.length) * 100)
})

// ========== 随机测验函数 ==========

// 生成随机测验题目
const generateRandomQuestions = () => {
  const questions: typeof randomQuizQuestions.value = []
  const allChars = [...gojuonRowOrder]

  // 先打乱所有假名顺序，然后取前20个，确保不重复
  const shuffledChars = [...allChars]
  for (let i = shuffledChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffledChars[i]!
    shuffledChars[i] = shuffledChars[j]!
    shuffledChars[j] = temp
  }
  const selectedChars = shuffledChars.slice(0, RANDOM_QUIZ_TOTAL)

  for (const char of selectedChars) {
    // 根据模式决定显示平假名还是片假名
    let isHiragana: boolean
    if (randomKanaMode.value === 'hiragana') {
      isHiragana = true
    } else if (randomKanaMode.value === 'katakana') {
      isHiragana = false
    } else {
      isHiragana = Math.random() > 0.5
    }

    // 生成4个选项（1个正确 + 3个错误）
    const correctRomaji = char.romaji
    const wrongOptions: string[] = []

    // 获取所有其他罗马音
    const otherRomajis = allChars
      .filter(c => c.romaji !== correctRomaji)
      .map(c => c.romaji)

    // 随机选择3个错误选项
    while (wrongOptions.length < 3) {
      const randomIndex = Math.floor(Math.random() * otherRomajis.length)
      const wrongRomaji = otherRomajis[randomIndex]!
      if (!wrongOptions.includes(wrongRomaji)) {
        wrongOptions.push(wrongRomaji)
      }
    }

    // 将正确答案和错误选项混合
    const options = [correctRomaji, ...wrongOptions]
    // 打乱选项顺序
    for (let j = options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1))
      const temp = options[j]!
      options[j] = options[k]!
      options[k] = temp
    }

    // 找到正确答案的索引
    const correctIndex = options.indexOf(correctRomaji)

    questions.push({
      char,
      isHiragana,
      options,
      correctIndex,
    })
  }

  randomQuizQuestions.value = questions
}

// 开始随机测验
const startRandomQuiz = (kanaMode: RandomKanaMode = 'mixed') => {
  quizType.value = 'random'
  randomKanaMode.value = kanaMode
  gameState.value = 'playing'
  randomCurrentQuestion.value = 0
  randomScore.value = 0
  randomAnswered.value = false
  randomSelectedIndex.value = null
  generateRandomQuestions()
}

// 选择随机测验答案
const selectRandomAnswer = (index: number) => {
  if (randomAnswered.value) return

  randomAnswered.value = true
  randomSelectedIndex.value = index

  const currentQ = randomQuizQuestions.value[randomCurrentQuestion.value]
  if (currentQ && index === currentQ.correctIndex) {
    randomScore.value++
  }

  // 1秒后自动进入下一题
  setTimeout(() => {
    nextRandomQuestion()
  }, 1000)
}

// 下一题
const nextRandomQuestion = () => {
  if (randomCurrentQuestion.value < RANDOM_QUIZ_TOTAL - 1) {
    randomCurrentQuestion.value++
    randomAnswered.value = false
    randomSelectedIndex.value = null
  } else {
    finishRandomQuiz()
  }
}

// 完成随机测验
const finishRandomQuiz = async () => {
  gameState.value = 'finished'

  // 保存到数据库
  if (isLoggedIn.value) {
    const userId = getUserId()
    if (userId) {
      try {
        // quiz_type 格式: random_hiragana / random_katakana / random_mixed
        await supabase.from('quiz_records').insert({
          user_id: userId,
          quiz_type: `random_${randomKanaMode.value}`,
          score: randomScore.value,
          total: RANDOM_QUIZ_TOTAL,
        } as any)
      } catch (e) {
        console.error('Failed to save quiz record:', e)
      }
    }
  }
}

// 随机测验得分百分比
const randomScorePercent = computed(() => {
  return Math.round((randomScore.value / RANDOM_QUIZ_TOTAL) * 100)
})

// 获取当前随机题目
const currentRandomQuestion = computed(() => {
  return randomQuizQuestions.value[randomCurrentQuestion.value] || null
})

// 获取随机测验进度百分比
const randomProgress = computed(() => {
  return Math.round((randomCurrentQuestion.value / RANDOM_QUIZ_TOTAL) * 100)
})
</script>

<template>
  <div class="min-h-screen pb-20">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 pt-6 pb-8 md:rounded-2xl md:mx-0 md:mt-0">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/gojuon" class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-xl font-bold">五十音测验</h1>
          <p class="text-white/70 text-sm">顺序测验模式</p>
        </div>
      </div>
    </div>

    <div class="px-4 py-6">
      <!-- 选择模式（开始前） -->
      <div v-if="gameState === 'idle'" class="max-w-md mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">选择测验类型</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
            按照五十音顺序依次点击正确的假名
          </p>

          <!-- 行顺序测验（横向） -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
              行顺序（あいうえお...）
            </h3>
            <div class="space-y-3">
              <button
                class="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startQuiz('hiragana', 'row')"
              >
                <span class="text-2xl">あ</span>
                <span>平假名行顺序</span>
              </button>

              <button
                class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startQuiz('katakana', 'row')"
              >
                <span class="text-2xl">ア</span>
                <span>片假名行顺序</span>
              </button>
            </div>
          </div>

          <!-- 列顺序测验（纵向） -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-down" class="w-4 h-4" />
              列顺序（あかさたな...）
            </h3>
            <div class="space-y-3">
              <button
                class="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startQuiz('hiragana', 'column')"
              >
                <span class="text-2xl">あ</span>
                <span>平假名列顺序</span>
              </button>

              <button
                class="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startQuiz('katakana', 'column')"
              >
                <span class="text-2xl">ア</span>
                <span>片假名列顺序</span>
              </button>
            </div>
          </div>

          <!-- 随机测验 -->
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
              随机测验（选择正确的罗马音）
            </h3>
            <div class="space-y-3">
              <button
                class="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startRandomQuiz('hiragana')"
              >
                <span class="text-2xl">あ</span>
                <span>平假名随机</span>
              </button>

              <button
                class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startRandomQuiz('katakana')"
              >
                <span class="text-2xl">ア</span>
                <span>片假名随机</span>
              </button>

              <button
                class="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                @click="startRandomQuiz('mixed')"
              >
                <span class="text-2xl">?</span>
                <span>混合随机</span>
              </button>
            </div>
          </div>

          <!-- 规则说明 -->
          <div class="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">测验规则</h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>- 满分 46 分</li>
              <li>- 按顺序点击正确的假名</li>
              <li>- 点错一次扣 1 分</li>
              <li>- 可以继续选择直到正确</li>
            </ul>
          </div>

          <!-- 查看记录 -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/gojuon/records"
            class="mt-4 block text-center text-purple-500 hover:text-purple-600 font-medium"
          >
            查看测验记录
          </NuxtLink>
        </div>
      </div>

      <!-- 测验进行中 - 顺序测验 -->
      <div v-else-if="gameState === 'playing' && quizType === 'order'" class="max-w-2xl mx-auto">
        <!-- 进度和分数 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg mb-4">
          <!-- 顶部工具栏：退出按钮和声音开关 -->
          <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <!-- 退出按钮 -->
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
              @click="quitQuiz"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
              <span class="text-sm font-medium">退出</span>
            </button>

            <!-- 声音开关 -->
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
              :class="soundEnabled
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'"
              @click="soundEnabled = !soundEnabled"
            >
              <UIcon
                :name="soundEnabled ? 'i-heroicons-speaker-wave' : 'i-heroicons-speaker-x-mark'"
                class="w-4 h-4"
              />
              <span class="text-sm font-medium">{{ soundEnabled ? '读音已开' : '读音已关' }}</span>
            </button>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-flag" class="w-5 h-5 text-purple-500" />
              <span class="text-gray-600 dark:text-gray-400">进度</span>
            </div>
            <span class="font-bold text-gray-900 dark:text-white">{{ currentIndex }} / {{ currentOrder.length }}</span>
          </div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>

          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5 text-amber-500" />
              <span class="text-gray-600 dark:text-gray-400">当前得分</span>
            </div>
            <span class="font-bold text-gray-900 dark:text-white">{{ score }} 分</span>
          </div>
        </div>

        <!-- 当前题目 -->
        <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center mb-4 shadow-lg">
          <p class="text-white/70 text-sm mb-2">请点击第 {{ currentIndex + 1 }} 个假名</p>
          <p class="text-white/70 text-sm">（{{ quizMode === 'hiragana' ? '平假名' : '片假名' }}）</p>
        </div>

        <!-- 选项网格 -->
        <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          <button
            v-for="optionIndex in shuffledOptions"
            :key="optionIndex"
            class="aspect-square rounded-xl flex items-center justify-center text-xl font-medium transition-all duration-200"
            :class="{
              'bg-emerald-500 text-white shadow-lg cursor-default': getOptionState(optionIndex) === 'completed',
              'bg-red-500 text-white shadow-lg animate-shake': getOptionState(optionIndex) === 'wrong',
              'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white cursor-pointer': getOptionState(optionIndex) === 'normal',
            }"
            :disabled="getOptionState(optionIndex) === 'completed'"
            @click="selectAnswer(optionIndex)"
          >
            {{ getOptionChar(optionIndex) }}
          </button>
        </div>
      </div>

      <!-- 测验进行中 - 随机测验 -->
      <div v-else-if="gameState === 'playing' && quizType === 'random'" class="max-w-md mx-auto">
        <!-- 进度和分数 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg mb-4">
          <!-- 退出按钮 -->
          <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
              @click="quitQuiz"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
              <span class="text-sm font-medium">退出</span>
            </button>
            <span class="text-sm text-gray-500">随机测验</span>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-flag" class="w-5 h-5 text-purple-500" />
              <span class="text-gray-600 dark:text-gray-400">进度</span>
            </div>
            <span class="font-bold text-gray-900 dark:text-white">{{ randomCurrentQuestion + 1 }} / {{ RANDOM_QUIZ_TOTAL }}</span>
          </div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
              :style="{ width: `${randomProgress}%` }"
            />
          </div>

          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5 text-amber-500" />
              <span class="text-gray-600 dark:text-gray-400">正确数</span>
            </div>
            <span class="font-bold text-gray-900 dark:text-white">{{ randomScore }}</span>
          </div>
        </div>

        <!-- 当前题目 - 显示假名 -->
        <div v-if="currentRandomQuestion" class="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl p-8 text-white text-center mb-6 shadow-lg">
          <p class="text-white/70 text-sm mb-4">这个假名的读音是？</p>
          <p class="text-7xl font-bold mb-4">
            {{ currentRandomQuestion.isHiragana ? currentRandomQuestion.char.hiragana : currentRandomQuestion.char.katakana }}
          </p>
          <p class="text-white/70 text-sm">（{{ currentRandomQuestion.isHiragana ? '平假名' : '片假名' }}）</p>
        </div>

        <!-- 4个选项 -->
        <div v-if="currentRandomQuestion" class="grid grid-cols-2 gap-3">
          <button
            v-for="(option, index) in currentRandomQuestion.options"
            :key="index"
            class="py-4 px-6 rounded-xl text-xl font-bold transition-all duration-200"
            :class="{
              'bg-emerald-500 text-white shadow-lg': randomAnswered && index === currentRandomQuestion.correctIndex,
              'bg-red-500 text-white shadow-lg animate-shake': randomAnswered && randomSelectedIndex === index && index !== currentRandomQuestion.correctIndex,
              'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white cursor-pointer': !randomAnswered,
              'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-default': randomAnswered && index !== currentRandomQuestion.correctIndex && randomSelectedIndex !== index,
            }"
            :disabled="randomAnswered"
            @click="selectRandomAnswer(index)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <!-- 测验完成 - 顺序测验 -->
      <div v-else-if="gameState === 'finished' && quizType === 'order'" class="max-w-md mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
          <!-- 结果图标 -->
          <div
            class="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            :class="scorePercent >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30' : scorePercent >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'"
          >
            <UIcon
              :name="scorePercent >= 80 ? 'i-heroicons-trophy' : scorePercent >= 60 ? 'i-heroicons-hand-thumb-up' : 'i-heroicons-arrow-path'"
              class="w-12 h-12"
              :class="scorePercent >= 80 ? 'text-emerald-500' : scorePercent >= 60 ? 'text-amber-500' : 'text-red-500'"
            />
          </div>

          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ scorePercent >= 80 ? '太棒了！' : scorePercent >= 60 ? '不错！' : '继续加油！' }}
          </h2>

          <p class="text-gray-500 dark:text-gray-400 mb-4">
            {{ quizMode === 'hiragana' ? '平假名' : '片假名' }}顺序测验完成
          </p>

          <!-- 分数 -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
            <p class="text-4xl font-bold text-gray-900 dark:text-white">
              {{ score }} <span class="text-xl text-gray-500">/ {{ currentOrder.length }}</span>
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              正确率 {{ scorePercent }}%
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-3">
            <button
              class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              @click="startQuiz(quizMode, orderMode)"
            >
              再来一次
            </button>

            <button
              class="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              @click="restart"
            >
              返回选择
            </button>

            <NuxtLink
              v-if="isLoggedIn"
              to="/gojuon/records"
              class="block w-full py-3 text-center text-purple-500 hover:text-purple-600 font-medium"
            >
              查看测验记录
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 测验完成 - 随机测验 -->
      <div v-else-if="gameState === 'finished' && quizType === 'random'" class="max-w-md mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
          <!-- 结果图标 -->
          <div
            class="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            :class="randomScorePercent >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30' : randomScorePercent >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'"
          >
            <UIcon
              :name="randomScorePercent >= 80 ? 'i-heroicons-trophy' : randomScorePercent >= 60 ? 'i-heroicons-hand-thumb-up' : 'i-heroicons-arrow-path'"
              class="w-12 h-12"
              :class="randomScorePercent >= 80 ? 'text-emerald-500' : randomScorePercent >= 60 ? 'text-amber-500' : 'text-red-500'"
            />
          </div>

          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ randomScorePercent >= 80 ? '太棒了！' : randomScorePercent >= 60 ? '不错！' : '继续加油！' }}
          </h2>

          <p class="text-gray-500 dark:text-gray-400 mb-4">
            {{ randomKanaMode === 'hiragana' ? '平假名' : randomKanaMode === 'katakana' ? '片假名' : '混合' }}随机测验完成
          </p>

          <!-- 分数 -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
            <p class="text-4xl font-bold text-gray-900 dark:text-white">
              {{ randomScore }} <span class="text-xl text-gray-500">/ {{ RANDOM_QUIZ_TOTAL }}</span>
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              正确率 {{ randomScorePercent }}%
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-3">
            <button
              class="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              @click="startRandomQuiz(randomKanaMode)"
            >
              再来一次
            </button>

            <button
              class="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              @click="restart"
            >
              返回选择
            </button>

            <NuxtLink
              v-if="isLoggedIn"
              to="/gojuon/records"
              class="block w-full py-3 text-center text-purple-500 hover:text-purple-600 font-medium"
            >
              查看测验记录
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
