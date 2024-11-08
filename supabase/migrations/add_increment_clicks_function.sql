-- Function to increment link clicks
create or replace function increment_link_clicks(link_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update links
  set clicks = clicks + 1
  where id = link_id;
end;
$$;

-- Allow public access to the function
grant execute on function increment_link_clicks(uuid) to public; 