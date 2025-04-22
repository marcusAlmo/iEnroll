-- invoice_plan
ALTER TABLE record.invoice_plan
    ADD CONSTRAINT fk_invoice_plan_invoice_id FOREIGN KEY (invoice_id) REFERENCES record.invoice(invoice_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

-- student_list
ALTER TABLE record.student_list
    ADD CONSTRAINT fk_student_list_school_acad_year_id FOREIGN KEY (school_acad_year_id) REFERENCES record.school_acad_year(school_acad_year_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

-- section_list
ALTER TABLE record.section_list
    ADD CONSTRAINT fk_section_list_school_acad_year_id FOREIGN KEY (school_acad_year_id) REFERENCES record.school_acad_year(school_acad_year_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

-- enrollment_management
ALTER TABLE record.enrollment_management
    ADD CONSTRAINT fk_enrollment_management_school_acad_year_id FOREIGN KEY (school_acad_year_id) REFERENCES record.school_acad_year(school_acad_year_id) ON UPDATE RESTRICT ON DELETE RESTRICT;