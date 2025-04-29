CREATE TYPE IF NOT EXISTS access_type AS ENUM ('read', 'modify');

CREATE TABLE IF NOT EXISTS enrollment.access_list (
    user_id INT NOT NULL,
    dashboard_access access_type NOT NULL DEFAULT 'read',
    enrollment_review_access access_type NOT NULL DEFAULT 'read',
    enrollment_management_access access_type NOT NULL DEFAULT 'read',
    personnel_center_access access_type NOT NULL DEFAULT 'read',
    system_settings_access access_type NOT NULL DEFAULT 'read',
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_access_list PRIMARY KEY (user_id)
);  

DO $$
BEGIN
    -- Bulk insert for different roles with their respective access levels
    INSERT INTO enrollment.access_list (
        user_id, 
        role_code, 
        dashboard_access, 
        enrollment_review_access, 
        enrollment_management_access, 
        personnel_center_access, 
        system_settings_access
    )
    SELECT 
        user_id,
        CASE role_code
            WHEN 'ADM' THEN 'admin'
            WHEN 'REG' THEN 'registrar'
            WHEN 'STU' THEN 'student'
            WHEN 'PAR' THEN 'parent'
        END AS role_code,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            ELSE 'read'
        END AS dashboard_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            WHEN 'REG' THEN 'modify'
            ELSE 'read'
        END AS enrollment_review_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            WHEN 'REG' THEN 'modify'
            ELSE 'read'
        END AS enrollment_management_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            WHEN 'REG' THEN 'modify'
            ELSE 'read'
        END AS personnel_center_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            ELSE 'read'
        END AS system_settings_access
    FROM enrollment.user
    WHERE role_code IN ('ADM', 'REG', 'STU', 'PAR')
    ON CONFLICT (user_id) DO NOTHING;
END $$;

DROP TABLE enrollment.role_permission;
DROP TABLE enrollment.permission;
DROP TABLE enrollment.user_role;
DROP TABLE enrollment.role;