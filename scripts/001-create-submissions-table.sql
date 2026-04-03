-- Create submissions table for storing uniform and almoxarifado requests
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  requester_name TEXT NOT NULL,
  registration TEXT NOT NULL,
  institution TEXT NOT NULL,
  submission_type TEXT DEFAULT 'uniformes',
  uniforms JSONB DEFAULT '[]'::jsonb,
  shoes JSONB DEFAULT '[]'::jsonb,
  student_kits JSONB DEFAULT '[]'::jsonb,
  teacher_polos JSONB DEFAULT '[]'::jsonb,
  backpacks JSONB DEFAULT '[]'::jsonb,
  stationery_items JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pendente'
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_institution ON submissions(institution);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(submission_type);
