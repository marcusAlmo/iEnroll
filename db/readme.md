# SQL Commands Documentation

<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
This directory contains all the SQL commands used in the iEnroll database system. The commands are organized into different categories based on their functionality and purpose.
</div>

## Directory Structure

<div style="background-color: #e9ecef; padding: 15px; border-radius: 6px; margin: 15px 0;">
<pre style="margin: 0;">
sql_commands/
├── table_creation/         # SQL scripts for creating database tables
├── foreign_keys/          # SQL scripts for defining foreign key constraints
├── index/                 # SQL scripts for creating database indexes
└── stored_functions_procedures/
    ├── functions/         # SQL functions
    ├── procedures/        # SQL stored procedures
    └── triggers/          # SQL triggers
</pre>
</div>

## Table Creation Scripts

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
The `table_creation/` directory contains SQL scripts for creating the database tables:

<ul style="list-style-type: none; padding-left: 0;">
<li style="padding: 8px; border-left: 4px solid #007bff; margin: 5px 0; background-color: #fff;">📄 `tc_system.sql`: Creates system-related tables</li>
<li style="padding: 8px; border-left: 4px solid #007bff; margin: 5px 0; background-color: #fff;">📄 `tc_enrollment.sql`: Creates enrollment-related tables</li>
<li style="padding: 8px; border-left: 4px solid #007bff; margin: 5px 0; background-color: #fff;">📄 `tc_record.sql`: Creates record-related tables</li>
<li style="padding: 8px; border-left: 4px solid #007bff; margin: 5px 0; background-color: #fff;">📄 `tc_metrics.sql`: Creates metrics-related tables</li>
<li style="padding: 8px; border-left: 4px solid #007bff; margin: 5px 0; background-color: #fff;">📄 `tc_chat.sql`: Creates chat-related tables</li>
</ul>
</div>

## Foreign Key Constraints

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
The `foreign_keys/` directory contains SQL scripts that define the relationships between tables:

<ul style="list-style-type: none; padding-left: 0;">
<li style="padding: 8px; border-left: 4px solid #28a745; margin: 5px 0; background-color: #fff;">🔗 `fk_system.sql`: Foreign key constraints for system tables</li>
<li style="padding: 8px; border-left: 4px solid #28a745; margin: 5px 0; background-color: #fff;">🔗 `fk_enrollment.sql`: Foreign key constraints for enrollment tables</li>
<li style="padding: 8px; border-left: 4px solid #28a745; margin: 5px 0; background-color: #fff;">🔗 `fk_record.sql`: Foreign key constraints for record tables</li>
<li style="padding: 8px; border-left: 4px solid #28a745; margin: 5px 0; background-color: #fff;">🔗 `fk_metrics.sql`: Foreign key constraints for metrics tables</li>
<li style="padding: 8px; border-left: 4px solid #28a745; margin: 5px 0; background-color: #fff;">🔗 `fk_chat.sql`: Foreign key constraints for chat tables</li>
</ul>
</div>

## Database Indexes

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
The `index/` directory contains SQL scripts for creating database indexes to optimize query performance:

<ul style="list-style-type: none; padding-left: 0;">
<li style="padding: 8px; border-left: 4px solid #ffc107; margin: 5px 0; background-color: #fff;">📊 `idx_system.sql`: Indexes for system tables</li>
<li style="padding: 8px; border-left: 4px solid #ffc107; margin: 5px 0; background-color: #fff;">📊 `idx_enrollment.sql`: Indexes for enrollment tables</li>
<li style="padding: 8px; border-left: 4px solid #ffc107; margin: 5px 0; background-color: #fff;">📊 `idx_record.sql`: Indexes for record tables</li>
<li style="padding: 8px; border-left: 4px solid #ffc107; margin: 5px 0; background-color: #fff;">📊 `idx_metrics.sql`: Indexes for metrics tables</li>
<li style="padding: 8px; border-left: 4px solid #ffc107; margin: 5px 0; background-color: #fff;">📊 `idx_chat.sql`: Indexes for chat tables</li>
</ul>
</div>

## Stored Functions and Procedures

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
The `stored_functions_procedures/` directory contains:

### Functions
<div style="padding: 10px; background-color: #fff; border-radius: 4px; margin: 10px 0;">
Contains SQL functions that perform specific operations and return values.
</div>

### Procedures
<div style="padding: 10px; background-color: #fff; border-radius: 4px; margin: 10px 0;">
Contains stored procedures that encapsulate complex operations and business logic.
</div>

### Triggers
<div style="padding: 10px; background-color: #fff; border-radius: 4px; margin: 10px 0;">
Contains database triggers that automatically execute in response to specific events.
</div>
</div>

## Usage Instructions

<div style="background-color: #e9ecef; padding: 15px; border-radius: 6px; margin: 15px 0;">
<ol style="padding-left: 20px;">
<li>Execute the scripts in the following order:
   <ul style="list-style-type: none; padding-left: 0;">
   <li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">1️⃣ First: `table_creation/` scripts</li>
   <li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">2️⃣ Second: `foreign_keys/` scripts</li>
   <li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">3️⃣ Third: `index/` scripts</li>
   <li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">4️⃣ Finally: `stored_functions_procedures/` scripts</li>
   </ul>
</li>
<li>Make sure to execute the scripts in the correct order within each directory as they may have dependencies on each other.</li>
</ol>
</div>

## Best Practices

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
<ul style="list-style-type: none; padding-left: 0;">
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">✅ Always backup your database before executing these scripts</li>
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">✅ Review the scripts before execution to understand their impact</li>
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">✅ Test the scripts in a development environment first</li>
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">✅ Document any custom modifications made to the scripts</li>
</ul>
</div>

## Maintenance

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
<ul style="list-style-type: none; padding-left: 0;">
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">🔄 Keep the scripts organized and well-documented</li>
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">🔄 Update the documentation when making changes to the scripts</li>
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">🔄 Version control all changes to the scripts</li>
<li style="padding: 8px; margin: 5px 0; background-color: #fff; border-radius: 4px;">🔄 Test all scripts after making modifications</li>
</ul>
</div>

## Notes

<div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107;">
<ul style="list-style-type: none; padding-left: 0;">
<li style="padding: 8px; margin: 5px 0;">⚠️ The scripts are designed to work with a specific database schema</li>
<li style="padding: 8px; margin: 5px 0;">⚠️ Some scripts may need to be modified based on your specific database configuration</li>
<li style="padding: 8px; margin: 5px 0;">⚠️ Always check for dependencies before executing any script</li>
</ul>
</div>

# Environment Setup

## Database Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ienroll
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_SCHEMA=enrollment
   ```

3. Make sure the `.env` file is in your `.gitignore` to prevent committing sensitive information.

## Security Notes

- Never commit the `.env` file to version control
- Keep your database credentials secure
- Use different credentials for development and production
- Regularly rotate passwords
- Use SSL for database connections in production

## Database Connection

The application will use these environment variables to connect to the PostgreSQL database. Make sure:
- The database server is running
- The specified user has appropriate permissions
- The database and schema exist
- Network access is properly configured

## Troubleshooting

If you encounter connection issues:
1. Verify the credentials in `.env`
2. Check if PostgreSQL is running
3. Confirm network connectivity
4. Verify user permissions
5. Check firewall settings 