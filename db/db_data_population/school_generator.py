from faker import Faker
from datetime import datetime, timedelta
import random
from address_generator import generate_address

fake = Faker()

def get_academic_year():
    """
    Returns the academic year in the format 'YYYY-YYYY' where the second year is current year + 1
    """
    current_year = datetime.now().year
    next_year = current_year + 1
    return f"{current_year}-{next_year}"

def generate_invoice_id(cursor):
    """
    Generates a random invoice ID
    """
    try:
        created_by = 'Uppend IT Admin'
        payer_name = fake.name()
        payer_address = fake.address()
        payer_contact_number = fake.phone_number()[:11]  # Limit to 11 characters
        payer_email_address = f"{payer_name.lower().replace(' ', '')}@example.com"
        seller_name = 'Uppend IT'
        amount_paid = random.randint(1000, 100000)
        issuer = 'Uppend IT'
        creation_date = datetime.now()

        cursor.execute("""
            INSERT INTO record.invoice(
            created_by, payer_name, payer_address, payer_contact_number, payer_email_address, 
            seller_name, amount_paid, issuer, creation_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING invoice_id
        """, (created_by, payer_name, payer_address, payer_contact_number, payer_email_address, 
              seller_name, amount_paid, issuer, creation_date))

        invoice_id = cursor.fetchone()[0]
        return invoice_id
    except Exception as e:
        print(f"Error generating invoice: {str(e)}")
        return None

def generate_school_subscription(cursor, school_id):
    """
    Generates a new school subscription with the current academic year
    """
    try:
        invoice_id = generate_invoice_id(cursor)
        if not invoice_id:
            raise Exception("Failed to generate invoice")

        plan_code = random.choice(['FRE', 'BAS', 'PRO', 'ENT'])
        cursor.execute("SELECT duration_days FROM system.plan WHERE plan_code = %s", (plan_code,))
        duration_days = cursor.fetchone()[0]
        
        start_datetime = datetime.now()
        end_datetime = start_datetime + timedelta(days=duration_days)

        cursor.execute("""
            INSERT INTO enrollment.school_subscription 
            (plan_code, school_id, duration_days, start_datetime, end_datetime, invoice_id, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING subscription_id
        """, (plan_code, school_id, duration_days, start_datetime, end_datetime, invoice_id, True))

        subscription_id = cursor.fetchone()[0]
        print(f"School subscription generated - ID: {subscription_id}, Plan: {plan_code}")
        return subscription_id

    except Exception as e:
        print(f"Error generating school subscription: {str(e)}")
        return None

def generate_school(cursor):
    """
    Generates a new school with the current academic year
    
    Args:
        cursor: Database cursor from the main module
        
    Returns:
        int: The generated school_id if successful, None if failed
    """
    try:
        # Generate address first
        address_id = generate_address(cursor)
        if not address_id:
            raise Exception("Failed to generate address")

        # Get school details
        school_name = input("Enter the name of the school to generate: ")
        if not school_name.strip():
            raise ValueError("School name cannot be empty")

        # Generate other details
        academic_year = get_academic_year()
        school_type = random.choice(['public', 'private'])
        email_address = f"{school_name.lower().replace(' ', '')}@example.com"
        contact_number = f"{random.randint(900, 999):03d}{random.randint(1000000, 9999999):07d}"  # Philippines mobile format
        website_url = f"www.{school_name.lower().replace(' ', '')}.com"
        school_id = random.randint(100000, 999999)

        # Insert school into database
        cursor.execute("""
            INSERT INTO enrollment.school (
                school_id,
                name, 
                academic_year, 
                type, 
                email_address, 
                contact_number, 
                website_url,
                address_id,
                is_active
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
            RETURNING school_id
        """, (
            school_id,
            school_name,
            academic_year,
            school_type,
            email_address,
            contact_number,
            website_url,
            address_id,
            True
        ))
        
        school_id = cursor.fetchone()[0]
        cursor.connection.commit()
        print(f"School '{school_name}' generated with ID: {school_id}")
        print(f"Academic Year: {academic_year}")
        print(f"Contact: {contact_number}")
        print(f"Email: {email_address}")
        print(f"Website: {website_url}")
        
        return school_id
        
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error generating school: {str(e)}")
        return None

def generate_grade_level_offered(cursor, school_id):
    """
    Generates grade level offered for a new school
    """
    try:
        academic_levels = ['KGT', 'ELE', 'JHS', 'SHS', 'TER']
        chosen_academic_level = random.choice(academic_levels)

        cursor.execute("""
            SELECT grade_level_code FROM system.grade_level 
            WHERE academic_level_code = %s
        """, (chosen_academic_level,))
        
        grade_levels = cursor.fetchall()
        grade_level_offered_ids = []

        for grade_level in grade_levels:
            cursor.execute("""
                INSERT INTO enrollment.grade_level_offered (school_id, grade_level_code)
                VALUES (%s, %s)
                RETURNING grade_level_offered_id
            """, (school_id, grade_level[0]))
            
            grade_level_offered_id = cursor.fetchone()[0]
            grade_level_offered_ids.append(grade_level_offered_id)
            
            # Generate related records
            generate_enrollment_schedule(cursor, grade_level_offered_id)
            generate_grade_section_type(cursor, grade_level_offered_id)

        print(f"Generated {len(grade_level_offered_ids)} grade levels for school {school_id}")
        return grade_level_offered_ids

    except Exception as e:
        print(f"Error generating grade levels: {str(e)}")
        return None

def generate_grade_section_type(cursor, grade_level_offered_id):
    """
    Generates grade section types for a new school
    """
    try:
        section_types = ['Science-Oriented', 'Regular']
        chosen_section_type = random.choice(section_types)
        
        cursor.execute("""
            INSERT INTO enrollment.grade_section_type (grade_level_offered_id, section_type)
            VALUES (%s, %s)
            RETURNING grade_section_type_id
        """, (grade_level_offered_id, chosen_section_type))
        
        grade_section_type_id = cursor.fetchone()[0]
        
        # Generate related records
        generate_enrollment_fee(cursor, grade_section_type_id)
        generate_enrollment_requirement(cursor, grade_section_type_id)
        generate_grade_section(cursor, grade_section_type_id)

        print(f"Generated section type '{chosen_section_type}' - ID: {grade_section_type_id}")
        return grade_section_type_id

    except Exception as e:
        print(f"Error generating grade section type: {str(e)}")
        return None

def generate_grade_section(cursor, grade_section_type_id):
    """
    Generates grade sections for a new school
    """
    try:
        section_name = fake.word()
        adviser = fake.name()
        slot_count = random.randint(30, 50)
        max_application_slot = random.randint(70, 100)
        
        cursor.execute("""
            INSERT INTO enrollment.grade_section 
            (grade_section_type_id, section_name, adviser, slot, max_application_slot)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING grade_section_id
        """, (grade_section_type_id, section_name, adviser, slot_count, max_application_slot))
        
        grade_section_id = cursor.fetchone()[0]
        print(f"Generated section '{section_name}' - ID: {grade_section_id}")
        return grade_section_id

    except Exception as e:
        print(f"Error generating grade section: {str(e)}")
        return None

def generate_enrollment_fee(cursor, grade_section_type_id):
    """
    Generates enrollment fees for a new school
    """
    try:
        fees = [
            ('Application Fee', 100, 'One-time application fee'),
            ('Enrollment Fee', 200, 'Basic enrollment fee'),
            ('Registration Fee', 300, 'Registration processing fee'),
            ('Tuition Fee', 1000, 'Monthly tuition fee'),
            ('Lab Fee', 500, 'Laboratory usage fee')
        ]
        
        fee_ids = []
        for name, amount, description in fees:
            cursor.execute("""
                INSERT INTO enrollment.enrollment_fee 
                (grade_section_type_id, name, amount, description)
                VALUES (%s, %s, %s, %s)
                RETURNING enrollment_fee_id
            """, (grade_section_type_id, name, amount, description))
            
            fee_ids.append(cursor.fetchone()[0])

        print(f"Generated {len(fee_ids)} enrollment fees")
        return fee_ids

    except Exception as e:
        print(f"Error generating enrollment fees: {str(e)}")
        return None

def generate_enrollment_requirement(cursor, grade_section_type_id):
    """
    Generates enrollment requirements for a new school
    """
    try:
        cursor.execute("""
            SELECT requirement_code, name, description 
            FROM system.common_enrollment_requirement
            WHERE is_active = TRUE
            ORDER BY RANDOM()
            LIMIT 3
        """)
        requirements = cursor.fetchall()
        
        requirement_ids = []
        for req_code, name, description in requirements:
            cursor.execute("""
                INSERT INTO enrollment.enrollment_requirement 
                (grade_section_type_id, requirement_code, name, description, is_required)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING enrollment_requirement_id
            """, (grade_section_type_id, req_code, name, description, True))
            
            requirement_ids.append(cursor.fetchone()[0])

        print(f"Generated {len(requirement_ids)} enrollment requirements")
        return requirement_ids

    except Exception as e:
        print(f"Error generating enrollment requirements: {str(e)}")
        return None

def generate_enrollment_schedule(cursor, grade_level_offered_id):
    """
    Generates enrollment schedules for a new school
    """
    try:
        start_datetime = datetime.now()
        end_datetime = start_datetime + timedelta(days=30)  # 30-day enrollment period
        
        cursor.execute("""
            INSERT INTO enrollment.enrollment_schedule 
            (grade_level_offered_id, start_datetime, end_datetime)
            VALUES (%s, %s, %s)
            RETURNING enrollment_schedule_id
        """, (grade_level_offered_id, start_datetime, end_datetime))
        
        schedule_id = cursor.fetchone()[0]
        print(f"Generated enrollment schedule - ID: {schedule_id}")
        return schedule_id

    except Exception as e:
        print(f"Error generating enrollment schedule: {str(e)}")
        return None



