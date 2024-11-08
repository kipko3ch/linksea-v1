-- Add clicks column to links table if not exists
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS clicks integer DEFAULT 0;

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  link_id uuid REFERENCES links ON DELETE CASCADE NOT NULL,
  clicked_at timestamp with time zone DEFAULT now(),
  referrer text,
  user_agent text,
  country text
);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analytics"
  ON analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT
  WITH CHECK (true);

-- Create function to increment link clicks
CREATE OR REPLACE FUNCTION increment_link_clicks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE links
  SET clicks = clicks + 1
  WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment clicks when analytics are added
DROP TRIGGER IF EXISTS on_analytics_insert ON analytics;
CREATE TRIGGER on_analytics_insert
  AFTER INSERT ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION increment_link_clicks();

-- Create index for better performance
CREATE INDEX analytics_link_id_idx ON analytics(link_id);
CREATE INDEX analytics_user_id_idx ON analytics(user_id);