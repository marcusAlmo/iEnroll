-- Description: This migration adds application slot column to enrollment schedule table with initial default value
-- Author: Mark June Almojuela
-- Date: 2024-03-19

-- Add application slot column with default value of 50
ALTER TABLE enrollment.enrollment_schedule
    ADD COLUMN application_slot INT DEFAULT 50 NOT NULL 
    CHECK (application_slot >= 0);

-- Remove the default value after initial data population
ALTER TABLE enrollment.enrollment_schedule
    ALTER COLUMN application_slot DROP DEFAULT;