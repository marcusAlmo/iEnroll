ALTER TYPE enrollment.access_type_access_list ADD VALUE 'restrict';

COMMIT;

DO $$
BEGIN
    UPDATE enrollment.access_list
    SET dashboard_access = 'restrict'
    WHERE role in ('student', 'parent');

    UPDATE enrollment.access_list
    SET enrollment_review_access = 'restrict'
    WHERE role in ('student', 'parent', 'admin');

    UPDATE enrollment.access_list
    SET enrollment_management_access = 'restrict'
    WHERE role in ('student', 'parent');

    UPDATE enrollment.access_list
    SET personnel_center_access = 'restrict'
    WHERE role in ('student', 'parent', 'registrar');

    UPDATE enrollment.access_list
    SET system_settings_access = 'restrict'
    WHERE role in ('student', 'parent', 'registrar');

END $$;