-- Add creche_items column for storing creche items in almoxarifado submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS creche_items JSONB DEFAULT '[]'::jsonb;
