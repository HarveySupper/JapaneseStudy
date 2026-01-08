<script setup lang="ts">
const {
  showInstallPrompt,
  isIOS,
  canInstallNative,
  installNative,
  dismissPrompt,
} = usePWAInstall()

// 处理安装按钮点击
const handleInstall = async () => {
  if (canInstallNative.value) {
    await installNative()
  }
}
</script>

<template>
  <!-- PWA 安装提示弹窗 -->
  <Transition name="slide-up">
    <div
      v-if="showInstallPrompt"
      class="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2 text-white">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="text-lg">🌸</span>
            </div>
            <span class="font-medium">添加到主屏幕</span>
          </div>
          <button
            class="w-6 h-6 flex items-center justify-center text-white/80 hover:text-white"
            @click="dismissPrompt"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- 内容 -->
        <div class="p-4">
          <!-- iOS Safari 安装指南 -->
          <div v-if="isIOS" class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              将「日语学习助手」添加到主屏幕，获得更好的使用体验：
            </p>

            <div class="space-y-2">
              <!-- 步骤 1 -->
              <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-blue-600 dark:text-blue-400 font-medium">1</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span>点击底部</span>
                  <div class="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <UIcon name="i-heroicons-arrow-up-on-square" class="w-4 h-4 text-blue-500" />
                  </div>
                  <span>分享按钮</span>
                </div>
              </div>

              <!-- 步骤 2 -->
              <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-blue-600 dark:text-blue-400 font-medium">2</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span>选择</span>
                  <div class="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                    <UIcon name="i-heroicons-plus-small" class="w-4 h-4" />
                    <span>添加到主屏幕</span>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-400 dark:text-gray-500 text-center">
              添加后可像 App 一样使用，支持离线访问
            </p>
          </div>

          <!-- Android / 其他浏览器 - 原生安装 -->
          <div v-else-if="canInstallNative" class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              将「日语学习助手」安装到设备，获得更好的使用体验！
            </p>

            <button
              class="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              @click="handleInstall"
            >
              立即安装
            </button>

            <p class="text-xs text-gray-400 dark:text-gray-500 text-center">
              安装后可像 App 一样使用，支持离线访问
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
