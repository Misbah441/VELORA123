-- Migration: Run this in your Supabase SQL Editor to create the schema
-- Do NOT run in production without review. Enable RLS before exposing tables.

-- ─── Extensions ─────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE shop_category AS ENUM (
    'produce', 'food_stall', 'grocery', 'clothing', 'household_goods', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE shop_status AS ENUM ('draft', 'published', 'paused');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE stall_type AS ENUM ('fixed', 'mobile');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ledger_entry_type AS ENUM (
    'sale', 'purchase', 'expense', 'withdrawal', 'credit_given', 'credit_repaid'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE surplus_listing_status AS ENUM ('active', 'expired', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE reservation_status AS ENUM (
    'pending', 'confirmed', 'collected', 'cancelled', 'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE purchase_group_status AS ENUM (
    'draft', 'open', 'collecting_offers', 'confirmed', 'completed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Tables ──────────────────────────────────────────────────────────────────

-- vendor_profiles: one row per authenticated user
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name        TEXT NOT NULL,
  preferred_language  TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ml')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_vendor_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.vendor_profiles (id, display_name, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.raw_user_meta_data->>'preferred_language' = 'ml' THEN 'ml' ELSE 'en' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_vendor_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_vendor_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_vendor_user();

-- vendor_settings: per-vendor preferences / feature flags
CREATE TABLE IF NOT EXISTS vendor_settings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id            UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  key                 TEXT NOT NULL,
  value               JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_id, key)
);

-- shops
CREATE TABLE IF NOT EXISTS shops (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id                    UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  name                        TEXT NOT NULL,
  slug                        TEXT NOT NULL,
  category                    shop_category NOT NULL,
  description                 TEXT,
  stall_type                  stall_type NOT NULL DEFAULT 'fixed',
  service_area                TEXT,
  public_location             TEXT,
  location_lat                DOUBLE PRECISION,
  location_lng                DOUBLE PRECISION,
  location_updated_at         TIMESTAMPTZ,
  opening_hours               JSONB,
  public_contact_preference   TEXT NOT NULL DEFAULT 'none' CHECK (public_contact_preference IN ('email', 'phone', 'none')),
  public_contact_value        TEXT,
  status                      shop_status NOT NULL DEFAULT 'draft',
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slug)
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id               UUID NOT NULL REFERENCES shops (id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  category              TEXT,
  description           TEXT,
  image_url             TEXT,
  selling_price_paise   INTEGER NOT NULL CHECK (selling_price_paise >= 0),
  currency              TEXT NOT NULL DEFAULT 'INR',
  unit                  TEXT NOT NULL DEFAULT 'piece',
  quantity_available    INTEGER CHECK (quantity_available >= 0),
  is_available          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- product_costs (private cost tracking per product)
CREATE TABLE IF NOT EXISTS product_costs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id          UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  owner_id            UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  cost_price_paise    INTEGER CHECK (cost_price_paise >= 0),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- inventory (opening stock and private notes per product)
CREATE TABLE IF NOT EXISTS inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  opening_stock   INTEGER CHECK (opening_stock >= 0),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ledger_entries (immutable double-entry style log)
CREATE TABLE IF NOT EXISTS ledger_entries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id          UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  amount_paise      INTEGER NOT NULL CHECK (amount_paise >= 0),
  entry_type        ledger_entry_type NOT NULL,
  payment_method    payment_method NOT NULL DEFAULT 'cash',
  description       TEXT,
  entry_date        DATE NOT NULL,
  idempotency_key   TEXT NOT NULL,
  correction_of     UUID REFERENCES ledger_entries (id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

-- credit_customers (private customer credit ledger)
CREATE TABLE IF NOT EXISTS credit_customers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id              UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  customer_reference    TEXT NOT NULL,
  outstanding_paise     INTEGER NOT NULL DEFAULT 0 CHECK (outstanding_paise >= 0),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- credit_events (journal of credit give / repay events)
CREATE TABLE IF NOT EXISTS credit_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id     UUID NOT NULL REFERENCES credit_customers (id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  amount_paise    INTEGER NOT NULL CHECK (amount_paise >= 0),
  event_type      TEXT NOT NULL CHECK (event_type IN ('credit_given', 'credit_repaid')),
  notes           TEXT,
  event_date      DATE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- surplus_listings
CREATE TABLE IF NOT EXISTS surplus_listings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id              UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  shop_id                 UUID NOT NULL REFERENCES shops (id) ON DELETE CASCADE,
  owner_id                UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  image_url               TEXT,
  eligible_quantity       INTEGER NOT NULL CHECK (eligible_quantity > 0),
  reserved_quantity       INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  normal_price_paise      INTEGER NOT NULL CHECK (normal_price_paise >= 0),
  discounted_price_paise  INTEGER NOT NULL CHECK (discounted_price_paise >= 0),
  collection_deadline     TIMESTAMPTZ NOT NULL,
  pickup_instructions     TEXT,
  status                  surplus_listing_status NOT NULL DEFAULT 'active',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reserved_lte_eligible CHECK (reserved_quantity <= eligible_quantity)
);

-- reservations
CREATE TABLE IF NOT EXISTS reservations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id        UUID NOT NULL REFERENCES surplus_listings (id) ON DELETE CASCADE,
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  customer_contact  TEXT NOT NULL,
  status            reservation_status NOT NULL DEFAULT 'pending',
  secure_token      TEXT NOT NULL,
  expiry            TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (secure_token)
);

-- enquiries (from public to vendor)
CREATE TABLE IF NOT EXISTS enquiries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id         UUID NOT NULL REFERENCES shops (id) ON DELETE CASCADE,
  sender_name     TEXT NOT NULL,
  sender_contact  TEXT NOT NULL,
  message         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- buy_groups (collective purchase groups)
CREATE TABLE IF NOT EXISTS buy_groups (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id    UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  item_name       TEXT NOT NULL,
  grade           TEXT,
  unit            TEXT NOT NULL,
  total_quantity  INTEGER NOT NULL CHECK (total_quantity > 0),
  area            TEXT NOT NULL,
  status          purchase_group_status NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- buy_group_members
CREATE TABLE IF NOT EXISTS buy_group_members (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id            UUID NOT NULL REFERENCES buy_groups (id) ON DELETE CASCADE,
  vendor_id           UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  requested_quantity  INTEGER NOT NULL CHECK (requested_quantity > 0),
  confirmed_quantity  INTEGER CHECK (confirmed_quantity >= 0),
  joined_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, vendor_id)
);

-- supplier_offers
CREATE TABLE IF NOT EXISTS supplier_offers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id              UUID NOT NULL REFERENCES buy_groups (id) ON DELETE CASCADE,
  supplier_reference    TEXT NOT NULL,
  unit_cost_paise       INTEGER NOT NULL CHECK (unit_cost_paise >= 0),
  transport_cost_paise  INTEGER NOT NULL DEFAULT 0 CHECK (transport_cost_paise >= 0),
  minimum_quantity      INTEGER NOT NULL CHECK (minimum_quantity > 0),
  valid_until           TIMESTAMPTZ NOT NULL,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- buy_contributions
CREATE TABLE IF NOT EXISTS buy_contributions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id            UUID NOT NULL REFERENCES buy_groups (id) ON DELETE CASCADE,
  member_id           UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  offer_id            UUID NOT NULL REFERENCES supplier_offers (id) ON DELETE CASCADE,
  amount_paise        INTEGER NOT NULL CHECK (amount_paise >= 0),
  payment_status      TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'recorded')),
  purchase_reference  TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- support_resources (vendor rights & support articles)
CREATE TABLE IF NOT EXISTS support_resources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  title_ml        TEXT,
  description     TEXT NOT NULL,
  description_ml  TEXT,
  official_url    TEXT NOT NULL,
  jurisdiction    TEXT NOT NULL,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  reviewer        TEXT NOT NULL,
  verified_at     DATE NOT NULL,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id  UUID NOT NULL REFERENCES vendor_profiles (id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audit_events (immutable log for all data changes)
CREATE TABLE IF NOT EXISTS audit_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID REFERENCES vendor_profiles (id) ON DELETE SET NULL,
  table_name  TEXT NOT NULL,
  row_id      UUID NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data    JSONB,
  new_data    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_shops_owner_id      ON shops (owner_id);
CREATE INDEX IF NOT EXISTS idx_shops_status        ON shops (status);
CREATE INDEX IF NOT EXISTS idx_shops_service_area  ON shops (service_area);

CREATE INDEX IF NOT EXISTS idx_products_shop_id      ON products (shop_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products (is_available);

CREATE INDEX IF NOT EXISTS idx_product_costs_product_id ON product_costs (product_id);
CREATE INDEX IF NOT EXISTS idx_product_costs_owner_id   ON product_costs (owner_id);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_owner_id   ON inventory (owner_id);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_owner_id   ON ledger_entries (owner_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_entry_date ON ledger_entries (entry_date);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_entry_type ON ledger_entries (entry_type);

CREATE INDEX IF NOT EXISTS idx_credit_customers_owner_id ON credit_customers (owner_id);
CREATE INDEX IF NOT EXISTS idx_credit_events_customer_id ON credit_events (customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_events_owner_id    ON credit_events (owner_id);

CREATE INDEX IF NOT EXISTS idx_surplus_listings_shop_id    ON surplus_listings (shop_id);
CREATE INDEX IF NOT EXISTS idx_surplus_listings_owner_id   ON surplus_listings (owner_id);
CREATE INDEX IF NOT EXISTS idx_surplus_listings_status     ON surplus_listings (status);
CREATE INDEX IF NOT EXISTS idx_surplus_listings_deadline   ON surplus_listings (collection_deadline);

CREATE INDEX IF NOT EXISTS idx_reservations_listing_id ON reservations (listing_id);

CREATE INDEX IF NOT EXISTS idx_enquiries_shop_id ON enquiries (shop_id);

CREATE INDEX IF NOT EXISTS idx_buy_groups_organizer_id ON buy_groups (organizer_id);
CREATE INDEX IF NOT EXISTS idx_buy_groups_status       ON buy_groups (status);
CREATE INDEX IF NOT EXISTS idx_buy_groups_area         ON buy_groups (area);

CREATE INDEX IF NOT EXISTS idx_buy_group_members_group_id  ON buy_group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_buy_group_members_vendor_id ON buy_group_members (vendor_id);

CREATE INDEX IF NOT EXISTS idx_supplier_offers_group_id   ON supplier_offers (group_id);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_valid_until ON supplier_offers (valid_until);

CREATE INDEX IF NOT EXISTS idx_buy_contributions_group_id  ON buy_contributions (group_id);
CREATE INDEX IF NOT EXISTS idx_buy_contributions_member_id ON buy_contributions (member_id);

CREATE INDEX IF NOT EXISTS idx_support_resources_is_published ON support_resources (is_published);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read      ON notifications (is_read);

CREATE INDEX IF NOT EXISTS idx_audit_events_actor_id   ON audit_events (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_table_name ON audit_events (table_name, row_id);

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE vendor_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops              ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_costs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE surplus_listings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_offers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_contributions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_resources  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events       ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ────────────────────────────────────────────────────────────

-- vendor_profiles: owner only
CREATE POLICY "vendor_profiles_owner_select" ON vendor_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "vendor_profiles_owner_insert" ON vendor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "vendor_profiles_owner_update" ON vendor_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- vendor_settings: owner only
CREATE POLICY "vendor_settings_owner_all" ON vendor_settings
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- shops: anon can SELECT published; owner has full access
CREATE POLICY "shops_anon_select_published" ON shops
  FOR SELECT USING (status = 'published');
CREATE POLICY "shops_owner_all" ON shops
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- products: anon can SELECT products of published shops; owner has full access
CREATE POLICY "products_anon_select_published" ON products
  FOR SELECT USING (
    is_available = TRUE AND EXISTS (
      SELECT 1 FROM shops s WHERE s.id = products.shop_id AND s.status = 'published'
    )
  );
CREATE POLICY "products_owner_all" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM shops s WHERE s.id = products.shop_id AND s.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM shops s WHERE s.id = products.shop_id AND s.owner_id = auth.uid())
  );

-- product_costs: owner only
CREATE POLICY "product_costs_owner_all" ON product_costs
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- inventory: owner only
CREATE POLICY "inventory_owner_all" ON inventory
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- ledger_entries: owner can INSERT and SELECT; UPDATE is disallowed (immutable)
CREATE POLICY "ledger_entries_owner_select" ON ledger_entries
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "ledger_entries_owner_insert" ON ledger_entries
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- credit_customers: owner only
CREATE POLICY "credit_customers_owner_all" ON credit_customers
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- credit_events: owner only
CREATE POLICY "credit_events_owner_all" ON credit_events
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- surplus_listings: anon can SELECT active listings; owner has full access
CREATE POLICY "surplus_listings_anon_select_active" ON surplus_listings
  FOR SELECT USING (
    status = 'active' AND collection_deadline > now() AND EXISTS (
      SELECT 1 FROM shops s WHERE s.id = surplus_listings.shop_id AND s.status = 'published'
    )
  );
CREATE POLICY "surplus_listings_owner_all" ON surplus_listings
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- reservations: owner can manage; guest access via secure_token is handled by API routes
CREATE POLICY "reservations_owner_all" ON reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM surplus_listings sl WHERE sl.id = reservations.listing_id AND sl.owner_id = auth.uid()
    )
  );

-- enquiries: protected API endpoint handles inserts; owner can read
CREATE POLICY "enquiries_owner_select" ON enquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM shops s WHERE s.id = enquiries.shop_id AND s.owner_id = auth.uid())
  );
CREATE POLICY "enquiries_owner_update" ON enquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM shops s WHERE s.id = enquiries.shop_id AND s.owner_id = auth.uid())
  );

-- buy_groups: authenticated vendors can SELECT open groups; organizer has full access
CREATE POLICY "buy_groups_auth_select" ON buy_groups
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "buy_groups_organizer_all" ON buy_groups
  FOR ALL USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);

-- buy_group_members: member can see own rows; organizer can see all rows in their group
CREATE POLICY "buy_group_members_member_select" ON buy_group_members
  FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "buy_group_members_organizer_select" ON buy_group_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM buy_groups bg WHERE bg.id = buy_group_members.group_id AND bg.organizer_id = auth.uid())
  );
CREATE POLICY "buy_group_members_member_insert" ON buy_group_members
  FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "buy_group_members_organizer_update" ON buy_group_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM buy_groups bg WHERE bg.id = buy_group_members.group_id AND bg.organizer_id = auth.uid())
  );

-- supplier_offers: authenticated vendors in the group can SELECT; organizer manages
CREATE POLICY "supplier_offers_auth_select" ON supplier_offers
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "supplier_offers_organizer_all" ON supplier_offers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM buy_groups bg WHERE bg.id = supplier_offers.group_id AND bg.organizer_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM buy_groups bg WHERE bg.id = supplier_offers.group_id AND bg.organizer_id = auth.uid())
  );

-- buy_contributions: member manages own rows
CREATE POLICY "buy_contributions_member_all" ON buy_contributions
  FOR ALL USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);

-- support_resources: authenticated vendors can read published entries
CREATE POLICY "support_resources_auth_select_published" ON support_resources
  FOR SELECT USING (is_published = TRUE AND auth.role() = 'authenticated');

-- notifications: recipient only
CREATE POLICY "notifications_recipient_select" ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "notifications_recipient_update" ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- audit_events: owner can view their own audit rows; no insert/update from client
CREATE POLICY "audit_events_owner_select" ON audit_events
  FOR SELECT USING (auth.uid() = actor_id);
