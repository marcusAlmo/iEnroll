from faker import Faker
from address_generator import generate_address
import random
import bcrypt

fake = Faker()

def encrypt_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(10)).decode()

def generate_role_mapping(cursor, user_ids, role):
    """This will generate role mapping for the user. 1 ADMIN and 1 REGISTRAR for each school."""
    cursor.execute("SELECT user_id FROM enrollment.user WHERE f_name || ' ' || m_name || ' ' || l_name  LIKE 'System System System'")
    assigned_by = cursor.fetchone()[0]
    school_with_admin = []

    cursor.execute("SELECT role_code FROM enrollment.role WHERE role_name = %s", (role,))

    insert_query = """
    INSERT INTO enrollment.role_mapping (user_id, role_code, assigned_by)
    VALUES (%s, %s, %s)
    ON CONFLICT (user_id) DO NOTHING;
    """
    cursor.executemany(insert_query, (user_ids, role_code, assigned_by))
    cursor.connection.commit()

class UserGenerator:
    def __init__(self, cursor, user_count, school_id):
        self.cursor = cursor
        self.user_count = user_count
        self.school_id = school_id


    def generate_admin_user(self):
        user_ids = self.generate_user_data(self.user_count, self.school_id)
        generate_role_mapping(self.cursor, user_ids, ('ADM','REG'))
        for user_id in user_ids:
            print(user_id)

    def generate_student_user(self):
        user_ids = self.generate_user_data(self.user_count, self.school_id)
        generate_role_mapping(self.cursor, user_ids, 'STU')
        for user_id in user_ids:
            print(user_id)

    def generate_user_data(self, user_count, school_id):

        school_ids = []
        if school_id == 0:
            self.cursor.execute("SELECT school_id FROM enrollment.school")
            school_ids = self.cursor.fetchall()
        else:
            school_ids = [school_id]
        user_ids = []
        user_data_list = []

        for school_id in school_ids:
            for i in range(user_count):
                password = fake.password()
                password_hash = encrypt_password(password)
                address_id = generate_address(self.cursor)
                user_data = {
                    "first_name": fake.first_name(),
                    "middle_name": fake.last_name(), 
                    "last_name": fake.last_name(),
                    "suffix": random.choice([fake.suffix(), None]),
                    "email_address": fake.email(),
                    "contact_number": fake.phone_number(),
                    "username": fake.user_name(),
                    "password_visible": password,
                    "password_hash": password_hash,
                    "address_id": address_id,
                    "gender": fake.random_element(elements=('Male', 'Female')),
                    "birth_date": fake.date_of_birth(),
                    "school_id": school_id
                }
                user_data_list.append(user_data)

            insert_query = """
            INSERT INTO enrollment.user (first_name, middle_name, last_name, suffix, email_address, contact_number, username, password_visible, password_hash, address_id, gender, birth_date, school_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (username) DO NOTHING;
            RETURNING user_id, school_id;
            """
            self.cursor.executemany(insert_query, user_data_list)
            user_ids = self.cursor.fetchall()
            self.cursor.connection.commit()

        return user_ids







