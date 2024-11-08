create table auth_otps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  otp text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  used boolean default false
);

-- Enable RLS
alter table auth_otps enable row level security;

-- Create policies
create policy "Users can view their own OTPs"
  on auth_otps for select
  using (auth.uid() = user_id);