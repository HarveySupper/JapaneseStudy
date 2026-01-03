// 用户相关类型
export interface User {
  id: string
  email: string
  nickname?: string
  avatar_url?: string | null
  study_goal?: string
  created_at: string
  updated_at?: string
}

// 单词相关类型
export interface Vocabulary {
  id: number
  kanji: string // 汉字
  hiragana: string // 平假名
  katakana?: string // 片假名
  romaji?: string // 罗马音
  meaning: string // 中文释义
  example_sentence?: string // 例句
  example_meaning?: string // 例句翻译
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'custom' // JLPT等级
  tags?: string[] // 标签
  created_at: string
}

// 用户单词学习记录
export interface UserVocabulary {
  id: number
  user_id: string
  vocabulary_id: number
  mastery_level: 'new' | 'learning' | 'familiar' | 'mastered' // 熟练度
  review_count: number // 复习次数
  correct_count: number // 正确次数
  next_review_at: string // 下次复习时间 (艾宾浩斯)
  last_reviewed_at?: string
  created_at: string
}

// 笔记相关类型
export interface Note {
  id: number
  user_id: string
  title: string
  content: string // 富文本内容
  category?: string
  tags?: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
}

// 打卡相关类型
export interface CheckIn {
  id: number
  user_id: string
  check_in_date: string // YYYY-MM-DD
  study_duration: number // 学习时长（分钟）
  words_learned: number // 新学单词数
  words_reviewed: number // 复习单词数
  notes_written: number // 写笔记数
  created_at: string
}

// 学习统计
export interface StudyStats {
  total_words: number
  mastered_words: number
  streak_days: number // 连续打卡天数
  total_study_time: number // 总学习时长（分钟）
  today_words_learned: number
  today_words_reviewed: number
}
