
CREATE TABLE public.barmode_progress (
  user_id UUID NOT NULL,
  track TEXT NOT NULL,
  missed INT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, track)
);
GRANT SELECT, INSERT, UPDATE ON public.barmode_progress TO authenticated;
GRANT ALL ON public.barmode_progress TO service_role;
ALTER TABLE public.barmode_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own progress" ON public.barmode_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users save their own progress" ON public.barmode_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own progress" ON public.barmode_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
