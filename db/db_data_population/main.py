import psycopg2
import os
import school_generator
import user_generator
import system_logs_generator

def connect_db():
    try:
        # Database connection parameters
        connection_params = {
            'host': os.getenv('POSTGRES_HOST', 'rt8-2.h.filess.io'),
            'port': os.getenv('POSTGRES_PORT', '5433'),
            'database': os.getenv('POSTGRES_DB', 'iEnroll_ballthembe'),
            'user': os.getenv('POSTGRES_USER', 'iEnroll_ballthembe'),
            'password': os.getenv('POSTGRES_PASSWORD', '93652d9b0bf99fbb20612e3388db3e95c9abad22')
        }
        
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
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
        return cur
    
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None

class Menu:
    def action_menu():
        action = int(input("""Enter action:
            [1] Insert new instance
            [2] Update existing instance
            [3] Delete existing instance
            [0] Exit
        Choice: """))
        return action

    def entity_menu():
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


if __name__ == '__main__':
    cursor = connect_db()

    menu = Menu()
    action = menu.action_menu()
    entity = menu.entity_menu()

    if action == 1:
        if entity == 1:
            school_generator.generate_school(cursor)
        elif entity == 2:
            user_generator.generate_user(cursor)
        elif entity == 3:
            user_generator.generate_user_log(cursor)
        elif entity == 4:
            system_logs_generator.generate_system_log(cursor)
        elif entity == 5:
            system_data.generate_system_initial_setup(cursor)
        elif entity == 6:
            user_generator.generate_chat(cursor)