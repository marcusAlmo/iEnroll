CREATE SCHEMA IF NOT EXISTS record;

-- student_list
CREATE TABLE IF NOT EXISTS record.student_list (
    student_list_id INT NOT NULL,
    school_id INT NOT NULL,
    date DATE NOT NULL,
    grade_level VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    adviser VARCHAR(100) NOT NULL,
    student_detail JSONB NOT NULL,
    student_attachment JSONB NOT NULL,
    is_retrieved BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT FALSE,
    retrieval_datetime TIMESTAMP,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_student_list PRIMARY KEY (student_list_id),
    constraint ck_retrieval_datetime CHECK (retrieval_datetime <= creation_datetime),
    constraint ck_update_datetime_creation_datetime CHECK (update_datetime <= creation_datetime),
    constraint ck_update_datetime_retrieval_datetime CHECK (update_datetime <= retrieval_datetime),
    constraint uq_student_list UNIQUE (school_id, date, grade_level, section, adviser)
);

-- section_list
CREATE TABLE IF NOT EXISTS record.section_list (
    section_list_id INT NOT NULL,
    school_id INT NOT NULL,
    date DATE NOT NULL,
    grade_level_section_detail JSONB NOT NULL,
    is_retrieved BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT FALSE,
    retrieval_datetime TIMESTAMP,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_section_list PRIMARY KEY (section_list_id),
    constraint uq_section_list UNIQUE (school_id, date),
    constraint ck_retrieval_datetime CHECK (retrieval_datetime <= creation_datetime),
    constraint ck_update_datetime_creation_datetime CHECK (update_datetime <= creation_datetime),
    constraint ck_update_datetime_retrieval_datetime CHECK (update_datetime <= retrieval_datetime)
);

-- invoice
CREATE TABLE IF NOT EXISTS record.invoice (
    invoice_id INT NOT NULL,
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

    constraint pk_invoice PRIMARY KEY (invoice_id)
);

-- invoice_plan
CREATE TABLE IF NOT EXISTS record.invoice_plan (
    plan_id INT NOT NULL,
    invoice_id INT NOT NULL,
    quantity INT NOT NULL,
    amount_each DECIMAL(10, 2) NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_invoice_plan PRIMARY KEY (invoice_id, plan_id)
);
