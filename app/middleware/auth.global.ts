/**
 * 全局认证中间件
 * 未登录用户只能访问登录/注册页面
 */
export default defineNuxtRouteMiddleware((to) => {
  // 不需要认证的页面（白名单）
  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.includes(to.path)

  // 获取用户状态
  const user = useSupabaseUser()
  const isLoggedIn = !!(user.value?.id || (user.value as any)?.sub)

  // 未登录用户访问受保护页面 -> 跳转到登录页
  if (!isLoggedIn && !isPublicPage) {
    return navigateTo('/login')
  }

  // 已登录用户访问登录/注册页 -> 跳转到首页
  if (isLoggedIn && isPublicPage) {
    return navigateTo('/')
  }
})
