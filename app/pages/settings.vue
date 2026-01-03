<script setup lang="ts">
const router = useRouter()
const { availableVoices, selectedVoiceName, saveVoicePreference, speak, updateAvailableVoices } = useSpeech()

// 初始化时加载语音列表
onMounted(() => {
  // 立即尝试更新
  updateAvailableVoices()

  // 如果语音列表为空，等待 voiceschanged 事件
  if (availableVoices.value.length === 0 && typeof window !== 'undefined' && window.speechSynthesis) {
    const handleVoicesChanged = () => {
      updateAvailableVoices()
    }
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)

    // 也尝试延迟加载（某些浏览器需要）
    setTimeout(() => {
      updateAvailableVoices()
    }, 500)
  }
})

// 选择语音
const selectVoice = (voiceName: string) => {
  saveVoicePreference(voiceName)
  // 播放测试音
  speak('こんにちは', { rate: 0.8 })
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen">
    <!-- 移动端布局 -->
    <div class="md:hidden">
      <!-- 顶部导航栏 -->
      <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center h-14 px-4">
          <button
            class="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="goBack"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 class="flex-1 text-center font-semibold text-gray-900 dark:text-white">应用设置</h1>
          <div class="w-10" />
        </div>
      </div>

      <!-- 设置内容 -->
      <div class="p-4 space-y-6">
        <!-- 语音设置卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-speaker-wave" class="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 class="font-semibold text-gray-900 dark:text-white">朗读语音</h2>
                <p class="text-sm text-gray-500">选择日语朗读的语音</p>
              </div>
            </div>
          </div>

          <!-- 语音列表 -->
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-if="availableVoices.length === 0"
              class="p-4 text-center text-gray-500"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>加载语音中...</p>
            </div>
            <button
              v-for="voice in availableVoices"
              :key="voice.name"
              class="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              @click="selectVoice(voice.name)"
            >
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="selectedVoiceName === voice.name
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300 dark:border-gray-600'"
              >
                <UIcon
                  v-if="selectedVoiceName === voice.name"
                  name="i-heroicons-check"
                  class="w-4 h-4 text-white"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">{{ voice.name }}</p>
                <p class="text-sm text-gray-500">{{ voice.lang }}</p>
              </div>
              <UIcon
                name="i-heroicons-play-circle"
                class="w-6 h-6 text-gray-400 hover:text-purple-500 transition-colors"
              />
            </button>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
          <div class="flex gap-3">
            <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm text-amber-800 dark:text-amber-200">
                点击语音可试听效果。如需更多语音，请在系统设置中下载。
              </p>
              <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                macOS: 系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 桌面端布局 -->
    <div class="hidden md:block">
      <!-- 页面标题 -->
      <div class="flex items-center gap-4 mb-8">
        <button
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="goBack"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">应用设置</h1>
          <p class="text-gray-500 mt-1">自定义你的学习体验</p>
        </div>
      </div>

      <!-- 设置内容 -->
      <div class="grid grid-cols-2 gap-8">
        <!-- 语音设置卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-speaker-wave" class="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">朗读语音</h2>
                <p class="text-sm text-gray-500">选择日语朗读的语音</p>
              </div>
            </div>
          </div>

          <!-- 语音列表 -->
          <div class="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-if="availableVoices.length === 0"
              class="p-6 text-center text-gray-500"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-3" />
              <p>加载语音中...</p>
            </div>
            <button
              v-for="voice in availableVoices"
              :key="voice.name"
              class="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
              @click="selectVoice(voice.name)"
            >
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="selectedVoiceName === voice.name
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-purple-300'"
              >
                <UIcon
                  v-if="selectedVoiceName === voice.name"
                  name="i-heroicons-check"
                  class="w-4 h-4 text-white"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">{{ voice.name }}</p>
                <p class="text-sm text-gray-500">{{ voice.lang }}</p>
              </div>
              <UIcon
                name="i-heroicons-play-circle"
                class="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors"
              />
            </button>
          </div>
        </div>

        <!-- 提示信息卡片 -->
        <div class="space-y-6">
          <div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-light-bulb" class="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold text-amber-800 dark:text-amber-200 mb-2">如何获取更多语音？</h3>
                <p class="text-sm text-amber-700 dark:text-amber-300">
                  点击语音可试听效果。如需更多日语语音，请在系统设置中下载。
                </p>
                <div class="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                  <p class="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">macOS 用户：</p>
                  <p class="text-xs text-amber-600 dark:text-amber-400">
                    系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他设置（预留位置） -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="text-center text-gray-400">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-10 h-10 mx-auto mb-3" />
              <p>更多设置敬请期待</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
