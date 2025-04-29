-- role_permission 
ALTER TABLE enrollment.role_permission
    ADD CONSTRAINT fk_role_permission_role_code FOREIGN KEY (role_code) REFERENCES enrollment.role(role_code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.role_permission
    ADD CONSTRAINT fk_role_permission_permission_id FOREIGN KEY (permission_id) REFERENCES enrollment.permission(permission_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- user_role 
ALTER TABLE enrollment.user_role
    ADD CONSTRAINT fk_user_role_user_id FOREIGN KEY (user_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.user_role
    ADD CONSTRAINT fk_user_role_role_code FOREIGN KEY (role_code) REFERENCES enrollment.role(role_code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.user_role
    ADD CONSTRAINT fk_user_role_assigned_by FOREIGN KEY (assigned_by) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- school_file 
ALTER TABLE enrollment.school_file
    ADD CONSTRAINT fk_school_file_school_id FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.school_file
    ADD CONSTRAINT fk_school_file_file_id FOREIGN KEY (file_id) REFERENCES enrollment.file(file_id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- school_file_access 
ALTER TABLE enrollment.school_file_access
    ADD CONSTRAINT fk_school_file_access_school_file_id FOREIGN KEY (school_file_id) REFERENCES enrollment.school_file(school_file_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.school_file_access
    ADD CONSTRAINT fk_school_file_access_student_id FOREIGN KEY (student_id) REFERENCES enrollment.student(student_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.school_file_access
    ADD CONSTRAINT fk_school_file_access_issuer_id FOREIGN KEY (issuer_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- user 
ALTER TABLE enrollment.user
    ADD CONSTRAINT fk_user_school_id FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- student 
ALTER TABLE enrollment.student
    ADD CONSTRAINT fk_student_address_id FOREIGN KEY (address_id) REFERENCES enrollment.address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.student
    ADD CONSTRAINT fk_student_enroller_id FOREIGN KEY (enroller_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- user_log 
ALTER TABLE enrollment.user_log
    ADD CONSTRAINT fk_user_log_user_id FOREIGN KEY (user_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_application 
ALTER TABLE enrollment.enrollment_application
    ADD CONSTRAINT fk_enrollment_application_student_id FOREIGN KEY (application_id) REFERENCES enrollment.student(student_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.enrollment_application
    ADD CONSTRAINT fk_enrollment_application_grade_level_offered_id FOREIGN KEY (grade_level_offered_id) REFERENCES enrollment.grade_level_offered(grade_level_offered_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.enrollment_application
    ADD CONSTRAINT fk_enrollment_application_schedule_id FOREIGN KEY (schedule_id) REFERENCES enrollment.aux_schedule_slot(schedule_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- application_attachment 
ALTER TABLE enrollment.application_attachment
    ADD CONSTRAINT fk_application_attachment_application_id FOREIGN KEY (application_id) REFERENCES enrollment.enrollment_application(application_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.application_attachment
    ADD CONSTRAINT fk_application_attachment_requirement_id FOREIGN KEY (requirement_id) REFERENCES enrollment.enrollment_requirement(requirement_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.application_attachment
    ADD CONSTRAINT fk_application_attachment_reviewer_id FOREIGN KEY (reviewer_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.application_attachment
    ADD CONSTRAINT fk_application_attachment_file_id FOREIGN KEY (file_id) REFERENCES enrollment.file(file_id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- school 
ALTER TABLE enrollment.school
    ADD CONSTRAINT fk_school_address_id FOREIGN KEY (address_id) REFERENCES enrollment.address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- student_enrollment 
ALTER TABLE enrollment.student_enrollment
    ADD CONSTRAINT fk_student_enrollment_enrollment_application_id FOREIGN KEY (enrollment_id) REFERENCES enrollment.enrollment_application(application_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.student_enrollment
    ADD CONSTRAINT fk_student_enrollment_grade_section_id FOREIGN KEY (grade_section_id) REFERENCES enrollment.grade_section(grade_section_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.student_enrollment
    ADD CONSTRAINT fk_student_enrollment_approver_id FOREIGN KEY (approver_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- grade_section_program
ALTER TABLE enrollment.grade_section_program
    ADD CONSTRAINT fk_grade_section_program_grade_level_offered_id FOREIGN KEY (grade_level_offered_id) REFERENCES enrollment.grade_level_offered(grade_level_offered_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.grade_section_program
    ADD CONSTRAINT fk_grade_section_program_id FOREIGN KEY (program_id) REFERENCES system.academic_program(program_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_requirement
ALTER TABLE enrollment.enrollment_requirement
    ADD CONSTRAINT fk_enrollment_requirement_grade_section_program_id FOREIGN KEY (grade_section_program_id) REFERENCES enrollment.grade_section_program(grade_section_program_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- banner
ALTER TABLE enrollment.banner
    ADD CONSTRAINT fk_banner_school_id FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- grade_level_offered
ALTER TABLE enrollment.grade_level_offered
    ADD CONSTRAINT fk_grade_level_offered_school_id FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.grade_level_offered
    ADD CONSTRAINT fk_grade_level_offered_grade_level_code FOREIGN KEY (grade_level_code) REFERENCES system.grade_level(grade_level_code) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_schedule
ALTER TABLE enrollment.enrollment_schedule
    ADD CONSTRAINT fk_enrollment_schedule_grade_level_offered_id FOREIGN KEY (grade_level_offered_id) REFERENCES enrollment.grade_level_offered(grade_level_offered_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- grade_section
ALTER TABLE enrollment.grade_section
    ADD CONSTRAINT fk_grade_section_grade_section_program_id FOREIGN KEY (grade_section_program_id) REFERENCES enrollment.grade_section_program(grade_section_program_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_fee
ALTER TABLE enrollment.enrollment_fee
    ADD CONSTRAINT fk_enrollment_fee_grade_section_program_id FOREIGN KEY (grade_section_program_id) REFERENCES enrollment.grade_section_program(grade_section_program_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- school_subscription
ALTER TABLE enrollment.school_subscription
    ADD CONSTRAINT fk_school_subscription_school_id FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.school_subscription
    ADD CONSTRAINT fk_school_subscription_plan_code FOREIGN KEY (plan_code) REFERENCES system.subscription_plan(plan_code) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_fee_payment
ALTER TABLE enrollment.enrollment_fee_payment
    ADD CONSTRAINT fk_enrollment_fee_payment_student_id FOREIGN KEY (student_id) REFERENCES enrollment.student(student_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.enrollment_fee_payment
    ADD CONSTRAINT fk_enrollment_fee_payment_payment_option_id FOREIGN KEY (payment_option_id) REFERENCES enrollment.school_payment_option(payment_option_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE enrollment.enrollment_fee_payment
    ADD CONSTRAINT fk_enrollment_fee_payment_file_id FOREIGN KEY (file_id) REFERENCES enrollment.file(file_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- payment_option
ALTER TABLE enrollment.school_payment_option
    ADD CONSTRAINT fk_school_payment_option_school_id FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- aux_schedule_slot
ALTER TABLE enrollment.aux_schedule_slot
    ADD CONSTRAINT fk_aux_schedule_slot_schedule_id FOREIGN KEY (schedule_id) REFERENCES enrollment.enrollment_schedule(schedule_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- file
ALTER TABLE enrollment.file
    ADD CONSTRAINT fk_file_school_id FOREIGN KEY(school_id)
    REFERENCES enrollment.school(school_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_fee_payment

ALTER TABLE enrollment.enrollment_fee_payment
    ADD CONSTRAINT fk_enrollment_fee_payment_option_id FOREIGN KEY(payment_option_id)
    REFERENCES enrollment.school_payment_option(payment_option_id) ON UPDATE CASCADE ON DELETE RESTRICT;


ALTER TABLE enrollment.aux_schedule_slot
    ADD CONSTRAINT fk_aux_schedule_slot_grade_level_offered_id FOREIGN KEY(grade_level_offered_id)
    REFERENCES enrollment.grade_level_offered(grade_level_offered_id) ON UPDATE CASCADE ON DELETE RESTRICT;


ALTER TABLE enrollment.enrollment_application
ADD CONSTRAINT fk_enrollment_application_grade_section_id 
FOREIGN KEY(grade_section_id) REFERENCES enrollment.grade_section(grade_section_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE enrollment.address
ADD CONSTRAINT fk_address_street_connection
FOREIGN KEY (street_id)
REFERENCES system.street(street_id);

ALTER TABLE enrollment.grade_section_program
ADD CONSTRAINT fk_address_program_connection
FOREIGN KEY (program_id)
REFERENCES system.academic_program(program_id);

ALTER TABLE enrollment.student
ADD CONSTRAINT fk_student_enroller_connection
FOREIGN KEY (enroller_id)
REFERENCES enrollment.user(user_id);