CREATE TYPE enrollment.access_type_access_list AS ENUM ('read', 'modify');
CREATE TYPE enrollment.role_type AS ENUM ('admin', 'registrar', 'student', 'parent');

CREATE TABLE IF NOT EXISTS enrollment.access_list (
    user_id INT NOT NULL,
    role enrollment.role_type NOT NULL,
    dashboard_access enrollment.access_type_access_list NOT NULL DEFAULT 'read',
    enrollment_review_access enrollment.access_type_access_list NOT NULL DEFAULT 'read',
    enrollment_management_access enrollment.access_type_access_list NOT NULL DEFAULT 'read',
    personnel_center_access enrollment.access_type_access_list NOT NULL DEFAULT 'read',
    system_settings_access enrollment.access_type_access_list NOT NULL DEFAULT 'read',
    update_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_access_list PRIMARY KEY (user_id)
);  

DO $$
BEGIN
    -- Bulk insert for different roles with their respective access levels
    INSERT INTO enrollment.access_list (
        user_id, 
        role, 
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
        END::enrollment.role_type AS role,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            ELSE 'read'
        END::enrollment.access_type_access_list AS dashboard_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            WHEN 'REG' THEN 'modify'
            ELSE 'read'
        END::enrollment.access_type_access_list AS enrollment_review_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            WHEN 'REG' THEN 'modify'
            ELSE 'read'
        END::enrollment.access_type_access_list AS enrollment_management_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            WHEN 'REG' THEN 'modify'
            ELSE 'read'
        END::enrollment.access_type_access_list AS personnel_center_access,
        CASE role_code
            WHEN 'ADM' THEN 'modify'
            ELSE 'read'
        END::enrollment.access_type_access_list AS system_settings_access
    FROM enrollment.user_role
    WHERE role_code IN ('ADM', 'REG', 'STU', 'PAR')
    ON CONFLICT (user_id) DO NOTHING;
END $$;

DROP TABLE enrollment.role_permission;
DROP TABLE enrollment.permission;
DROP TABLE enrollment.user_role;
DROP TABLE enrollment.role;