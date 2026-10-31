-- VEXORA News & Announcements CMS
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  excerpt VARCHAR(600) NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  category VARCHAR(40) NOT NULL DEFAULT 'Company News'
    CHECK (category IN ('Company News','Announcements','Technology','Events')),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('published','draft','archived')),
  author VARCHAR(120) NOT NULL DEFAULT 'VEXORA Team',
  seo_title VARCHAR(160),
  seo_description VARCHAR(320),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT news_articles_slug_format
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT news_articles_title_not_blank CHECK (length(trim(title)) > 0),
  CONSTRAINT news_articles_excerpt_not_blank CHECK (length(trim(excerpt)) > 0)
);

CREATE INDEX IF NOT EXISTS news_articles_status_published_idx
  ON public.news_articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS news_articles_category_idx
  ON public.news_articles (category, updated_at DESC);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- The application uses server-side admin API routes for writes and public reads.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.news_articles TO service_role;

NOTIFY pgrst, 'reload schema';
