
-- =========================================================
-- VEXORA Platform
-- Migration 003: Clients, services, requests and contracts
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Clients
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE
        REFERENCES auth.users(id) ON DELETE SET NULL,
    client_type VARCHAR(20) NOT NULL DEFAULT 'company'
        CHECK (client_type IN ('individual', 'company')),
    name VARCHAR(180) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(40),
    company_name VARCHAR(180),
    tax_number VARCHAR(80),
    website VARCHAR(255),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    notes TEXT,
    status public.record_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 2. Service catalog
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID
        REFERENCES public.departments(id) ON DELETE SET NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    description TEXT,
    starting_price NUMERIC(12, 2)
        CHECK (starting_price IS NULL OR starting_price >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    estimated_days INTEGER
        CHECK (estimated_days IS NULL OR estimated_days >= 0),
    status public.record_status NOT NULL DEFAULT 'active',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 3. Client service requests
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,

    client_id UUID NOT NULL
        REFERENCES public.clients(id) ON DELETE RESTRICT,

    service_id UUID
        REFERENCES public.services(id) ON DELETE SET NULL,

    assigned_to UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    budget_min NUMERIC(12, 2)
        CHECK (budget_min IS NULL OR budget_min >= 0),

    budget_max NUMERIC(12, 2)
        CHECK (budget_max IS NULL OR budget_max >= 0),

    currency CHAR(3) NOT NULL DEFAULT 'USD',

    status VARCHAR(30) NOT NULL DEFAULT 'new'
        CHECK (status IN (
            'new',
            'reviewing',
            'quoted',
            'approved',
            'in_progress',
            'completed',
            'rejected',
            'cancelled'
        )),

    priority VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT service_requests_budget_range_check
        CHECK (
            budget_min IS NULL
            OR budget_max IS NULL
            OR budget_max >= budget_min
        ),

    -- Required so quotations can reference the request
    -- and its client together.
    CONSTRAINT service_requests_id_client_unique
        UNIQUE (id, client_id)
);

-- ---------------------------------------------------------
-- 4. Quotations
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,

    request_id UUID NOT NULL,

    client_id UUID NOT NULL
        REFERENCES public.clients(id) ON DELETE RESTRICT,

    prepared_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (subtotal >= 0),

    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (discount_amount >= 0),

    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (tax_amount >= 0),

    total_amount NUMERIC(12, 2)
        GENERATED ALWAYS AS (
            subtotal - discount_amount + tax_amount
        ) STORED,

    currency CHAR(3) NOT NULL DEFAULT 'USD',

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft', 'sent', 'accepted', 'rejected', 'expired'
        )),

    valid_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT quotations_discount_within_subtotal
        CHECK (discount_amount <= subtotal),

    -- A quotation must belong to the same client as its request.
    CONSTRAINT quotations_request_client_fk
        FOREIGN KEY (request_id, client_id)
        REFERENCES public.service_requests (id, client_id)
        ON DELETE RESTRICT,

    -- Required for contracts to verify client and currency.
    CONSTRAINT quotations_id_client_currency_unique
        UNIQUE (id, client_id, currency)
);

-- ---------------------------------------------------------
-- 5. Quotation line items
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    quotation_id UUID NOT NULL
        REFERENCES public.quotations(id) ON DELETE CASCADE,

    description VARCHAR(300) NOT NULL,

    quantity NUMERIC(12, 2) NOT NULL DEFAULT 1
        CHECK (quantity > 0),

    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (unit_price >= 0),

    line_total NUMERIC(14, 2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 6. Recalculate quotation subtotal from its line items
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.recalculate_quotation_subtotal()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_old_quotation_id UUID;
    v_new_quotation_id UUID;
BEGIN
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        v_old_quotation_id := OLD.quotation_id;
    END IF;

    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        v_new_quotation_id := NEW.quotation_id;
    END IF;

    -- Recalculate the previous quotation when an item is
    -- deleted or moved to another quotation.
    IF v_old_quotation_id IS NOT NULL THEN
        UPDATE public.quotations AS q
        SET subtotal = (
            SELECT COALESCE(SUM(qi.line_total), 0)
            FROM public.quotation_items AS qi
            WHERE qi.quotation_id = v_old_quotation_id
        )
        WHERE q.id = v_old_quotation_id;
    END IF;

    -- Recalculate the destination quotation when an item
    -- is inserted or moved from another quotation.
    IF v_new_quotation_id IS NOT NULL
       AND v_new_quotation_id IS DISTINCT FROM v_old_quotation_id
    THEN
        UPDATE public.quotations AS q
        SET subtotal = (
            SELECT COALESCE(SUM(qi.line_total), 0)
            FROM public.quotation_items AS qi
            WHERE qi.quotation_id = v_new_quotation_id
        )
        WHERE q.id = v_new_quotation_id;
    END IF;

    -- AFTER triggers ignore the returned row.
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_quotation_items_recalculate_subtotal
    ON public.quotation_items;

CREATE TRIGGER trg_quotation_items_recalculate_subtotal
AFTER INSERT OR UPDATE OR DELETE
ON public.quotation_items
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_quotation_subtotal();

-- ---------------------------------------------------------
-- 7. Contracts
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,

    client_id UUID NOT NULL
        REFERENCES public.clients(id) ON DELETE RESTRICT,

    quotation_id UUID,

    title VARCHAR(200) NOT NULL,
    terms TEXT,

    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (total_amount >= 0),

    currency CHAR(3) NOT NULL DEFAULT 'USD',

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft', 'pending', 'active', 'completed',
            'terminated', 'expired'
        )),

    start_date DATE,
    end_date DATE,

    created_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT contracts_date_range_check
        CHECK (
            start_date IS NULL
            OR end_date IS NULL
            OR end_date >= start_date
        ),

    -- If a quotation is supplied, its client and currency
    -- must match those recorded on the contract.
    CONSTRAINT contracts_quotation_client_currency_fk
        FOREIGN KEY (quotation_id, client_id, currency)
        REFERENCES public.quotations (id, client_id, currency)
        ON DELETE RESTRICT
);

-- ---------------------------------------------------------
-- 8. Indexes
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_clients_user
    ON public.clients(user_id);

CREATE INDEX IF NOT EXISTS idx_clients_status
    ON public.clients(status);

CREATE INDEX IF NOT EXISTS idx_services_department
    ON public.services(department_id);

CREATE INDEX IF NOT EXISTS idx_services_status_order
    ON public.services(status, display_order);

CREATE INDEX IF NOT EXISTS idx_service_requests_client
    ON public.service_requests(client_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_service
    ON public.service_requests(service_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_assignee
    ON public.service_requests(assigned_to);

CREATE INDEX IF NOT EXISTS idx_service_requests_status_date
    ON public.service_requests(status, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_quotations_client
    ON public.quotations(client_id);

CREATE INDEX IF NOT EXISTS idx_quotations_request
    ON public.quotations(request_id);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation
    ON public.quotation_items(quotation_id);

CREATE INDEX IF NOT EXISTS idx_contracts_client
    ON public.contracts(client_id);

CREATE INDEX IF NOT EXISTS idx_contracts_quotation
    ON public.contracts(quotation_id);

-- ---------------------------------------------------------
-- 9. updated_at triggers
-- ---------------------------------------------------------

DROP TRIGGER IF EXISTS trg_clients_updated_at
    ON public.clients;

CREATE TRIGGER trg_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_services_updated_at
    ON public.services;

CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_service_requests_updated_at
    ON public.service_requests;

CREATE TRIGGER trg_service_requests_updated_at
BEFORE UPDATE ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_quotations_updated_at
    ON public.quotations;

CREATE TRIGGER trg_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_contracts_updated_at
    ON public.contracts;

CREATE TRIGGER trg_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;
