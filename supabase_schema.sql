-- SQL Schema for Personal Dashboard
-- 1. Resume Profile Table (Single row storage: id = 'my-resume')
CREATE TABLE IF NOT EXISTS resume_profile (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE resume_profile ENABLE ROW LEVEL SECURITY;

-- Public read access: anyone can view
DROP POLICY IF EXISTS "public_select_resume" ON resume_profile;
CREATE POLICY "public_select_resume" ON resume_profile 
  FOR SELECT USING (true);

-- Authenticated write access: only I (logged in) can modify
DROP POLICY IF EXISTS "auth_modify_resume" ON resume_profile;
CREATE POLICY "auth_modify_resume" ON resume_profile 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- 2. Todo Tasks Table
CREATE TABLE IF NOT EXISTS todo_tasks (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  priority TEXT DEFAULT 'Medium' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE todo_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write access to todo_tasks" ON todo_tasks 
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write access to journal_entries" ON journal_entries 
  FOR ALL USING (true) WITH CHECK (true);

-- Seed Initial Data
INSERT INTO resume_profile (id, data)
VALUES (
  'my-resume',
  '{
    "about": {
      "name": "Alexander Mercer",
      "title": "Senior Full-Stack Engineer",
      "location": "San Francisco, CA (Remote)",
      "bio": "Passionate software engineer specializing in building high-performance, accessible, and scalable web applications."
    },
    "skills": ["React", "Node.js", "TypeScript", "JavaScript", "Python", "SQL", "Docker", "Git"],
    "experience": [],
    "projects": [],
    "education": []
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Cleanup legacy tables
DROP TABLE IF EXISTS user_roles;
