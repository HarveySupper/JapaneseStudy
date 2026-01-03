<script setup lang="ts">
const route = useRoute()

const navigation = [
  { name: '首页', path: '/', icon: 'i-heroicons-home', iconActive: 'i-heroicons-home-solid' },
  { name: '背单词', path: '/vocabulary', icon: 'i-heroicons-book-open', iconActive: 'i-heroicons-book-open-solid' },
  { name: '笔记', path: '/notes', icon: 'i-heroicons-document-text', iconActive: 'i-heroicons-document-text-solid' },
  { name: '打卡', path: '/checkin', icon: 'i-heroicons-calendar-days', iconActive: 'i-heroicons-calendar-days-solid' },
  { name: '我的', path: '/profile', icon: 'i-heroicons-user', iconActive: 'i-heroicons-user-solid' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 桌面端布局 -->
    <div class="hidden md:flex min-h-screen">
      <!-- 左侧边栏 -->
      <aside class="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-40">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-xl">🌸</span>
            </div>
            <div>
              <h1 class="font-bold text-gray-900 dark:text-white">日语学习助手</h1>
              <p class="text-xs text-gray-500">Japanese Study</p>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 p-4 space-y-2">
          <NuxtLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            :class="isActive(item.path)
              ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'"
          >
            <UIcon
              :name="isActive(item.path) ? item.iconActive : item.icon"
              class="w-5 h-5"
            />
            <span class="font-medium">{{ item.name }}</span>
            <!-- 激活指示器 -->
            <div
              v-if="isActive(item.path)"
              class="ml-auto w-1.5 h-1.5 bg-rose-500 rounded-full"
            />
          </NuxtLink>
        </nav>

        <!-- 底部信息 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">每日一句</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white japanese-text">継続は力なり</p>
            <p class="text-xs text-gray-500 mt-1">坚持就是力量</p>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 - 桌面端 -->
      <main class="flex-1 ml-64">
        <div class="max-w-4xl mx-auto p-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- 移动端布局 -->
    <div class="md:hidden min-h-screen">
      <!-- 主内容区域 - 移动端 -->
      <main class="pb-24">
        <slot />
      </main>

      <!-- 底部导航栏 - 仅移动端显示 -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        <!-- 毛玻璃背景 -->
        <div class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50" />

        <div class="relative flex justify-around items-center h-16 max-w-lg mx-auto">
          <NuxtLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="relative flex flex-col items-center justify-center w-16 h-full transition-all duration-200"
          >
            <!-- 激活状态背景 -->
            <div
              v-if="isActive(item.path)"
              class="absolute top-1 w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl transition-all duration-300"
            />

            <!-- 图标 -->
            <UIcon
              :name="isActive(item.path) ? item.iconActive : item.icon"
              class="relative z-10 w-6 h-6 transition-all duration-200"
              :class="isActive(item.path)
                ? 'text-rose-500 scale-110'
                : 'text-gray-400 dark:text-gray-500'"
            />

            <!-- 文字 -->
            <span
              class="relative z-10 text-[10px] mt-1 font-medium transition-colors duration-200"
              :class="isActive(item.path)
                ? 'text-rose-500'
                : 'text-gray-400 dark:text-gray-500'"
            >
              {{ item.name }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
/* iOS 安全区域适配 */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
