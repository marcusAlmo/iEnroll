-- +migrate Up
-- Description: Creates functions and triggers for managing enrollment application slots
-- Author: Mark June Almojuela
-- Date: 2024-04-09

-- Function: enrollment.fn_check_section_slot_availability
-- Purpose: Validates slot availability before inserting a new enrollment application
-- Trigger: t_insert_enrollment_application (BEFORE INSERT)
-- Parameters: None (uses NEW record)
-- Returns: NEW record if slot is available, raises exception if not
-- Error Handling: Raises exception when no slots are available
-- Dependencies: enrollment.aux_schedule_slot table
CREATE OR REPLACE FUNCTION enrollment.fn_check_section_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT application_slot_left FROM enrollment.aux_schedule_slot WHERE schedule_id = NEW.schedule_id) > 0 THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'Section slot availability exceeded. Choose another section to proceed.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger: t_insert_enrollment_application
-- Purpose: Ensures slot availability before allowing new enrollment applications
-- Table: enrollment.enrollment_application
-- Timing: BEFORE INSERT
-- Function: enrollment.fn_check_section_slot_availability
CREATE TRIGGER t_insert_enrollment_application
BEFORE INSERT ON enrollment.enrollment_application
FOR EACH ROW EXECUTE FUNCTION enrollment.fn_check_section_slot_availability();

-- Function: enrollment.fn_decrement_aux_schedule_slot
-- Purpose: Decrements available slots and manages section closure after successful enrollment
-- Trigger: t_after_insert_enrollment_application (AFTER INSERT)
-- Parameters: None (uses NEW record)
-- Returns: NEW record
-- Error Handling: Raises exception when no slots are available
-- Dependencies: enrollment.aux_schedule_slot table
CREATE OR REPLACE FUNCTION enrollment.fn_decrement_aux_schedule_slot()
RETURNS TRIGGER AS $$
DECLARE
    v_application_slot_left INT;
BEGIN
    -- Use a single UPDATE with CASE statement to handle both slot decrement and closure
    UPDATE enrollment.aux_schedule_slot 
    SET 
        application_slot_left = application_slot_left - 1,
        is_closed = CASE 
            WHEN application_slot_left = 1 THEN TRUE 
            ELSE is_closed 
        END
    WHERE schedule_id = NEW.schedule_id
    AND application_slot_left > 0
    RETURNING application_slot_left INTO v_application_slot_left;

    -- If no rows were updated, it means there were no slots left
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Section slot availability exceeded. Choose another section to proceed.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: t_after_insert_enrollment_application
-- Purpose: Updates slot availability after successful enrollment
-- Table: enrollment.enrollment_application
-- Timing: AFTER INSERT
-- Function: enrollment.fn_decrement_aux_schedule_slot
CREATE TRIGGER t_after_insert_enrollment_application
AFTER INSERT ON enrollment.enrollment_application
FOR EACH ROW EXECUTE FUNCTION enrollment.fn_decrement_aux_schedule_slot();