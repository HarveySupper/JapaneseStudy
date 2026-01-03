<script setup lang="ts">
// 示例笔记数据（后续从 Supabase 获取）
const notes = ref([
  {
    id: 1,
    title: '动词て形变化规则',
    content: '五段动词、一段动词、不规则动词的变化方式...',
    category: '语法',
    created_at: '2024-01-03',
    is_pinned: true,
  },
  {
    id: 2,
    title: 'N5 常用句型整理',
    content: '～です、～ます、～てください...',
    category: '句型',
    created_at: '2024-01-02',
    is_pinned: false,
  },
])

const showNewNoteModal = ref(false)
</script>

<template>
  <div class="p-4">
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">学习笔记</h1>
      <UButton color="primary" @click="showNewNoteModal = true">
        <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-1" />
        新建
      </UButton>
    </div>

    <!-- 搜索框 -->
    <UInput
      placeholder="搜索笔记..."
      icon="i-heroicons-magnifying-glass"
      class="mb-4"
    />

    <!-- 笔记列表 -->
    <div class="space-y-3">
      <UCard
        v-for="note in notes"
        :key="note.id"
        class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <UIcon
                v-if="note.is_pinned"
                name="i-heroicons-bookmark-solid"
                class="w-4 h-4 text-primary-500"
              />
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ note.title }}
              </h3>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ note.content }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <UBadge color="neutral" variant="soft" size="xs">
                {{ note.category }}
              </UBadge>
              <span class="text-xs text-gray-400">{{ note.created_at }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 空状态 -->
    <div
      v-if="notes.length === 0"
      class="text-center py-12"
    >
      <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">还没有笔记</p>
      <p class="text-sm text-gray-400 mt-1">点击右上角新建笔记</p>
    </div>

    <!-- 新建笔记弹窗 (简单占位) -->
    <UModal v-model:open="showNewNoteModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">新建笔记</h3>
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-heroicons-x-mark"
                @click="showNewNoteModal = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <UFormField label="标题">
              <UInput placeholder="输入笔记标题" />
            </UFormField>
            <UFormField label="分类">
              <USelect
                :items="['语法', '句型', '词汇', '文化', '其他']"
                placeholder="选择分类"
              />
            </UFormField>
            <UFormField label="内容">
              <UTextarea
                placeholder="输入笔记内容..."
                :rows="6"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" color="neutral" @click="showNewNoteModal = false">
                取消
              </UButton>
              <UButton color="primary">
                保存
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
