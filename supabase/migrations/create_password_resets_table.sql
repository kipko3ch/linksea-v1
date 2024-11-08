create table password_resets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  used boolean default false
);

-- Enable RLS
alter table password_resets enable row level security;

-- Create policies
create policy "Users can view their own reset tokens"
  on password_resets for select
  using (auth.uid() = user_id);