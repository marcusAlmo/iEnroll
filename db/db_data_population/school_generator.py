"""
School Generator Module

This module provides functionality to generate school-related data for the iEnroll system.
It includes functions to generate schools, their subscriptions, grade levels, sections,
fees, requirements, and enrollment schedules.

The module uses Faker for generating fake data and maintains referential integrity
across multiple related tables in the database.
"""

from faker import Faker
from datetime import datetime, timedelta
import random
from address_generator import generate_address

fake = Faker()

def get_academic_year():
    """
    Returns the current academic year in the format 'YYYY-YYYY'.
    
    Returns:
        str: The academic year string in the format 'YYYY-YYYY'
    """
    current_year = datetime.now().year
    next_year = current_year + 1
    return f"{current_year}-{next_year}"

def generate_invoice_id(cursor):
    """
    Generates a new invoice record with random data.
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        int: The generated invoice_id if successful, None if failed
    """
    try:
        cursor.execute("""
            SELECT MAX(invoice_id) FROM record.invoice
        """)
        max_invoice_id = cursor.fetchone()[0]
        if max_invoice_id is None:
            max_invoice_id = 100000

        created_by = 'Uppend IT Admin'
        payer_name = fake.name()
        payer_address = fake.address()
        payer_contact_number = fake.phone_number()[:11]  # Limit to 11 characters
        payer_email_address = f"{payer_name.lower().replace(' ', '')}@example.com"
        seller_name = 'Uppend IT'
        amount_paid = random.randint(1000, 100000)
        issuer = 'Uppend IT'
        creation_date = datetime.now()
        invoice_id = max_invoice_id + 1
        bir_accreditation_number = random.randint(100000000000, 999999999999)
        cursor.execute("""
            INSERT INTO record.invoice(
            invoice_id, created_by, payer_name, payer_address, payer_contact_number, payer_email_address, 
            seller_name, bir_accreditation_number, amount_paid, issuer, creation_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (invoice_id, created_by, payer_name, payer_address, payer_contact_number, payer_email_address, 
              seller_name, bir_accreditation_number, amount_paid, issuer, creation_date))
        print(f"Invoice generated - ID: {invoice_id}")

        plan_name = random.choice(['FRE', 'BAS', 'PRO', 'ENT'])
        quantity = random.randint(1, 10)
        amount_each = random.randint(1000, 100000)

        cursor.execute("""
            INSERT INTO record.invoice_plan(
                invoice_id, plan_name, quantity, amount_each)
            VALUES (%s, %s, %s, %s)
        """, (invoice_id, plan_name, quantity, amount_each))

        print(f"Invoice plan generated.")
        return invoice_id
    except Exception as e:
        print(f"Error generating invoice: {str(e)}")
        return None

def generate_school_subscription(cursor, school_id):
    """
    Generates a subscription record for a school with a random plan.
    
    Args:
        cursor: Database cursor for executing SQL queries
        school_id (int): The ID of the school to create subscription for
        
    Returns:
        int: The generated subscription_id if successful, None if failed
    """
    try:
        print(school_id)
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
    Generates a complete school record with all related data.
    This includes:
    - School basic information
    - Address
    - Subscription
    - Grade levels
    - Sections
    - Fees
    - Requirements
    - Enrollment schedules
    
    Args:
        cursor: Database cursor for executing SQL queries
        
    Returns:
        int: The generated school_id if successful, None if failed
    """
    try:
        # Start transaction
        cursor.execute("BEGIN")
        
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
            ON CONFLICT (school_id) DO NOTHING
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
        
        # Generate subscription
        subscription_id = generate_school_subscription(cursor, school_id)
        if not subscription_id:
            raise Exception("Failed to generate school subscription")
            
        # Generate grade levels
        grade_level_ids = generate_grade_level_offered(cursor, school_id)
        if not grade_level_ids:
            raise Exception("Failed to generate grade levels")
            
        # If all operations succeed, commit the transaction
        cursor.connection.commit()
        
        print(f"School '{school_name}' generated with ID: {school_id}")
        print(f"Academic Year: {academic_year}")
        print(f"Contact: {contact_number}")
        print(f"Email: {email_address}")
        print(f"Website: {website_url}")
        print(f"Generated {len(grade_level_ids)} grade levels")
        
        return school_id
        
    except Exception as e:
        # Rollback the transaction on any error
        cursor.connection.rollback()
        print(f"Error generating school: {str(e)}")
        return None

def generate_grade_level_offered(cursor, school_id):
    """
    Generates grade level offerings for a school.
    
    Args:
        cursor: Database cursor for executing SQL queries
        school_id (int): The ID of the school to create grade levels for
        
    Returns:
        list: List of generated grade_level_offered_ids if successful, None if failed
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
                INSERT INTO enrollment.grade_level_offered 
                (school_id, grade_level_code)
                VALUES (%s, %s)
                ON CONFLICT (school_id, grade_level_code) DO NOTHING
                RETURNING grade_level_offered_id
            """, (school_id, grade_level[0]))
            
            grade_level_offered_id = cursor.fetchone()[0]
            print(f"Generated grade level offered - ID: {grade_level_offered_id}")
            grade_level_offered_ids.append(grade_level_offered_id)
            
            # Generate related records
            schedule_id = generate_enrollment_schedule(cursor, grade_level_offered_id)
            if not schedule_id:
                raise Exception("Failed to generate enrollment schedule")
                
            section_type_id = generate_grade_section_type(cursor, grade_level_offered_id)
            if not section_type_id:
                raise Exception("Failed to generate grade section type")

        print(f"Generated {len(grade_level_offered_ids)} grade levels for school {school_id}")
        return grade_level_offered_ids

    except Exception as e:
        print(f"Error generating grade levels: {str(e)}")
        return None

def generate_grade_section_type(cursor, grade_level_offered_id):
    """
    Generates section types for a grade level offering.
    
    Args:
        cursor: Database cursor for executing SQL queries
        grade_level_offered_id (int): The ID of the grade level offering
        
    Returns:
        int: The generated grade_section_type_id if successful, None if failed
    """
    try:
        section_types = ['special', 'regular']
        chosen_section_type = random.choice(section_types)
        
        cursor.execute("""
            INSERT INTO enrollment.grade_section_type 
            (grade_level_offered_id, section_type)
            VALUES (%s, %s)
            ON CONFLICT (grade_level_offered_id, section_type) DO NOTHING
            RETURNING grade_section_type_id
        """, (grade_level_offered_id, chosen_section_type))
        
        grade_section_type_id = cursor.fetchone()[0]
        
        # Generate related records
        fee_ids = generate_enrollment_fee(cursor, grade_section_type_id)
        if not fee_ids:
            raise Exception("Failed to generate enrollment fees")
            
        requirement_ids = generate_enrollment_requirement(cursor, grade_section_type_id)
        if not requirement_ids:
            raise Exception("Failed to generate enrollment requirements")
            
        section_id = generate_grade_section(cursor, grade_section_type_id)
        if not section_id:
            raise Exception("Failed to generate grade section")

        print(f"Generated section type '{chosen_section_type}' - ID: {grade_section_type_id}")
        return grade_section_type_id

    except Exception as e:
        print(f"Error generating grade section type: {str(e)}")
        return None

def generate_grade_section(cursor, grade_section_type_id):
    """
    Generates sections for a grade section type.
    
    Args:
        cursor: Database cursor for executing SQL queries
        grade_section_type_id (int): The ID of the grade section type
        
    Returns:
        int: The generated grade_section_id if successful, None if failed
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
            ON CONFLICT (grade_section_type_id, section_name) DO NOTHING
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
    Generates enrollment fees for a grade section type.
    
    Args:
        cursor: Database cursor for executing SQL queries
        grade_section_type_id (int): The ID of the grade section type
        
    Returns:
        list: List of generated fee_ids if successful, None if failed
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
                ON CONFLICT (grade_section_type_id, name) DO NOTHING
                RETURNING fee_id
            """, (grade_section_type_id, name, amount, description))
            
            fee_ids.append(cursor.fetchone()[0])

        print(f"Generated {len(fee_ids)} enrollment fees")
        return fee_ids

    except Exception as e:
        print(f"Error generating enrollment fees: {str(e)}")
        return None

def generate_enrollment_requirement(cursor, grade_section_type_id):
    """
    Generates enrollment requirements for a grade section type.
    
    Args:
        cursor: Database cursor for executing SQL queries
        grade_section_type_id (int): The ID of the grade section type
        
    Returns:
        list: List of generated requirement_ids if successful, None if failed
    """
    try:
        cursor.execute("""
            SELECT requirement_id, name, type, accepted_data_type, is_required, description 
            FROM system.common_enrollment_requirement
            ORDER BY RANDOM()
            LIMIT 3
        """)
        requirements = cursor.fetchall()
        
        if not requirements:
            raise Exception("No active requirements found in system.common_enrollment_requirement")
            
        requirement_ids = []
        for requirement_id, name, type, accepted_data_type, is_required, description in requirements:
            cursor.execute("""
                INSERT INTO enrollment.enrollment_requirement 
                (grade_section_type_id, name, type, accepted_data_type, is_required, description)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (requirement_id) DO NOTHING
                RETURNING requirement_id
            """, (grade_section_type_id, name, type, accepted_data_type, is_required, description))
            
            requirement_ids.append(cursor.fetchone()[0])

        print(f"Generated {len(requirement_ids)} enrollment requirements")
        return requirement_ids

    except Exception as e:
        print(f"Error generating enrollment requirements: {str(e)}")
        return None

def generate_enrollment_schedule(cursor, grade_level_offered_id):
    """
    Generates enrollment schedules for a grade level offering.
    
    Args:
        cursor: Database cursor for executing SQL queries
        grade_level_offered_id (int): The ID of the grade level offering
        
    Returns:
        int: The generated schedule_id if successful, None if failed
    """
    try:
        start_datetime = datetime.now()
        end_datetime = start_datetime + timedelta(days=30)  # 30-day enrollment period
        
        cursor.execute("""
            INSERT INTO enrollment.enrollment_schedule 
            (grade_level_offered_id, start_datetime, end_datetime)
            VALUES (%s, %s, %s)
            ON CONFLICT (schedule_id) DO NOTHING
            RETURNING schedule_id
        """, (grade_level_offered_id, start_datetime, end_datetime))
        
        schedule_id = cursor.fetchone()[0]
        print(f"Generated enrollment schedule - ID: {schedule_id}")
        return schedule_id

    except Exception as e:
        print(f"Error generating enrollment schedule: {str(e)}")
        return None



