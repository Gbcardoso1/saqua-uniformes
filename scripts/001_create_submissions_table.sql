-- Create submissions table to store uniform requests
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  registration text not null,
  institution text not null,
  uniforms jsonb not null default '[]'::jsonb,
  shoes jsonb not null default '[]'::jsonb,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.submissions enable row level security;

-- Allow anyone to insert (directors submitting forms)
create policy "Allow public insert"
  on public.submissions for insert
  with check (true);

-- Allow anyone to select (admin viewing submissions)
create policy "Allow public select"
  on public.submissions for select
  using (true);

-- Create index for faster queries
create index if not exists submissions_submitted_at_idx on public.submissions(submitted_at desc);
create index if not exists submissions_institution_idx on public.submissions(institution);
