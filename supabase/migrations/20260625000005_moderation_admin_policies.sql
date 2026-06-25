-- Migration: 20260625000005_moderation_admin_policies.sql
-- Description: Add RLS policies for reports, moderation_log, and profiles to support Moderator and Admin portals

-- 1. Helper function to check if current user is Moderator or Admin
CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND (role ILIKE 'Moderator' OR role ILIKE 'Admin')
  );
$$;

-- 2. Helper function to check if current user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role ILIKE 'Admin'
  );
$$;

-- 3. Reports Policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON reports;
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id OR public.is_moderator_or_admin());

DROP POLICY IF EXISTS "Mods and Admins can update reports" ON reports;
CREATE POLICY "Mods and Admins can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (public.is_moderator_or_admin())
  WITH CHECK (public.is_moderator_or_admin());

DROP POLICY IF EXISTS "Mods and Admins can delete reports" ON reports;
CREATE POLICY "Mods and Admins can delete reports"
  ON reports FOR DELETE
  TO authenticated
  USING (public.is_moderator_or_admin());


-- 4. Moderation Log Policies
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mods and Admins can insert log" ON moderation_log;
CREATE POLICY "Mods and Admins can insert log"
  ON moderation_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_moderator_or_admin());

DROP POLICY IF EXISTS "Mods and Admins can view log" ON moderation_log;
CREATE POLICY "Mods and Admins can view log"
  ON moderation_log FOR SELECT
  TO authenticated
  USING (public.is_moderator_or_admin());


-- 5. Profiles Policies Update for Admins
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
