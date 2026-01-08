/**
 * PWA 安装引导 composable
 * 支持 iOS 设备检测和安装提示
 */
export function usePWAInstall() {
  // 是否显示安装提示
  const showInstallPrompt = useState('pwa-show-prompt', () => false)

  // 是否已关闭提示（存储到 localStorage）
  const isDismissed = useState('pwa-dismissed', () => false)

  // 检测是否为 iOS 设备
  const isIOS = computed(() => {
    if (typeof window === 'undefined') return false
    const ua = window.navigator.userAgent
    return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
  })

  // 检测是否为 Safari 浏览器
  const isSafari = computed(() => {
    if (typeof window === 'undefined') return false
    const ua = window.navigator.userAgent
    return /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)
  })

  // 检测是否已经以 PWA 模式运行（standalone）
  const isStandalone = computed(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  })

  // 检测是否为 Android 设备
  const isAndroid = computed(() => {
    if (typeof window === 'undefined') return false
    return /Android/.test(window.navigator.userAgent)
  })

  // Android 的 beforeinstallprompt 事件
  const deferredPrompt = ref<any>(null)
  const canInstallNative = computed(() => !!deferredPrompt.value)

  // 是否应该显示安装引导
  const shouldShowInstallGuide = computed(() => {
    // 如果已关闭或已是 PWA 模式，不显示
    if (isDismissed.value || isStandalone.value) return false
    // iOS Safari 或 Android 可以显示
    return (isIOS.value && isSafari.value) || canInstallNative.value
  })

  // 初始化
  const init = () => {
    if (typeof window === 'undefined') return

    // 从 localStorage 读取关闭状态
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      isDismissed.value = true
    }

    // 监听 Android 的 beforeinstallprompt 事件
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      // 延迟显示提示，不要在页面加载时立即显示
      setTimeout(() => {
        if (!isDismissed.value && !isStandalone.value) {
          showInstallPrompt.value = true
        }
      }, 3000)
    })

    // 检测 iOS Safari，延迟显示提示
    if (isIOS.value && isSafari.value && !isStandalone.value && !isDismissed.value) {
      setTimeout(() => {
        showInstallPrompt.value = true
      }, 5000) // iOS 延迟 5 秒显示
    }
  }

  // 触发 Android 原生安装
  const installNative = async () => {
    if (!deferredPrompt.value) return false

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      deferredPrompt.value = null
      showInstallPrompt.value = false
    }

    return outcome === 'accepted'
  }

  // 关闭提示
  const dismissPrompt = () => {
    showInstallPrompt.value = false
    isDismissed.value = true
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  // 重置关闭状态（用于测试）
  const resetDismissed = () => {
    localStorage.removeItem('pwa-install-dismissed')
    isDismissed.value = false
  }

  // 组件挂载时初始化
  onMounted(() => {
    init()
  })

  return {
    showInstallPrompt,
    isIOS,
    isSafari,
    isStandalone,
    isAndroid,
    canInstallNative,
    shouldShowInstallGuide,
    installNative,
    dismissPrompt,
    resetDismissed,
  }
}
