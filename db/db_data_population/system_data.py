def generate_system_initial_setup(cursor):
    generate_academic_levels(cursor)
    generate_grade_levels(cursor)
    generate_system_logs(cursor)    


def generate_grade_levels(cursor):
    """
    Generate initial system setup data for grade levels
    Covers primary (G), secondary (H), and college (C) levels
    """
    # Kindergarten
    kindergarten_levels = [
        ('NUR', 'Nursery', 'KGT', True),
        ('KGT', 'Kindergarten', 'KGT', True)
    ]

    # Primary School Levels (Grades 1-6)
    primary_levels = [
        ('G01', 'Grade 1', 'ELE', True),
        ('G02', 'Grade 2', 'ELE', True),
        ('G03', 'Grade 3', 'ELE', True),
        ('G04', 'Grade 4', 'ELE', True),
        ('G05', 'Grade 5', 'ELE', True),
        ('G06', 'Grade 6', 'ELE', True)
    ]

    # Secondary School Levels (Grades 7-12)
    secondary_levels = [
        ('H07', 'Grade 7', 'JHS', True),
        ('H08', 'Grade 8', 'JHS', True),
        ('H09', 'Grade 9', 'JHS', True),
        ('H10', 'Grade 10', 'JHS', True),
        ('H11', 'Grade 11', 'SHS', True),
        ('H12', 'Grade 12', 'SHS', True)
    ]

    # College Levels (1st to 4th Year)
    college_levels = [
        ('C01', 'First Year College', 'TER', True),
        ('C02', 'Second Year College', 'TER', True),
        ('C03', 'Third Year College', 'TER', True),
        ('C04', 'Fourth Year College', 'TER', True)
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
        for level_code, level_name in all_levels:
            cursor.execute(insert_query, (level_code, level_name))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted grade levels into system.grade_level")
        print(f"Number of grade levels inserted: {cursor.rowcount}")

    except Exception as e:
        # Rollback in case of error
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
    VALUES (%s, %s, %s) 
    ON CONFLICT (academic_level_code) DO NOTHING;
    """

    try:
        # Execute insertions
        for level_code, level_name in academic_levels:
            cursor.execute(insert_query, (level_code, level_name))
        
        # Commit the transactions
        cursor.connection.commit()
        print("Successfully inserted academic levels into system.academic_level")
        print(f"Number of academic levels inserted: {cursor.rowcount}")
    except Exception as e:
        # Rollback in case of error
        cursor.connection.rollback()
        print(f"Error inserting academic levels: {e}")

def generate_system_settings(cursor):
    pass

def generate_system_logs(cursor):
    pass
