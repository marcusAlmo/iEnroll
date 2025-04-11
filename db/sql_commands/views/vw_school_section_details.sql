
CREATE VIEW enrollment.vw_school_section_details AS
WITH school_data AS (
    SELECT 
        s.school_id,
        s.name as school_name,
        s.academic_year,
        s.school_type,
        s.email_address,
        s.contact_number,
        s.website_url,
        s.is_active as school_active,
        ss.subscription_id,
        ss.plan_code,
        ss.duration_days,
        ss.start_datetime as subscription_start,
        ss.end_datetime as subscription_end,
        ss.is_active as subscription_active,
        glo.grade_level_offered_id,
        gl.grade_level_code,
        gl.grade_level as grade_level_name,
        gl.academic_level_code,
        gst.program_id,    
        gs.grade_section_id,
        gs.section_name,
        gs.adviser,
        gs.slot,
        gs.max_application_slot,
        es.schedule_id,
        es.start_datetime as enrollment_start,
        es.end_datetime as enrollment_end,
        ef.fee_id,
        ef.name as fee_name,
        ef.amount as fee_amount,
        ef.description as fee_description,
        er.requirement_id,
        er.name as requirement_name,
        er.requirement_type as requirement_type,
        er.accepted_data_type as accepted_data_type,
        er.is_required as is_requirement_required
    FROM enrollment.school s
    LEFT JOIN enrollment.school_subscription ss ON s.school_id = ss.school_id
    LEFT JOIN enrollment.grade_level_offered glo ON s.school_id = glo.school_id
    LEFT JOIN system.grade_level gl ON glo.grade_level_code = gl.grade_level_code
    LEFT JOIN enrollment.grade_section_program gst ON glo.grade_level_offered_id = gst.grade_level_offered_id
    LEFT JOIN enrollment.grade_section gs ON gst.grade_section_program_id = gs.grade_section_program_id
    LEFT JOIN enrollment.enrollment_schedule es ON glo.grade_level_offered_id = es.grade_level_offered_id
    LEFT JOIN enrollment.enrollment_fee ef ON gst.grade_section_program_id = ef.grade_section_program_id
    LEFT JOIN enrollment.enrollment_requirement er ON gst.grade_section_program_id = er.grade_section_program_id
    WHERE s.school_id = 762306
    ORDER BY 
        gl.academic_level_code,
        gl.grade_level_code,
        gst.program_id,
        gs.section_name
)
SELECT 
    school_id,
    school_name,
    academic_year,
    school_type,
    email_address,
    contact_number,
    website_url,
    school_active,
    subscription_id,
    plan_code,
    duration_days,
    subscription_start,
    subscription_end,
    subscription_active,
    grade_level_offered_id,
    grade_level_code,
    grade_level_name,
    academic_level_code,
    program_id,
    grade_section_id,
    section_name,
    adviser,
    slot,
    max_application_slot,
    schedule_id,
    enrollment_start,
    enrollment_end,
    json_agg(
        json_build_object(
            'fee_id', fee_id,
            'fee_name', fee_name,
            'fee_amount', fee_amount,
            'fee_description', fee_description
        )
    ) as fees,
    json_agg(
        json_build_object(
            'requirement_id', requirement_id,
            'requirement_name', requirement_name,
            'requirement_type', requirement_type,
            'accepted_data_type', accepted_data_type,
            'is_required', is_requirement_required
        )
    ) as requirements
FROM school_data
GROUP BY 
    school_id,
    school_name,
    academic_year,
    school_type,
    email_address,
    contact_number,
    website_url,
    school_active,
    subscription_id,
    plan_code,
    duration_days,
    subscription_start,
    subscription_end,
    subscription_active,
    grade_level_offered_id,
    grade_level_code,
    grade_level_name,
    academic_level_code,
    program_id,
    grade_section_id,
    section_name,
    adviser,
    slot,
    max_application_slot,
    schedule_id,
    enrollment_start,
    enrollment_end;