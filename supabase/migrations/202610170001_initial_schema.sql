
-- =========================================================
-- VEXORA Platform
-- Migration 001: Database foundation
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Automatically update updated_at columns
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- General application user status
DO $$
BEGIN
    CREATE TYPE public.app_user_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'pending'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END;
$$;

-- General record status
DO $$
BEGIN
    CREATE TYPE public.record_status AS ENUM (
        'active',
        'inactive',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END;
$$;

COMMIT;

