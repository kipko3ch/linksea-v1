-- Create settings table
create table if not exists app_settings (
  key text primary key,
  value text not null
);

-- Insert default settings
insert into app_settings (key, value) values
  ('frontend_url', 'http://localhost:3000'),
  ('email_webhook_url', 'http://localhost:3000/api/auth/email-hook')
on conflict (key) do update set value = excluded.value;

-- Create a function to get settings
create or replace function get_setting(setting_key text)
returns text as $$
  select value from app_settings where key = setting_key;
$$ language sql stable;

-- Create a function to handle email events
create or replace function handle_auth_email()
returns trigger as $$
declare
  email_data json;
  frontend_url text;
  webhook_url text;
  user_email text;
begin
  -- Get settings
  frontend_url := get_setting('frontend_url');
  webhook_url := get_setting('email_webhook_url');

  -- Get user email from auth.users (using service role)
  select email into user_email 
  from auth.users 
  where id = NEW.user_id;

  -- For OTP creation
  email_data := json_build_object(
    'event', 'LOGIN_OTP',
    'email', user_email,
    'data', json_build_object(
      'otp', NEW.otp
    )
  );

  -- Call the email webhook if we have data to send
  if email_data is not null then
    perform
      net.http_post(
        url := webhook_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := email_data
      );
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger for OTP creation
drop trigger if exists on_otp_created on auth_otps;
create trigger on_otp_created
  after insert on auth_otps
  for each row execute procedure handle_auth_email();