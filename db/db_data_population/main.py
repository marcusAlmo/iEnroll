import psycopg2
import os
import school_generator
import system_data_generator
import user_generator
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def connect_db():
    try:
        # Database connection parameters
        connection_params = {
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT'),
            'database': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD')
        }
        
        # Print connection parameters for debugging (remove in production)
        print("Attempting to connect with parameters:", {k: v for k, v in connection_params.items() if k != 'password'})
        
        # Establish connection
        conn = psycopg2.connect(**connection_params)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute version query
        cur.execute('SELECT version();')
        
        # Fetch the version
        db_version = cur.fetchone()[0]
        
        if db_version:
            print(f"PostgreSQL Version: {db_version}")
        else:
            print("Failed to retrieve PostgreSQL version.")
        
        return conn, cur
    
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None, None

class Menu:
    def action_menu(self):
        action = int(input("""Enter action:
            [1] Insert new instance
            [2] Update existing instance
            [3] Delete existing instance
            [0] Exit
        Choice: """))
        return action

    def entity_menu(self):
        entity = int(input("""Choose entity:
            [1] School
            [2] User
            [3] User logs
            [4] System logs
            [5] System Initial Setup (for new db instance)
            [6] Chat
            [0] Exit
        Choice: """))
        return entity

def validate_school_data(school_name, email, contact):
    if not school_name.strip():
        raise ValueError("School name cannot be empty")
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        raise ValueError("Invalid email format")
    if not re.match(r'^\+?1?\d{9,15}$', contact):
        raise ValueError("Invalid contact number format")

if __name__ == '__main__':
    conn, cursor = connect_db()
    if not cursor:
        print("Failed to connect to database. Exiting...")
        exit(1)

    menu = Menu()
    action = menu.action_menu()
    entity = menu.entity_menu()

    # action = 1
    # entity = 2

    try:
        if action == 1:
            if entity == 1:
                school_id = school_generator.generate_school(cursor)
                print(f"School {school_id} created successfully")
            elif entity == 2:
                approach = int(input("""Choose approach:
                    [1] Generate users for a specific school
                    [2] Generate users for all schools
                Choice: """))
                school_id = 0
                if approach == 1:
                    school_id = int(input("Enter school id: "))
                else: school_id = 0
                user_type = int(input("""Choose user type:
                    [1] Admin
                    [2] Student
                Choice: """))
                user_count = int(input("Enter number of users to generate: "))
                if user_type == 1:
                    user_generator.UserGenerator(cursor, user_count, school_id).generate_admin_user()
                elif user_type == 2:
                    user_generator.UserGenerator(cursor, user_count, school_id).generate_student_user()
            elif entity == 3:
                # user_generator.generate_user_log(cursor)
                pass
            elif entity == 4:
                # system_logs_generator.generate_system_log(cursor)
                pass
            elif entity == 5:
                system_data_generator.generate_system_initial_setup(cursor)
            elif entity == 6:
                # user_generator.generate_chat(cursor)
                pass
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()