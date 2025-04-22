-- update function
CREATE OR REPLACE FUNCTION system.fn_update_datetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- grade_level trigger
CREATE TRIGGER t_update_grade_level
    BEFORE UPDATE ON system.grade_level
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();

-- academic_level trigger
CREATE TRIGGER t_update_academic_level
    BEFORE UPDATE ON system.academic_level
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();

-- system_setting trigger
CREATE TRIGGER t_update_system_setting
    BEFORE UPDATE ON system.system_setting
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();

-- common_enrollment_requirement trigger
CREATE TRIGGER t_update_common_enrollment_requirement
    BEFORE UPDATE ON system.common_enrollment_requirement
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();

-- requirement_group trigger
CREATE TRIGGER t_update_requirement_group
    BEFORE UPDATE ON system.requirement_group
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();


-- plan trigger
CREATE TRIGGER t_update_plan
    BEFORE UPDATE ON system.subscription_plan
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();

-- about_uppend trigger
CREATE TRIGGER t_update_about_uppend
    BEFORE UPDATE ON system.about_uppend
    FOR EACH ROW EXECUTE FUNCTION system.fn_update_datetime();

