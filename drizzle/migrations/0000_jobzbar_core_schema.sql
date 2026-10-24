
-- 1. Profiles (auto-created on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  city TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Feed posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT 'General',
  body TEXT NOT NULL,
  likes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are readable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Signed-in users post as themselves" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors update their own posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors delete their own posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Post comments
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.post_comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are readable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Signed-in users comment as themselves" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors delete their own comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Jobs & gigs posted by members
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gig','full')),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  city TEXT NOT NULL,
  role TEXT NOT NULL,
  pay TEXT NOT NULL,
  per TEXT NOT NULL DEFAULT '/shift',
  when_text TEXT NOT NULL DEFAULT 'Flexible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs are readable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Signed-in users post jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Posters update their own jobs" ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Posters delete their own jobs" ON public.jobs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants read their own applications" ON public.job_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Job posters read applications to their jobs" ON public.job_applications FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.user_id = auth.uid()));
CREATE POLICY "Signed-in users apply as themselves" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Applicants withdraw their own application" ON public.job_applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. Venue sessions (server-validated check-ins)
CREATE TABLE public.venue_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  venue_id TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  alias TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  intent TEXT NOT NULL DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.venue_sessions TO authenticated;
GRANT ALL ON public.venue_sessions TO service_role;
ALTER TABLE public.venue_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active sessions are visible to signed-in users" ON public.venue_sessions FOR SELECT TO authenticated USING (ended_at IS NULL AND expires_at > now());
CREATE POLICY "Users read their own session history" ON public.venue_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users start their own sessions" ON public.venue_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users end their own sessions" ON public.venue_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. Venue chat messages
CREATE TABLE public.venue_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.venue_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  venue_id TEXT NOT NULL,
  author_alias TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.venue_messages TO authenticated;
GRANT ALL ON public.venue_messages TO service_role;
ALTER TABLE public.venue_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read venue chat" ON public.venue_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only active session holders post to venue chat" ON public.venue_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.venue_sessions s WHERE s.id = session_id AND s.user_id = auth.uid() AND s.ended_at IS NULL AND s.expires_at > now()));

-- 8. BAR MODE unlock (one-time ₹369)
CREATE TABLE public.barmode_unlocks (
  user_id UUID PRIMARY KEY,
  amount_inr INT NOT NULL DEFAULT 369,
  provider TEXT NOT NULL DEFAULT 'demo',
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.barmode_unlocks TO authenticated;
GRANT ALL ON public.barmode_unlocks TO service_role;
ALTER TABLE public.barmode_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own unlock" ON public.barmode_unlocks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users record their own unlock" ON public.barmode_unlocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 9. BAR MODE test attempts
CREATE TABLE public.barmode_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  track TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  missed INT[] NOT NULL DEFAULT '{}',
  revisit BOOLEAN NOT NULL DEFAULT false,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.barmode_attempts TO authenticated;
GRANT ALL ON public.barmode_attempts TO service_role;
ALTER TABLE public.barmode_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own attempts" ON public.barmode_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users save their own attempts" ON public.barmode_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users attach their plan to their own attempt" ON public.barmode_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. Mentor requests
CREATE TABLE public.mentor_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Waiting for mentor',
  answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.mentor_requests TO authenticated;
GRANT ALL ON public.mentor_requests TO service_role;
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own mentor requests" ON public.mentor_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users send their own mentor requests" ON public.mentor_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
