-- update function
CREATE OR REPLACE FUNCTION fn_update_datetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- permission update trigger
CREATE TRIGGER t_update_permission
    BEFORE UPDATE ON enrollment.permission
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- role permission update trigger
CREATE TRIGGER t_update_role_permission
    BEFORE UPDATE ON enrollment.role_permission
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- role update trigger
CREATE TRIGGER t_update_role
    BEFORE UPDATE ON enrollment.role
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- user_role update trigger
CREATE TRIGGER t_update_user_role
    BEFORE UPDATE ON enrollment.user_role
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- user update trigger
CREATE TRIGGER t_update_user
    BEFORE UPDATE ON enrollment.user
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- student update trigger
CREATE TRIGGER t_update_student
    BEFORE UPDATE ON enrollment.student
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- address update trigger
CREATE TRIGGER t_update_address
    BEFORE UPDATE ON enrollment.address
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- enrollment_application update trigger
CREATE TRIGGER t_update_enrollment_application
    BEFORE UPDATE ON enrollment.enrollment_application
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- application_attachment update trigger
CREATE TRIGGER t_update_application_attachment
    BEFORE UPDATE ON enrollment.application_attachment
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- school update trigger
CREATE TRIGGER t_update_school
    BEFORE UPDATE ON enrollment.school
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- student_enrollment update trigger
CREATE TRIGGER t_update_student_enrollment
    BEFORE UPDATE ON enrollment.student_enrollment
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- banner update trigger
CREATE TRIGGER t_update_banner
    BEFORE UPDATE ON enrollment.banner
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- grade_level_offered update trigger
CREATE TRIGGER t_update_grade_level_offered
    BEFORE UPDATE ON enrollment.grade_level_offered
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- enrollment_schedule update trigger
CREATE TRIGGER t_update_enrollment_schedule
    BEFORE UPDATE ON enrollment.enrollment_schedule
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- grade_level_section update trigger
CREATE TRIGGER t_update_grade_level_section
    BEFORE UPDATE ON enrollment.grade_level_section
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- school_subscription update trigger
CREATE TRIGGER t_update_school_subscription
    BEFORE UPDATE ON enrollment.school_subscription
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- enrollment_requirement update trigger
CREATE TRIGGER t_update_enrollment_requirement
    BEFORE UPDATE ON enrollment.enrollment_requirement
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();
    