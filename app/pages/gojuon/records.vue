<script setup lang="ts">
const supabase = useSupabaseClient()
const { user, isLoggedIn } = useAuth()
const router = useRouter()

// 获取用户ID
const getUserId = () => user.value?.id || user.value?.sub

// 测验记录类型
interface QuizRecord {
  id: string
  user_id: string
  quiz_type: string
  score: number
  total: number
  created_at: string
}

// 记录列表
const records = ref<QuizRecord[]>([])
const loading = ref(true)
const selectedType = ref<'all' | 'hiragana' | 'katakana' | 'random'>('all')

// 获取记录
const fetchRecords = async () => {
  const userId = getUserId()
  if (!userId) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    let query = supabase
      .from('quiz_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (selectedType.value !== 'all') {
      // 按类别筛选
      if (selectedType.value === 'hiragana') {
        query = query.like('quiz_type', '%hiragana%')
      } else if (selectedType.value === 'katakana') {
        query = query.like('quiz_type', '%katakana%')
      } else if (selectedType.value === 'random') {
        query = query.like('quiz_type', 'random_%')
      }
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.error('Failed to fetch records:', error)
    } else {
      records.value = data || []
    }
  } catch (e) {
    console.error('Error fetching records:', e)
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化
watch(selectedType, () => {
  fetchRecords()
})

// 监听用户变化
watch(() => getUserId(), (newId) => {
  if (newId) {
    fetchRecords()
  }
}, { immediate: true })

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (days === 1) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

// 获取测验类型名称
const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    // 旧版类型（兼容）
    hiragana_order: '平假名顺序',
    katakana_order: '片假名顺序',
    // 顺序测验
    hiragana_row_order: '平假名行顺序',
    katakana_row_order: '片假名行顺序',
    hiragana_column_order: '平假名列顺序',
    katakana_column_order: '片假名列顺序',
    // 随机测验
    random_hiragana: '平假名随机',
    random_katakana: '片假名随机',
    random_mixed: '混合随机',
  }
  return names[type] || type
}

// 获取得分颜色
const getScoreColor = (score: number, total: number) => {
  const percent = (score / total) * 100
  if (percent >= 80) return 'text-emerald-500'
  if (percent >= 60) return 'text-amber-500'
  return 'text-red-500'
}

// 计算折线图数据
const chartData = computed(() => {
  // 按类型分组，取最近20条
  let filteredRecords = records.value
  if (selectedType.value === 'hiragana') {
    filteredRecords = records.value.filter(r => r.quiz_type.includes('hiragana'))
  } else if (selectedType.value === 'katakana') {
    filteredRecords = records.value.filter(r => r.quiz_type.includes('katakana'))
  } else if (selectedType.value === 'random') {
    filteredRecords = records.value.filter(r => r.quiz_type.startsWith('random_'))
  }

  // 倒序，让图表从左到右是时间递增
  const reversed = [...filteredRecords].reverse().slice(-20)

  return reversed.map(r => ({
    date: new Date(r.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    score: r.score,
    total: r.total,
    percent: Math.round((r.score / r.total) * 100),
  }))
})

// 计算统计数据
const stats = computed(() => {
  if (records.value.length === 0) {
    return { avg: 0, max: 0, count: 0 }
  }

  const scores = records.value.map(r => (r.score / r.total) * 100)
  return {
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    max: Math.round(Math.max(...scores)),
    count: records.value.length,
  }
})

// SVG 折线图路径
const chartPath = computed(() => {
  if (chartData.value.length < 2) return ''

  const width = 100
  const height = 60
  const padding = 5

  const points = chartData.value.map((d, i) => {
    const x = padding + (i / (chartData.value.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.percent / 100) * (height - padding * 2)
    return `${x},${y}`
  })

  return `M ${points.join(' L ')}`
})

// 折线图区域路径
const chartAreaPath = computed(() => {
  if (chartData.value.length < 2) return ''

  const width = 100
  const height = 60
  const padding = 5

  const points = chartData.value.map((d, i) => {
    const x = padding + (i / (chartData.value.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.percent / 100) * (height - padding * 2)
    return `${x},${y}`
  })

  const startX = padding
  const endX = padding + ((chartData.value.length - 1) / (chartData.value.length - 1)) * (width - padding * 2)

  return `M ${startX},${height - padding} L ${points.join(' L ')} L ${endX},${height - padding} Z`
})
</script>

<template>
  <div class="min-h-screen pb-20">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 pt-6 pb-8 md:rounded-2xl md:mx-0 md:mt-0">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/gojuon/quiz" class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-xl font-bold">测验记录</h1>
          <p class="text-white/70 text-sm">查看历史成绩</p>
        </div>
      </div>
    </div>

    <div class="px-4 py-6">
      <!-- 未登录提示 -->
      <div v-if="!isLoggedIn" class="max-w-md mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
          <UIcon name="i-heroicons-lock-closed" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">请先登录</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-4">登录后可查看测验记录</p>
          <NuxtLink
            to="/login"
            class="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl"
          >
            去登录
          </NuxtLink>
        </div>
      </div>

      <template v-else>
        <!-- 筛选和统计 -->
        <div class="max-w-2xl mx-auto mb-6">
          <!-- 筛选按钮 -->
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              v-for="option in [
                { value: 'all', label: '全部' },
                { value: 'hiragana', label: '平假名' },
                { value: 'katakana', label: '片假名' },
                { value: 'random', label: '随机' },
              ]"
              :key="option.value"
              class="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              :class="selectedType === option.value
                ? 'bg-purple-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'"
              @click="selectedType = option.value as any"
            >
              {{ option.label }}
            </button>
          </div>

          <!-- 统计卡片 -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
              <p class="text-2xl font-bold text-purple-500">{{ stats.count }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">测验次数</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
              <p class="text-2xl font-bold text-emerald-500">{{ stats.avg }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">平均正确率</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
              <p class="text-2xl font-bold text-amber-500">{{ stats.max }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">最高正确率</p>
            </div>
          </div>

          <!-- 折线图 -->
          <div v-if="chartData.length >= 2" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg mb-6">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-3">成绩趋势</h3>
            <div class="relative h-40">
              <svg class="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                <!-- 背景网格线 -->
                <line x1="5" y1="15" x2="95" y2="15" stroke="currentColor" class="text-gray-200 dark:text-gray-700" stroke-width="0.3" />
                <line x1="5" y1="30" x2="95" y2="30" stroke="currentColor" class="text-gray-200 dark:text-gray-700" stroke-width="0.3" />
                <line x1="5" y1="45" x2="95" y2="45" stroke="currentColor" class="text-gray-200 dark:text-gray-700" stroke-width="0.3" />

                <!-- 填充区域 -->
                <path
                  :d="chartAreaPath"
                  fill="url(#gradient)"
                  opacity="0.3"
                />

                <!-- 折线 -->
                <path
                  :d="chartPath"
                  fill="none"
                  stroke="url(#lineGradient)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <!-- 数据点 -->
                <circle
                  v-for="(d, i) in chartData"
                  :key="i"
                  :cx="5 + (i / (chartData.length - 1)) * 90"
                  :cy="55 - (d.percent / 100) * 50"
                  r="2"
                  fill="white"
                  stroke="url(#lineGradient)"
                  stroke-width="1"
                />

                <!-- 渐变定义 -->
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color: rgb(168, 85, 247); stop-opacity: 0.5" />
                    <stop offset="100%" style="stop-color: rgb(168, 85, 247); stop-opacity: 0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color: rgb(168, 85, 247)" />
                    <stop offset="100%" style="stop-color: rgb(236, 72, 153)" />
                  </linearGradient>
                </defs>
              </svg>

              <!-- Y轴标签 -->
              <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-1">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>
            </div>

            <!-- X轴标签 -->
            <div class="flex justify-between text-xs text-gray-400 mt-2 px-6">
              <span>{{ chartData[0]?.date }}</span>
              <span>{{ chartData[chartData.length - 1]?.date }}</span>
            </div>
          </div>

          <!-- 记录列表 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 class="font-medium text-gray-800 dark:text-gray-200">历史记录</h3>
            </div>

            <!-- 加载中 -->
            <div v-if="loading" class="p-8 text-center">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-purple-500 mx-auto" />
              <p class="text-gray-500 dark:text-gray-400 mt-2">加载中...</p>
            </div>

            <!-- 空状态 -->
            <div v-else-if="records.length === 0" class="p-8 text-center">
              <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">暂无测验记录</p>
              <NuxtLink
                to="/gojuon/quiz"
                class="inline-block mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm"
              >
                去测验
              </NuxtLink>
            </div>

            <!-- 记录列表 -->
            <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
              <div
                v-for="record in records"
                :key="record.id"
                class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center"
                    :class="record.quiz_type.includes('hiragana') ? 'bg-pink-100 dark:bg-pink-900/30'
                      : record.quiz_type.includes('katakana') ? 'bg-indigo-100 dark:bg-indigo-900/30'
                      : 'bg-purple-100 dark:bg-purple-900/30'"
                  >
                    <span class="text-lg">{{
                      record.quiz_type.includes('hiragana') ? 'あ'
                      : record.quiz_type.includes('katakana') ? 'ア'
                      : '?'
                    }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-200">{{ getTypeName(record.quiz_type) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(record.created_at) }}</p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="font-bold" :class="getScoreColor(record.score, record.total)">
                    {{ record.score }} / {{ record.total }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ Math.round((record.score / record.total) * 100) }}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
