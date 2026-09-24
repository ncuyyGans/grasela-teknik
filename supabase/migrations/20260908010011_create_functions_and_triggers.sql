/*
# Grasela Teknik — Helper Functions & Auth Trigger

1. is_admin() — returns true if current auth user has is_admin = true in profiles.
   Used by RLS policies to restrict admin-only operations.
2. handle_new_user() — trigger that auto-creates a profile on signup.
   The FIRST user to sign up automatically becomes admin.
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, is_admin)
  VALUES (
    NEW.id,
    NOT EXISTS (SELECT 1 FROM public.profiles WHERE is_admin = true)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();