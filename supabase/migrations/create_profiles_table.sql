-- Drop the table if it exists
DROP TABLE IF EXISTS profiles;

-- Create the table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  bio text,
  avatar_url text,
  updated_at timestamp with time zone default now(),
  constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create trigger to automatically update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();