export default defineAppConfig({
  ui: {
    // 主题色 - 使用樱花粉/日式风格
    colors: {
      primary: 'rose',
      secondary: 'indigo',
      success: 'emerald',
      info: 'sky',
      warning: 'amber',
      error: 'red',
      neutral: 'slate',
    },

    // 按钮样式
    button: {
      rounded: 'rounded-xl',
      default: {
        size: 'md',
      },
    },

    // 卡片样式
    card: {
      rounded: 'rounded-2xl',
      shadow: 'shadow-lg',
      body: {
        padding: 'p-5',
      },
    },

    // 输入框样式
    input: {
      rounded: 'rounded-xl',
    },

    // 徽章样式
    badge: {
      rounded: 'rounded-full',
    },

    // 头像样式
    avatar: {
      rounded: 'rounded-full',
    },
  },
})
