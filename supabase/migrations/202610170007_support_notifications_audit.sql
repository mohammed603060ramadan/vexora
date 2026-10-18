
-- =========================================================
-- VEXORA Platform
-- Migration 007: Support, Notifications and Audit Logs
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Support Tickets
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,

    client_id UUID
        REFERENCES public.clients(id) ON DELETE SET NULL,

    created_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    assigned_to UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    subject VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,

    category VARCHAR(100),

    priority VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    status VARCHAR(30) NOT NULL DEFAULT 'open'
        CHECK (status IN (
            'open',
            'in_progress',
            'waiting_for_client',
            'resolved',
            'closed'
        )),

    source VARCHAR(30) NOT NULL DEFAULT 'platform'
        CHECK (source IN ('platform', 'email', 'phone', 'other')),

    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT support_ticket_status_timestamps_check
        CHECK (
            (status = 'resolved' AND resolved_at IS NOT NULL)
            OR
            (status <> 'resolved' AND resolved_at IS NULL)
        ),

    CONSTRAINT support_ticket_closed_timestamp_check
        CHECK (
            (status = 'closed' AND closed_at IS NOT NULL)
            OR
            (status <> 'closed' AND closed_at IS NULL)
        )
);

-- ---------------------------------------------------------
-- 2. Support Ticket Replies
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.support_ticket_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL
        REFERENCES public.support_tickets(id) ON DELETE CASCADE,

    author_user_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    message TEXT NOT NULL,

    is_internal BOOLEAN NOT NULL DEFAULT false,

    attachment_path TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT support_ticket_reply_message_not_empty
        CHECK (length(trim(message)) > 0)
);

-- ---------------------------------------------------------
-- 3. Notifications
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    notification_type VARCHAR(50) NOT NULL DEFAULT 'general',

    related_table VARCHAR(100),
    related_record_id UUID,

    action_url TEXT,

    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT notifications_read_state_check
        CHECK (
            (is_read = false AND read_at IS NULL)
            OR
            (is_read = true AND read_at IS NOT NULL)
        )
);

-- ---------------------------------------------------------
-- 4. Audit Logs
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    actor_user_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,

    description TEXT,

    old_values JSONB,
    new_values JSONB,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT audit_logs_metadata_object_check
        CHECK (jsonb_typeof(metadata) = 'object'),

    CONSTRAINT audit_logs_old_values_object_check
        CHECK (
            old_values IS NULL
            OR jsonb_typeof(old_values) = 'object'
        ),

    CONSTRAINT audit_logs_new_values_object_check
        CHECK (
            new_values IS NULL
            OR jsonb_typeof(new_values) = 'object'
        )
);

-- ---------------------------------------------------------
-- 5. Notification read-state helper
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_notification_read_state()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NEW.is_read = false THEN
        NEW.read_at := NULL;
    ELSIF NEW.read_at IS NULL THEN
        NEW.read_at := now();
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notifications_read_state
    ON public.notifications;

CREATE TRIGGER trg_notifications_read_state
BEFORE INSERT OR UPDATE OF is_read, read_at
ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.sync_notification_read_state();

-- ---------------------------------------------------------
-- 6. Support ticket timestamp helper
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_support_ticket_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NEW.status = 'resolved' THEN
        IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'resolved' THEN
            NEW.resolved_at := now();
        ELSIF NEW.resolved_at IS NULL THEN
            NEW.resolved_at := now();
        END IF;
    ELSE
        NEW.resolved_at := NULL;
    END IF;

    IF NEW.status = 'closed' THEN
        IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'closed' THEN
            NEW.closed_at := now();
        ELSIF NEW.closed_at IS NULL THEN
            NEW.closed_at := now();
        END IF;
    ELSE
        NEW.closed_at := NULL;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_support_ticket_timestamps
    ON public.support_tickets;

CREATE TRIGGER trg_support_ticket_timestamps
BEFORE INSERT OR UPDATE OF status, resolved_at, closed_at
ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.sync_support_ticket_timestamps();

-- ---------------------------------------------------------
-- 7. Prevent accidental audit-log changes
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION
        'Audit log records cannot be updated or deleted';
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable
    ON public.audit_logs;

CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE
ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- ---------------------------------------------------------
-- 8. Indexes
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_support_tickets_client
    ON public.support_tickets(client_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_assignee
    ON public.support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status_priority
    ON public.support_tickets(status, priority);

CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at
    ON public.support_tickets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket
    ON public.support_ticket_replies(ticket_id, created_at);

CREATE INDEX IF NOT EXISTS idx_ticket_replies_author
    ON public.support_ticket_replies(author_user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON public.notifications(user_id, created_at DESC)
    WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
    ON public.audit_logs(actor_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
    ON public.audit_logs(entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON public.audit_logs(created_at DESC);

-- ---------------------------------------------------------
-- 9. Updated-at triggers
-- ---------------------------------------------------------

DROP TRIGGER IF EXISTS trg_support_tickets_updated_at
    ON public.support_tickets;

CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_support_ticket_replies_updated_at
    ON public.support_ticket_replies;

CREATE TRIGGER trg_support_ticket_replies_updated_at
BEFORE UPDATE ON public.support_ticket_replies
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;
