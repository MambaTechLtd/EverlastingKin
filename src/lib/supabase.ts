// src/lib/supabase.ts
import { createClient, type User as AuthUser } from '@supabase/supabase-js';

// Environment configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

// =====================
// Database Types
// =====================

export interface AppUser {
  id: string;
  email: string;
  role: 'public' | 'mortuary_staff' | 'police' | 'admin';
  approval_status: 'pending' | 'approved' | 'rejected';
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  organization?: string | null;
  badge_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeceasedRecord {
  id: string;
  name: string;
  date_of_death: string;
  location: string;
  description?: string | null;
  fingerprint_hash?: string | null;
  photo_url?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PoliceReport {
  id: string;
  deceased_record_id: string;
  report_number: string;
  officer_notes?: string | null;
  fingerprint_match_status?: 'pending' | 'matched' | 'no_match';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NextOfKin {
  id: string;
  deceased_record_id: string;
  name: string;
  relationship: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  action: string;
  table_name?: string | null;
  record_id?: string | null;
  details?: unknown;
  ip_address?: string | null;
  created_at: string;
}

// =====================
// Helper Functions
// =====================

/**
 * Fetches a user profile from the database
 */
export const getUserProfile = async (userId: string): Promise<AppUser | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[Supabase] Error fetching user:', error.message);
    return null;
  }

  return data;
};

/**
 * Logs an audit action to the database
 */
export const logAuditAction = async (
  action: string,
  metadata?: {
    table_name?: string;
    record_id?: string;
    details?: unknown;
  }
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('audit_logs').insert({
    user_id: user?.id,
    action,
    table_name: metadata?.table_name,
    record_id: metadata?.record_id,
    details: metadata?.details,
    ip_address: '', // Add IP collection logic if needed
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[Supabase] Audit log failed:', error.message);
  }
};

/**
 * Gets the current authenticated user with profile
 */
export const getCurrentUser = async (): Promise<
  { auth: AuthUser; profile: AppUser } | null
> => {
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const profile = await getUserProfile(authUser.id);
  if (!profile) return null;

  return { auth: authUser, profile };
};

// =====================
// Type Helpers
// =====================

/**
 * Type for Supabase query responses with error handling
 */
export type QueryResult<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * Utility type for table names
 */
export type DatabaseTable =
  | 'users'
  | 'deceased_records'
  | 'police_reports'
  | 'next_of_kin'
  | 'audit_logs';