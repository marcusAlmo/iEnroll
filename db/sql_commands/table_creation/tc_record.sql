CREATE SCHEMA IF NOT EXISTS record;

-- student_list
CREATE TABLE IF NOT EXISTS record.student_list (
    school_acad_year_id INT NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    section VARCHAR(100) NOT NULL,
    adviser VARCHAR(100) NOT NULL,
    student_detail JSONB NOT NULL,      
    student_attachment JSONB NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_student_list PRIMARY KEY (school_acad_year_id),
    constraint uq_student_list UNIQUE (school_acad_year_id, grade_level, section, adviser)
);

-- section_list
CREATE TABLE IF NOT EXISTS record.section_list (
    school_acad_year_id INT NOT NULL,
    grade_section_detail JSONB NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_section_list PRIMARY KEY (school_acad_year_id)
);

-- enrollment_management
CREATE TABLE IF NOT EXISTS record.enrollment_management (
    school_acad_year_id INT NOT NULL,
    staff_list JSONB NOT NULL,
    schedule_list JSONB NOT NULL,
    log_list JSONB NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_enrollment PRIMARY KEY (school_acad_year_id),
    constraint uq_enrollment UNIQUE (school_acad_year_id)
);

-- school_acad_year
CREATE TABLE IF NOT EXISTS record.school_acad_year (
    school_acad_year_id INT NOT NULL,
    school_id INT NOT NULL,
    school_name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archive_datetime TIMESTAMP, --timestamp of the original record's archive

    constraint pk_school_acad_year PRIMARY KEY (school_acad_year_id),
    constraint uq_school_acad_year UNIQUE (school_id, academic_year)
);

-- invoice
CREATE TABLE IF NOT EXISTS record.invoice (
    invoice_id INT NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    payer_name VARCHAR(100) NOT NULL,
    payer_address VARCHAR(255) NOT NULL,
    payer_contact_number VARCHAR(11) NOT NULL,
    payer_email_address VARCHAR(100) NOT NULL,
    seller_name VARCHAR(100) NOT NULL,
    bir_accreditation_number VARCHAR(30) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    creation_date DATE NOT NULL,
    issue_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_invoice PRIMARY KEY (invoice_id),
    constraint ck_amount_paid CHECK (amount_paid >= 0)
);

-- invoice_plan
CREATE TABLE IF NOT EXISTS record.invoice_plan (
    plan_name VARCHAR(30) NOT NULL,
    invoice_id INT NOT NULL,
    quantity INT NOT NULL,
    amount_each DECIMAL(10, 2) NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_invoice_plan PRIMARY KEY (invoice_id, plan_name),
    constraint ck_amount_each CHECK (amount_each >= 0),
    constraint ck_quantity CHECK (quantity > 0)
);
