CREATE OR REPLACE FUNCTION fn_update_student_enrollment()
RETURNS TRIGGER AS $$
/**
 * Manages student enrollment updates with section capacity validation.
 * 
 * This function controls student section transfers by:
 * 1. Preventing transfers to fully occupied grade sections
 * 2. Automatically updating the modification timestamp
 * 
 * Key Validation Mechanisms:
 * - Checks grade section capacity before allowing transfer
 * - Ensures students can only move to sections with available slots
 * - Automatically tracks last modification time
 * 
 * Update Workflow:
 * 1. Detect changes in grade_section_id
 * 2. Count current enrollments in target section
 * 3. Compare against section's total available slots
 * 4. Block transfer if section is at full capacity
 * 5. Update modification timestamp
 * 
 * Capacity Calculation:
 * - Compares current student count in section
 * - Checks against predefined section slot limit
 * 
 * @trigger BEFORE UPDATE on enrollment.student_enrollment table
 * @param OLD The original row before update
 * @param NEW The proposed new row after update
 * 
 * @returns NEW with updated timestamp if transfer is allowed
 * @throws EXCEPTION if target section is full
 * 
 * @example
 * -- This update will be blocked if section is at capacity
 * UPDATE enrollment.student_enrollment 
 * SET grade_section_id = 456 
 * WHERE student_enrollment_id = 123;
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    IF NEW.grade_section_id <> OLD.grade_section_id THEN
        IF (SELECT COUNT(*) FROM enrollment.student_enrollment 
            WHERE grade_section_id = NEW.grade_section_id) >= 
            (SELECT slot FROM enrollment.grade_section WHERE grade_section_id = NEW.grade_section_id) 
        THEN
            RAISE EXCEPTION 'Slots are full. Please choose another grade section.';
        END IF;
    END IF;
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;