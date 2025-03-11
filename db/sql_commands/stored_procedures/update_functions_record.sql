-- update function
CREATE OR REPLACE FUNCTION fn_update_datetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- student_list trigger
CREATE TRIGGER t_update_student_list
    BEFORE UPDATE ON record.student_list
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- section_list trigger
CREATE TRIGGER t_update_section_list
    BEFORE UPDATE ON record.section_list
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- invoice trigger
CREATE TRIGGER t_update_invoice
    BEFORE UPDATE ON record.invoice
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- invoice_plan trigger
CREATE TRIGGER t_update_invoice_plan
    BEFORE UPDATE ON record.invoice_plan
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();