-- invoice table indexes
CREATE INDEX idx_invoice_seller_name ON record.invoice(seller_name);
CREATE INDEX idx_invoice_payer_name ON record.invoice(payer_name);

-- school_acad_year table indexes
CREATE INDEX idx_school_acad_year_school_id ON record.school_acad_year(school_id);
CREATE INDEX idx_school_acad_year_academic_year ON record.school_acad_year(academic_year);
CREATE INDEX idx_school_acad_year_school_name ON record.school_acad_year(school_name);

-- student_list table indexes
CREATE INDEX idx_student_list_school_acad_year_id ON record.student_list(grade_level);
CREATE INDEX idx_student_list_section ON record.student_list(section);
