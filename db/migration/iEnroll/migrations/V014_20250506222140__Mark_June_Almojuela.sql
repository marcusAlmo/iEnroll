ALTER TABLE enrollment.enrollment_application
DROP COLUMN grade_level_offered_id;

ALTER TABLE enrollment.enrollment_application
ADD COLUMN grade_section_program_id INT NOT NULL DEFAULT 2;

-- ALTER TABLE enrollment.enrollment_application
-- ADD COLUMN grade_section_id INT;

ALTER TABLE enrollment.enrollment_application
ADD CONSTRAINT fk_enrollment_application_grade_section_program_id 
FOREIGN KEY(grade_section_program_id) REFERENCES enrollment.grade_section_program(grade_section_program_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- ALTER TABLE enrollment.enrollment_application
-- ADD CONSTRAINT fk_enrollment_application_grade_section_id
-- FOREIGN KEY(grade_section_id) REFERENCES enrollment.grade_section(grade_section_id)
-- ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE enrollment.enrollment_application
ALTER COLUMN grade_section_program_id DROP DEFAULT;