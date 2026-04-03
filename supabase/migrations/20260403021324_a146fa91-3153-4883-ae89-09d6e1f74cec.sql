
-- Drop FK constraint from profiles to auth.users to allow demo data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
