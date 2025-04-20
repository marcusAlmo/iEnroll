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
    requirement_type enrollment.requirement_type NOT NULL,
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

-- subscription_plan
CREATE TABLE IF NOT EXISTS system.subscription_plan (
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

-- academic_program
CREATE TABLE IF NOT EXISTS system.academic_program (
    program_id INT GENERATED ALWAYS AS IDENTITY,
    program VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_academic_program PRIMARY KEY (program_id),
    constraint uq_academic_program UNIQUE (program, description)
);


-- street
CREATE TABLE IF NOT EXISTS system.street (
    street_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    street VARCHAR(100) NOT NULL,
    district_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_street PRIMARY KEY(street_id),
    CONSTRAINT uq_street_district UNIQUE(street, district_id)
);

-- district
CREATE TABLE IF NOT EXISTS system.district (
    district_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_district PRIMARY KEY(district_id),
    CONSTRAINT uq_district_municipality UNIQUE(district, municipality_id)
);

-- municipality
CREATE TABLE IF NOT EXISTS system.municipality (
    municipality_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    province_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_municipality PRIMARY KEY(municipality_id),
    CONSTRAINT uq_municipality_province UNIQUE(municipality, province_id)
);

-- province 
CREATE TABLE IF NOT EXISTS system.province (
    province_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    province VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_province PRIMARY KEY(province_id),
    CONSTRAINT uq_province UNIQUE(province)
);