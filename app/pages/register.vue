<script setup lang="ts">
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMsg.value = '请填写所有必填项'
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = '密码至少需要6位'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          nickname: nickname.value || email.value.split('@')[0],
        },
      },
    })

    if (error) {
      // 处理各种错误情况
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        errorMsg.value = '该邮箱已被注册，请直接登录'
      } else if (error.message.includes('valid email')) {
        errorMsg.value = '请输入有效的邮箱地址'
      } else {
        errorMsg.value = error.message
      }
      return
    }

    // 检查是否是重复注册（Supabase 不会报错，但 identities 为空）
    // 这是 Supabase 的安全设计，防止邮箱枚举攻击
    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      errorMsg.value = '该邮箱已被注册，请直接登录'
      return
    }

    // 注册成功，自动登录
    if (data.session) {
      // 已自动登录
      successMsg.value = '注册成功！正在跳转...'
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else if (data.user) {
      // 需要手动登录（可能是邮箱验证模式）
      // 尝试自动登录
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (loginError) {
        // 如果自动登录失败（比如需要邮箱验证），提示用户
        if (loginError.message.includes('email_not_confirmed') || loginError.message.includes('Email not confirmed')) {
          successMsg.value = '注册成功！请查收验证邮件，点击链接后即可登录'
        } else {
          successMsg.value = '注册成功！请前往登录'
        }
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        // 自动登录成功
        successMsg.value = '注册成功！正在跳转...'
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } else {
      // 其他未知情况
      errorMsg.value = '注册失败，请重试或尝试登录'
    }
  } catch (e: any) {
    errorMsg.value = e.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500" />

      <!-- 装饰圆形 -->
      <div class="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <!-- 内容区 -->
      <div class="relative min-h-screen flex flex-col justify-center px-6 py-8">
        <div class="mx-auto w-full max-w-sm">
          <!-- Logo / 标题 -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
              <span class="text-3xl">✨</span>
            </div>
            <h1 class="text-2xl font-bold text-white">
              创建新账号
            </h1>
            <p class="mt-1 text-white/70 text-sm">
              开始你的日语学习之旅
            </p>
          </div>

          <!-- 注册表单卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-5">
            <form @submit.prevent="handleRegister" class="space-y-4">
              <!-- 成功提示 -->
              <div
                v-if="successMsg"
                class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0" />
                {{ successMsg }}
              </div>

              <!-- 错误提示 -->
              <div
                v-if="errorMsg"
                class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 flex-shrink-0" />
                {{ errorMsg }}
              </div>

              <!-- 昵称 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  昵称 <span class="text-gray-400 font-normal">(可选)</span>
                </label>
                <div class="relative">
                  <UIcon name="i-heroicons-user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="nickname"
                    type="text"
                    placeholder="你的昵称"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- 邮箱 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  邮箱 <span class="text-red-400">*</span>
                </label>
                <div class="relative">
                  <UIcon name="i-heroicons-envelope" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="email"
                    type="email"
                    placeholder="your@email.com"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- 密码 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  密码 <span class="text-red-400">*</span>
                  <span class="text-gray-400 font-normal ml-1">(至少6位)</span>
                </label>
                <div class="relative">
                  <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="password"
                    type="password"
                    placeholder="设置密码"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- 确认密码 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  确认密码 <span class="text-red-400">*</span>
                </label>
                <div class="relative">
                  <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- 注册按钮 -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                <span>{{ loading ? '注册中...' : '创建账号' }}</span>
              </button>
            </form>

            <!-- 分隔线 -->
            <div class="relative my-5">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white dark:bg-gray-800 px-4 text-gray-400">或</span>
              </div>
            </div>

            <!-- 登录链接 -->
            <div class="text-center">
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                已有账号？
                <NuxtLink to="/login" class="text-purple-500 hover:text-purple-600 font-semibold ml-1">
                  立即登录
                </NuxtLink>
              </p>
            </div>
          </div>

          <!-- 返回首页 -->
          <div class="text-center mt-6">
            <NuxtLink to="/" class="text-white/70 hover:text-white transition-colors flex items-center justify-center gap-1 text-sm">
              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
              返回首页
            </NuxtLink>
          </div>
        </div>
      </div>
  </div>
</template>
