/*
# Grasela Teknik — RLS Policies

## Security Model
- profiles: authenticated users can read their own profile.
- site_settings: public read; admin-only update.
- services: public read; admin-only insert/update/delete.
- gallery: public read; admin-only insert/update/delete.
- orders: public insert (anyone can submit a booking); admin-only read/update/delete.

All admin checks use the is_admin() helper function.
*/

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================
-- SITE SETTINGS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "settings_select_all" ON public.site_settings;
CREATE POLICY "settings_select_all"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "settings_update_admin" ON public.site_settings;
CREATE POLICY "settings_update_admin"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICES POLICIES
-- ============================================================
DROP POLICY IF EXISTS "services_select_all" ON public.services;
CREATE POLICY "services_select_all"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
CREATE POLICY "services_insert_admin"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "services_update_admin" ON public.services;
CREATE POLICY "services_update_admin"
  ON public.services FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "services_delete_admin" ON public.services;
CREATE POLICY "services_delete_admin"
  ON public.services FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- GALLERY POLICIES
-- ============================================================
DROP POLICY IF EXISTS "gallery_select_all" ON public.gallery;
CREATE POLICY "gallery_select_all"
  ON public.gallery FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "gallery_insert_admin" ON public.gallery;
CREATE POLICY "gallery_insert_admin"
  ON public.gallery FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "gallery_update_admin" ON public.gallery;
CREATE POLICY "gallery_update_admin"
  ON public.gallery FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "gallery_delete_admin" ON public.gallery;
CREATE POLICY "gallery_delete_admin"
  ON public.gallery FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- ORDERS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "orders_insert_all" ON public.orders;
CREATE POLICY "orders_insert_all"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;
CREATE POLICY "orders_select_admin"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;
CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKET & POLICIES
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "gallery_bucket_read_all" ON storage.objects;
CREATE POLICY "gallery_bucket_read_all"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "gallery_bucket_insert_admin" ON storage.objects;
CREATE POLICY "gallery_bucket_insert_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

DROP POLICY IF EXISTS "gallery_bucket_update_admin" ON storage.objects;
CREATE POLICY "gallery_bucket_update_admin"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin())
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

DROP POLICY IF EXISTS "gallery_bucket_delete_admin" ON storage.objects;
CREATE POLICY "gallery_bucket_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin());