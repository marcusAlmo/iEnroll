def generate_system_initial_setup(cursor):
    """Main function to set up initial system data"""
    try:
        cursor.execute("BEGIN")
        
        generate_academic_levels(cursor)
        generate_grade_levels(cursor)
        generate_system_settings(cursor)
        generate_common_enrollment_requirements(cursor)
        requirement_group_generator(cursor)
        requirement_group_mapping_generator(cursor)
        generate_plan(cursor)
        about_uppend(cursor)
        
        cursor.execute("COMMIT")
        print("System initial setup completed successfully")
        
    except Exception as e:
        cursor.execute("ROLLBACK")
        print(f"Error in system initial setup: {e}")




def check_default_data(cursor):
    """
    Checks if the default data already exists in the database
    """
    # Check if the system.grade_level table is empty
    cursor.execute("SELECT COUNT(*) FROM system.grade_level")
    if cursor.fetchone()[0] == 0:
        return True
    else:
        return False
    
    
    


def generate_grade_levels(cursor):
    """
    Generate initial system setup data for grade levels
    Covers primary (G), secondary (H), and college (C) levels
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
        ('SYSTEM_EMAIL', 'system@ienroll.edu', 'system@ienroll.edu'),
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
        (name, type, accepted_data_type, is_required, description)
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
    Generates subscription plans in the system.plan table
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
    INSERT INTO system.plan
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
    Generates about us content in the system.about_uppend table
    
    Args:
        cursor: Database cursor from the main module
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