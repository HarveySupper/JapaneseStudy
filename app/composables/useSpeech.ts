/**
 * 日语语音朗读 composable
 * 使用 Web Speech API 实现日语发音
 */

// 全局状态 key
const VOICE_STORAGE_KEY = 'japanese-study-voice'

// 定义语音信息类型
export interface VoiceInfo {
  name: string
  lang: string
}

export function useSpeech() {
  // 使用 useState 实现跨组件共享状态
  const isSpeaking = useState<boolean>('speech-is-speaking', () => false)
  const availableVoices = useState<VoiceInfo[]>('speech-available-voices', () => [])
  const selectedVoiceName = useState<string>('speech-selected-voice', () => '')

  // 从 localStorage 加载保存的语音偏好
  const loadSavedVoice = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(VOICE_STORAGE_KEY)
    if (saved) {
      selectedVoiceName.value = saved
    }
  }

  // 保存语音偏好到 localStorage
  const saveVoicePreference = (voiceName: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(VOICE_STORAGE_KEY, voiceName)
    selectedVoiceName.value = voiceName
  }

  // 获取所有可用的日语语音
  const getAvailableJapaneseVoices = (): VoiceInfo[] => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return []

    const voices = window.speechSynthesis.getVoices()
    const jaVoices = voices
      .filter(v => v.lang.startsWith('ja'))
      .map(v => ({ name: v.name, lang: v.lang }))

    return jaVoices
  }

  // 更新可用语音列表
  const updateAvailableVoices = () => {
    availableVoices.value = getAvailableJapaneseVoices()
  }

  // 获取当前选择的日语语音
  const getJapaneseVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null

    const voices = window.speechSynthesis.getVoices()
    const jaVoices = voices.filter(v => v.lang.startsWith('ja'))

    // 如果有用户选择的语音，优先使用
    if (selectedVoiceName.value) {
      const userSelected = jaVoices.find(v => v.name === selectedVoiceName.value)
      if (userSelected) {
        return userSelected
      }
    }

    // 默认优先选择高质量的日语语音 (Apple 设备) - 男声优先
    const preferredVoices = [
      'Otoya', // iOS/macOS 男声
      'Kyoko', // iOS/macOS 女声
      'O-Ren', // macOS
      'Google', // Chrome
    ]

    for (const preferred of preferredVoices) {
      const voice = jaVoices.find(v => v.name.includes(preferred))
      if (voice) {
        return voice
      }
    }

    // 回退到任意日语语音
    return jaVoices[0] || null
  }

  // 朗读文本
  const speak = (text: string, options?: { rate?: number; pitch?: number }) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return
    }

    // 取消之前的语音
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = options?.rate ?? 0.9
    utterance.pitch = options?.pitch ?? 1

    // 尝试获取日语语音
    const voice = getJapaneseVoice()
    if (voice) {
      utterance.voice = voice
    }

    utterance.onstart = () => {
      isSpeaking.value = true
    }

    utterance.onend = () => {
      isSpeaking.value = false
    }

    utterance.onerror = () => {
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  // 停止朗读
  const stop = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  // 朗读单词（带延迟重复）
  const speakWord = async (word: string, repeatCount = 1, delay = 1000) => {
    for (let i = 0; i < repeatCount; i++) {
      speak(word)
      if (i < repeatCount - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  // 预加载语音引擎
  const preload = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.getVoices()
  }

  // 检查是否支持语音合成
  const isSupported = computed(() => {
    if (typeof window === 'undefined') return false
    return 'speechSynthesis' in window
  })

  // 组件挂载时预加载
  onMounted(() => {
    loadSavedVoice()
    preload()
    updateAvailableVoices()
    // 监听 voices 变化
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        preload()
        updateAvailableVoices()
      }
    }
  })

  return {
    speak,
    stop,
    speakWord,
    preload,
    isSpeaking: readonly(isSpeaking),
    isSupported: readonly(isSupported),
    // 语音选择相关
    availableVoices: readonly(availableVoices),
    selectedVoiceName: readonly(selectedVoiceName),
    saveVoicePreference,
    updateAvailableVoices,
  }
}
