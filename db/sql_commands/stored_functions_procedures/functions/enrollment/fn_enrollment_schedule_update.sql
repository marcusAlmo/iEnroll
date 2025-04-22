CREATE OR REPLACE FUNCTION enrollment.fn_enrollment_schedule_update()
RETURNS TRIGGER AS $$
/**
 * Validates and manages updates to enrollment schedule timestamps.
 * 
 * This function enforces data integrity by:
 * 1. Preventing updates to closed enrollment schedules
 * 2. Validating datetime constraints for new timestamps
 * 3. Maintaining chronological consistency
 * 4. Automatically updating the modification timestamp
 * 
 * Validation Checks:
 * - Blocks modifications to already closed schedules
 * - Prevents setting new start or end datetime in the past
 * - Ensures start datetime is before end datetime
 * 
 * Closed Schedule Criteria:
 * - Schedule is considered closed if its start or end datetime is in the past
 * 
 * Datetime Constraints:
 * - Cannot modify closed schedules
 * - New start_datetime must be in the future
 * - New end_datetime must be in the future
 * - New start_datetime must be before new end_datetime
 * 
 * Workflow:
 * 1. Check if existing schedule is already closed
 * 2. Validate new start and end datetime
 * 3. Raise exception for invalid datetime configurations
 * 4. Update modification timestamp
 * 
 * @trigger BEFORE UPDATE on enrollment.enrollment_schedule table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp if update is valid
 * @throws EXCEPTION if:
 *  - Attempting to modify a closed schedule
 *  - New start or end datetime is in the past
 *  - New start datetime is after new end datetime
 * 
 * @example
 * -- These updates will be blocked
 * UPDATE enrollment.enrollment_schedule 
 * SET start_datetime = '2020-01-01' 
 * WHERE enrollment_schedule_id = 123;
 * 
 * UPDATE enrollment.enrollment_schedule 
 * SET start_datetime = '2024-01-01' 
 * WHERE enrollment_schedule_id = 123 -- if schedule is already closed
 * 
 * @note Uses CURRENT_TIMESTAMP for real-time validation
 * @note Prevents modifications to historical schedules
 * 
 * @author almojuela_mj
 * @version 1.1.0
 * @date 2025-03-22
 */
BEGIN
    IF OLD.start_datetime < CURRENT_TIMESTAMP OR OLD.end_datetime < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Cannot change the start or end datetime of a closed enrollment schedule.';
    END IF;
    IF NEW.start_datetime < CURRENT_TIMESTAMP OR NEW.end_datetime < CURRENT_TIMESTAMP OR NEW.start_datetime > NEW.end_datetime THEN
        RAISE EXCEPTION 'Invalid start or end datetime.';
    END IF;
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;