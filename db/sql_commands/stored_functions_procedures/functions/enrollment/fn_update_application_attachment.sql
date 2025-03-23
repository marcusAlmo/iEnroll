CREATE OR REPLACE FUNCTION fn_update_application_attachment()
RETURNS TRIGGER AS $$
/**
 * Manages updates to enrollment application attachments with specific business rules.
 * 
 * This function controls the lifecycle of application attachments by:
 * 1. Propagating 'invalid' status to the parent enrollment application
 * 2. Preventing updates to already accepted attachments
 * 3. Automatically updating the modification timestamp
 * 
 * Status Handling:
 * - If attachment is marked 'invalid', the entire application is set to 'invalid'
 * - Accepted attachments cannot be modified
 * 
 * Workflow:
 * 1. Check the new status of the attachment
 * 2. Update parent application status if needed
 * 3. Prevent modifications to accepted attachments
 * 4. Update the modification timestamp
 * 
 * @trigger BEFORE UPDATE on enrollment.application_attachment table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp if update is allowed
 * @throws EXCEPTION if trying to update an accepted attachment
 * 
 * @example
 * -- This will set both attachment and application status to 'invalid'
 * UPDATE enrollment.application_attachment 
 * SET status = 'invalid' 
 * WHERE attachment_id = 123;
 * 
 * -- This will raise an exception
 * UPDATE enrollment.application_attachment 
 * SET filename = 'new_file.pdf' 
 * WHERE status = 'accepted';
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    IF NEW.status = 'invalid' THEN
        UPDATE enrollment.enrollment_application
        SET status = 'invalid'
        WHERE application_id = NEW.application_id;
    ELSEIF NEW.status = 'accepted' THEN
        RAISE EXCEPTION 'Accepted attachments cannot be updated';
    END IF;
    
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;