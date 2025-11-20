-- Create the flights table
create table public.flights (
  id uuid default gen_random_uuid() primary key,
  flight_number text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  time_zone text not null,
  start_location text not null,
  end_location text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.flights enable row level security;

-- Create a policy that allows anyone to read flights (public access)
create policy "Enable read access for all users"
on public.flights
for select
to public
using (true);

-- Create a policy that allows anyone to insert/update/delete (FOR DEMO/ADMIN ONLY)
-- IN PRODUCTION: You should restrict this to authenticated users with specific roles
create policy "Enable write access for all users"
on public.flights
for all
to public
using (true)
with check (true);
