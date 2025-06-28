/*
  # Universal Search and Dashboard Functions

  1. Universal Search Function
    - Semantic search across deceased records and police reports
    - Role-based result filtering
    - Relevance scoring

  2. Dashboard Functions
    - Admin dashboard with comprehensive stats
    - Mortuary staff dashboard with assigned cases
    - Police dashboard with reports and cases
    - Public dashboard with inquiries
*/

-- Universal search function with semantic understanding
CREATE OR REPLACE FUNCTION universal_search(search_term TEXT, user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
    record_type TEXT,
    record_id UUID,
    display_name TEXT,
    display_details TEXT,
    relevance_score FLOAT,
    is_public BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
DECLARE
    user_role_val user_role;
BEGIN
    -- Get user role
    SELECT role INTO user_role_val FROM users WHERE id = user_id;
    
    RETURN QUERY
    -- Search deceased records
    SELECT 
        'deceased'::TEXT as record_type,
        dr.id as record_id,
        dr.full_name as display_name,
        CONCAT(
            'Found: ', COALESCE(dr.date_of_death::TEXT, 'unknown date'), 
            ' in ', COALESCE(dr.location_found, 'unknown location'),
            CASE WHEN dr.distinguishing_marks IS NOT NULL THEN 
                CONCAT('. Marks: ', LEFT(dr.distinguishing_marks, 50), 
                CASE WHEN LENGTH(dr.distinguishing_marks) > 50 THEN '...' ELSE '' END) 
            ELSE '' END,
            CASE WHEN dr.clothing_description IS NOT NULL THEN 
                CONCAT('. Clothing: ', LEFT(dr.clothing_description, 30),
                CASE WHEN LENGTH(dr.clothing_description) > 30 THEN '...' ELSE '' END) 
            ELSE '' END
        ) as display_details,
        -- Calculate relevance score
        CASE 
            WHEN dr.full_name ILIKE '%' || search_term || '%' THEN 1.0
            WHEN dr.location_found ILIKE '%' || search_term || '%' THEN 0.8
            WHEN dr.distinguishing_marks ILIKE '%' || search_term || '%' THEN 0.7
            WHEN dr.clothing_description ILIKE '%' || search_term || '%' THEN 0.6
            WHEN dr.personal_effects ILIKE '%' || search_term || '%' THEN 0.5
            ELSE ts_rank(to_tsvector('english', 
                COALESCE(dr.full_name, '') || ' ' ||
                COALESCE(dr.location_found, '') || ' ' ||
                COALESCE(dr.distinguishing_marks, '') || ' ' ||
                COALESCE(dr.clothing_description, '') || ' ' ||
                COALESCE(dr.personal_effects, '')
            ), plainto_tsquery('english', search_term))
        END as relevance_score,
        dr.is_public_viewable as is_public,
        dr.created_at
    FROM deceased_records dr
    WHERE (
        -- Access control based on user role
        (user_role_val = 'admin') OR
        (dr.is_public_viewable = TRUE) OR
        (user_role_val = 'mortuary_staff' AND (user_id = dr.assigned_staff_id OR user_id = dr.created_by)) OR
        (user_role_val = 'police' AND EXISTS (
            SELECT 1 FROM police_reports 
            WHERE deceased_record_id = dr.id AND reporting_officer_id = user_id
        )) OR
        (user_role_val = 'mortuary_staff') OR
        (user_role_val = 'police')
    )
    AND (
        -- Search conditions
        dr.full_name ILIKE '%' || search_term || '%' OR
        dr.location_found ILIKE '%' || search_term || '%' OR
        dr.distinguishing_marks ILIKE '%' || search_term || '%' OR
        dr.clothing_description ILIKE '%' || search_term || '%' OR
        dr.personal_effects ILIKE '%' || search_term || '%' OR
        dr.gender ILIKE '%' || search_term || '%' OR
        dr.ethnicity ILIKE '%' || search_term || '%' OR
        to_tsvector('english', 
            COALESCE(dr.full_name, '') || ' ' ||
            COALESCE(dr.location_found, '') || ' ' ||
            COALESCE(dr.distinguishing_marks, '') || ' ' ||
            COALESCE(dr.clothing_description, '') || ' ' ||
            COALESCE(dr.personal_effects, '') || ' ' ||
            COALESCE(dr.gender, '') || ' ' ||
            COALESCE(dr.ethnicity, '')
        ) @@ plainto_tsquery('english', search_term)
    )
    
    UNION ALL
    
    -- Search police reports (only for authorized users)
    SELECT 
        'police_report'::TEXT as record_type,
        pr.id as record_id,
        CONCAT('Police Report #', pr.case_id) as display_name,
        CONCAT(
            'For: ', COALESCE(dr.full_name, 'unknown'), 
            '. Circumstances: ', LEFT(COALESCE(pr.circumstances_of_discovery, ''), 50),
            CASE WHEN LENGTH(COALESCE(pr.circumstances_of_discovery, '')) > 50 THEN '...' ELSE '' END
        ) as display_details,
        CASE 
            WHEN pr.circumstances_of_discovery ILIKE '%' || search_term || '%' THEN 0.9
            WHEN pr.officer_notes ILIKE '%' || search_term || '%' THEN 0.7
            WHEN pr.evidence_collected ILIKE '%' || search_term || '%' THEN 0.6
            ELSE ts_rank(to_tsvector('english', 
                COALESCE(pr.circumstances_of_discovery, '') || ' ' ||
                COALESCE(pr.officer_notes, '') || ' ' ||
                COALESCE(pr.evidence_collected, '')
            ), plainto_tsquery('english', search_term))
        END as relevance_score,
        FALSE as is_public,
        pr.created_at
    FROM police_reports pr
    JOIN deceased_records dr ON pr.deceased_record_id = dr.id
    WHERE (
        -- Only authorized users can see police reports
        (user_role_val = 'admin') OR
        (user_role_val = 'police' AND pr.reporting_officer_id = user_id) OR
        (user_role_val = 'police') OR
        (user_role_val = 'mortuary_staff' AND (user_id = dr.assigned_staff_id OR user_id = dr.created_by))
    )
    AND (
        pr.circumstances_of_discovery ILIKE '%' || search_term || '%' OR
        pr.officer_notes ILIKE '%' || search_term || '%' OR
        pr.evidence_collected ILIKE '%' || search_term || '%' OR
        pr.case_id ILIKE '%' || search_term || '%' OR
        to_tsvector('english', 
            COALESCE(pr.circumstances_of_discovery, '') || ' ' ||
            COALESCE(pr.officer_notes, '') || ' ' ||
            COALESCE(pr.evidence_collected, '') || ' ' ||
            COALESCE(pr.case_id, '')
        ) @@ plainto_tsquery('english', search_term)
    )
    
    ORDER BY relevance_score DESC, created_at DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin dashboard function
CREATE OR REPLACE FUNCTION admin_dashboard_stats(admin_id UUID DEFAULT auth.uid())
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Verify admin access
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied. User is not an admin.';
    END IF;
    
    SELECT jsonb_build_object(
        'user_counts', jsonb_build_object(
            'total', (SELECT COUNT(*) FROM users),
            'pending_approval', (SELECT COUNT(*) FROM users WHERE approval_status = 'pending'),
            'admins', (SELECT COUNT(*) FROM users WHERE role = 'admin'),
            'mortuary_staff', (SELECT COUNT(*) FROM users WHERE role = 'mortuary_staff'),
            'police', (SELECT COUNT(*) FROM users WHERE role = 'police'),
            'public_users', (SELECT COUNT(*) FROM users WHERE role = 'public')
        ),
        'deceased_records', jsonb_build_object(
            'total', (SELECT COUNT(*) FROM deceased_records),
            'unidentified', (SELECT COUNT(*) FROM deceased_records WHERE identification_status = 'unidentified'),
            'pending_confirmation', (SELECT COUNT(*) FROM deceased_records WHERE identification_status = 'pending_confirmation'),
            'identified', (SELECT COUNT(*) FROM deceased_records WHERE identification_status = 'identified'),
            'public', (SELECT COUNT(*) FROM deceased_records WHERE is_public_viewable = TRUE)
        ),
        'police_reports', jsonb_build_object(
            'total', (SELECT COUNT(*) FROM police_reports),
            'draft', (SELECT COUNT(*) FROM police_reports WHERE report_status = 'draft'),
            'submitted', (SELECT COUNT(*) FROM police_reports WHERE report_status = 'submitted'),
            'closed', (SELECT COUNT(*) FROM police_reports WHERE report_status = 'closed')
        ),
        'recent_activity', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'timestamp', created_at,
                'action', action,
                'user_id', user_id,
                'details', details
            )), '[]'::jsonb)
            FROM (
                SELECT created_at, action, user_id, details
                FROM audit_logs
                ORDER BY created_at DESC
                LIMIT 10
            ) recent
        ),
        'pending_users', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', id,
                'email', email,
                'first_name', first_name,
                'last_name', last_name,
                'role', role,
                'organization', organization,
                'created_at', created_at
            )), '[]'::jsonb)
            FROM users
            WHERE approval_status = 'pending'
            ORDER BY created_at DESC
            LIMIT 20
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mortuary staff dashboard function
CREATE OR REPLACE FUNCTION mortuary_staff_dashboard(staff_id UUID DEFAULT auth.uid())
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Verify mortuary staff access
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = staff_id AND role = 'mortuary_staff') THEN
        RAISE EXCEPTION 'Access denied. User is not mortuary staff.';
    END IF;
    
    SELECT jsonb_build_object(
        'assigned_cases', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', id,
                'full_name', full_name,
                'date_of_death', date_of_death,
                'location_found', location_found,
                'identification_status', identification_status,
                'disposition_status', disposition_status,
                'is_public_viewable', is_public_viewable,
                'created_at', created_at
            )), '[]'::jsonb)
            FROM deceased_records
            WHERE assigned_staff_id = staff_id OR created_by = staff_id
            ORDER BY created_at DESC
            LIMIT 50
        ),
        'case_stats', jsonb_build_object(
            'total_assigned', (SELECT COUNT(*) FROM deceased_records 
                              WHERE assigned_staff_id = staff_id OR created_by = staff_id),
            'unidentified', (SELECT COUNT(*) FROM deceased_records 
                            WHERE (assigned_staff_id = staff_id OR created_by = staff_id) 
                            AND identification_status = 'unidentified'),
            'pending', (SELECT COUNT(*) FROM deceased_records 
                       WHERE (assigned_staff_id = staff_id OR created_by = staff_id) 
                       AND identification_status = 'pending_confirmation'),
            'identified', (SELECT COUNT(*) FROM deceased_records 
                          WHERE (assigned_staff_id = staff_id OR created_by = staff_id) 
                          AND identification_status = 'identified'),
            'awaiting_release', (SELECT COUNT(*) FROM deceased_records 
                                WHERE (assigned_staff_id = staff_id OR created_by = staff_id) 
                                AND disposition_status = 'awaiting_release')
        ),
        'recent_police_reports', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', pr.id,
                'case_id', pr.case_id,
                'deceased_name', dr.full_name,
                'date_of_report', pr.date_of_report,
                'report_status', pr.report_status,
                'fingerprint_match_status', pr.fingerprint_match_status
            )), '[]'::jsonb)
            FROM police_reports pr
            JOIN deceased_records dr ON pr.deceased_record_id = dr.id
            WHERE dr.assigned_staff_id = staff_id OR dr.created_by = staff_id
            ORDER BY pr.created_at DESC
            LIMIT 10
        ),
        'next_of_kin_inquiries', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', nok.id,
                'deceased_name', dr.full_name,
                'inquirer_name', nok.name,
                'relationship', nok.relationship,
                'contact_phone', nok.contact_phone,
                'verified', nok.verified,
                'inquiry_date', nok.inquiry_date
            )), '[]'::jsonb)
            FROM next_of_kin nok
            JOIN deceased_records dr ON nok.deceased_record_id = dr.id
            WHERE dr.assigned_staff_id = staff_id OR dr.created_by = staff_id
            ORDER BY nok.inquiry_date DESC
            LIMIT 15
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Police dashboard function
CREATE OR REPLACE FUNCTION police_dashboard(officer_id UUID DEFAULT auth.uid())
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Verify police access
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = officer_id AND role = 'police') THEN
        RAISE EXCEPTION 'Access denied. User is not police.';
    END IF;
    
    SELECT jsonb_build_object(
        'my_reports', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', pr.id,
                'case_id', pr.case_id,
                'deceased_record_id', pr.deceased_record_id,
                'deceased_name', dr.full_name,
                'date_of_report', pr.date_of_report,
                'report_status', pr.report_status,
                'fingerprint_match_status', pr.fingerprint_match_status,
                'jurisdiction', pr.jurisdiction
            )), '[]'::jsonb)
            FROM police_reports pr
            JOIN deceased_records dr ON pr.deceased_record_id = dr.id
            WHERE pr.reporting_officer_id = officer_id
            ORDER BY pr.created_at DESC
            LIMIT 50
        ),
        'report_stats', jsonb_build_object(
            'total', (SELECT COUNT(*) FROM police_reports 
                      WHERE reporting_officer_id = officer_id),
            'draft', (SELECT COUNT(*) FROM police_reports 
                      WHERE reporting_officer_id = officer_id AND report_status = 'draft'),
            'submitted', (SELECT COUNT(*) FROM police_reports 
                          WHERE reporting_officer_id = officer_id AND report_status = 'submitted'),
            'closed', (SELECT COUNT(*) FROM police_reports 
                       WHERE reporting_officer_id = officer_id AND report_status = 'closed'),
            'fingerprint_matches', (SELECT COUNT(*) FROM police_reports 
                                   WHERE reporting_officer_id = officer_id AND fingerprint_match_status = 'matched')
        ),
        'relevant_deceased_cases', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', dr.id,
                'full_name', dr.full_name,
                'date_of_death', dr.date_of_death,
                'location_found', dr.location_found,
                'identification_status', dr.identification_status,
                'has_report', true
            )), '[]'::jsonb)
            FROM deceased_records dr
            JOIN police_reports pr ON dr.id = pr.deceased_record_id
            WHERE pr.reporting_officer_id = officer_id
            ORDER BY dr.created_at DESC
            LIMIT 20
        ),
        'pending_investigations', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', pr.id,
                'case_id', pr.case_id,
                'deceased_name', dr.full_name,
                'fingerprint_status', pr.fingerprint_match_status,
                'days_open', EXTRACT(DAY FROM now() - pr.created_at)
            )), '[]'::jsonb)
            FROM police_reports pr
            JOIN deceased_records dr ON pr.deceased_record_id = dr.id
            WHERE pr.reporting_officer_id = officer_id 
            AND pr.report_status IN ('draft', 'submitted')
            ORDER BY pr.created_at ASC
            LIMIT 10
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public user dashboard function
CREATE OR REPLACE FUNCTION public_user_dashboard(user_id UUID DEFAULT auth.uid())
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    user_email TEXT;
    user_phone TEXT;
BEGIN
    -- Get user contact info
    SELECT email, phone_number INTO user_email, user_phone 
    FROM users WHERE id = user_id;
    
    SELECT jsonb_build_object(
        'my_inquiries', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', nok.id,
                'deceased_record_id', nok.deceased_record_id,
                'deceased_name', dr.full_name,
                'date_of_death', dr.date_of_death,
                'location_found', dr.location_found,
                'relationship', nok.relationship,
                'inquiry_status', nok.notification_status,
                'verified', nok.verified,
                'inquiry_date', nok.inquiry_date
            )), '[]'::jsonb)
            FROM next_of_kin nok
            JOIN deceased_records dr ON nok.deceased_record_id = dr.id
            WHERE nok.contact_email = user_email
            OR nok.contact_phone = user_phone
            ORDER BY nok.inquiry_date DESC
        ),
        'inquiry_stats', jsonb_build_object(
            'total_inquiries', (
                SELECT COUNT(*) FROM next_of_kin 
                WHERE contact_email = user_email OR contact_phone = user_phone
            ),
            'verified_matches', (
                SELECT COUNT(*) FROM next_of_kin 
                WHERE (contact_email = user_email OR contact_phone = user_phone) 
                AND verified = true
            ),
            'pending_verification', (
                SELECT COUNT(*) FROM next_of_kin 
                WHERE (contact_email = user_email OR contact_phone = user_phone) 
                AND verified = false
            )
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;