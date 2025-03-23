CREATE OR REPLACE FUNCTION fn_restrict_update()
RETURNS TRIGGER AS $$
/**
 * Prevents updates to specific system tables and logs unauthorized update attempts.
 * 
 * This function serves as a security mechanism to:
 * 1. Block modifications to critical system tables
 * 2. Log all attempted updates with detailed context
 * 3. Provide an audit trail of unauthorized access attempts
 * 
 * @trigger BEFORE UPDATE on system-critical tables
 * @param NEW The new row that would be updated
 * 
 * @returns NULL
 * @throws EXCEPTION when any update is attempted
 * 
 * Logging Details:
 * - Captures the user's full name as the initiator
 * - Records the table name, action type, and user ID
 * - Timestamps the unauthorized update attempt
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
DECLARE
    initiator VARCHAR(100);
BEGIN
    SELECT first_name || ' ' || last_name AS name 
    FROM enrollment.user 
    WHERE user_id = NEW.user_id 
    INTO initiator;

    INSERT INTO enrollment.system_log (
        initiator,
        system_action,
        details,
        log_datetime
    ) VALUES (
        initiator,
        'System Data Update Attempt',
        json_build_object(
            'table', TG_TABLE_NAME, 
            'action', 'update', 
            'remarks', 'Updates are not allowed for this table', 
            'user_id', NEW.user_id
        ),
        CURRENT_TIMESTAMP
    );

    RAISE EXCEPTION 'Updates are not allowed for this table';
END;
$$ LANGUAGE plpgsql;