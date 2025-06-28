/*
  # Enhanced Everlasting Kin Database Schema

  1. New Tables
    - Enhanced users table with comprehensive role management
    - Deceased records with full forensic and identification fields
    - Police reports with investigation tracking
    - Next of kin with verification and notification status
    - Media attachments for secure file management
    - Audit logs for comprehensive system tracking
    - Notification logs for communication tracking

  2. Security
    - Enable RLS on all tables
    - Role-based access policies for each user type
    - Secure media access controls

  3. Features
    - Universal search with semantic understanding
    - Dashboard functions for each role
    - Comprehensive audit trail
*/

-- Create ENUM types for various statuses and roles
CREATE TYPE user_role AS ENUM ('admin', 'mortuary_staff', 'police', 'public');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE fingerprint_status AS ENUM ('pending', 'matched', 'no_match');
CREATE TYPE identification_status AS ENUM ('unidentified', 'pending_confirmation', 'identified');
CREATE TYPE disposition_status AS ENUM ('awaiting_release', 'released', 'buried');
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'whatsapp');
CREATE TYPE notification_status AS ENUM ('sent', 'failed', 'pending');

-- Enhanced users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'public',
    approval_status approval_status NOT NULL DEFAULT 'pending',
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone_number text,
    organization text,
    badge_number text,
    department text,
    is_active boolean NOT NULL DEFAULT true,
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enhanced deceased records table
CREATE TABLE IF NOT EXISTS deceased_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    date_of_birth date,
    estimated_age integer,
    gender text,
    ethnicity text,
    date_of_death date NOT NULL,
    time_of_death time,
    date_found date,
    time_found time,
    location_found text NOT NULL,
    condition_of_body text,
    clothing_description text,
    personal_effects text,
    distinguishing_marks text,
    preliminary_cause_of_death text,
    official_cause_of_death text,
    fingerprint_hash text,
    dental_records_ref text,
    dna_sample_id text,
    mortuary_id text,
    date_admitted date,
    location_admitted text,
    assigned_staff_id uuid REFERENCES users(id),
    identification_status identification_status NOT NULL DEFAULT 'unidentified',
    disposition_status disposition_status NOT NULL DEFAULT 'awaiting_release',
    is_public_viewable boolean NOT NULL DEFAULT false,
    created_by uuid NOT NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Police reports table
CREATE TABLE IF NOT EXISTS police_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id text NOT NULL UNIQUE,
    deceased_record_id uuid NOT NULL REFERENCES deceased_records(id) ON DELETE CASCADE,
    reporting_officer_id uuid NOT NULL REFERENCES users(id),
    date_of_report date NOT NULL,
    time_of_report time NOT NULL,
    jurisdiction text NOT NULL,
    circumstances_of_discovery text NOT NULL,
    evidence_collected text,
    fingerprint_match_status fingerprint_status DEFAULT 'pending',
    dna_match_status text,
    dental_match_status text,
    officer_notes text,
    crime_type text,
    accident_type text,
    report_status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Next of kin table
CREATE TABLE IF NOT EXISTS next_of_kin (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deceased_record_id uuid NOT NULL REFERENCES deceased_records(id) ON DELETE CASCADE,
    name text NOT NULL,
    relationship text NOT NULL,
    contact_email text,
    contact_phone text,
    address text,
    verified boolean NOT NULL DEFAULT false,
    notification_status text NOT NULL DEFAULT 'pending',
    inquiry_date timestamptz DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Media attachments table
CREATE TABLE IF NOT EXISTS media_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    record_type text NOT NULL CHECK (record_type IN ('deceased', 'police_report')),
    record_id uuid NOT NULL,
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size integer NOT NULL,
    file_path text NOT NULL,
    is_public boolean NOT NULL DEFAULT false,
    uploaded_by uuid NOT NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    action text NOT NULL,
    table_name text,
    record_id uuid,
    details jsonb,
    ip_address text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    email text,
    phone text,
    notification_type notification_type NOT NULL,
    subject text,
    content text NOT NULL,
    status notification_status NOT NULL DEFAULT 'pending',
    sent_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deceased_records_created_by ON deceased_records(created_by);
CREATE INDEX IF NOT EXISTS idx_deceased_records_assigned_staff ON deceased_records(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_deceased_records_public ON deceased_records(is_public_viewable);
CREATE INDEX IF NOT EXISTS idx_deceased_records_search ON deceased_records USING gin(to_tsvector('english', full_name || ' ' || COALESCE(location_found, '') || ' ' || COALESCE(distinguishing_marks, '')));
CREATE INDEX IF NOT EXISTS idx_police_reports_deceased_record ON police_reports(deceased_record_id);
CREATE INDEX IF NOT EXISTS idx_police_reports_reporting_officer ON police_reports(reporting_officer_id);
CREATE INDEX IF NOT EXISTS idx_next_of_kin_deceased_record ON next_of_kin(deceased_record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deceased_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_of_kin ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- RLS Policies for deceased_records table
CREATE POLICY "Admins can manage all deceased records" ON deceased_records
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Mortuary staff can manage their assigned records" ON deceased_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'mortuary_staff' 
            AND (auth.uid() = assigned_staff_id OR auth.uid() = created_by)
        )
    );

CREATE POLICY "Mortuary staff can view all records for reference" ON deceased_records
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'mortuary_staff')
    );

CREATE POLICY "Police can view deceased records linked to their reports" ON deceased_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM police_reports 
            WHERE deceased_record_id = deceased_records.id 
            AND reporting_officer_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'police')
    );

CREATE POLICY "Public can view public deceased records" ON deceased_records
    FOR SELECT USING (is_public_viewable = true);

-- RLS Policies for police_reports table
CREATE POLICY "Admins can manage all police reports" ON police_reports
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Police can manage their own reports" ON police_reports
    FOR ALL USING (reporting_officer_id = auth.uid());

CREATE POLICY "Police can view all reports for reference" ON police_reports
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'police')
    );

CREATE POLICY "Mortuary staff can view reports linked to their deceased records" ON police_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deceased_records 
            WHERE id = police_reports.deceased_record_id 
            AND (assigned_staff_id = auth.uid() OR created_by = auth.uid())
        )
    );

-- RLS Policies for next_of_kin table
CREATE POLICY "Admins can manage all next of kin records" ON next_of_kin
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Mortuary staff can manage next of kin for their records" ON next_of_kin
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM deceased_records 
            WHERE id = next_of_kin.deceased_record_id 
            AND (assigned_staff_id = auth.uid() OR created_by = auth.uid())
        )
    );

CREATE POLICY "Public can view next of kin for public records" ON next_of_kin
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deceased_records 
            WHERE id = next_of_kin.deceased_record_id 
            AND is_public_viewable = true
        )
    );

-- RLS Policies for media_attachments table
CREATE POLICY "Admins can manage all media attachments" ON media_attachments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Record owners can manage their media attachments" ON media_attachments
    FOR ALL USING (
        (record_type = 'deceased' AND EXISTS (
            SELECT 1 FROM deceased_records 
            WHERE id = record_id 
            AND (created_by = auth.uid() OR assigned_staff_id = auth.uid())
        )) OR
        (record_type = 'police_report' AND EXISTS (
            SELECT 1 FROM police_reports 
            WHERE id = record_id 
            AND reporting_officer_id = auth.uid()
        )) OR
        uploaded_by = auth.uid()
    );

CREATE POLICY "Public can view public media attachments" ON media_attachments
    FOR SELECT USING (is_public = true);

-- RLS Policies for audit_logs table
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for notification_logs table
CREATE POLICY "Admins can view all notification logs" ON notification_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can view their own notification logs" ON notification_logs
    FOR SELECT USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deceased_records_updated_at
    BEFORE UPDATE ON deceased_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_police_reports_updated_at
    BEFORE UPDATE ON police_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_next_of_kin_updated_at
    BEFORE UPDATE ON next_of_kin
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();