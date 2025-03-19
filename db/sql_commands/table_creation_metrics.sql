CREATE SCHEMA IF NOT EXISTS metrics;

-- consumption_data
CREATE TABLE IF NOT EXISTS metrics.consumption_data (
    consumption_data_id INT NOT NULL,
    school_id INT NOT NULL,
    school_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    slot_used INT NOT NULL,
    upload_count INT NOT NULL,
    download_count INT NOT NULL,
    generation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_consumption_data PRIMARY KEY (consumption_data_id),
    constraint uq_consumption_data UNIQUE (school_id, date)
);

-- enrollment_data
CREATE TABLE IF NOT EXISTS metrics.enrollment_data (
    enrollment_data_id INT NOT NULL,
    school_id INT NOT NULL,
    school_name VARCHAR(100) NOT NULL,
    academic_level VARCHAR(50) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    application_count INT NOT NULL,
    accepted_application_count INT NOT NULL,
    denied_application_count INT NOT NULL,
    invalid_application_count INT NOT NULL,
    generation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_enrollment_data PRIMARY KEY (enrollment_data_id),
    constraint uq_enrollment_data UNIQUE (school_id, date),
    constraint ck_enrollment_data CHECK (application_count >= 0 AND accepted_application_count >= 0 AND denied_application_count >= 0 AND invalid_application_count >= 0)
);

-- performance_data
CREATE TABLE IF NOT EXISTS metrics.performance_data (
    performance_data_id INT NOT NULL,
    school_id INT NOT NULL,
    school_name VARCHAR(100) NOT NULL,
    academic_level VARCHAR(50) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    login_count INT NOT NULL,
    account_creation_count INT NOT NULL,
    application_received_count INT NOT NULL,
    reviewed_application_count INT NOT NULL,
    declined_application_count INT NOT NULL,
    invalid_application_count INT NOT NULL,
    generation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_performance_data PRIMARY KEY (performance_data_id),
    constraint uq_performance_data UNIQUE (school_id, date)
);

