ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status text DEFAULT 'pendente';
UPDATE submissions SET status = CASE WHEN finalized = true THEN 'finalizado' ELSE 'pendente' END WHERE status IS NULL OR status = 'pendente';
