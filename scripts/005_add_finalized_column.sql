-- Add finalized column to track completed submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS finalized BOOLEAN DEFAULT FALSE;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS finalized_at TIMESTAMP WITH TIME ZONE;
