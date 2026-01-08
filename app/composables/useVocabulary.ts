import type { Vocabulary, UserVocabulary } from '~/types'

export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered'

export interface VocabularyWithProgress extends Vocabulary {
  userProgress?: UserVocabulary
  fromApi?: boolean // 标记是否来自 API
}

// 艾宾浩斯遗忘曲线间隔（天数）
const REVIEW_INTERVALS: Record<MasteryLevel, number[]> = {
  new: [1],           // 生词: 1天后复习
  learning: [2],      // 模糊: 2天后复习
  familiar: [4],      // 熟悉: 4天后复习
  mastered: [7, 15, 30], // 掌握: 7天 -> 15天 -> 30天
}

export function useVocabulary() {
  const supabase = useSupabaseClient()
  const { user, isLoggedIn } = useAuth()

  // 获取用户ID
  const getUserId = () => user.value?.id || (user.value as any)?.sub

  // 获取今天的日期字符串 (YYYY-MM-DD)
  const getTodayDate = (): string => {
    const now = new Date()
    return now.toISOString().split('T')[0] as string
  }

  // 计算下次复习时间
  const calculateNextReviewDate = (level: MasteryLevel, reviewCount: number = 0): Date => {
    const intervals = REVIEW_INTERVALS[level]
    const intervalIndex = Math.min(reviewCount, intervals.length - 1)
    const days = intervals[intervalIndex] || intervals[intervals.length - 1] || 1

    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + days)
    return nextDate
  }

  // 获取每日新单词（未学过的）
  const getDailyWords = async (count: number = 20): Promise<VocabularyWithProgress[]> => {
    const userId = getUserId()
    if (!userId) {
      // 未登录时返回前20个单词（仅供预览）
      const { data } = await supabase
        .from('vocabularies')
        .select('*')
        .order('difficulty_order', { ascending: true })
        .limit(count)

      return (data || []) as unknown as VocabularyWithProgress[]
    }

    // 获取用户今天已学习的单词ID
    const todayDate = getTodayDate()
    const { data: learnedToday } = await supabase
      .from('user_vocabularies')
      .select('vocabulary_id')
      .eq('user_id', userId)
      .eq('learned_at', todayDate)

    const learnedTodayIds = ((learnedToday || []) as any[]).map(v => v.vocabulary_id)

    // 获取用户所有已学过的单词ID
    const { data: allLearned } = await supabase
      .from('user_vocabularies')
      .select('vocabulary_id')
      .eq('user_id', userId)

    const allLearnedIds = ((allLearned || []) as any[]).map(v => v.vocabulary_id)

    // 如果今天已学习的数量已达到count，返回今天的单词
    if (learnedTodayIds.length >= count) {
      const { data: todayWords } = await supabase
        .from('vocabularies')
        .select('*')
        .in('id', learnedTodayIds)
        .order('difficulty_order', { ascending: true })

      // 获取用户进度
      const { data: progress } = await supabase
        .from('user_vocabularies')
        .select('*')
        .eq('user_id', userId)
        .in('vocabulary_id', learnedTodayIds)

      const progressMap = new Map(((progress || []) as any[]).map(p => [p.vocabulary_id, p]))

      return ((todayWords || []) as any[]).map(word => ({
        ...word,
        userProgress: progressMap.get(word.id),
      })) as VocabularyWithProgress[]
    }

    // 需要补充的新单词数量
    const needMore = count - learnedTodayIds.length

    // 获取还没学过的新单词
    const { data: allVocabs } = await supabase
      .from('vocabularies')
      .select('*')
      .order('difficulty_order', { ascending: true })

    const newWords = ((allVocabs || []) as any[]).filter(v => !allLearnedIds.includes(v.id)).slice(0, needMore)

    // 合并今天已学的和新单词
    if (learnedTodayIds.length > 0) {
      const { data: todayWords } = await supabase
        .from('vocabularies')
        .select('*')
        .in('id', learnedTodayIds)

      const { data: progress } = await supabase
        .from('user_vocabularies')
        .select('*')
        .eq('user_id', userId)
        .in('vocabulary_id', learnedTodayIds)

      const progressMap = new Map(((progress || []) as any[]).map(p => [p.vocabulary_id, p]))

      const todayWithProgress = ((todayWords || []) as any[]).map(word => ({
        ...word,
        userProgress: progressMap.get(word.id),
      }))

      return [...todayWithProgress, ...newWords] as VocabularyWithProgress[]
    }

    return newWords as VocabularyWithProgress[]
  }

  // 获取需要复习的单词（艾宾浩斯遗忘曲线）
  const getReviewWords = async (): Promise<VocabularyWithProgress[]> => {
    const userId = getUserId()
    if (!userId) return []

    const now = new Date().toISOString()

    // 获取需要复习的记录（next_review_at <= 现在）
    const { data: reviewRecords } = await supabase
      .from('user_vocabularies')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_at', now)
      .not('mastery_level', 'eq', 'mastered')
      .order('next_review_at', { ascending: true })

    // 也获取已掌握但需要复习的单词
    const { data: masteredReviewRecords } = await supabase
      .from('user_vocabularies')
      .select('*')
      .eq('user_id', userId)
      .eq('mastery_level', 'mastered')
      .lte('next_review_at', now)
      .order('next_review_at', { ascending: true })

    const allReviewRecords = [...((reviewRecords || []) as any[]), ...((masteredReviewRecords || []) as any[])]

    if (allReviewRecords.length === 0) return []

    const vocabIds = allReviewRecords.map(r => r.vocabulary_id)

    // 获取单词详情
    const { data: vocabs } = await supabase
      .from('vocabularies')
      .select('*')
      .in('id', vocabIds)

    const vocabMap = new Map(((vocabs || []) as any[]).map(v => [v.id, v]))

    return allReviewRecords.map(record => ({
      ...(vocabMap.get(record.vocabulary_id) || {}),
      userProgress: record,
    })).filter((v: any) => v.id) as VocabularyWithProgress[]
  }

  // 标记单词掌握程度
  const markMastery = async (
    vocabularyId: number,
    level: MasteryLevel,
    isReview: boolean = false
  ): Promise<boolean> => {
    const userId = getUserId()
    if (!userId) return false

    const todayDate = getTodayDate()
    const now = new Date().toISOString()

    // 检查是否已有记录
    const { data: existing } = await supabase
      .from('user_vocabularies')
      .select('*')
      .eq('user_id', userId)
      .eq('vocabulary_id', vocabularyId)
      .single()

    const existingRecord = existing as any
    const reviewCount = existingRecord ? (existingRecord.review_count || 0) + (isReview ? 1 : 0) : 0
    const correctCount = existingRecord
      ? (existingRecord.correct_count || 0) + (level === 'mastered' || level === 'familiar' ? 1 : 0)
      : (level === 'mastered' || level === 'familiar' ? 1 : 0)

    const nextReviewAt = calculateNextReviewDate(level, reviewCount)

    if (existingRecord) {
      // 更新现有记录
      const { error } = await (supabase as any)
        .from('user_vocabularies')
        .update({
          mastery_level: level,
          review_count: reviewCount,
          correct_count: correctCount,
          next_review_at: nextReviewAt.toISOString(),
          last_reviewed_at: now,
        })
        .eq('id', existingRecord.id)

      return !error
    } else {
      // 创建新记录
      const { error } = await (supabase as any)
        .from('user_vocabularies')
        .insert({
          user_id: userId,
          vocabulary_id: vocabularyId,
          mastery_level: level,
          review_count: 0,
          correct_count: level === 'mastered' || level === 'familiar' ? 1 : 0,
          next_review_at: nextReviewAt.toISOString(),
          learned_at: todayDate,
          last_reviewed_at: now,
        })

      return !error
    }
  }

  // 获取学习统计
  const getStats = async () => {
    const userId = getUserId()
    if (!userId) {
      return {
        totalLearned: 0,
        masteredCount: 0,
        todayLearned: 0,
        needReview: 0,
      }
    }

    const todayDate = getTodayDate()
    const now = new Date().toISOString()

    // 总学习数
    const { count: totalLearned } = await supabase
      .from('user_vocabularies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // 已掌握数
    const { count: masteredCount } = await supabase
      .from('user_vocabularies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('mastery_level', 'mastered')

    // 今日学习数
    const { count: todayLearned } = await supabase
      .from('user_vocabularies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('learned_at', todayDate)

    // 需要复习数
    const { count: needReview } = await supabase
      .from('user_vocabularies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('next_review_at', now)

    return {
      totalLearned: totalLearned || 0,
      masteredCount: masteredCount || 0,
      todayLearned: todayLearned || 0,
      needReview: needReview || 0,
    }
  }

  return {
    getDailyWords,
    getReviewWords,
    markMastery,
    getStats,
    calculateNextReviewDate,
  }
}
