-- Create feedbacks table for storing school suggestions and feedback
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'sugestao',
  status VARCHAR(20) DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert feedback
CREATE POLICY "Allow anonymous insert" ON feedbacks
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy to allow authenticated users to read all feedbacks
CREATE POLICY "Allow authenticated read" ON feedbacks
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow anonymous read (for admin panel)
CREATE POLICY "Allow anon read" ON feedbacks
  FOR SELECT
  TO anon
  USING (true);

-- Policy to allow anonymous update (for admin panel)
CREATE POLICY "Allow anon update" ON feedbacks
  FOR UPDATE
  TO anon
  USING (true);
