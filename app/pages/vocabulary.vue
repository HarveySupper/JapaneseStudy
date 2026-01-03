<script setup lang="ts">
const { speak, isSpeaking, isSupported } = useSpeech()

// 示例单词数据（后续从 Supabase 获取）
const words = ref([
  { id: 1, kanji: '勉強', hiragana: 'べんきょう', meaning: '学习', level: 'N5' },
  { id: 2, kanji: '日本語', hiragana: 'にほんご', meaning: '日语', level: 'N5' },
  { id: 3, kanji: '先生', hiragana: 'せんせい', meaning: '老师', level: 'N5' },
  { id: 4, kanji: '学生', hiragana: 'がくせい', meaning: '学生', level: 'N5' },
  { id: 5, kanji: '友達', hiragana: 'ともだち', meaning: '朋友', level: 'N5' },
])

const currentIndex = ref(0)
const showMeaning = ref(false)

const currentWord = computed(() => words.value[currentIndex.value])

const nextWord = () => {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++
    showMeaning.value = false
  }
}

const prevWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showMeaning.value = false
  }
}

const speakCurrentWord = () => {
  if (currentWord.value) {
    speak(currentWord.value.kanji)
  }
}
</script>

<template>
  <div class="p-4">
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">背单词</h1>
      <UBadge color="primary" variant="soft">
        {{ currentIndex + 1 }} / {{ words.length }}
      </UBadge>
    </div>

    <!-- 单词卡片 -->
    <UCard class="mb-6">
      <div class="text-center py-8">
        <!-- 汉字 -->
        <h2 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ currentWord?.kanji }}
        </h2>

        <!-- 假名 -->
        <p class="text-2xl text-primary-500 mb-4">
          {{ currentWord?.hiragana }}
        </p>

        <!-- 发音按钮 -->
        <UButton
          v-if="isSupported"
          variant="ghost"
          color="primary"
          :disabled="isSpeaking"
          @click="speakCurrentWord"
        >
          <UIcon name="i-heroicons-speaker-wave" class="w-6 h-6" />
          <span class="ml-2">{{ isSpeaking ? '朗读中...' : '朗读' }}</span>
        </UButton>

        <!-- 等级标签 -->
        <div class="mt-4">
          <UBadge color="neutral" variant="soft">
            {{ currentWord?.level }}
          </UBadge>
        </div>

        <!-- 释义（点击显示） -->
        <div class="mt-8">
          <UButton
            v-if="!showMeaning"
            variant="outline"
            color="neutral"
            @click="showMeaning = true"
          >
            点击显示释义
          </UButton>
          <p
            v-else
            class="text-xl text-gray-700 dark:text-gray-300"
          >
            {{ currentWord?.meaning }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- 控制按钮 -->
    <div class="flex justify-between gap-4">
      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        class="flex-1"
        :disabled="currentIndex === 0"
        @click="prevWord"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
        上一个
      </UButton>
      <UButton
        color="primary"
        size="lg"
        class="flex-1"
        :disabled="currentIndex === words.length - 1"
        @click="nextWord"
      >
        下一个
        <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
      </UButton>
    </div>

    <!-- 熟练度按钮 -->
    <div class="mt-6">
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
        你对这个单词的掌握程度
      </p>
      <div class="grid grid-cols-4 gap-2">
        <UButton color="error" variant="soft" size="sm">生词</UButton>
        <UButton color="warning" variant="soft" size="sm">模糊</UButton>
        <UButton color="primary" variant="soft" size="sm">熟悉</UButton>
        <UButton color="success" variant="soft" size="sm">掌握</UButton>
      </div>
    </div>
  </div>
</template>
