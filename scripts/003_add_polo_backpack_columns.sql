-- Add separate columns for teacher polos and backpacks
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS teacher_polos jsonb DEFAULT '[]'::jsonb;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS backpacks jsonb DEFAULT '[]'::jsonb;
