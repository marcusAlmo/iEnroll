-- update function
CREATE OR REPLACE FUNCTION fn_update_datetime()
RETURNS TRIGGER AS $$
/**
 * Automatically updates the modification timestamp for database records.
 * 
 * This universal trigger function ensures that every record's update_datetime 
 * is set to the current system timestamp whenever a record is modified.
 * 
 * Key Features:
 * - Automatically tracks last modification time
 * - Works with any table containing an update_datetime column
 * - Preserves data integrity by recording precise update moments
 * 
 * Typical Use Cases:
 * - Tracking record modifications
 * - Audit trail maintenance
 * - Identifying most recently updated records
 * 
 * @trigger BEFORE UPDATE on any table with update_datetime column
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp
 * 
 * @example
 * -- Automatically applied to tables like:
 * -- user, student, enrollment_application, etc.
 * UPDATE enrollment.user 
 * SET email = 'new_email@example.com' 
 * WHERE user_id = 123;
 * -- update_datetime will be set to current timestamp
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;