ALTER TABLE enrollment.enrollment_schedule 
ADD COLUMN can_choose_section BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE enrollment.enrollment_application
ADD COLUMN grade_section_id INT;

ALTER TABLE enrollment.enrollment_application
ADD CONSTRAINT fk_enrollment_application_grade_section_id 
FOREIGN KEY(grade_section_id) REFERENCES enrollment.grade_section(grade_section_id)
ON UPDATE CASCADE ON DELETE RESTRICT;