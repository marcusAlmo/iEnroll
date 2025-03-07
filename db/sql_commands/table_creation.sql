CREATE SCHEMA enrollment;

CREATE SCHEMA chat;

CREATE SCHEMA system;

CREATE SCHEMA metrics;


-- permission
CREATE TABLE permission (
    permission_id INT GENERATED ALWAYS AS IDENTITY,
    permission VARCHAR(100) NOT NULL,
    description VARCHAR(255),  
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_permission PRIMARY KEY (permission_id),
    constraint uq_permission UNIQUE (permission)
);

-- role
CREATE TABLE role (
    role_id INT GENERATED ALWAYS AS IDENTITY,
    role VARCHAR(100) NOT NULL,
    description VARCHAR(255),  
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_role PRIMARY KEY (role_id),
    constraint uq_role UNIQUE (role)
);

-- role_permission
CREATE TABLE role_permission (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    assignment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_role_permission PRIMARY KEY (role_id, permission_id),
    constraint fk_role FOREIGN KEY (role_id) REFERENCES role(role_id),
    constraint fk_permission FOREIGN KEY (permission_id) REFERENCES permission(permission_id)
);

