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
