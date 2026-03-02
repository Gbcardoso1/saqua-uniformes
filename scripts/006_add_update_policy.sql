-- Add UPDATE policy for submissions table
CREATE POLICY "Allow public update" ON public.submissions FOR UPDATE USING (true) WITH CHECK (true);
