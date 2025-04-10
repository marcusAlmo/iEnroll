from faker import Faker
from address_generator import generate_address

fake = Faker()

def generate_user_data(cursor, user_count):
    cursor.execute("SELECT school_id FROM enrollment.school")
    school_ids = cursor.fetchall()
    chosen_school_id = random.choice(school_ids)
    user_ids = []

    for i in range(user_count):
        password = fake.password()
        address_id = generate_address(cursor)
        user_data = {
            "first_name": fake.first_name(),
            "middle_name": fake.last_name(), 
            "last_name": fake.last_name(),
            "suffix": random.choice([fake.suffix(), None]),
            "email_address": fake.email(),
            "contact_number": fake.phone_number(),
            "username": fake.user_name(),
            "password_visible": password,
            "password_hash": bcrypt.hashpw(password.encode(), bcrypt.gensalt(10)),
            "address_id": address_id,
            "gender": fake.random_element(elements=('Male', 'Female')),
            "birth_date": fake.date_of_birth(),
            "school_id": chosen_school_id
        }


    return user_ids

def generate_admin_user(cursor, user_count):
    user_ids = generate_user_data(cursor, user_count)
    for user_id in user_ids:
        print(user_id)

def generate_student_user(cursor, user_count):
    user_ids = generate_user_data(cursor, user_count)
    for user_id in user_ids:
        print(user_id)



