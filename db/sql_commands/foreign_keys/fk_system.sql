-- grade_level
ALTER TABLE system.grade_level
    ADD CONSTRAINT fk_grade_level_academic_level_code FOREIGN KEY (academic_level_code) REFERENCES system.academic_level(academic_level_code) ON UPDATE CASCADE ON DELETE RESTRICT;

-- enrollment_group_requirement
ALTER TABLE system.enrollment_group_requirement
    ADD CONSTRAINT fk_enrollment_group_requirement_enrollment_group_id FOREIGN KEY (group_id) REFERENCES system.requirement_group(group_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE system.enrollment_group_requirement
    ADD CONSTRAINT fk_enrollment_group_requirement_requirement_id FOREIGN KEY (requirement_id) REFERENCES system.common_enrollment_requirement(requirement_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- street
ALTER TABLE system.street
    ADD CONSTRAINT fk_street_district_id FOREIGN KEY (district_id) REFERENCES system.district(district_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- district
ALTER TABLE system.district
    ADD CONSTRAINT fk_district_municipality_id FOREIGN KEY (municipality_id) REFERENCES system.municipality(municipality_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- municipality
ALTER TABLE system.municipality
    ADD CONSTRAINT fk_municipality_province_id FOREIGN KEY (province_id) REFERENCES system.province(province_id) ON UPDATE CASCADE ON DELETE RESTRICT;
