-- 单词库表
CREATE TABLE IF NOT EXISTS public.vocabularies (
  id SERIAL PRIMARY KEY,
  kanji TEXT NOT NULL,
  hiragana TEXT NOT NULL,
  katakana TEXT,
  romaji TEXT,
  meaning TEXT NOT NULL,
  example_sentence TEXT,
  example_meaning TEXT,
  level TEXT DEFAULT 'N5' CHECK (level IN ('N5', 'N4', 'N3', 'N2', 'N1', 'custom')),
  difficulty_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户单词学习记录表
CREATE TABLE IF NOT EXISTS public.user_vocabularies (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vocabulary_id INT REFERENCES public.vocabularies(id) ON DELETE CASCADE NOT NULL,
  mastery_level TEXT DEFAULT 'new' CHECK (mastery_level IN ('new', 'learning', 'familiar', 'mastered')),
  review_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  learned_at DATE,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_vocab_user ON public.user_vocabularies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocab_next_review ON public.user_vocabularies(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_vocab_learned_at ON public.user_vocabularies(user_id, learned_at);
CREATE INDEX IF NOT EXISTS idx_vocab_level ON public.vocabularies(level, difficulty_order);

-- 启用 RLS
ALTER TABLE public.vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabularies ENABLE ROW LEVEL SECURITY;

-- 单词库：所有人可读
DROP POLICY IF EXISTS "Anyone can read vocabularies" ON public.vocabularies;
CREATE POLICY "Anyone can read vocabularies" ON public.vocabularies
  FOR SELECT USING (true);

-- 用户学习记录：用户只能操作自己的记录
DROP POLICY IF EXISTS "Users can view own vocabulary records" ON public.user_vocabularies;
CREATE POLICY "Users can view own vocabulary records" ON public.user_vocabularies
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vocabulary records" ON public.user_vocabularies;
CREATE POLICY "Users can insert own vocabulary records" ON public.user_vocabularies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vocabulary records" ON public.user_vocabularies;
CREATE POLICY "Users can update own vocabulary records" ON public.user_vocabularies
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vocabulary records" ON public.user_vocabularies;
CREATE POLICY "Users can delete own vocabulary records" ON public.user_vocabularies
  FOR DELETE USING (auth.uid() = user_id);
