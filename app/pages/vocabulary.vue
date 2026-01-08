<script setup lang="ts">
import type { MasteryLevel } from '~/composables/useVocabulary'

const { speak, isSupported } = useSpeech()
const { getDailyWords, getReviewWords, markMastery, getStats } = useVocabulary()
const { fetchByLevel, fetchAndSaveWords, isLoading: isJishoLoading } = useJisho()
const { isLoggedIn } = useAuth()

// 当前模式：learn = 今日学习，review = 复习
type Mode = 'learn' | 'review'
const currentMode = ref<Mode>('learn')

// 单词列表
const words = ref<any[]>([])
const currentIndex = ref(0)
const showMeaning = ref(false)
const showExample = ref(false)
const isLoading = ref(true)
const isCompleted = ref(false)
const isSyncing = ref(false) // 是否正在同步单词
const syncProgress = ref('') // 同步进度信息

// 统计数据
const stats = ref({
  totalLearned: 0,
  masteredCount: 0,
  todayLearned: 0,
  needReview: 0,
})

// 当前单词
const currentWord = computed(() => words.value[currentIndex.value])

// 剩余未掌握的单词数（今日学习模式）
const remainingCount = computed(() => {
  if (currentMode.value === 'review') {
    return words.value.length - currentIndex.value
  }
  // 学习模式下，统计还未标记为 mastered 的单词
  return words.value.filter((w, i) => i >= currentIndex.value && w.userProgress?.mastery_level !== 'mastered').length
})

// 从 Jisho API 同步单词到数据库
const syncWordsFromApi = async (level: string = 'n5', pages: number = 10) => {
  isSyncing.value = true
  syncProgress.value = '正在从 Jisho.org 获取单词...'

  try {
    const savedCount = await fetchAndSaveWords(level, pages)
    syncProgress.value = `成功导入 ${savedCount} 个单词！`

    // 重新加载单词
    await loadDailyWords()
    await loadStats()
  } catch (e) {
    console.error('Failed to sync words:', e)
    syncProgress.value = '同步失败，请重试'
  } finally {
    setTimeout(() => {
      isSyncing.value = false
      syncProgress.value = ''
    }, 2000)
  }
}

// 加载今日学习单词
const loadDailyWords = async () => {
  isLoading.value = true
  isCompleted.value = false
  currentIndex.value = 0
  showMeaning.value = false
  showExample.value = false

  try {
    let data = await getDailyWords(20)

    // 如果数据库没有单词，尝试从 API 直接获取显示（不保存到数据库）
    if (data.length === 0 && !isLoggedIn.value) {
      const apiWords = await fetchByLevel('n5', 1)
      data = apiWords.slice(0, 20).map((w, i) => ({
        id: i + 1,
        ...w,
        fromApi: true,
      })) as any[]
    }

    // 过滤掉已掌握的单词
    words.value = data.filter(w => w.userProgress?.mastery_level !== 'mastered')

    if (words.value.length === 0) {
      isCompleted.value = true
    }
  } catch (e) {
    console.error('Failed to load daily words:', e)
    words.value = []
  } finally {
    isLoading.value = false
  }
}

// 加载复习单词
const loadReviewWords = async () => {
  isLoading.value = true
  isCompleted.value = false
  currentIndex.value = 0
  showMeaning.value = false
  showExample.value = false

  try {
    const data = await getReviewWords()
    words.value = data

    if (words.value.length === 0) {
      isCompleted.value = true
    }
  } catch (e) {
    console.error('Failed to load review words:', e)
    words.value = []
  } finally {
    isLoading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    stats.value = await getStats()
  } catch (e) {
    console.error('Failed to load stats:', e)
  }
}

// 切换模式
const switchMode = async (mode: Mode) => {
  currentMode.value = mode
  if (mode === 'learn') {
    await loadDailyWords()
  } else {
    await loadReviewWords()
  }
}

// 播放发音
const speakCurrentWord = () => {
  if (currentWord.value) {
    speak(currentWord.value.hiragana || currentWord.value.kanji)
  }
}

// 下一个单词
const nextWord = () => {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++
    showMeaning.value = false
    showExample.value = false
  } else {
    // 已完成所有单词
    isCompleted.value = true
    loadStats()
  }
}

// 上一个单词
const prevWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showMeaning.value = false
    showExample.value = false
  }
}

// 标记掌握程度
const handleMarkMastery = async (level: MasteryLevel) => {
  if (!currentWord.value || !isLoggedIn.value) return

  const success = await markMastery(
    currentWord.value.id,
    level,
    currentMode.value === 'review'
  )

  if (success) {
    // 更新当前单词的状态
    if (words.value[currentIndex.value]) {
      words.value[currentIndex.value].userProgress = {
        ...words.value[currentIndex.value].userProgress,
        mastery_level: level,
      }
    }

    // 如果是学习模式且标记为掌握，从列表中移除
    if (currentMode.value === 'learn' && level === 'mastered') {
      words.value.splice(currentIndex.value, 1)
      if (currentIndex.value >= words.value.length) {
        currentIndex.value = Math.max(0, words.value.length - 1)
      }
      if (words.value.length === 0) {
        isCompleted.value = true
        loadStats()
      }
      showMeaning.value = false
      showExample.value = false
    } else {
      // 自动进入下一个
      nextWord()
    }
  }
}

// 掌握程度配置
const masteryLevels = [
  { level: 'new' as MasteryLevel, label: '生词', color: 'error', icon: 'i-heroicons-x-circle' },
  { level: 'learning' as MasteryLevel, label: '模糊', color: 'warning', icon: 'i-heroicons-question-mark-circle' },
  { level: 'familiar' as MasteryLevel, label: '熟悉', color: 'primary', icon: 'i-heroicons-check-circle' },
  { level: 'mastered' as MasteryLevel, label: '掌握', color: 'success', icon: 'i-heroicons-star' },
]

// 初始化
onMounted(async () => {
  await loadDailyWords()
  await loadStats()
})
</script>

<template>
  <div class="min-h-screen pb-20">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white px-5 pt-6 pb-8 md:rounded-2xl md:mx-0 md:mt-0">
      <div class="flex items-center gap-3 mb-4">
        <NuxtLink to="/" class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-xl font-bold">背单词</h1>
          <p class="text-white/70 text-sm">每日20词 · 艾宾浩斯记忆</p>
        </div>
      </div>

      <!-- 模式切换 Tab -->
      <div class="flex gap-2 mt-4">
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          :class="currentMode === 'learn'
            ? 'bg-white text-purple-600'
            : 'bg-white/20 text-white hover:bg-white/30'"
          @click="switchMode('learn')"
        >
          <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
          今日学习
        </button>
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 relative"
          :class="currentMode === 'review'
            ? 'bg-white text-purple-600'
            : 'bg-white/20 text-white hover:bg-white/30'"
          @click="switchMode('review')"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          复习
          <!-- 待复习数量 -->
          <span
            v-if="stats.needReview > 0 && currentMode !== 'review'"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ stats.needReview > 99 ? '99+' : stats.needReview }}
          </span>
        </button>
      </div>
    </div>

    <div class="px-4 py-6">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-4 gap-2 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.todayLearned }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">今日学习</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalLearned }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">累计学习</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
          <p class="text-2xl font-bold text-emerald-500">{{ stats.masteredCount }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">已掌握</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
          <p class="text-2xl font-bold text-amber-500">{{ stats.needReview }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">待复习</p>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-purple-500 animate-spin" />
        <p class="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
      </div>

      <!-- 完成状态 -->
      <div v-else-if="isCompleted" class="max-w-md mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
          <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UIcon name="i-heroicons-check-badge" class="w-10 h-10 text-emerald-500" />
          </div>

          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ currentMode === 'learn' ? '今日学习完成！' : '复习完成！' }}
          </h2>

          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {{ currentMode === 'learn'
              ? '你已完成今日的单词学习，明天继续加油！'
              : '所有待复习的单词都已复习完毕。'
            }}
          </p>

          <div class="space-y-3">
            <button
              v-if="currentMode === 'learn'"
              class="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              @click="switchMode('review')"
            >
              去复习
            </button>
            <button
              class="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              @click="currentMode === 'learn' ? loadDailyWords() : loadReviewWords()"
            >
              重新开始
            </button>
          </div>
        </div>
      </div>

      <!-- 单词卡片 -->
      <div v-else-if="currentWord" class="max-w-md mx-auto">
        <!-- 进度 -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentMode === 'learn' ? '今日学习' : '复习' }}
          </span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ currentIndex + 1 }} / {{ words.length }}
            <span v-if="remainingCount !== words.length - currentIndex" class="text-gray-400">
              （剩余 {{ remainingCount }}）
            </span>
          </span>
        </div>

        <!-- 进度条 -->
        <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
          <div
            class="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300"
            :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"
          />
        </div>

        <!-- 单词卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <!-- 等级标签 -->
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
              {{ currentWord.level || 'N5' }}
            </span>
            <span
              v-if="currentWord.userProgress?.mastery_level"
              class="text-xs px-2 py-0.5 rounded-full"
              :class="{
                'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': currentWord.userProgress.mastery_level === 'new',
                'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400': currentWord.userProgress.mastery_level === 'learning',
                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': currentWord.userProgress.mastery_level === 'familiar',
                'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400': currentWord.userProgress.mastery_level === 'mastered',
              }"
            >
              {{ currentWord.userProgress.mastery_level === 'new' ? '生词'
                : currentWord.userProgress.mastery_level === 'learning' ? '模糊'
                : currentWord.userProgress.mastery_level === 'familiar' ? '熟悉'
                : '已掌握' }}
            </span>
          </div>

          <!-- 单词内容 -->
          <div class="p-6 text-center">
            <!-- 汉字 -->
            <h2 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {{ currentWord.kanji }}
            </h2>

            <!-- 假名 -->
            <p class="text-2xl text-purple-500 mb-2">
              {{ currentWord.hiragana }}
              <span v-if="currentWord.katakana" class="text-gray-400 text-lg ml-2">
                ({{ currentWord.katakana }})
              </span>
            </p>

            <!-- 罗马音 -->
            <p v-if="currentWord.romaji" class="text-sm text-gray-400 mb-4">
              {{ currentWord.romaji }}
            </p>

            <!-- 发音按钮 -->
            <button
              v-if="isSupported"
              class="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
              @click="speakCurrentWord"
            >
              <UIcon name="i-heroicons-speaker-wave" class="w-5 h-5" />
              <span>朗读</span>
            </button>

            <!-- 释义 -->
            <div class="mt-6">
              <button
                v-if="!showMeaning"
                class="px-6 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                @click="showMeaning = true"
              >
                点击显示释义
              </button>
              <div v-else class="space-y-2">
                <p class="text-xl text-gray-800 dark:text-gray-200">
                  {{ currentWord.meaning }}
                </p>
              </div>
            </div>

            <!-- 例句 -->
            <div v-if="currentWord.example_sentence" class="mt-4">
              <button
                v-if="!showExample"
                class="text-sm text-purple-500 hover:text-purple-600 transition-all"
                @click="showExample = true"
              >
                显示例句
              </button>
              <div v-else class="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left">
                <div class="flex items-start gap-2">
                  <p class="text-gray-800 dark:text-gray-200 flex-1">
                    {{ currentWord.example_sentence }}
                  </p>
                  <button
                    v-if="isSupported"
                    class="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all flex items-center justify-center"
                    @click="speak(currentWord.example_sentence)"
                    title="朗读例句"
                  >
                    <UIcon name="i-heroicons-speaker-wave" class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {{ currentWord.example_meaning }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 掌握程度按钮 -->
        <div v-if="isLoggedIn" class="mb-6">
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
            选择你对这个单词的掌握程度
          </p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="item in masteryLevels"
              :key="item.level"
              class="py-3 rounded-xl font-medium transition-all flex flex-col items-center gap-1"
              :class="{
                'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400': item.color === 'error',
                'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400': item.color === 'warning',
                'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400': item.color === 'primary',
                'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400': item.color === 'success',
              }"
              @click="handleMarkMastery(item.level)"
            >
              <UIcon :name="item.icon" class="w-5 h-5" />
              <span class="text-xs">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- 未登录提示 -->
        <div v-else class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <p class="text-sm text-amber-700 dark:text-amber-300 text-center">
            <NuxtLink to="/login" class="font-medium underline">登录</NuxtLink>
            后可保存学习进度
          </p>
        </div>

        <!-- 导航按钮 -->
        <div class="flex gap-4">
          <button
            class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="currentIndex === 0"
            @click="prevWord"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            上一个
          </button>
          <button
            class="flex-1 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="currentIndex === words.length - 1"
            @click="nextWord"
          >
            下一个
            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 无单词状态 -->
      <div v-else class="max-w-md mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
          <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UIcon name="i-heroicons-book-open" class="w-10 h-10 text-gray-400" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ currentMode === 'learn' ? '单词库为空' : '暂无需复习' }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {{ currentMode === 'learn' ? '点击下方按钮从网络获取日语单词' : '没有需要复习的单词。' }}
          </p>

          <!-- 同步单词按钮 -->
          <div v-if="currentMode === 'learn' && isLoggedIn" class="space-y-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">选择 JLPT 级别导入单词：</p>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="level in ['N5', 'N4', 'N3', 'N2', 'N1']"
                :key="level"
                class="py-2 rounded-lg text-sm font-medium transition-all"
                :class="level === 'N5'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                :disabled="isSyncing"
                @click="syncWordsFromApi(level.toLowerCase(), 10)"
              >
                {{ level }}
              </button>
            </div>

            <!-- 同步进度 -->
            <div v-if="isSyncing" class="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-purple-500 animate-spin" />
                <span class="text-purple-600 dark:text-purple-400">{{ syncProgress }}</span>
              </div>
            </div>
          </div>

          <!-- 未登录提示 -->
          <div v-else-if="currentMode === 'learn' && !isLoggedIn" class="mt-4">
            <p class="text-sm text-amber-600 dark:text-amber-400 mb-3">
              登录后可从网络导入更多单词
            </p>
            <NuxtLink
              to="/login"
              class="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium rounded-xl"
            >
              去登录
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部同步按钮（有单词时也可同步更多） -->
    <div v-if="!isLoading && words.length > 0 && isLoggedIn" class="fixed bottom-24 right-4">
      <button
        class="w-12 h-12 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        :disabled="isSyncing"
        @click="syncWordsFromApi('n5', 5)"
        title="从网络获取更多单词"
      >
        <UIcon
          :name="isSyncing ? 'i-heroicons-arrow-path' : 'i-heroicons-cloud-arrow-down'"
          class="w-6 h-6"
          :class="{ 'animate-spin': isSyncing }"
        />
      </button>
    </div>
  </div>
</template>
