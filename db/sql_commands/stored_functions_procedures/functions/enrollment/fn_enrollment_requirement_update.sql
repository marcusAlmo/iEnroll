CREATE OR REPLACE FUNCTION enrollment.fn_enrollment_requirement_update()
RETURNS TRIGGER AS $$
/**
 * Prevents updates to enrollment requirements with active applications.
 * 
 * This function enforces data integrity by:
 * 1. Blocking modifications to critical requirement attributes
 * 2. Preventing changes when active enrollment applications exist
 * 3. Automatically updating the modification timestamp
 * 
 * Restricted Attributes:
 * - grade_section_type_id
 * - name
 * - type
 * - accepted_data_type
 * 
 * Validation Mechanism:
 * - Checks for changes in critical requirement attributes
 * - Verifies active applications for the associated grade section type
 * - Prevents updates that could disrupt ongoing enrollment processes
 * 
 * Workflow:
 * 1. Detect changes to critical requirement attributes
 * 2. Retrieve grade level offered for the grade section type
 * 3. Check for active applications using fn_count_active_applications
 * 4. Block update if active applications exist
 * 5. Update modification timestamp
 * 
 * @trigger BEFORE UPDATE on enrollment.enrollment_requirement table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp if update is allowed
 * @throws EXCEPTION if:
 *  - Attempting to change critical requirement attributes
 *  - Active applications exist for the grade section type
 * 
 * @example
 * -- These updates will be blocked if active applications exist
 * UPDATE enrollment.enrollment_requirement 
 * SET name = 'New Requirement Name' 
 * WHERE enrollment_requirement_id = 123;
 * 
 * UPDATE enrollment.enrollment_requirement 
 * SET type = 'new_type' 
 * WHERE enrollment_requirement_id = 123;
 * 
 * @note Uses a nested SELECT to find grade_level_offered_id
 * @note Utilizes fn_count_active_applications for validation
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    IF NEW.grade_section_type_id <> OLD.grade_section_type_id OR NEW.name <> OLD.name OR
       NEW.type <> OLD.type OR NEW.accepted_data_type <> OLD.accepted_data_type THEN
       IF fn_count_active_applications((SELECT grade_level_offered_id FROM enrollment.grade_section_type WHERE grade_section_type_id = NEW.grade_section_type_id)) > 0 THEN
            RAISE EXCEPTION 'Cannot change the required status of an enrollment requirement.';
        END IF;
    END IF;
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;