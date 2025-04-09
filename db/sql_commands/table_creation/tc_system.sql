CREATE SCHEMA IF NOT EXISTS system;

-- academic_level
CREATE TABLE IF NOT EXISTS system.academic_level (
    academic_level_code CHAR(3) NOT NULL,
    academic_level VARCHAR(50) NOT NULL,
    is_supported BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_academic_level PRIMARY KEY (academic_level_code),
    constraint uq_academic_level UNIQUE (academic_level)
);

-- grade_level
CREATE TABLE IF NOT EXISTS system.grade_level (
    grade_level_code CHAR(3) NOT NULL,
    academic_level_code CHAR(3) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    is_supported BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_grade_level PRIMARY KEY (grade_level_code),
    constraint uq_grade_level UNIQUE (academic_level_code, grade_level)
);

-- system_setting
CREATE TABLE IF NOT EXISTS system.system_setting (
    setting_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    current_value VARCHAR(100) NOT NULL,
    default_value VARCHAR(100) NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_system_setting PRIMARY KEY (setting_id),
    constraint uq_system_setting UNIQUE (name)
);

-- system_log
CREATE TABLE IF NOT EXISTS system.system_log (
    system_log_id INT GENERATED ALWAYS AS IDENTITY,
    initiator VARCHAR(100) NOT NULL,
    system_action VARCHAR(100) NOT NULL,
    details JSONB,
    log_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_system_log PRIMARY KEY (system_log_id)
);

-- common_enrollment_requirement
CREATE TABLE IF NOT EXISTS system.common_enrollment_requirement (
    requirement_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    type enrollment.requirement_type NOT NULL,
    accepted_data_type enrollment.accepted_data_type NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    description VARCHAR(255),
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_common_enrollment_requirement PRIMARY KEY (requirement_id),
    constraint uq_common_enrollment_requirement UNIQUE (name)
);

-- requirement_group
CREATE TABLE IF NOT EXISTS system.requirement_group (
    group_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_requirement_group PRIMARY KEY (group_id),
    constraint uq_requirement_group UNIQUE (name)
);

-- enrollment_group_requirement
CREATE TABLE IF NOT EXISTS system.enrollment_group_requirement (
    group_id INT NOT NULL,
    requirement_id INT NOT NULL,

    constraint pk_enrollment_group_requirement PRIMARY KEY (group_id, requirement_id)
);

-- plan
CREATE TABLE IF NOT EXISTS system.plan (
    plan_code CHAR(3) NOT NULL,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(255) NOT NULL,
    duration_days INT NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    max_student_count INT NOT NULL,
    max_admin_count INT NOT NULL,
    max_form_field_count INT NOT NULL,
    max_image_upload_count INT NOT NULL,
    is_most_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_plan PRIMARY KEY (plan_code),
    constraint uq_plan UNIQUE (name), 
    constraint ck_discount_percent CHECK (discount_percent BETWEEN 0 AND 100),
    constraint ck_duration_days CHECK (duration_days > 0),
    constraint ck_max_student_count CHECK (max_student_count > 0),
    constraint ck_max_admin_count CHECK (max_admin_count > 0),
    constraint ck_max_form_field_count CHECK (max_form_field_count > 0),
    constraint ck_max_image_upload_count CHECK (max_image_upload_count > 0),
    constraint ck_original_price CHECK (original_price >= 0),
    constraint ck_discounted_price CHECK (discounted_price >= 0),
    constraint ck_discounted_price_less_than_original_price CHECK (discounted_price <= original_price)
);

-- about_uppend
CREATE TABLE IF NOT EXISTS system.about_uppend (
    email_address VARCHAR(100) NOT NULL PRIMARY KEY,
    contact_number CHAR(11) NOT NULL,
    website_url VARCHAR(255) NOT NULL,  
    bir_accreditation_number VARCHAR(30) NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

