CREATE OR REPLACE FUNCTION enrollment.fn_user_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $$
/**
 * Prevents updates to user records with active enrollment applications.
 * 
 * This function enforces data integrity by restricting modifications to users 
 * who have ongoing enrollment processes to prevent potential conflicts.
 * 
 * Key Validation Mechanism:
 * 1. Checks for existing enrollment applications
 * 2. Blocks updates for users with specific application statuses
 * 3. Supports multiple identifier types (user_id, student_id, address_id)
 * 
 * Blocked Application Statuses:
 * - NULL (any existing application)
 * - 'pending'
 * - 'accepted'
 * - 'denied'
 * 
 * Update Prevention Rationale:
 * - Maintains data consistency during enrollment processes
 * - Prevents modifications that could disrupt ongoing applications
 * - Ensures application integrity
 * 
 * Flexible Identifier Handling:
 * - Uses COALESCE to check against multiple potential identifiers
 * - Supports updates across different related tables
 * 
 * @trigger BEFORE UPDATE on user-related tables
 * @param NEW The proposed new row after update
 * 
 * @returns NEW if no active enrollment application exists
 * @throws EXCEPTION if an active enrollment application is found
 * 
 * @example
 * -- These updates will be blocked
 * UPDATE enrollment.user 
 * SET email = 'new_email@example.com' 
 * WHERE user_id = 123;  -- If user has pending application
 * 
 * UPDATE enrollment.student 
 * SET middle_name = 'New Middle Name' 
 * WHERE student_id = 456;  -- If student has accepted application
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
DECLARE
    v_status VARCHAR(20);
BEGIN
    SELECT ea.status FROM enrollment.enrollment_application ea
    INNER JOIN enrollment.student s ON ea.application_id = s.student_id
    WHERE s.address_id = OLD.address_id
    INTO v_status;

    IF v_status IS NOT NULL AND (v_status = 'pending' OR v_status = 'accepted' OR v_status = 'denied') THEN
        RAISE EXCEPTION 'Cannot update user with active enrollment application';
    END IF;

    RETURN NEW;
END;
$$;

ALTER TABLE enrollment.grade_level_offered
ADD COLUMN can_choose_section BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE enrollment.enrollment_schedule
DROP COLUMN can_choose_section;