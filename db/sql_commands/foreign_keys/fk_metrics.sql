-- consumption_data
ALTER TABLE metrics.consumption_data
    ADD CONSTRAINT fk_consumption_data_school_acad_year_id FOREIGN KEY (school_acad_year_id) REFERENCES record.school_acad_year(school_acad_year_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

-- enrollment_data
ALTER TABLE metrics.enrollment_data
    ADD CONSTRAINT fk_enrollment_data_school_acad_year_id FOREIGN KEY (school_acad_year_id) REFERENCES record.school_acad_year(school_acad_year_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

-- performance_data
ALTER TABLE metrics.performance_data
    ADD CONSTRAINT fk_performance_data_school_acad_year_id FOREIGN KEY (school_acad_year_id) REFERENCES record.school_acad_year(school_acad_year_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
