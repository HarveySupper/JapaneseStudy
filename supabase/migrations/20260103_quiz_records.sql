-- 测验记录表
-- 存储用户的五十音测验成绩

-- 创建 quiz_records 表
CREATE TABLE IF NOT EXISTS public.quiz_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_quiz_records_user_id ON public.quiz_records(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_records_created_at ON public.quiz_records(created_at DESC);

-- 启用 RLS
ALTER TABLE public.quiz_records ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的记录
CREATE POLICY "Users can view their own quiz records"
  ON public.quiz_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的记录
CREATE POLICY "Users can insert their own quiz records"
  ON public.quiz_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
