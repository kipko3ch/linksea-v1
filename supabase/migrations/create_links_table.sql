-- Create sequence for position
CREATE SEQUENCE IF NOT EXISTS links_position_seq;

-- Create links table
create table links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text not null,
  description text,
  icon text,
  position integer default nextval('links_position_seq') not null,
  clicks integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table links enable row level security;

-- Create policies
create policy "Users can view their own links"
  on links for select
  using (auth.uid() = user_id);

create policy "Users can insert their own links"
  on links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on links for delete
  using (auth.uid() = user_id);

-- Create index on user_id and position
CREATE INDEX links_user_id_position_idx ON links(user_id, position);