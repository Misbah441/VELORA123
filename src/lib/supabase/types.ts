// Database types for the Small Vendor Support Platform
// These types mirror the database schema defined in PLAN.md

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ────────────────────────────────────────────────────────────────────

export type ShopCategory =
  | 'produce'
  | 'food_stall'
  | 'grocery'
  | 'clothing'
  | 'household_goods'
  | 'other';

export type ShopStatus = 'draft' | 'published' | 'paused';

export type StallType = 'fixed' | 'mobile';

export type LedgerEntryType =
  | 'sale'
  | 'purchase'
  | 'expense'
  | 'withdrawal'
  | 'credit_given'
  | 'credit_repaid';

export type PaymentMethod = 'cash' | 'upi' | 'other';

export type SurplusListingStatus = 'active' | 'expired' | 'closed';

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'collected'
  | 'cancelled'
  | 'expired';

export type PurchaseGroupStatus =
  | 'draft'
  | 'open'
  | 'collecting_offers'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

// ─── Database Tables ─────────────────────────────────────────────────────────

export interface VendorProfile {
  id: string; // references auth.users
  display_name: string;
  preferred_language: 'en' | 'ml';
  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: string;
  owner_id: string; // references vendor_profiles.id
  name: string;
  slug: string;
  category: ShopCategory;
  description: string | null;
  stall_type: StallType;
  service_area: string | null;
  public_location: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_updated_at: string | null;
  opening_hours: Json | null; // { mon: {open: string, close: string}, ... }
  public_contact_preference: 'email' | 'phone' | 'none';
  public_contact_value: string | null;
  status: ShopStatus;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string; // references shops.id
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  selling_price_paise: number; // stored in paise (smallest currency unit)
  currency: string; // 'INR'
  unit: string; // 'kg', 'piece', 'portion', etc.
  quantity_available: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrivateInventory {
  id: string;
  product_id: string; // references products.id
  owner_id: string; // references vendor_profiles.id
  cost_price_paise: number | null;
  opening_stock: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  owner_id: string; // references vendor_profiles.id
  amount_paise: number; // always positive
  entry_type: LedgerEntryType;
  payment_method: PaymentMethod;
  description: string | null;
  entry_date: string; // YYYY-MM-DD
  idempotency_key: string; // prevent duplicate posting
  correction_of: string | null; // references ledger_entries.id
  created_at: string;
}

export interface CustomerCredit {
  id: string;
  owner_id: string; // references vendor_profiles.id
  customer_reference: string; // private label (never publicly visible)
  outstanding_paise: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SurplusListing {
  id: string;
  product_id: string; // references products.id
  shop_id: string; // references shops.id
  owner_id: string; // references vendor_profiles.id
  image_url: string | null;
  eligible_quantity: number;
  reserved_quantity: number;
  normal_price_paise: number;
  discounted_price_paise: number;
  collection_deadline: string; // ISO timestamp
  pickup_instructions: string | null;
  status: SurplusListingStatus;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  listing_id: string; // references surplus_listings.id
  quantity: number;
  customer_contact: string; // private; phone or email
  status: ReservationStatus;
  secure_token: string; // used for token-based access
  expiry: string; // ISO timestamp
  created_at: string;
  updated_at: string;
}

export interface PurchaseGroup {
  id: string;
  organizer_id: string; // references vendor_profiles.id
  item_name: string;
  grade: string | null;
  unit: string;
  total_quantity: number;
  area: string;
  status: PurchaseGroupStatus;
  created_at: string;
  updated_at: string;
}

export interface PurchaseGroupMember {
  id: string;
  group_id: string; // references purchase_groups.id
  vendor_id: string; // references vendor_profiles.id
  requested_quantity: number;
  confirmed_quantity: number | null;
  joined_at: string;
}

export interface SupplierOffer {
  id: string;
  group_id: string; // references purchase_groups.id
  supplier_reference: string;
  unit_cost_paise: number;
  transport_cost_paise: number;
  minimum_quantity: number;
  valid_until: string; // ISO timestamp
  notes: string | null;
  created_at: string;
}

export interface MemberContribution {
  id: string;
  group_id: string; // references purchase_groups.id
  member_id: string; // references vendor_profiles.id
  offer_id: string; // references supplier_offers.id
  amount_paise: number;
  payment_status: 'pending' | 'recorded';
  purchase_reference: string | null;
  created_at: string;
}

export interface SupportResource {
  id: string;
  title: string;
  title_ml: string | null;
  description: string;
  description_ml: string | null;
  official_url: string;
  jurisdiction: string;
  tags: string[];
  reviewer: string;
  verified_at: string; // YYYY-MM-DD
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string; // references vendor_profiles.id
  event_type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

// ─── Database interface (for Supabase client typing) ─────────────────────────

export interface Database {
  public: {
    Tables: {
      vendor_profiles: {
        Row: VendorProfile;
        Insert: Omit<VendorProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VendorProfile, 'id' | 'created_at'>>;
      };
      shops: {
        Row: Shop;
        Insert: Omit<Shop, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Shop, 'id' | 'owner_id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'shop_id' | 'created_at'>>;
      };
      private_inventory: {
        Row: PrivateInventory;
        Insert: Omit<PrivateInventory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PrivateInventory, 'id' | 'product_id' | 'owner_id' | 'created_at'>>;
      };
      ledger_entries: {
        Row: LedgerEntry;
        Insert: Omit<LedgerEntry, 'id' | 'created_at'>;
        Update: never; // immutable; use correction_of linkage
      };
      customer_credits: {
        Row: CustomerCredit;
        Insert: Omit<CustomerCredit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CustomerCredit, 'id' | 'owner_id' | 'created_at'>>;
      };
      surplus_listings: {
        Row: SurplusListing;
        Insert: Omit<SurplusListing, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SurplusListing, 'id' | 'owner_id' | 'created_at'>>;
      };
      reservations: {
        Row: Reservation;
        Insert: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Reservation, 'id' | 'listing_id' | 'created_at'>>;
      };
      purchase_groups: {
        Row: PurchaseGroup;
        Insert: Omit<PurchaseGroup, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PurchaseGroup, 'id' | 'organizer_id' | 'created_at'>>;
      };
      purchase_group_members: {
        Row: PurchaseGroupMember;
        Insert: Omit<PurchaseGroupMember, 'id' | 'joined_at'>;
        Update: Partial<Omit<PurchaseGroupMember, 'id' | 'group_id' | 'vendor_id' | 'joined_at'>>;
      };
      supplier_offers: {
        Row: SupplierOffer;
        Insert: Omit<SupplierOffer, 'id' | 'created_at'>;
        Update: Partial<Omit<SupplierOffer, 'id' | 'group_id' | 'created_at'>>;
      };
      member_contributions: {
        Row: MemberContribution;
        Insert: Omit<MemberContribution, 'id' | 'created_at'>;
        Update: Partial<Omit<MemberContribution, 'id' | 'group_id' | 'member_id' | 'created_at'>>;
      };
      support_resources: {
        Row: SupportResource;
        Insert: Omit<SupportResource, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SupportResource, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Pick<Notification, 'is_read'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      shop_category: ShopCategory;
      shop_status: ShopStatus;
      stall_type: StallType;
      ledger_entry_type: LedgerEntryType;
      payment_method: PaymentMethod;
      surplus_listing_status: SurplusListingStatus;
      reservation_status: ReservationStatus;
      purchase_group_status: PurchaseGroupStatus;
    };
  };
}
