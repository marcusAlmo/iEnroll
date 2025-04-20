CREATE OR REPLACE FUNCTION enrollment.fn_grade_section_type_update()
RETURNS TRIGGER AS $$
/**
 * Prevents updates to grade section types with active enrollment applications.
 * 
 * This function enforces data integrity by:
 * 1. Blocking modifications when active enrollment applications exist
 * 2. Automatically updating the modification timestamp
 * 
 * Validation Mechanism:
 * - Checks for active enrollment applications using fn_count_active_applications
 * - Prevents any update if active applications are detected
 * - Ensures data consistency across related entities
 * 
 * Key Constraints:
 * - Unconditionally blocks updates with existing active applications
 * - Always updates the modification timestamp
 * 
 * Workflow:
 * 1. Count active applications for the given grade level offered
 * 2. Raise exception if any active applications exist
 * 3. Update the modification timestamp
 * 
 * @trigger BEFORE UPDATE on enrollment.grade_section_type table
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp if no active applications exist
 * @throws EXCEPTION if active enrollment applications are found
 * 
 * @example
 * -- This update will be blocked if active applications exist
 * UPDATE enrollment.grade_section_type 
 * SET some_column = 'new_value' 
 * WHERE grade_section_type_id = 123;
 * 
 * @note Uses fn_count_active_applications for validation
 * 
 * @author almojuela_mj
 * @version 1.2.0
 * @date 2025-03-22
 */
BEGIN
    IF fn_count_active_applications(NEW.grade_level_offered_id) > 0 THEN
        RAISE EXCEPTION 'Cannot change the active status of a grade section type with active section type applications.';
    END IF;
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;