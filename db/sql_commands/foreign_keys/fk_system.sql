-- grade_level
ALTER TABLE system.grade_level
    ADD CONSTRAINT fk_grade_level_academic_level_code FOREIGN KEY (academic_level_code) REFERENCES system.academic_level(academic_level_code) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_group_requirement
ALTER TABLE system.enrollment_group_requirement
    ADD CONSTRAINT fk_enrollment_group_requirement_enrollment_group_id FOREIGN KEY (group_id) REFERENCES system.requirement_group(group_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE system.enrollment_group_requirement
    ADD CONSTRAINT fk_enrollment_group_requirement_requirement_id FOREIGN KEY (requirement_id) REFERENCES system.requirement(requirement_id) ON UPDATE CASCADE ON DELETE CASCADE;
