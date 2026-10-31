-- VEXORA CMS pages. Existing application routes remain authoritative;
-- this table stores additional content-managed pages only.
CREATE TABLE IF NOT EXISTS public.site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  excerpt VARCHAR(320),
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  seo_title VARCHAR(160),
  seo_description VARCHAR(320),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_pages_slug_format
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*(/[a-z0-9]+(-[a-z0-9]+)*)*$'),
  CONSTRAINT site_pages_title_not_blank
    CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS site_pages_status_updated_idx
  ON public.site_pages (status, updated_at DESC);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- All writes and reads are mediated by server-side routes using service_role.
-- No anon/authenticated table policies are intentionally created.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.site_pages TO service_role;

NOTIFY pgrst, 'reload schema';
