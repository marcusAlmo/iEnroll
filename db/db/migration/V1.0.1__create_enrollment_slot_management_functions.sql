-- +migrate Up
-- Description: Creates functions and triggers for managing enrollment application slots
-- Author: Mark June Almojuela
-- Date: 2024-04-09

-- Add default value for is_closed column
ALTER TABLE enrollment.enrollment_application
    ALTER COLUMN is_closed 
    SET DEFAULT false;

-- Add grade_level_offered_id column and foreign key constraint
ALTER TABLE enrollment.aux_schedule_slot
    ADD COLUMN grade_level_offered_id INT NOT NULL;

ALTER TABLE enrollment.aux_schedule_slot
    ADD CONSTRAINT fk_grade_level_offered_id
    FOREIGN KEY (grade_level_offered_id)
    REFERENCES system.grade_level(id);

-- +migrate Down
-- Description: Drops the enrollment slot management functions and triggers
-- Author: Mark June Almojuela
-- Date: 2024-04-09

-- Remove foreign key constraint and column
ALTER TABLE enrollment.aux_schedule_slot
    DROP CONSTRAINT IF EXISTS fk_grade_level_offered_id;

ALTER TABLE enrollment.aux_schedule_slot
    DROP COLUMN IF EXISTS grade_level_offered_id;

-- Remove default value for is_closed column
ALTER TABLE enrollment.enrollment_application
    ALTER COLUMN is_closed 
    DROP DEFAULT; 