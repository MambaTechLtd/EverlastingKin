import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types - defined without export first
type User = {
  id: string
  email: string
  role: 'public' | 'mortuary_staff' | 'police' | 'admin'
  approval_status: 'pending' | 'approved' | 'rejected'
  first_name: string
  last_name: string
  phone_number?: string
  organization?: string
  badge_number?: string
  created_at: string
  updated_at: string
}

type DeceasedRecord = {
  id: string
  name: string
  date_of_death: string
  location: string
  description?: string
  fingerprint_hash?: string
  photo_url?: string
  created_by: string
  created_at: string
  updated_at: string
}

type PoliceReport = {
  id: string
  deceased_record_id: string
  report_number: string
  officer_notes?: string
  fingerprint_match_status?: 'pending' | 'matched' | 'no_match'
  created_by: string
  created_at: string
  updated_at: string
}

type NextOfKin = {
  id: string
  deceased_record_id: string
  name: string
  relationship: string
  contact_email?: string
  contact_phone?: string
  address?: string
  verified: boolean
  created_at: string
  updated_at: string
}

type AuditLog = {
  id: string
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  details?: any
  ip_address?: string
  created_at: string
}

type NotificationLog = {
  id: string
  user_id?: string
  email?: string
  phone?: string
  notification_type: 'email' | 'sms' | 'whatsapp'
  subject?: string
  content: string
  status: 'sent' | 'failed' | 'pending'
  sent_at?: string
  created_at: string
}

type AdminRequest = {
  id: string
  user_id: string
  request_type: 'role_change' | 'access_request' | 'data_correction'
  current_role: string
  requested_role?: string
  justification: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
}

// Explicit type-only exports
export type {
  User,
  DeceasedRecord,
  PoliceReport,
  NextOfKin,
  AuditLog,
  NotificationLog,
  AdminRequest
}

// Helper functions for common database operations
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

export const logAuditAction = async (
  action: string,
  tableName?: string,
  recordId?: string,
  details?: any
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user?.id,
        action,
        table_name: tableName,
        record_id: recordId,
        details,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging audit action:', error)
    }
  } catch (error) {
    console.error('Error in logAuditAction:', error)
  }
}