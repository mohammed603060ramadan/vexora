-- VEXORA Finance schema repair.
-- Additive, idempotent migration. Does not create placeholder contracts
-- or modify existing client/project records.
-- Finance UI reads these tables only through an authenticated admin session.

BEGIN;

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount NUMERIC(14, 2)
    GENERATED ALWAYS AS (subtotal - discount_amount + tax_amount) STORED,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'void')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT invoices_discount_within_subtotal CHECK (discount_amount <= subtotal),
  CONSTRAINT invoices_date_range_check CHECK (due_date IS NULL OR due_date >= issue_date),
  CONSTRAINT invoices_id_client_currency_unique UNIQUE (id, client_id, currency)
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description VARCHAR(300) NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  line_total NUMERIC(16, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  invoice_id UUID,
  received_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  payment_method VARCHAR(30) NOT NULL DEFAULT 'bank_transfer'
    CHECK (payment_method IN ('cash', 'bank_transfer', 'card', 'online', 'cheque', 'other')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_reference VARCHAR(180),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payments_invoice_client_currency_fk
    FOREIGN KEY (invoice_id, client_id, currency)
    REFERENCES public.invoices (id, client_id, currency)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title VARCHAR(220) NOT NULL,
  description TEXT,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(30)
    CHECK (payment_method IS NULL OR payment_method IN ('cash', 'bank_transfer', 'card', 'online', 'other')),
  status VARCHAR(20) NOT NULL DEFAULT 'recorded'
    CHECK (status IN ('recorded', 'pending', 'cancelled')),
  receipt_path TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.recalculate_invoice_subtotal()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_old_invoice_id UUID;
  v_new_invoice_id UUID;
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    v_old_invoice_id := OLD.invoice_id;
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    v_new_invoice_id := NEW.invoice_id;
  END IF;
  IF v_old_invoice_id IS NOT NULL THEN
    UPDATE public.invoices AS i
    SET subtotal = (
      SELECT COALESCE(SUM(ii.line_total), 0)
      FROM public.invoice_items AS ii
      WHERE ii.invoice_id = v_old_invoice_id
    )
    WHERE i.id = v_old_invoice_id;
  END IF;
  IF v_new_invoice_id IS NOT NULL
     AND v_new_invoice_id IS DISTINCT FROM v_old_invoice_id THEN
    UPDATE public.invoices AS i
    SET subtotal = (
      SELECT COALESCE(SUM(ii.line_total), 0)
      FROM public.invoice_items AS ii
      WHERE ii.invoice_id = v_new_invoice_id
    )
    WHERE i.id = v_new_invoice_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_items_recalculate_subtotal ON public.invoice_items;
CREATE TRIGGER trg_invoice_items_recalculate_subtotal
AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
FOR EACH ROW EXECUTE FUNCTION public.recalculate_invoice_subtotal();

CREATE OR REPLACE FUNCTION public.refresh_invoice_payment_status(p_invoice_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_total NUMERIC(14, 2);
  v_paid NUMERIC(14, 2);
  v_due_date DATE;
  v_status VARCHAR(20);
  v_new_status VARCHAR(20);
BEGIN
  SELECT i.total_amount, i.due_date, i.status
  INTO v_total, v_due_date, v_status
  FROM public.invoices AS i
  WHERE i.id = p_invoice_id
  FOR UPDATE;
  IF NOT FOUND OR v_status IN ('draft', 'void') THEN
    RETURN;
  END IF;
  SELECT COALESCE(SUM(p.amount), 0)
  INTO v_paid
  FROM public.payments AS p
  WHERE p.invoice_id = p_invoice_id AND p.status = 'completed';
  IF v_total > 0 AND v_paid >= v_total THEN
    v_new_status := 'paid';
  ELSIF v_paid > 0 THEN
    v_new_status := 'partially_paid';
  ELSIF v_due_date IS NOT NULL AND v_due_date < CURRENT_DATE THEN
    v_new_status := 'overdue';
  ELSE
    v_new_status := 'issued';
  END IF;
  UPDATE public.invoices
  SET status = v_new_status
  WHERE id = p_invoice_id AND status IS DISTINCT FROM v_new_status;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_payment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.invoice_id IS NOT NULL THEN
    PERFORM public.refresh_invoice_payment_status(OLD.invoice_id);
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE')
     AND NEW.invoice_id IS NOT NULL
     AND (
       TG_OP = 'INSERT'
       OR NEW.invoice_id IS DISTINCT FROM OLD.invoice_id
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.amount IS DISTINCT FROM OLD.amount
     ) THEN
    PERFORM public.refresh_invoice_payment_status(NEW.invoice_id);
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_payments_refresh_invoice_status ON public.payments;
CREATE TRIGGER trg_payments_refresh_invoice_status
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_payment_status_change();

CREATE INDEX IF NOT EXISTS idx_invoices_client_date ON public.invoices(client_id, issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status_due ON public.invoices(status, due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON public.invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_date ON public.payments(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_expenses_category_date ON public.expenses(category_id, expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON public.expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status_date ON public.expenses(status, expense_date DESC);

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_payments_updated_at ON public.payments;
CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_expenses_updated_at ON public.expenses;
CREATE TRIGGER trg_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Finance pages currently expose read-only registers. Authenticated users
-- may SELECT only when their server-issued app_metadata role is admin.
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS finance_admin_select_invoices ON public.invoices;
CREATE POLICY finance_admin_select_invoices ON public.invoices
FOR SELECT TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS finance_admin_select_invoice_items ON public.invoice_items;
CREATE POLICY finance_admin_select_invoice_items ON public.invoice_items
FOR SELECT TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS finance_admin_select_payments ON public.payments;
CREATE POLICY finance_admin_select_payments ON public.payments
FOR SELECT TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS finance_admin_select_expense_categories ON public.expense_categories;
CREATE POLICY finance_admin_select_expense_categories ON public.expense_categories
FOR SELECT TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS finance_admin_select_expenses ON public.expenses;
CREATE POLICY finance_admin_select_expenses ON public.expenses
FOR SELECT TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

GRANT USAGE ON SCHEMA public TO authenticated, service_role;
REVOKE ALL ON TABLE
  public.invoices,
  public.invoice_items,
  public.payments,
  public.expense_categories,
  public.expenses
FROM anon, authenticated;
GRANT SELECT ON TABLE
  public.invoices,
  public.invoice_items,
  public.payments,
  public.expense_categories,
  public.expenses
TO authenticated;
GRANT ALL ON TABLE
  public.invoices,
  public.invoice_items,
  public.payments,
  public.expense_categories,
  public.expenses
TO service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;
