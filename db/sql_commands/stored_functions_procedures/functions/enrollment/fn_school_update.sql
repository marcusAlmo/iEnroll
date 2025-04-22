CREATE OR REPLACE FUNCTION enrollment.fn_school_update()
RETURNS TRIGGER AS $$
/**
 * Restricts updates to school records with active enrollment applications.
 * 
 * This function prevents modifications to critical school attributes 
 * when the school has ongoing enrollment applications to maintain data integrity.
 * 
 * Restricted Attributes:
 * - academic_year
 * - name
 * - school_type
 * - address_id
 * 
 * Update Validation:
 * 1. Checks if any of the critical attributes are being modified
 * 2. Verifies if the school has any active enrollment applications
 * 3. Raises an exception if update would compromise ongoing applications
 * 
 * Application Status Check:
 * - Searches for applications in grade levels offered by the school
 * - Prevents updates if any applications exist
 * 
 * @trigger BEFORE UPDATE on enrollment.school table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW if update is allowed, otherwise raises an exception
 * 
 * @example
 * -- This update would be blocked if school has active applications
 * UPDATE enrollment.school 
 * SET name = 'New School Name' 
 * WHERE school_id = 123;
 * 
 * @note Uses a nested subquery to check for applications across all 
 *       grade levels offered by the school
 * 
 * @author almojuela_mj
 * @version 1.0.1
 * @date 2025-03-22
 */
BEGIN
    IF NEW.academic_year <> OLD.academic_year OR
       NEW.name <> OLD.name OR
       NEW.school_type <> OLD.school_type OR
       NEW.address_id <> OLD.address_id THEN
        IF (SELECT COUNT(*) FROM enrollment.enrollment_application WHERE grade_level_offered_id IN (SELECT grade_level_offered_id FROM enrollment.grade_level_offered WHERE school_id = NEW.school_id)) > 0 THEN
            RAISE EXCEPTION 'Cannot update school with active student enrollments';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;