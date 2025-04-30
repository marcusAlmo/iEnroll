from collections import UserString
from faker import Faker
from address_generator import generate_address
import random
import bcrypt

fake = Faker()

def encrypt_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(10)).decode()

def generate_role_mapping(cursor, user_ids, role):
    """This will generate role mapping for the user. 1 ADMIN and 1 REGISTRAR for each school."""
    cursor.execute("SELECT user_id FROM enrollment.user WHERE first_name || ' ' || middle_name || ' ' || last_name  LIKE 'System System System'")
    assigned_by = cursor.fetchone()[0]

    # Fetch the role_code for the given role

    insert_query = """
    INSERT INTO enrollment.user_role (user_id, role_code, assigned_by)
    VALUES (%s, %s, %s)
    ON CONFLICT (user_id, role_code) DO NOTHING;
    """
    
    # Handle different possible input formats for user_ids
    if user_ids and isinstance(user_ids[0], tuple):
        # If user_ids is a list of tuples (from fetchall()), extract the first element
        insert_data = [(id[0], role, assigned_by) for id in user_ids]
    else:
        # If user_ids is a list of user IDs
        insert_data = [(id, role, assigned_by) for id in user_ids]

    try:
        cursor.executemany(insert_query, insert_data)
        cursor.connection.commit()
        print(f"Successfully mapped {len(insert_data)} users to {role} role")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error mapping users to role: {e}")


def generate_student(cursor, user_ids):
    try:
        student_data = []
        for user_id in user_ids:
            address_id = generate_address(cursor)
            data = (
                user_id,
                address_id[1],
                user_id,
                fake.date_of_birth(minimum_age=7)
            )
            student_data.append(data)
        
        insert_query = """
            INSERT INTO enrollment.student(student_id, address_id, enroller_id, birthdate)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (student_id) DO NOTHING;
        """
        cursor.executemany(insert_query, student_data)
        cursor.connection.commit()
        print(f"Successfully generated {len(student_data)} students")
    except Exception as e:
        cursor.connection.rollback()
        print(f"Error generating students: {e}")

class UserGenerator:
    def __init__(self, cursor, user_count, school_id, user_type):
        self.cursor = cursor
        self.user_count = user_count
        self.school_id = school_id
        self.user_type = user_type

    def generate_user(self):
        user_ids = self.generate_user_data(self.user_count, self.school_id)
        generate_role_mapping(self.cursor, user_ids, self.user_type)
        generate_student(self.cursor, user_ids) if self.user_type == 'STU' else None

    def generate_user_data(self, user_count, school_id):
        try:
            # Handle school_ids retrieval
            if school_id == 0:
                self.cursor.execute("SELECT school_id FROM enrollment.school WHERE school_id <> 0")
                school_ids_result = self.cursor.fetchall()
                # Flatten the list of tuples to a list of school IDs
                school_ids = [sid[0] for sid in school_ids_result] if school_ids_result else []
            else:
                school_ids = [school_id]

            # Validate school_ids
            if not school_ids:
                print("No schools found for user generation")
                return []  # Return empty list instead of None

            user_ids = []

            for current_school_id in school_ids:
                for i in range(user_count):
                    password = fake.password()
                    password_hash = encrypt_password(password)
                    phone_number = f"09{random.randint(100000000, 999999999):09d}"
                    user_data = (
                    fake.first_name(),
                    fake.last_name(), 
                    fake.last_name(),
                    random.choice([fake.suffix(), None]),
                        fake.random_element(elements=('male', 'female')),
                        fake.email(),
                        phone_number,
                        fake.user_name(),
                        password_hash,
                        current_school_id,
                        password
                    )

                    insert_query = """
                    INSERT INTO enrollment.user (first_name, middle_name, last_name, suffix, gender, email_address, contact_number, username, password_hash, school_id, password_visible)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (username) DO NOTHING
                    RETURNING user_id;
                    """
                    
                    self.cursor.execute(insert_query, user_data)
                    user_ids.append(self.cursor.fetchone()[0])
            
            return user_ids  
        except Exception as e:
            print(f"Error generating user data: {str(e)}")
            return [] 
