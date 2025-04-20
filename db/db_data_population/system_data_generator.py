"""
System Data Generator Module

This module provides functionality to generate initial system data for the iEnroll system.
It includes functions to set up academic levels, grade levels, system settings, enrollment
requirements, requirement groups, subscription plans, and company information.

The module ensures that all system-level data is properly initialized and maintains
referential integrity across related tables.
"""

from address_generator import generate_address
from user_generator import encrypt_password

def generate_system_initial_setup(cursor):
    """
    Main function to set up all initial system data.
    This function coordinates the generation of all system-level data in the correct order.
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    try:
        cursor.execute("BEGIN")
        
        generate_address(cursor)
        generate_academic_levels(cursor)
        generate_grade_levels(cursor)
        generate_system_settings(cursor)
        generate_common_enrollment_requirements(cursor)
        requirement_group_generator(cursor)
        requirement_group_mapping_generator(cursor)
        generate_plan(cursor)
        about_uppend(cursor)
        generate_role(cursor)
        generate_permission(cursor)
        generate_role_permission_mapping(cursor)
        generate_system_user(cursor)
        
        cursor.execute("COMMIT")
        print("System initial setup completed.")
        
    except Exception as e:
        cursor.execute("ROLLBACK")
        print(f"Error in system initial setup: {e}")


def generate_role(cursor):
    """
    Generates role data for the system.
    Creates roles for:
    - Administrator
    - Student
    - Parent
    - Registrar
    """
    roles = [
        ('ADM', 'administrator', 'Administrator'),
        ('STU', 'student', 'Student'),
        ('PAR', 'parent', 'Parent'),
        ('REG', 'registrar', 'Registrar')
    ]

    try:
        insert_query = """
        INSERT INTO enrollment.role (role_code, name, description)
        VALUES (%s, %s, %s)
        ON CONFLICT (role_code) DO NOTHING;
        """
        cursor.executemany(insert_query, roles)
        cursor.connection.commit()
        print("Successfully inserted roles")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error inserting roles: {e}")


def generate_permission(cursor):
    """
    Generates permission data for the system.
    Creates permissions name and description
    """

    # List of permissions with their descriptions as tuples
    permissions = [
        ('dashboard', 'Allows access to the main dashboard of the application'),
        ('subscription', 'Grants permission to manage subscriptions'),
        ('school_details', 'Provides access to view and edit school details'),
        ('enrollment_details', 'Allows users to manage enrollment details'),
        ('payment_details', 'Grants access to payment-related information and actions'),
        ('settings', 'Provides permission to change system settings'),
        ('system_logs', 'Allows access to system logs for monitoring and auditing'),
        ('chat', 'Grants permission to use the chat feature within the application'),
        ('notification', 'Provides access to notifications for user updates and alerts'),
        ('report', 'Allows users to generate and view reports'),
        ('enrollment_review', 'Grants permission to review enrollment applications and statuses'),
        ('student_details', 'Provides access to view and edit student details'), 
        ('enrollment_application', 'Grants permission to apply for enrollment')
    ]

    try:
        insert_query = """
        INSERT INTO enrollment.permission (name, description)
        VALUES (%s, %s)
        ON CONFLICT (name) DO NOTHING;
        """
        cursor.executemany(insert_query, permissions)   
        cursor.connection.commit()
        print("Successfully inserted permissions")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error inserting permissions: {e}")


def generate_role_permission_mapping(cursor):
    """
    Generates role permission mappings for the system.
    Creates associations between roles and permissions.
    """
    cursor.execute("SELECT permission_id, name FROM enrollment.permission")
    permission_ids = cursor.fetchall()
    # List of role permission mappings as tuples
    role_permissions = [
        ('ADM', 'dashboard'),
        ('ADM', 'subscription'),
        ('ADM', 'school_details'),
        ('ADM', 'enrollment_details'),
        ('ADM', 'payment_details'),
        ('ADM', 'settings'),    
        ('ADM', 'system_logs'),
        ('ADM', 'chat'),
        ('ADM', 'notification'),
        ('ADM', 'report'),
        ('ADM', 'enrollment_review'),
        
        ('PAR', 'student_details'),
        ('PAR', 'enrollment_application'),

        ('REG', 'enrollment_details'),
        ('REG', 'payment_details'),
        ('REG', 'settings'),
        ('REG', 'system_logs'),
        ('REG', 'chat'),
        ('REG', 'notification'),
        ('REG', 'report'),
        ('REG', 'enrollment_review'),

        ('STU', 'student_details'),
        ('STU', 'enrollment_application'),    
    ]

    mapped_permissions = []
    for role_code, permission_name in role_permissions:
        permission_id = next((id for id, name in permission_ids if name == permission_name), None)
        if permission_id:
            mapped_permissions.append((role_code, permission_id))

    try:
        insert_query = """
        INSERT INTO enrollment.role_permission (role_code, permission_id)
        VALUES (%s, %s)
        ON CONFLICT (role_code, permission_id) DO NOTHING;
        """
        cursor.executemany(insert_query, mapped_permissions)
        cursor.connection.commit()
        print("Successfully inserted role permissions")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error inserting role permissions: {e}")


def check_default_data(cursor):
    """
    Checks if the default system data already exists in the database.
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        bool: True if default data needs to be generated, False if it already exists
    """
    # Check if the system.grade_level table is empty
    cursor.execute("SELECT COUNT(*) FROM system.grade_level")
    if cursor.fetchone()[0] == 0:
        return True
    else:
        return False
    
    
    


def generate_grade_levels(cursor):
    """
    Generates initial grade level data for the system.
    Creates grade levels for:
    - Primary School (Grades 1-6)
    - Secondary School (Grades 7-12)
    - College (1st to 4th Year)
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    # Primary School Levels (Grades 1-6)
    primary_levels = [
        ('G01', 'Grade 1', 'ELE'),
        ('G02', 'Grade 2', 'ELE'),
        ('G03', 'Grade 3', 'ELE'),
        ('G04', 'Grade 4', 'ELE'),
        ('G05', 'Grade 5', 'ELE'),
        ('G06', 'Grade 6', 'ELE')
    ]

    # Secondary School Levels (Grades 7-12)
    secondary_levels = [
        ('H07', 'Grade 7', 'JHS'),
        ('H08', 'Grade 8', 'JHS'),
        ('H09', 'Grade 9', 'JHS'),
        ('H10', 'Grade 10', 'JHS'),
        ('H11', 'Grade 11', 'SHS'),
        ('H12', 'Grade 12', 'SHS')
    ]

    # College Levels (1st to 4th Year)
    college_levels = [
        ('C01', 'First Year College', 'TER'),
        ('C02', 'Second Year College', 'TER'),
        ('C03', 'Third Year College', 'TER'),
        ('C04', 'Fourth Year College', 'TER')
    ]

    # Combine all levels
    all_levels = primary_levels + secondary_levels + college_levels

    # SQL query to insert grade levels
    insert_query = """
    INSERT INTO system.grade_level (grade_level_code, grade_level, academic_level_code, is_supported) 
    VALUES (%s, %s, %s, %s) 
    ON CONFLICT (grade_level_code) DO NOTHING;
    """

    try:
        # Execute insertions
        for code, name, acad_level in all_levels:
            cursor.execute(insert_query, (code, name, acad_level, True))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted grade levels")

    except Exception as e:
        cursor.connection.rollback()
        print(f"Error inserting grade levels: {e}")

def generate_academic_levels(cursor):
    """
    Generates academic level data for the system.
    Creates levels for:
    - Kindergarten
    - Elementary
    - Junior High School
    - Senior High School
    - Tertiary
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    academic_levels = [
        ('KGT', 'Kindergarten'),
        ('ELE', 'Elementary'),
        ('JHS', 'Junior High School'),
        ('SHS', 'Senior High School'),
        ('TER', 'Tertiary')
    ]

    # SQL query to insert academic levels
    insert_query = """
    INSERT INTO system.academic_level (academic_level_code, academic_level, is_supported) 
    VALUES (%s, %s, true) 
    ON CONFLICT (academic_level_code) DO NOTHING;          
    """

    try:
        # Execute insertions
        for code, name in academic_levels:
            cursor.execute(insert_query, (code, name))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted academic levels")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error inserting academic levels: {e}")

def generate_system_settings(cursor):
    """
    Generates default system settings including:
    - Login attempts limit
    - Password expiry
    - Session timeout
    - Maintenance mode
    - File upload limits
    - Allowed file types
    - Enrollment status
    - Academic year
    - System email
    - Backup retention
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    # Default system settings
    system_settings = [
        ('MAX_LOGIN_ATTEMPTS', '3', '3'),
        ('PASSWORD_EXPIRY_DAYS', '90', '90'),
        ('SESSION_TIMEOUT_MINS', '30', '30'),
        ('MAINTENANCE_MODE', 'false', 'false'),
        ('FILE_UPLOAD_MAX_SIZE', '10485760', '10485760'),
        ('ALLOWED_FILE_TYPES', '.pdf,.doc,.docx,.jpg,.jpeg,.png', '.pdf,.doc,.docx,.jpg,.jpeg,.png'),
        ('ENROLLMENT_OPEN', 'true', 'true'),
        ('ACADEMIC_YEAR', '2023-2024', '2023-2024'),
        ('SYSTEM_EMAIL', 'system@uppend.edu', 'system@uppend.edu'),
        ('BACKUP_RETENTION_DAYS', '30', '30')
    ]

    # SQL query to insert system settings
    insert_query = """
    INSERT INTO system.system_setting (name, current_value, default_value)
    VALUES (%s, %s, %s)
    ON CONFLICT (name) DO UPDATE 
    SET current_value = EXCLUDED.current_value,
        default_value = EXCLUDED.default_value;
    """

    try:
        # Execute insertions
        for name, current_value, default_value in system_settings:
            cursor.execute(insert_query, (name, current_value, default_value))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted system settings")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error inserting system settings: {e}")

def generate_common_enrollment_requirements(cursor):
    """
    Generates common enrollment requirements that apply across all schools.
    Includes requirements for:
    - Transcript of Records (TOR)
    - Birth Certificate
    - Good Moral Character
    - Form 137/138
    - Medical Certificate
    - Vaccination Records
    - ID Photos
    - Proof of Address
    - Certificate of Completion
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    # Common enrollment requirements that apply across schools
    common_requirements = [
        ('TOR', 'document', 'document', True, 'Official academic records from previous school'),
        ('BC', 'document', 'document', True, 'PSA/NSO authenticated birth certificate'),
        ('GMC', 'document', 'document', True, 'Certificate of good moral character from previous school'),
        ('F137', 'document', 'document', True, 'Official student permanent record'),
        ('F138', 'document', 'document', True, 'Report card from previous school year'),
        ('MED', 'document', 'document', False, 'Recent medical clearance'),
        ('VAX', 'document', 'document', False, 'Updated vaccination/immunization records'),
        ('PIC', 'image', 'image', True, 'Recent 2x2 ID photographs'),
        ('POA', 'document', 'document', False, 'Valid proof of current residence'),
        ('COC', 'document', 'document', True, 'For graduates from previous level')
    ]

    # SQL query to insert common enrollment requirements
    insert_query = """
    INSERT INTO system.common_enrollment_requirement 
        (name, requirement_type, accepted_data_type, is_required, description)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (name) DO NOTHING;
    """

    try:
        # Execute insertions
        for name, type, accepted_data_type, is_required, description in common_requirements:
            cursor.execute(insert_query, (name, type, accepted_data_type, is_required, description))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted common enrollment requirements")
        print(f"Number of requirements inserted: {cursor.rowcount}")
    except Exception as e:
        # Rollback in case of error
        cursor.connection.rollback()
        print(f"Error inserting common enrollment requirements: {e}")

def requirement_group_generator(cursor):
    """
    Generates requirement groups for different enrollment scenarios:
    - New Student
    - Transferee
    - Foreign Student
    - Returnee
    - Graduate
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    # Sample requirement groups for different enrollment scenarios
    requirement_groups = [
        ('NEW_STUDENT', 'New Student Requirements'),
        ('TRANSFEREE', 'Transferee Requirements'),
        ('FOREIGN', 'Foreign Student Requirements'),
        ('RETURNEE', 'Returnee Requirements'),
        ('GRADUATE', 'Graduate Requirements')
    ]

    # SQL query to insert requirement groups
    insert_query = """
    INSERT INTO system.requirement_group
        (name, description)
    VALUES (%s, %s)
    ON CONFLICT (name) DO NOTHING;
    """

    try:
        # Execute insertions
        for name, desc in requirement_groups:
            cursor.execute(insert_query, (name, desc))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted requirement groups")
        print(f"Number of groups inserted: {cursor.rowcount}")
    except Exception as e:
        # Rollback in case of error
        cursor.connection.rollback()
        print(f"Error inserting requirement groups: {e}")

def requirement_group_mapping_generator(cursor):
    """
    Maps requirements to their respective groups.
    Creates associations between:
    - New Student requirements
    - Transferee requirements
    - Foreign Student requirements
    - Returnee requirements
    - Graduate requirements
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    # Map requirements to groups
    group_requirements = [
        # New Student Requirements
        ('NEW_STUDENT', 'FORM137'),
        ('NEW_STUDENT', 'BIRTH_CERT'), 
        ('NEW_STUDENT', 'GOOD_MORAL'),
        ('NEW_STUDENT', 'MED_CERT'),
        ('NEW_STUDENT', 'PHOTO'),

        # Transferee Requirements
        ('TRANSFEREE', 'FORM137'),
        ('TRANSFEREE', 'TOR'),
        ('TRANSFEREE', 'GOOD_MORAL'),
        ('TRANSFEREE', 'MED_CERT'),
        ('TRANSFEREE', 'PHOTO'),
        ('TRANSFEREE', 'HONORABLE_DISMISSAL'),

        # Foreign Student Requirements
        ('FOREIGN', 'PASSPORT'),
        ('FOREIGN', 'VISA'),
        ('FOREIGN', 'ALIEN_CERT'),
        ('FOREIGN', 'TOR'),
        ('FOREIGN', 'PHOTO'),

        # Returnee Requirements
        ('RETURNEE', 'CLEARANCE'),
        ('RETURNEE', 'GOOD_MORAL'),
        ('RETURNEE', 'MED_CERT'),
        ('RETURNEE', 'PHOTO'),

        # Graduate Requirements
        ('GRADUATE', 'TOR'),
        ('GRADUATE', 'DIPLOMA'),
        ('GRADUATE', 'GOOD_MORAL'),
        ('GRADUATE', 'PHOTO')
    ]

    # SQL query to insert requirement group mappings
    insert_query = """
    INSERT INTO system.enrollment_group_requirement
        (group_id, requirement_id)
    SELECT 
        rg.group_id,
        r.requirement_id
    FROM system.requirement_group rg
    CROSS JOIN system.common_enrollment_requirement r
    WHERE rg.name = %s 
    AND r.name = %s
    ON CONFLICT (group_id, requirement_id) DO NOTHING;
    """

    try:
        # Execute insertions
        for group_name, req_code in group_requirements:
            cursor.execute(insert_query, (group_name, req_code))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully mapped requirements to groups")
        print(f"Number of mappings inserted: {cursor.rowcount}")
    except Exception as e:
        # Rollback in case of error
        cursor.connection.rollback()
        print(f"Error mapping requirements to groups: {e}")


def generate_plan(cursor):
    """
    Generates subscription plans for the system:
    - Free Plan (FRE)
    - Basic Plan (BAS)
    - Pro Plan (PRO)
    - Enterprise Plan (ENT)
    
    Each plan includes:
    - Duration
    - Pricing
    - Student limits
    - Admin limits
    - Feature limits
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """
    # Define subscription plans with all required fields and valid prices
    plans = [
        ('FRE', 'Free Plan', 'Basic free plan', 30, 0.00, 0, 0.00, 1, 1, 10, 10, False, True),
        ('BAS', 'Basic Plan', 'Standard plan with basic features', 30, 999.99, 0, 999.99, 500, 3, 20, 20, True, True),
        ('PRO', 'Pro Plan', 'Professional plan with advanced features', 30, 1999.99, 0, 1999.99, 1000, 5, 50, 50, False, True),
        ('ENT', 'Enterprise Plan', 'Enterprise plan with unlimited features', 30, 4999.99, 0, 4999.99, 999999999, 10, 100, 100, False, True)
    ]

    # SQL query to insert plans
    insert_query = """
    INSERT INTO system.subscription_plan
        (plan_code, name, description, duration_days, discounted_price, discount_percent, original_price, 
         max_student_count, max_admin_count, max_form_field_count, max_image_upload_count, is_most_popular, is_active)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (plan_code) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        duration_days = EXCLUDED.duration_days,
        discounted_price = EXCLUDED.discounted_price,
        discount_percent = EXCLUDED.discount_percent,
        original_price = EXCLUDED.original_price,
        max_student_count = EXCLUDED.max_student_count,
        max_admin_count = EXCLUDED.max_admin_count,
        max_form_field_count = EXCLUDED.max_form_field_count,
        max_image_upload_count = EXCLUDED.max_image_upload_count,
        is_most_popular = EXCLUDED.is_most_popular,
        is_active = EXCLUDED.is_active;
    """

    try:
        # Execute insertions
        cursor.executemany(insert_query, plans)
        cursor.connection.commit()
        print("Successfully generated subscription plans")

    except Exception as e:
        cursor.connection.rollback()
        print(f"Error generating subscription plans: {e}")

def about_uppend(cursor):
    """
    Generates company information for Uppend IT.
    Includes:
    - Contact email
    - Contact number
    - Website URL
    - BIR Accreditation Number
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        None
    """

    # Define about us content
    about_content = {
        'email_address': 'support@ienroll.com',
        'contact_number': '09123456789',
        'website_url': 'https://www.ienroll.com',
        'bir_accreditation_number': 'BIR-ACC-2024-001234'
    }

    # SQL query to insert/update about us content
    insert_query = """
    INSERT INTO system.about_uppend
        (email_address, contact_number, website_url, bir_accreditation_number)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (email_address) DO UPDATE SET
        contact_number = EXCLUDED.contact_number,
        website_url = EXCLUDED.website_url,
        bir_accreditation_number = EXCLUDED.bir_accreditation_number;
    """

    try:
        # Execute insertion
        cursor.execute(insert_query, (
            about_content['email_address'],
            about_content['contact_number'], 
            about_content['website_url'],
            about_content['bir_accreditation_number']
        ))
        
        # Commit the transaction
        cursor.connection.commit()
        print("Successfully generated about us content")
        print(f"About us content inserted/updated")

    except Exception as e:
        # Rollback in case of error
        cursor.connection.rollback()
        print(f"Error generating about us content: {e}")


def generate_system_user(cursor):
    """
    Generates system user for the system.
    """
    try:
        address = generate_address(cursor)
        address_id = address[1]
        school_id = 0

        # Create the school if it doesn't exist
        cursor.execute(
            "INSERT INTO enrollment.school (school_id, name, academic_year, school_type, email_address, contact_number, address_id) "
            "VALUES (%s, 'iEnroll', '2024-2025', 'other', 'system@ienroll.com', '09123456789', %s) "
            "ON CONFLICT (name) DO NOTHING;",
            (school_id, address_id[1])
        )
        print("Successfully created or found iEnroll school.")

        password = 'system'
        password_hash = encrypt_password(password)

        insert_query = """
        INSERT INTO enrollment.user (first_name, middle_name, last_name, suffix, email_address, contact_number, username, password_visible, password_hash, gender, school_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (username) DO NOTHING;
        """
        cursor.execute(insert_query, (
            'System', 'System', 'System', 'V1', 'system@ienroll.com', '09123456789', 'system', password, password_hash, 'Male', school_id
        ))
        
        cursor.connection.commit()  # Commit the transaction
        print("Successfully generated system user")

    except Exception as e:
        cursor.connection.rollback()  # Rollback the transaction on error
        print(f"Error generating system user: {e}")


def generate_system_address_data(cursor):
    
    insert_province = """
    INSERT INTO system.province (province, is_default)
    VALUES (%s, %s)
    ON CONFLICT (province) DO NOTHING;
    """
    
    insert_municipality = """
    INSERT INTO system.municipality (municipality, province_id, is_default)
    VALUES (%s, %s, %s)
    ON CONFLICT (municipality, province_id) DO NOTHING;
    """
    
    insert_district = """
    INSERT INTO system.district (district, municipality_id, is_default)
    VALUES (%s, %s, %s)
    ON CONFLICT (district, municipality_id) DO NOTHING;
    """

    insert_street = """
    INSERT INTO system.street (street, district_id, is_default)
    VALUES (%s, %s, %s)
    ON CONFLICT (street, district_id) DO NOTHING;
    """

    sample_streets = [
        ('Purok 1', 1, True),
        ('Purok 2', 1, False),
        ('Purok 3', 2, False),
        ('Purok 4', 2, True),
        ('Purok 5', 3, True),
        ('Purok 6', 3, False),
        ('Purok 7', 4, True),
        ('Purok 8', 4, False),
        ('Purok 9', 5, True),
        ('Purok 10', 5, False),
    ]

    sample_districts = [
        ('District 1', 1, True),
        ('District 2', 2, False),
        ('District 3', 3, False),
        ('District 4', 4, True),
        ('District 5', 5, True),
        ('District 6', 5, False),
        ('District 7', 6, True),
        ('District 8', 6, False),
    ]

    sample_municipalities = [
        ('Municipality 1', 1, True),
        ('Municipality 2', 2, False),
        ('Municipality 3', 3, False),
        ('Municipality 4', 4, True),
        ('Municipality 5', 5, True),
        ('Municipality 6', 5, False),
        ('Municipality 7', 6, True),
        ('Municipality 8', 6, False),
    ]

    sample_provinces = [
        ('Province 1', True),
        ('Province 2', False),
        ('Province 3', False),
        ('Province 4', True),
        ('Province 5', True),
        ('Province 6', False),
        ('Province 7', True),
        ('Province 8', False),
    ]
    
    
    cursor.executemany(insert_street, sample_streets)
    cursor.executemany(insert_district, sample_districts)
    cursor.executemany(insert_municipality, sample_municipalities)
    cursor.executemany(insert_province, sample_provinces)
    
    
