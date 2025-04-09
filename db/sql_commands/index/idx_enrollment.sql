-- user table indexes
CREATE INDEX idx_user_school_id ON enrollment.user(school_id);

-- user_log table indexes
CREATE INDEX idx_user_log_user_id ON enrollment.user_log(user_id);

-- user_role table indexes
CREATE INDEX idx_user_role_assigned_by ON enrollment.user_role(assigned_by);

-- school_file table indexes
CREATE INDEX idx_school_file_school_id ON enrollment.school_file(school_id);

-- school_file_access table indexes
CREATE INDEX idx_school_file_access_file_id ON enrollment.school_file_access(file_id);
CREATE INDEX idx_school_file_access_student_id ON enrollment.school_file_access(student_id);
CREATE INDEX idx_school_file_access_issuer_id ON enrollment.school_file_access(issuer_id);

-- student table indexes
CREATE INDEX idx_student_address_id ON enrollment.student(address_id);
CREATE INDEX idx_student_enroller_id ON enrollment.student(enroller_id);

-- enrollment_application table indexes
CREATE INDEX idx_enrollment_application_grade_level_offered_id ON enrollment.enrollment_application(grade_level_offered_id);
CREATE INDEX idx_enrollment_application_status ON enrollment.enrollment_application(status);

-- student_enrollment table indexes
CREATE INDEX idx_student_enrollment_grade_section_id ON enrollment.student_enrollment(grade_section_id);
CREATE INDEX idx_student_enrollment_approver_id ON enrollment.student_enrollment(approver_id);

-- school table indexes
CREATE INDEX idx_school_address_id ON enrollment.school(address_id);

-- grade_level_offered table indexes
CREATE INDEX idx_grade_level_offered_school_id ON enrollment.grade_level_offered(school_id);
CREATE INDEX idx_grade_level_offered_grade_level_code ON enrollment.grade_level_offered(grade_level_code);

-- enrollment_schedule table indexes
CREATE INDEX idx_enrollment_schedule_grade_level_offered_id ON enrollment.enrollment_schedule(grade_level_offered_id);

-- grade_section_type table indexes
CREATE INDEX idx_grade_section_type_grade_level_offered_id ON enrollment.grade_section_type(grade_level_offered_id);
CREATE INDEX idx_grade_section_type_section_type ON enrollment.grade_section_type(section_type);

-- grade_section table indexes
CREATE INDEX idx_grade_section_grade_section_type_id ON enrollment.grade_section(grade_section_type_id);

-- enrollment_requirement table indexes
CREATE INDEX idx_enrollment_requirement_grade_section_type_id ON enrollment.enrollment_requirement(grade_section_type_id);

-- enrollment_fee table indexes
CREATE INDEX idx_enrollment_fee_grade_section_type_id ON enrollment.enrollment_fee(grade_section_type_id);

-- school_subscription table indexes
CREATE INDEX idx_school_subscription_school_id ON enrollment.school_subscription(school_id);
CREATE INDEX idx_school_subscription_plan_code ON enrollment.school_subscription(plan_code);