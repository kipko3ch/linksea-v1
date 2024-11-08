-- Add unique constraint to username if not already exists
ALTER TABLE profiles
ADD CONSTRAINT username_unique UNIQUE (username);

-- Add validation for username format
ALTER TABLE profiles
ADD CONSTRAINT username_format CHECK (
  username ~* '^[a-zA-Z0-9_-]{3,30}$'
); 