-- Description: This migration adds grade level reference to schedule slots and implements a trigger for closed schedules
-- Author: Mark June Almojuela
-- Date: 2024-03-19

-- Set default value for is_closed column in aux_schedule_slot
ALTER TABLE enrollment.aux_schedule_slot
    ALTER COLUMN is_closed SET DEFAULT false;

-- Add grade level reference to schedule slots
ALTER TABLE enrollment.aux_schedule_slot
    ADD COLUMN grade_level_offered_id INT NOT NULL;

-- Add foreign key constraint for grade level
ALTER TABLE enrollment.aux_schedule_slot
    ADD CONSTRAINT fk_grade_level_offered_id
    FOREIGN KEY (grade_level_offered_id)
    REFERENCES enrollment.grade_level_offered(grade_level_offered_id);

-- Create function to handle deletion of closed schedules
CREATE OR REPLACE FUNCTION enrollment.fn_delete_closed_schedule()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM enrollment.aux_schedule_slot
    WHERE is_closed = true;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically delete closed schedules
CREATE TRIGGER t_delete_closed_schedule
    AFTER UPDATE ON enrollment.aux_schedule_slot
    FOR EACH ROW 
    EXECUTE FUNCTION enrollment.fn_delete_closed_schedule();