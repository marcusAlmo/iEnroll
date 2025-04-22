CREATE OR REPLACE FUNCTION enrollment.fn_grade_level_offered_update()
RETURNS TRIGGER AS $$
/**
 * Manages updates to grade levels offered with strict data integrity rules.
 * 
 * This function controls modifications to grade level offerings by:
 * 1. Preventing changes to fundamental grade level attributes
 * 2. Restricting status changes when active applications exist
 * 3. Automatically updating the modification timestamp
 * 
 * Key Validation Mechanisms:
 * - Blocks modifications to school and grade level code
 * - Prevents deactivation of grade levels with ongoing applications
 * - Automatically tracks last modification time
 * 
 * Update Restrictions:
 * 1. School ID cannot be changed
 * 2. Grade level code cannot be modified
 * 3. Active status can only be changed if no applications exist
 * 
 * Workflow:
 * 1. Check for attempts to modify school or grade level code
 * 2. Validate active status changes
 * 3. Prevent updates that could disrupt ongoing enrollment processes
 * 4. Update modification timestamp
 * 
 * @trigger BEFORE UPDATE on enrollment.grade_level_offered table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp if update is allowed
 * @throws EXCEPTION if:
 *  - Attempting to change school or grade level code
 *  - Trying to change active status with existing applications
 * 
 * @example
 * -- These updates will be blocked
 * UPDATE enrollment.grade_level_offered 
 * SET school_id = 456 
 * WHERE grade_level_offered_id = 123;
 * 
 * UPDATE enrollment.grade_level_offered 
 * SET is_active = FALSE 
 * WHERE grade_level_offered_id = 123;  -- If applications exist
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    IF NEW.school_id <> OLD.school_id OR
       NEW.grade_level_code <> OLD.grade_level_code THEN
        RAISE EXCEPTION 'Cannot change the school or grade level code of a grade level offered.';
    ELSEIF NEW.is_active <> OLD.is_active THEN
        IF fn_count_active_applications(NEW.grade_level_offered_id) > 0 THEN
            RAISE EXCEPTION 'Cannot change the active status of a grade level offered with active applications.';
        END IF;
    END IF;
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;