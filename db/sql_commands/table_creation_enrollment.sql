CREATE SCHEMA IF NOT EXISTS enrollment;


-- permission
CREATE TABLE IF NOT EXISTS enrollment.permission (
    permission_id INT GENERATED ALWAYS AS IDENTITY,
    permission VARCHAR(100) NOT NULL,
    description VARCHAR(255),  
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_permission PRIMARY KEY (permission_id),
    constraint uq_permission UNIQUE (permission)
);

-- role
CREATE TABLE IF NOT EXISTS enrollment.role (
    role_code CHAR(3) NOT NULL,
    role VARCHAR(100) NOT NULL,
    description VARCHAR(255),  
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_role PRIMARY KEY (role_code),
    constraint uq_role UNIQUE (role)
);

-- role_permission
CREATE TABLE IF NOT EXISTS enrollment.role_permission (
    role_code CHAR(3) NOT NULL,
    permission_id INT NOT NULL,
    assignment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_role_permission PRIMARY KEY (role_code, permission_id)
);

-- gender_enum
CREATE TYPE IF NOT EXISTS enrollment.gender AS ENUM ('Male', 'Female', 'Other');

-- user
CREATE TABLE IF NOT EXISTS enrollment.user (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    f_name VARCHAR(100) NOT NULL,
    m_name VARCHAR(100),
    l_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(15),
    gender enrollment.gender NOT NULL,
    email_address VARCHAR(100),
    contact_number CHAR(11) NOT NULL,
    username VARCHAR(100) NOT NULL,
    pass_hash VARCHAR(255) NOT NULL,
    school_id INT NOT NULL,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_user PRIMARY KEY (user_id),
    constraint uq_username UNIQUE (username),
    constraint uq_pass_hash UNIQUE (pass_hash),
    constraint uq_name UNIQUE (f_name, m_name, l_name, suffix)
);

-- user_log
CREATE TABLE IF NOT EXISTS enrollment.user_log (
    user_log_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    log_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_user_log PRIMARY KEY (user_log_id)
);

-- user_role
CREATE TABLE IF NOT EXISTS enrollment.user_role (
    user_id INT NOT NULL,
    role_code CHAR(3) NOT NULL,
    assigned_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assignment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_user_role PRIMARY KEY (user_id, role_code)
);

-- student
CREATE TABLE IF NOT EXISTS enrollment.student (
    student_id INT NOT NULL,
    school_id INT NOT NULL,
    birthdate DATE NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_student PRIMARY KEY (student_id)
);

-- school_file
CREATE TYPE enrollment.access_type AS ENUM ('public', 'limited', 'restricted');
CREATE TABLE IF NOT EXISTS enrollment.school_file (
    school_file_id INT GENERATED ALWAYS AS IDENTITY,
    school_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    access_type enrollment.access_type NOT NULL,
    upload_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_school_file PRIMARY KEY (school_file_id)
);

-- school_file_access
CREATE TABLE IF NOT EXISTS enrollment.school_file_access (
    school_file_access_id INT GENERATED ALWAYS AS IDENTITY,
    school_file_id INT NOT NULL,
    student_id INT NOT NULL,
    access_datetime TIMESTAMP,
    issue_datetime TIMESTAMP NOT NULL,
    termination_datetime TIMESTAMP NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_school_file_access PRIMARY KEY (school_file_access_id)
);

-- address 
CREATE TABLE IF NOT EXISTS enrollment.address (
    address_id INT GENERATED ALWAYS AS IDENTITY,
    address_line_1 VARCHAR(255),
    street VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_address PRIMARY KEY (address_id)
);

-- enrollment_application
CREATE TYPE enrollment.application_status AS ENUM ('pending', 'accepted', 'denied', 'invalid');
CREATE TABLE IF NOT EXISTS enrollment.enrollment_application (
    enrollment_application_id INT NOT NULL, 
    grade_level_offered_id INT NOT NULL,
    application_status enrollment.application_status NOT NULL,
    application_remarks TEXT,
    application_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_enrollment_application PRIMARY KEY (enrollment_application_id)
);

-- application_attachment
CREATE TYPE enrollment.attachment_type AS ENUM ('document', 'image', 'text');
CREATE TYPE enrollment.attachment_status AS ENUM ('pending', 'accepted', 'invalid');
CREATE TABLE IF NOT EXISTS enrollment.application_attachment (
    enrollment_requirement_id INT NOT NULL,
    enrollment_application_id INT NOT NULL,
    attachment VARCHAR(255) NOT NULL,
    attachment_type enrollment.attachment_type NOT NULL,
    attachment_status enrollment.attachment_status NOT NULL,
    reviewer_id INT NOT NULL,
    review_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upload_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_application_attachment PRIMARY KEY (enrollment_requirement_id, enrollment_application_id)
);

-- student_enrollment
CREATE TABLE IF NOT EXISTS enrollment.student_enrollment (
    student_enrollment_id INT NOT NULL,
    section_id INT NOT NULL,
    approver_id INT NOT NULL,
    enrollment_remarks TEXT,
    enrollment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_student_enrollment PRIMARY KEY (student_enrollment_id)
);

-- school
CREATE TYPE enrollment.school_type AS ENUM ('public', 'private', 'other');
CREATE TABLE IF NOT EXISTS enrollment.school (
    school_id INT NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    school_type enrollment.school_type NOT NULL,
    email_address VARCHAR(100) NOT NULL,
    contact_number VARCHAR(11) NOT NULL,
    website_url VARCHAR(255),
    address_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    enrollment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_school PRIMARY KEY (school_id)
); 

-- banner
CREATE TABLE IF NOT EXISTS enrollment.banner (
    school_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_banner PRIMARY KEY (school_id)
);

-- grade_level_offered
CREATE TABLE IF NOT EXISTS enrollment.grade_level_offered (
    grade_level_offered_id INT NOT NULL,
    school_id INT NOT NULL,
    grade_level_id INT NOT NULL,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_grade_level_offered PRIMARY KEY (grade_level_offered_id),
    constraint uq_grade_level_offered UNIQUE (school_id, grade_level_id)
);

-- enrollment_schedule
CREATE TABLE IF NOT EXISTS enrollment.enrollment_schedule (
    enrollment_schedule_id INT NOT NULL,
    grade_level_offered_id INT NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_enrollment_schedule PRIMARY KEY (enrollment_schedule_id)
);

-- grade_level_section_type
CREATE TYPE enrollment.section_type AS ENUM ('regular', 'special');
CREATE TABLE IF NOT EXISTS enrollment.grade_level_section_type (
    grade_level_section_type_id INT NOT NULL,
    grade_level_offered_id INT NOT NULL,
    section_type enrollment.section_type NOT NULL,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_grade_level_section_type PRIMARY KEY (grade_level_section_type_id),
    constraint uq_grade_level_section_type UNIQUE (grade_level_offered_id, section_type)
);

-- grade_level_section
CREATE TABLE IF NOT EXISTS enrollment.grade_level_section (
    grade_level_section_id INT NOT NULL,
    grade_level_section_type_id INT NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    adviser VARCHAR(100) NOT NULL,
    slot INT NOT NULL,
    max_application_slot INT NOT NULL,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_grade_level_section PRIMARY KEY (grade_level_section_id),
    constraint uq_grade_level_section UNIQUE (grade_level_section_type_id, section_name),
    constraint ck_grade_level_section CHECK (slot > 0 AND max_application_slot > 0),
    constraint ck_max_application_slot CHECK (max_application_slot >= slot)
);

-- enrollment_requirement
CREATE TYPE enrollment.requirement_type AS ENUM ('document', 'image', 'text');
CREATE TYPE enrollment.accepted_data_type AS ENUM ('string', 'number', 'date', 'image', 'document');
CREATE TABLE IF NOT EXISTS enrollment.enrollment_requirement (
    enrollment_requirement_id INT NOT NULL,
    grade_level_section_type_id INT NOT NULL,
    requirement_name VARCHAR(50) NOT NULL,
    requirement_type enrollment.requirement_type NOT NULL,
    accepted_data_type enrollment.accepted_data_type NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_enrollment_requirement PRIMARY KEY (enrollment_requirement_id),
    constraint uq_enrollment_requirement UNIQUE (grade_level_section_type_id, requirement_name)
);

-- enrollment_fee
CREATE TABLE IF NOT EXISTS enrollment.enrollment_fee (
    enrollment_fee_id INT NOT NULL,
    grade_level_section_type_id INT NOT NULL,
    fee_name VARCHAR(100) NOT NULL,
    fee_amount DECIMAL(10, 2) NOT NULL,
    fee_description VARCHAR(100) ,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_enrollment_fee PRIMARY KEY (enrollment_fee_id),
    constraint uq_enrollment_fee UNIQUE (grade_level_section_type_id, fee_name),
    constraint ck_enrollment_fee CHECK (fee_amount > 0)
);

-- school_subscription
CREATE TABLE IF NOT EXISTS enrollment.school_subscription (
    school_subscription_id INT NOT NULL,
    plan_id INT NOT NULL,
    school_id INT NOT NULL,
    subscription_start_datetime TIMESTAMP NOT NULL,
    subscription_end_datetime TIMESTAMP NOT NULL,
    invoice_number BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_school_subscription PRIMARY KEY (school_subscription_id),
    constraint ck_school_subscription CHECK (subscription_start_datetime < subscription_end_datetime)
);


