CREATE OR REPLACE FUNCTION enrollment.fn_grade_section_update()
RETURNS TRIGGER AS $$
/**
 * Grade Section Update Validation Trigger
 * 
 * Comprehensive validation mechanism for grade section modifications
 * ensuring data integrity and adherence to system constraints.
 * 
 * Core Validation Checks:
 * 1. Prevent changes to active grade sections
 * 2. Enforce slot and enrollment consistency
 * 3. Validate maximum application slot allocations
 * 
 * Constraint Enforcement Strategies:
 * - Block section name/adviser changes with active applications
 * - Prevent slot reductions below current enrollments
 * - Ensure slot allocations respect subscription limits
 * 
 * Performance Characteristics:
 * - Minimal database query overhead
 * - Constant-time complexity
 * - Atomic transaction validation
 * 
 * Key Validation Rules:
 * - Cannot modify section with active applications
 * - Slot cannot be less than current enrollments
 * - Maximum application slots respect subscription constraints
 * 
 * Input Parameters:
 * @param NEW Updated row data
 * @param OLD Original row data before update
 * 
 * @returns TRIGGER result (NEW or raises exception)
 * 
 * @usage Automatically triggered on grade_section table updates
 * 
 * @note Prevents unauthorized or inconsistent updates
 * @note Maintains referential and logical data integrity
 * 
 * @author almojuela_mj
 * @version 1.3.0
 * @date 2025-03-22
 */
DECLARE
    v_school_id INTEGER;
    v_current_enrollment INTEGER;
BEGIN
    -- Prevent section modifications with active applications
    IF NEW.section_name <> OLD.section_name OR NEW.adviser <> OLD.adviser THEN 
        IF fn_count_active_applications(
            (SELECT grade_level_offered_id 
             FROM enrollment.grade_section_type 
             WHERE grade_section_type_id = NEW.grade_section_type_id)
        ) > 0 THEN
            RAISE EXCEPTION 'Cannot modify an active grade section with existing applications.';
        END IF;
    
    -- Validate slot modifications
    ELSIF NEW.slot <> OLD.slot THEN
        v_current_enrollment := fn_count_section_enrollment(NEW.grade_section_id);
        
        IF v_current_enrollment > NEW.slot OR 
           v_current_enrollment > NEW.max_application_slot THEN
            RAISE EXCEPTION 'Slot reduction below current enrollment is not permitted.';
        END IF;
    
    -- Validate maximum application slot changes
    ELSIF NEW.max_application_slot <> OLD.max_application_slot THEN
        -- Retrieve associated school ID
        SELECT school_id INTO v_school_id
        FROM enrollment.grade_section_type gst
        INNER JOIN enrollment.grade_level_offered glo 
            ON gst.grade_level_offered_id = glo.grade_level_offered_id
        WHERE gst.grade_section_type_id = NEW.grade_section_type_id;

        -- Ensure slot increases respect subscription limits
        IF NEW.max_application_slot > OLD.max_application_slot THEN
            IF fn_remaining_plan_slot(v_school_id, 'student') < 
               (NEW.max_application_slot - OLD.max_application_slot) THEN
                RAISE EXCEPTION 'Insufficient remaining student slots in subscription.';
            END IF;
        END IF;
    END IF;

    NEW.update_datetime = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;