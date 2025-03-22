
-- permission update trigger
CREATE TRIGGER t_update_permission
    BEFORE UPDATE ON enrollment.permission
    FOR EACH ROW EXECUTE FUNCTION fn_restrict_update();

-- role permission update trigger
CREATE TRIGGER t_update_role_permission
    BEFORE UPDATE ON enrollment.role_permission
    FOR EACH ROW EXECUTE FUNCTION fn_restrict_update();

-- role update trigger
CREATE TRIGGER t_update_role
    BEFORE UPDATE ON enrollment.role
    FOR EACH ROW EXECUTE FUNCTION fn_restrict_update();

-- user_role update trigger
CREATE TRIGGER t_update_user_role
    BEFORE UPDATE ON enrollment.user_role
    FOR EACH ROW EXECUTE FUNCTION fn_user_role_update();

-- user update trigger
CREATE TRIGGER t_update_user
    BEFORE UPDATE ON enrollment.user
    FOR EACH ROW EXECUTE FUNCTION fn_user_update();

-- student update trigger
CREATE TRIGGER t_update_student
    BEFORE UPDATE ON enrollment.student
    FOR EACH ROW EXECUTE FUNCTION fn_user_update();

-- address update trigger
CREATE TRIGGER t_update_address
    BEFORE UPDATE ON enrollment.address
    FOR EACH ROW EXECUTE FUNCTION fn_user_update();

-- enrollment_application update trigger
CREATE TRIGGER t_update_enrollment_application
    BEFORE UPDATE ON enrollment.enrollment_application
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- application_attachment update trigger
CREATE TRIGGER t_update_application_attachment
    BEFORE UPDATE ON enrollment.application_attachment
    FOR EACH ROW EXECUTE FUNCTION fn_update_application_attachment();

-- school update trigger
CREATE TRIGGER t_update_school
    BEFORE UPDATE ON enrollment.school
    FOR EACH ROW EXECUTE FUNCTION fn_school_update();

-- student_enrollment update trigger
CREATE TRIGGER t_update_student_enrollment
    BEFORE UPDATE ON enrollment.student_enrollment
    FOR EACH ROW EXECUTE FUNCTION fn_update_student_enrollment();

-- banner update trigger
CREATE TRIGGER t_update_banner
    BEFORE UPDATE ON enrollment.banner
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- grade_level_offered update trigger
CREATE TRIGGER t_update_grade_level_offered
    BEFORE UPDATE ON enrollment.grade_level_offered
    FOR EACH ROW EXECUTE FUNCTION fn_grade_level_offered_update();

-- grade_section_type update trigger
CREATE TRIGGER t_update_grade_section_type
    BEFORE UPDATE ON enrollment.grade_section_type
    FOR EACH ROW EXECUTE FUNCTION fn_grade_section_type_update();

-- enrollment_requirement update trigger
CREATE TRIGGER t_update_enrollment_requirement
    BEFORE UPDATE ON enrollment.enrollment_requirement
    FOR EACH ROW EXECUTE FUNCTION fn_enrollment_requirement_update();

-- enrollment_schedule update trigger
CREATE TRIGGER t_update_enrollment_schedule
    BEFORE UPDATE ON enrollment.enrollment_schedule
    FOR EACH ROW EXECUTE FUNCTION fn_enrollment_schedule_update();

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
    