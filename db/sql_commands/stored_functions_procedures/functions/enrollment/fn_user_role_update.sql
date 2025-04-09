CREATE OR REPLACE FUNCTION fn_user_role_update()
RETURNS TRIGGER AS $$
/**
 * Restricts updates to user role records, allowing only is_active column modifications.
 * 
 * This function enforces strict data integrity for user role assignments by:
 * 1. Preventing modifications to critical user role attributes
 * 2. Ensuring that only the is_active status can be changed
 * 
 * Restricted Attributes:
 * - role_id
 * - user_id
 * - created_at
 * 
 * Update Validation:
 * 1. Checks if any protected attributes are being modified
 * 2. Raises an exception if unauthorized changes are attempted
 * 3. Allows updates only to the is_active column
 * 
 * Security Rationale:
 * - Prevents accidental or unauthorized changes to user role assignments
 * - Maintains the integrity of user-role relationships
 * - Provides a controlled mechanism for role status management
 * 
 * @trigger BEFORE UPDATE on enrollment.user_role table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW if update is allowed (only is_active)
 * @throws EXCEPTION if attempting to modify protected attributes
 * 
 * @example
 * -- This update will be allowed
 * UPDATE enrollment.user_role 
 * SET is_active = false 
 * WHERE user_role_id = 123;
 * 
 * -- These updates will raise an exception
 * UPDATE enrollment.user_role 
 * SET role_id = 456 
 * WHERE user_role_id = 123;
 * 
 * UPDATE enrollment.user_role 
 * SET user_id = 789 
 * WHERE user_role_id = 123;
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    IF (NEW.role_id <> OLD.role_id OR 
        NEW.user_id <> OLD.user_id OR 
        NEW.created_at <> OLD.created_at) THEN

        RAISE EXCEPTION 'Only is_active column can be updated for user roles';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;