<script setup lang="ts">
const router = useRouter()
const { user, profile, isLoggedIn, signOut, loading } = useAuth()

// 调试信息（开发环境）
if (import.meta.dev) {
  watchEffect(() => {
    console.log('Profile Page State:', {
      isLoggedIn: isLoggedIn.value,
      hasProfile: !!profile.value,
      loading: loading.value,
      userId: user.value?.id || user.value?.sub,
    })
  })
}

// 学习统计（后续从数据库获取）
const stats = ref({
  total_words: 156,
  mastered_words: 42,
  total_notes: 8,
  streak_days: 7,
  total_study_time: 180, // 分钟
})

// 格式化学习时间
const formattedStudyTime = computed(() => {
  const hours = Math.floor(stats.value.total_study_time / 60)
  const minutes = stats.value.total_study_time % 60
  if (hours === 0 && minutes === 0) return '0分钟'
  return hours > 0 ? `${hours}h${minutes}m` : `${minutes}分钟`
})

// 设置项
const settings = [
  { icon: 'i-heroicons-cog-6-tooth', label: '应用设置', desc: '主题、通知、语言', path: '/settings', color: 'bg-gray-500' },
  { icon: 'i-heroicons-arrow-down-tray', label: '数据导出', desc: '导出学习记录', path: '/export', color: 'bg-sky-500' },
  { icon: 'i-heroicons-arrow-up-tray', label: '数据导入', desc: '导入单词本', path: '/import', color: 'bg-emerald-500' },
  { icon: 'i-heroicons-information-circle', label: '关于', desc: '版本信息', path: '/about', color: 'bg-purple-500' },
]

// 退出登录
const handleSignOut = async () => {
  await signOut()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- ============ 移动端布局 ============ -->
    <div class="md:hidden">
      <!-- 已登录状态 (有 profile 数据) -->
      <template v-if="isLoggedIn && profile">
        <!-- 顶部渐变背景 + 用户信息 -->
        <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-5 pt-8 pb-20 rounded-b-[2.5rem]">
          <div class="flex items-center gap-4">
            <!-- 头像 -->
            <div class="relative">
              <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                <img
                  v-if="profile.avatar_url"
                  :src="profile.avatar_url"
                  :alt="profile.nickname"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-3xl">🌸</span>
              </div>
              <!-- 编辑按钮 -->
              <button class="absolute -right-1 -bottom-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <UIcon name="i-heroicons-pencil" class="w-4 h-4 text-purple-500" />
              </button>
            </div>

            <!-- 用户信息 -->
            <div class="flex-1">
              <h1 class="text-xl font-bold">{{ profile.nickname || '日语学习者' }}</h1>
              <p class="text-white/70 text-sm mt-0.5">{{ profile.email }}</p>
              <div class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-amber-300" />
                <span>目标: {{ profile.study_goal || 'JLPT N3' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习统计卡片 -->
        <div class="px-5 -mt-12 pb-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 mb-6">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">学习成就</h2>
            <div class="grid grid-cols-4 gap-2">
              <div class="text-center p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                <p class="text-xl font-bold text-rose-500">{{ stats.total_words }}</p>
                <p class="text-[10px] text-gray-500 mt-1">单词量</p>
              </div>
              <div class="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p class="text-xl font-bold text-emerald-500">{{ stats.mastered_words }}</p>
                <p class="text-[10px] text-gray-500 mt-1">已掌握</p>
              </div>
              <div class="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p class="text-xl font-bold text-amber-500">{{ stats.streak_days }}</p>
                <p class="text-[10px] text-gray-500 mt-1">连续天</p>
              </div>
              <div class="text-center p-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                <p class="text-xl font-bold text-sky-500">{{ formattedStudyTime }}</p>
                <p class="text-[10px] text-gray-500 mt-1">学习</p>
              </div>
            </div>
          </div>

          <!-- 设置菜单 -->
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">设置</h2>
          <div class="space-y-3">
            <NuxtLink
              v-for="item in settings"
              :key="item.label"
              :to="item.path"
              class="block"
            >
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md flex items-center gap-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                  :class="item.color"
                >
                  <UIcon :name="item.icon" class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.label }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.desc }}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- 退出登录按钮 -->
          <button
            class="w-full mt-6 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            @click="handleSignOut"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </template>

      <!-- 加载中 (已登录但 profile 还没加载) -->
      <div v-else-if="isLoggedIn && !profile" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-purple-500 mx-auto" />
          <p class="mt-3 text-gray-500">加载中...</p>
        </div>
      </div>

      <!-- 未登录状态 -->
      <div v-else class="min-h-screen">
        <!-- 渐变背景 -->
        <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-5 pt-12 pb-32 rounded-b-[3rem]">
          <div class="text-center">
            <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span class="text-5xl">🌸</span>
            </div>
            <h1 class="text-2xl font-bold">日语学习助手</h1>
            <p class="text-white/70 mt-2">登录后同步学习数据</p>
          </div>
        </div>

        <!-- 登录注册卡片 -->
        <div class="px-5 -mt-20 pb-6">
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">开始你的学习之旅</h2>

            <div class="space-y-4">
              <NuxtLink to="/login" class="block">
                <button class="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
                  <span>立即登录</span>
                </button>
              </NuxtLink>

              <NuxtLink to="/register" class="block">
                <button class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                  <UIcon name="i-heroicons-user-plus" class="w-5 h-5" />
                  <span>免费注册</span>
                </button>
              </NuxtLink>
            </div>

            <!-- 功能预览 -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-500 text-center mb-4">登录后可享受以下功能</p>
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                  <UIcon name="i-heroicons-book-open" class="w-6 h-6 text-rose-500 mx-auto" />
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">背单词</p>
                </div>
                <div class="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <UIcon name="i-heroicons-cloud" class="w-6 h-6 text-emerald-500 mx-auto" />
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">云同步</p>
                </div>
                <div class="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <UIcon name="i-heroicons-fire" class="w-6 h-6 text-amber-500 mx-auto" />
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">打卡</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 桌面端布局 ============ -->
    <div class="hidden md:block">
      <!-- 已登录状态 -->
      <template v-if="isLoggedIn && profile">
        <!-- 用户信息卡片 -->
        <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden mb-8">
          <div class="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full" />
          <div class="absolute -right-24 top-16 w-32 h-32 bg-white/10 rounded-full" />

          <div class="relative z-10 flex items-center gap-6">
            <!-- 头像 -->
            <div class="relative">
              <div class="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                <img
                  v-if="profile.avatar_url"
                  :src="profile.avatar_url"
                  :alt="profile.nickname"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-4xl">🌸</span>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="flex-1">
              <h1 class="text-2xl font-bold">{{ profile.nickname || '日语学习者' }}</h1>
              <p class="text-white/70 mt-1">{{ profile.email }}</p>
              <div class="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-amber-300" />
                <span>目标: {{ profile.study_goal || 'JLPT N3' }}</span>
              </div>
            </div>

            <!-- 编辑按钮 -->
            <button class="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
              <span>编辑资料</span>
            </button>
          </div>
        </div>

        <!-- 学习统计 -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">学习成就</h2>
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-book-open" class="w-7 h-7 text-rose-500" />
              </div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.total_words }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">学习单词</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check-badge" class="w-7 h-7 text-emerald-500" />
              </div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.mastered_words }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">已掌握</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-fire" class="w-7 h-7 text-amber-500" />
              </div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.streak_days }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">连续打卡</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-clock" class="w-7 h-7 text-sky-500" />
              </div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formattedStudyTime }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">学习时长</p>
            </div>
          </div>
        </div>

        <!-- 设置菜单 -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">设置</h2>
        <div class="grid grid-cols-2 gap-4 mb-8">
          <NuxtLink
            v-for="item in settings"
            :key="item.label"
            :to="item.path"
            class="group"
          >
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-xl hover:scale-[1.01] transition-all">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                :class="item.color"
              >
                <UIcon :name="item.icon" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.label }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.desc }}</p>
              </div>
              <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>
        </div>

        <!-- 退出登录按钮 -->
        <button
          class="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
          @click="handleSignOut"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </template>

      <!-- 加载中 (已登录但 profile 还没加载) -->
      <div v-else-if="isLoggedIn && !profile" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-purple-500 mx-auto" />
          <p class="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>

      <!-- 未登录状态 -->
      <div v-else>
        <div class="grid grid-cols-2 gap-8">
          <!-- 左侧介绍 -->
          <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full" />
            <div class="absolute -right-24 top-24 w-32 h-32 bg-white/10 rounded-full" />
            <div class="absolute -left-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full" />

            <div class="relative z-10">
              <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <span class="text-4xl">🌸</span>
              </div>
              <h1 class="text-3xl font-bold mb-3">日语学习助手</h1>
              <p class="text-white/80 mb-8">登录后同步学习数据，随时随地继续学习</p>

              <!-- 功能列表 -->
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
                  </div>
                  <span>智能背单词，科学记忆曲线</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <UIcon name="i-heroicons-cloud" class="w-5 h-5" />
                  </div>
                  <span>云端同步，多设备无缝衔接</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
                  </div>
                  <span>学习统计，见证成长轨迹</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧登录注册 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">开始学习</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-8">登录或注册，开启日语学习之旅</p>

            <div class="space-y-4 mb-8">
              <NuxtLink to="/login" class="block">
                <button class="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
                  <span>立即登录</span>
                </button>
              </NuxtLink>

              <NuxtLink to="/register" class="block">
                <button class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                  <UIcon name="i-heroicons-user-plus" class="w-5 h-5" />
                  <span>免费注册</span>
                </button>
              </NuxtLink>
            </div>

            <!-- 功能预览 -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-500 text-center mb-4">登录后可享受以下功能</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl hover:scale-105 transition-transform">
                  <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-rose-500 mx-auto" />
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">背单词</p>
                </div>
                <div class="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:scale-105 transition-transform">
                  <UIcon name="i-heroicons-cloud" class="w-8 h-8 text-emerald-500 mx-auto" />
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">云同步</p>
                </div>
                <div class="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:scale-105 transition-transform">
                  <UIcon name="i-heroicons-fire" class="w-8 h-8 text-amber-500 mx-auto" />
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">打卡</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
