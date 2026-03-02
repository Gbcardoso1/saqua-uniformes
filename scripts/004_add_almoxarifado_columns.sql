-- Add columns for almoxarifado submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS submission_type TEXT DEFAULT 'uniformes';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS stationery_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS kitchen_items JSONB DEFAULT '[]'::jsonb;
