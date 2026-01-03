import type { User } from '~/types'

/**
 * 用户认证 composable
 * 使用 @nuxtjs/supabase 提供的 composables
 */
export function useAuth() {
  const supabase = useSupabaseClient()
  // 使用 @nuxtjs/supabase 提供的 user composable，支持 SSR
  const supabaseUser = useSupabaseUser()

  // 用户资料 - 使用 useState 确保 SSR/客户端共享
  const profile = useState<User | null>('auth-profile', () => null)
  const loading = useState('auth-loading', () => false)
  const profileFetched = useState('auth-profile-fetched', () => false)

  // 是否已登录 - 支持 User.id 和 Claims.sub 两种格式
  const isLoggedIn = computed(() => !!(supabaseUser.value?.id || supabaseUser.value?.sub))

  // 获取用户 ID（支持 User.id 和 Claims.sub）
  const getUserId = () => supabaseUser.value?.id || supabaseUser.value?.sub

  // 获取用户资料
  const fetchProfile = async () => {
    const userId = getUserId()
    if (!userId) {
      profile.value = null
      return
    }

    // 避免重复获取
    if (profileFetched.value && profile.value?.id === userId) {
      return
    }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Failed to fetch profile:', error)
        // 如果获取失败，使用 supabaseUser 的基本信息作为 fallback
        profile.value = {
          id: userId,
          email: supabaseUser.value?.email || '',
          nickname: supabaseUser.value?.user_metadata?.nickname || supabaseUser.value?.email?.split('@')[0] || '用户',
          avatar_url: null,
          study_goal: 'JLPT N3',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User
      } else {
        profile.value = data as User
      }
      profileFetched.value = true
    } catch (e) {
      console.error('Error fetching profile:', e)
      // 异常时也使用 fallback
      if (supabaseUser.value) {
        profile.value = {
          id: userId,
          email: supabaseUser.value.email || '',
          nickname: supabaseUser.value.user_metadata?.nickname || supabaseUser.value.email?.split('@')[0] || '用户',
          avatar_url: null,
          study_goal: 'JLPT N3',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User
      }
    } finally {
      loading.value = false
    }
  }

  // 监听用户变化，自动获取 profile
  watch(supabaseUser, (newUser, oldUser) => {
    const newId = newUser?.id || newUser?.sub
    const oldId = oldUser?.id || oldUser?.sub
    console.log('Supabase user changed:', newId)
    if (newId && newId !== oldId) {
      profileFetched.value = false
      fetchProfile()
    } else if (!newUser) {
      profile.value = null
      profileFetched.value = false
    }
  }, { immediate: true })

  // 更新用户资料
  const updateProfile = async (updates: Partial<User>) => {
    const userId = getUserId()
    if (!userId) return { error: '未登录' }

    loading.value = true
    try {
      const { error } = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', userId)

      if (error) {
        return { error: error.message }
      }

      // 更新本地状态
      if (profile.value) {
        profile.value = { ...profile.value, ...updates }
      }

      return { error: null }
    } catch (e: any) {
      return { error: e.message }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
      // 无论是否成功，都清除本地状态
      profile.value = null
      profileFetched.value = false
    } catch (e) {
      console.error('Sign out exception:', e)
      // 即使出错也清除本地状态
      profile.value = null
      profileFetched.value = false
    } finally {
      loading.value = false
    }
  }

  return {
    user: supabaseUser,
    profile: readonly(profile),
    isLoggedIn,
    loading: readonly(loading),
    fetchProfile,
    updateProfile,
    signOut,
  }
}
