-- Add student_kits and teacher_kits columns to submissions table
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS student_kits JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS teacher_kits JSONB DEFAULT '[]'::jsonb;
