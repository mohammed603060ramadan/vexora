
-- =========================================================
-- VEXORA Platform
-- Migration: Initial database foundation
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Extensions
-- ---------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------
-- 2. Shared timestamp trigger function
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------
-- 3. Shared application enums
-- ---------------------------------------------------------

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
