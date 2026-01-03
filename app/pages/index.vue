<script setup lang="ts">
const { isLoggedIn, profile } = useAuth()

// 模拟学习数据（后续从 Supabase 获取）
const stats = ref({
  streak_days: 7,
  total_words: 156,
  mastered_words: 42,
  today_words_learned: 12,
  today_words_reviewed: 28,
})

const todayCheckedIn = ref(false)
const showCheckinSuccess = ref(false)

// 打卡动画
const handleCheckin = () => {
  todayCheckedIn.value = true
  showCheckinSuccess.value = true
  stats.value.streak_days++

  setTimeout(() => {
    showCheckinSuccess.value = false
  }, 2000)
}

// 获取问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 功能卡片
const features = [
  {
    path: '/gojuon',
    icon: 'i-heroicons-language',
    title: '五十音图',
    desc: '学习日语基础发音',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    path: '/vocabulary',
    icon: 'i-heroicons-book-open',
    title: '背单词',
    desc: '学习新单词，复习旧单词',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    path: '/notes',
    icon: 'i-heroicons-document-text',
    title: '学习笔记',
    desc: '记录学习心得和语法要点',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    path: '/checkin',
    icon: 'i-heroicons-calendar-days',
    title: '打卡记录',
    desc: '查看学习日历和统计',
    gradient: 'from-amber-500 to-orange-500',
  },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- ============ 移动端布局 ============ -->
    <div class="md:hidden">
      <!-- 顶部渐变背景 -->
      <div class="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white px-5 pt-8 pb-24 rounded-b-[2.5rem]">
        <!-- 问候语 -->
        <div class="mb-6">
          <p class="text-rose-100 text-sm">{{ greeting }}</p>
          <h1 class="text-2xl font-bold mt-1">
            {{ isLoggedIn && profile ? profile.nickname : '日语学习者' }} 👋
          </h1>
        </div>

        <!-- 打卡卡片 -->
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-5 relative overflow-hidden">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <div class="absolute -right-8 top-8 w-16 h-16 bg-white/10 rounded-full" />

          <div class="flex items-center justify-between relative z-10">
            <div>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-fire-solid"
                  class="w-7 h-7 text-amber-300"
                  :class="{ 'flame-animate': stats.streak_days > 0 }"
                />
                <span class="text-lg font-medium text-white/90">连续打卡</span>
              </div>
              <p class="text-4xl font-bold mt-2 flex items-baseline gap-1">
                <span :class="{ 'count-animate': showCheckinSuccess }">{{ stats.streak_days }}</span>
                <span class="text-lg font-normal text-white/70">天</span>
              </p>
            </div>

            <button
              :disabled="todayCheckedIn"
              class="relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce"
              :class="todayCheckedIn
                ? 'bg-white/30 text-white/70 cursor-not-allowed'
                : 'bg-white text-rose-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'"
              @click="handleCheckin"
            >
              <span v-if="!todayCheckedIn">打卡</span>
              <span v-else class="flex items-center gap-1">
                <UIcon name="i-heroicons-check" class="w-5 h-5" />
                已打卡
              </span>

              <div
                v-if="showCheckinSuccess"
                class="absolute inset-0 flex items-center justify-center bg-emerald-500 rounded-xl checkin-animate"
              >
                <UIcon name="i-heroicons-check" class="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="px-5 -mt-12 pb-6">
        <!-- 学习统计卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 mb-6">
          <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">今日学习</h2>
          <div class="grid grid-cols-4 gap-2">
            <div class="text-center">
              <p class="text-2xl font-bold text-rose-500">{{ stats.today_words_learned }}</p>
              <p class="text-xs text-gray-500 mt-1">新学</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-sky-500">{{ stats.today_words_reviewed }}</p>
              <p class="text-xs text-gray-500 mt-1">复习</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-emerald-500">{{ stats.mastered_words }}</p>
              <p class="text-xs text-gray-500 mt-1">掌握</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_words }}</p>
              <p class="text-xs text-gray-500 mt-1">总词汇</p>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">开始学习</h2>

        <div class="space-y-4">
          <NuxtLink
            v-for="(item, index) in features"
            :key="item.path"
            :to="item.path"
            class="block slide-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md card-hover flex items-center gap-4 border border-gray-100 dark:border-gray-700">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg"
                :class="item.gradient"
              >
                <UIcon :name="item.icon" class="w-7 h-7" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white text-base">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ item.desc }}</p>
              </div>
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- 每日一句 -->
        <div class="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-5 text-white relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p class="text-xs text-white/70 mb-2">每日一句</p>
          <p class="text-lg font-medium japanese-text">継続は力なり</p>
          <p class="text-sm text-white/80 mt-1">坚持就是力量</p>
        </div>
      </div>
    </div>

    <!-- ============ 桌面端布局 ============ -->
    <div class="hidden md:block">
      <!-- 头部欢迎区 -->
      <div class="mb-8">
        <p class="text-gray-500 dark:text-gray-400">{{ greeting }}</p>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {{ isLoggedIn && profile ? profile.nickname : '日语学习者' }} 👋
        </h1>
      </div>

      <!-- 顶部卡片区 - 打卡 + 统计 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <!-- 打卡卡片 -->
        <div class="col-span-1 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div class="absolute -right-12 top-12 w-24 h-24 bg-white/10 rounded-full" />

          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <UIcon
                name="i-heroicons-fire-solid"
                class="w-8 h-8 text-amber-300"
                :class="{ 'flame-animate': stats.streak_days > 0 }"
              />
              <span class="text-lg font-medium text-white/90">连续打卡</span>
            </div>

            <p class="text-5xl font-bold flex items-baseline gap-2 mb-6">
              <span :class="{ 'count-animate': showCheckinSuccess }">{{ stats.streak_days }}</span>
              <span class="text-xl font-normal text-white/70">天</span>
            </p>

            <button
              :disabled="todayCheckedIn"
              class="w-full relative py-3 rounded-xl font-semibold transition-all duration-300"
              :class="todayCheckedIn
                ? 'bg-white/30 text-white/70 cursor-not-allowed'
                : 'bg-white text-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'"
              @click="handleCheckin"
            >
              <span v-if="!todayCheckedIn">立即打卡</span>
              <span v-else class="flex items-center justify-center gap-2">
                <UIcon name="i-heroicons-check" class="w-5 h-5" />
                今日已打卡
              </span>

              <div
                v-if="showCheckinSuccess"
                class="absolute inset-0 flex items-center justify-center bg-emerald-500 rounded-xl checkin-animate"
              >
                <UIcon name="i-heroicons-check" class="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
        </div>

        <!-- 学习统计卡片 -->
        <div class="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">学习概览</h2>

          <div class="grid grid-cols-4 gap-6">
            <div class="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
              <p class="text-3xl font-bold text-rose-500">{{ stats.today_words_learned }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">今日新学</p>
            </div>
            <div class="text-center p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
              <p class="text-3xl font-bold text-sky-500">{{ stats.today_words_reviewed }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">今日复习</p>
            </div>
            <div class="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p class="text-3xl font-bold text-emerald-500">{{ stats.mastered_words }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">已掌握</p>
            </div>
            <div class="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.total_words }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">总词汇</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能入口 -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">快速开始</h2>

      <div class="grid grid-cols-3 gap-6">
        <NuxtLink
          v-for="item in features"
          :key="item.path"
          :to="item.path"
          class="group"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 card-hover h-full">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg mb-4 group-hover:scale-110 transition-transform"
              :class="item.gradient"
            >
              <UIcon :name="item.icon" class="w-7 h-7" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ item.title }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ item.desc }}
            </p>
            <div class="mt-4 flex items-center text-rose-500 font-medium group-hover:translate-x-1 transition-transform">
              <span>开始学习</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
