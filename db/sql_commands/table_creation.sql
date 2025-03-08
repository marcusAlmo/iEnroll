CREATE SCHEMA IF NOT EXISTS enrollment;

CREATE SCHEMA IF NOT EXISTS chat;

CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS metrics;


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
    role_id INT GENERATED ALWAYS AS IDENTITY,
    role VARCHAR(100) NOT NULL,
    description VARCHAR(255),  
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_role PRIMARY KEY (role_id),
    constraint uq_role UNIQUE (role)
);

-- role_permission
CREATE TABLE IF NOT EXISTS enrollment.role_permission (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    assignment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_role_permission PRIMARY KEY (role_id, permission_id),
    constraint fk_role FOREIGN KEY (role_id) REFERENCES enrollment.role(role_id)
);

-- gender_enum
CREATE TYPE IF NOT EXISTS enrollment.gender AS ENUM ('Male', 'Female', 'Other');

-- user
CREATE TABLE IF NOT EXISTS enrollment.user (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    f_name VARCHAR(100) NOT NULL,
    m_name VARCHAR(100),
    l_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(100),
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
    role_id INT NOT NULL,
    assigned_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assignment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_user_role PRIMARY KEY (user_id, role_id)
);

-- student
CREATE TABLE IF NOT EXISTS enrollment.student (
    student_id INT NOT NULL,
    school_id INT NOT NULL,
    birth_date DATE NOT NULL,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_student PRIMARY KEY (student_id)
);
