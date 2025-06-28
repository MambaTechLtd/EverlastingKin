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
  department?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeceasedRecord {
  id: string;
  full_name: string;
  date_of_birth?: string | null;
  estimated_age?: number | null;
  gender?: string | null;
  ethnicity?: string | null;
  date_of_death: string;
  time_of_death?: string | null;
  date_found?: string | null;
  time_found?: string | null;
  location_found: string;
  condition_of_body?: string | null;
  clothing_description?: string | null;
  personal_effects?: string | null;
  distinguishing_marks?: string | null;
  preliminary_cause_of_death?: string | null;
  official_cause_of_death?: string | null;
  fingerprint_hash?: string | null;
  dental_records_ref?: string | null;
  dna_sample_id?: string | null;
  mortuary_id?: string | null;
  date_admitted?: string | null;
  location_admitted?: string | null;
  assigned_staff_id?: string | null;
  identification_status: 'unidentified' | 'pending_confirmation' | 'identified';
  disposition_status: 'awaiting_release' | 'released' | 'buried';
  is_public_viewable: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PoliceReport {
  id: string;
  case_id: string;
  deceased_record_id: string;
  reporting_officer_id: string;
  date_of_report: string;
  time_of_report: string;
  jurisdiction: string;
  circumstances_of_discovery: string;
  evidence_collected?: string | null;
  fingerprint_match_status?: 'pending' | 'matched' | 'no_match';
  dna_match_status?: string | null;
  dental_match_status?: string | null;
  officer_notes?: string | null;
  crime_type?: string | null;
  accident_type?: string | null;
  report_status: string;
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
  notification_status: string;
  inquiry_date?: string | null;
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

export interface SearchResult {
  record_type: string;
  record_id: string;
  display_name: string;
  display_details: string;
  relevance_score: number;
  is_public: boolean;
  created_at: string;
}

export interface DashboardStats {
  user_counts?: {
    total: number;
    pending_approval: number;
    admins: number;
    mortuary_staff: number;
    police: number;
    public_users: number;
  };
  deceased_records?: {
    total: number;
    unidentified: number;
    pending_confirmation: number;
    identified: number;
    public: number;
  };
  police_reports?: {
    total: number;
    draft: number;
    submitted: number;
    closed: number;
  };
  recent_activity?: Array<{
    timestamp: string;
    action: string;
    user_id?: string;
    details?: unknown;
  }>;
  pending_users?: Array<AppUser>;
  assigned_cases?: Array<DeceasedRecord>;
  case_stats?: {
    total_assigned: number;
    unidentified: number;
    pending: number;
    identified: number;
    awaiting_release: number;
  };
  my_reports?: Array<PoliceReport & { deceased_name: string }>;
  report_stats?: {
    total: number;
    draft: number;
    submitted: number;
    closed: number;
    fingerprint_matches: number;
  };
  my_inquiries?: Array<NextOfKin & { deceased_name: string; date_of_death: string; location_found: string }>;
  inquiry_stats?: {
    total_inquiries: number;
    verified_matches: number;
    pending_verification: number;
  };
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
 * Universal search function
 */
export const universalSearch = async (searchTerm: string): Promise<SearchResult[]> => {
  const { data, error } = await supabase.rpc('universal_search', {
    search_term: searchTerm
  });

  if (error) {
    console.error('[Supabase] Search error:', error.message);
    return [];
  }

  return data || [];
};

/**
 * Get dashboard stats based on user role
 */
export const getDashboardStats = async (role: string): Promise<DashboardStats> => {
  let functionName = '';
  
  switch (role) {
    case 'admin':
      functionName = 'admin_dashboard_stats';
      break;
    case 'mortuary_staff':
      functionName = 'mortuary_staff_dashboard';
      break;
    case 'police':
      functionName = 'police_dashboard';
      break;
    case 'public':
      functionName = 'public_user_dashboard';
      break;
    default:
      return {};
  }

  const { data, error } = await supabase.rpc(functionName);

  if (error) {
    console.error(`[Supabase] Dashboard error for ${role}:`, error.message);
    return {};
  }

  return data || {};
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

/**
 * Create a new deceased record
 */
export const createDeceasedRecord = async (record: Partial<DeceasedRecord>): Promise<{ data: DeceasedRecord | null; error: any }> => {
  const { data, error } = await supabase
    .from('deceased_records')
    .insert(record)
    .select()
    .single();

  if (!error) {
    await logAuditAction('Created deceased record', {
      table_name: 'deceased_records',
      record_id: data?.id,
      details: { name: record.full_name }
    });
  }

  return { data, error };
};

/**
 * Update a deceased record
 */
export const updateDeceasedRecord = async (id: string, updates: Partial<DeceasedRecord>): Promise<{ data: DeceasedRecord | null; error: any }> => {
  const { data, error } = await supabase
    .from('deceased_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (!error) {
    await logAuditAction('Updated deceased record', {
      table_name: 'deceased_records',
      record_id: id,
      details: updates
    });
  }

  return { data, error };
};

/**
 * Create a new police report
 */
export const createPoliceReport = async (report: Partial<PoliceReport>): Promise<{ data: PoliceReport | null; error: any }> => {
  const { data, error } = await supabase
    .from('police_reports')
    .insert(report)
    .select()
    .single();

  if (!error) {
    await logAuditAction('Created police report', {
      table_name: 'police_reports',
      record_id: data?.id,
      details: { case_id: report.case_id }
    });
  }

  return { data, error };
};

/**
 * Update user approval status (admin only)
 */
export const updateUserApproval = async (userId: string, status: 'approved' | 'rejected'): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('users')
    .update({ 
      approval_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (!error) {
    await logAuditAction(`User ${status}`, {
      table_name: 'users',
      record_id: userId,
      details: { approval_status: status }
    });
  }

  return { error };
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
  | 'audit_logs'
  | 'notification_logs'
  | 'media_attachments';