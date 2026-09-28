-- Allow admins to configure an exact Google Maps destination separately from the display address.
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS maps_url text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.site_settings.maps_url IS
  'Optional Google Maps share URL used by public address links.';
