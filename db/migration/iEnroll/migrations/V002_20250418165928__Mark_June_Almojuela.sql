ALTER TABLE enrollment.file
ADD COLUMN uuid UUID DEFAULT gen_random_uuid();

-- add uuid for non-conflicting file id