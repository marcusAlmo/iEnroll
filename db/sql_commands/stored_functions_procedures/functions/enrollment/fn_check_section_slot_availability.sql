
CREATE OR REPLACE FUNCTION enrollment.fn_check_section_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM enrollment.student_enrollment_application WHERE grade_section_id = NEW.grade_section_id) >= (SELECT slot FROM enrollment.grade_section WHERE id = NEW.grade_section_id) THEN
        RAISE EXCEPTION 'Section slot availability exceeded. Choose another section to proceed.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
