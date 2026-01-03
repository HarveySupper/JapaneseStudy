<script setup lang="ts">
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = '请填写邮箱和密码'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        errorMsg.value = '邮箱或密码错误'
      } else if (error.message.includes('Email not confirmed') || error.code === 'email_not_confirmed') {
        errorMsg.value = '邮箱未验证，请先查收验证邮件'
      } else {
        errorMsg.value = error.message
      }
      return
    }

    // 确保 session 已经设置
    if (data.session) {
      console.log('Login successful, session:', data.session.user.id)
      // 等待一下让 auth 状态更新
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/')
    } else {
      errorMsg.value = '登录异常，请重试'
    }
  } catch (e: any) {
    errorMsg.value = e.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600" />

      <!-- 装饰圆形 -->
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
      <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <!-- 内容区 -->
      <div class="relative min-h-screen flex flex-col justify-center px-6 py-12">
        <div class="mx-auto w-full max-w-sm">
          <!-- Logo / 标题 -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span class="text-4xl">🌸</span>
            </div>
            <h1 class="text-3xl font-bold text-white">
              日语学习助手
            </h1>
            <p class="mt-2 text-white/70">
              登录开始今天的学习
            </p>
          </div>

          <!-- 登录表单卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6">
            <form @submit.prevent="handleLogin" class="space-y-5">
              <!-- 错误提示 -->
              <div
                v-if="errorMsg"
                class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 flex-shrink-0" />
                {{ errorMsg }}
              </div>

              <!-- 邮箱 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱
                </label>
                <div class="relative">
                  <UIcon name="i-heroicons-envelope" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="email"
                    type="email"
                    placeholder="your@email.com"
                    class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-500 transition-all"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- 密码 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  密码
                </label>
                <div class="relative">
                  <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="password"
                    type="password"
                    placeholder="输入密码"
                    class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-500 transition-all"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- 登录按钮 -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                <span>{{ loading ? '登录中...' : '登录' }}</span>
              </button>
            </form>

            <!-- 分隔线 -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white dark:bg-gray-800 px-4 text-gray-400">或</span>
              </div>
            </div>

            <!-- 注册链接 -->
            <div class="text-center">
              <p class="text-gray-500 dark:text-gray-400">
                还没有账号？
                <NuxtLink to="/register" class="text-rose-500 hover:text-rose-600 font-semibold ml-1">
                  立即注册
                </NuxtLink>
              </p>
            </div>
          </div>

          <!-- 返回首页 -->
          <div class="text-center mt-8">
            <NuxtLink to="/" class="text-white/70 hover:text-white transition-colors flex items-center justify-center gap-1">
              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
              返回首页
            </NuxtLink>
          </div>
        </div>
      </div>
  </div>
</template>
