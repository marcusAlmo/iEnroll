# Database Data Population Scripts

This directory contains scripts for populating the iEnroll database with test data. These scripts are used to generate realistic test data for development and testing purposes.

## Files Overview

### main.py
The main entry point for data generation. This script:
- Establishes database connections
- Provides a command-line interface for selecting which data to generate
- Coordinates the execution of other generator scripts
- Handles transaction management and error handling

### school_generator.py
Generates complete school records with all related data:
- School basic information (name, type, contact details)
- Address information
- Subscription plans
- Grade levels and sections
- Enrollment fees
- Requirements
- Enrollment schedules

### user_generator.py
Generates user accounts for the system:
- Creates user profiles with realistic names and contact information
- Assigns appropriate roles and permissions
- Generates login credentials
- Links users to schools or system roles

### address_generator.py
Generates realistic address data:
- Creates complete address records with street, city, province, etc.
- Ensures address format matches the system's requirements
- Maintains referential integrity with other tables

### system_data_generator.py
Generates system-level data:
- Creates system configurations
- Generates reference tables data
- Sets up initial system parameters
- Creates system roles and permissions

### .env
Contains environment variables for database connection:
- Database host
- Port
- Username
- Password
- Database name

### guide.md
Contains quick reference instructions for using the data generation scripts.

## Usage

1. Ensure your `.env` file is properly configured with database credentials
2. Run `main.py` to start the data generation process
3. Follow the interactive prompts to select which data to generate
4. Review the generated data in the database

## Dependencies

- Python 3.x
- psycopg2 (PostgreSQL adapter)
- python-dotenv
- Faker (for generating realistic fake data)

## Notes

- All scripts maintain referential integrity between tables
- Generated data is realistic but not real
- Scripts include error handling and transaction management
- Data generation can be customized through the interactive interface 