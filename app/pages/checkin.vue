<script setup lang="ts">
// 当前月份
const currentDate = ref(new Date())

// 打卡记录（后续从 Supabase 获取）
const checkInDates = ref<string[]>([
  '2024-01-01',
  '2024-01-02',
  '2024-01-03',
])

// 月份统计
const monthStats = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const checkedDays = checkInDates.value.filter(date => {
    const d = new Date(date)
    return d.getFullYear() === year && d.getMonth() === month
  }).length

  return {
    total: daysInMonth,
    checked: checkedDays,
    rate: Math.round((checkedDays / daysInMonth) * 100),
  }
})

// 生成日历数据
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: { date: number | null; isChecked: boolean; isToday: boolean }[] = []

  // 填充空白
  for (let i = 0; i < firstDay; i++) {
    days.push({ date: null, isChecked: false, isToday: false })
  }

  // 填充日期
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i
    days.push({
      date: i,
      isChecked: checkInDates.value.includes(dateStr),
      isToday,
    })
  }

  return days
})

const monthName = computed(() => {
  return currentDate.value.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
})

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
</script>

<template>
  <div class="p-4">
    <!-- 头部 -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">打卡记录</h1>
    </div>

    <!-- 月份统计 -->
    <UCard class="mb-4">
      <div class="grid grid-cols-3 text-center">
        <div>
          <p class="text-2xl font-bold text-primary-500">{{ monthStats.checked }}</p>
          <p class="text-sm text-gray-500">已打卡</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ monthStats.total }}</p>
          <p class="text-sm text-gray-500">本月天数</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-500">{{ monthStats.rate }}%</p>
          <p class="text-sm text-gray-500">完成率</p>
        </div>
      </div>
    </UCard>

    <!-- 日历 -->
    <UCard>
      <!-- 月份切换 -->
      <div class="flex items-center justify-between mb-4">
        <UButton variant="ghost" color="neutral" icon="i-heroicons-chevron-left" @click="prevMonth" />
        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ monthName }}</span>
        <UButton variant="ghost" color="neutral" icon="i-heroicons-chevron-right" @click="nextMonth" />
      </div>

      <!-- 星期标题 -->
      <div class="grid grid-cols-7 text-center mb-2">
        <span
          v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
          :key="day"
          class="text-sm text-gray-500"
        >
          {{ day }}
        </span>
      </div>

      <!-- 日期格子 -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="aspect-square flex items-center justify-center relative"
        >
          <template v-if="day.date">
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors"
              :class="{
                'bg-primary-500 text-white': day.isChecked,
                'ring-2 ring-primary-500': day.isToday && !day.isChecked,
                'text-gray-900 dark:text-white': !day.isChecked,
              }"
            >
              {{ day.date }}
            </span>
          </template>
        </div>
      </div>
    </UCard>

    <!-- 打卡历史 -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">最近记录</h2>
      <div class="space-y-2">
        <UCard
          v-for="date in checkInDates.slice().reverse().slice(0, 5)"
          :key="date"
          class="!p-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-primary-500" />
              </div>
              <span class="text-gray-900 dark:text-white">{{ date }}</span>
            </div>
            <UBadge color="success" variant="soft" size="xs">已打卡</UBadge>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
