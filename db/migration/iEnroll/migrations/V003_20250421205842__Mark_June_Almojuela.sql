-- ADD UNIQUE CONSTRAINT ON PROGRAMS
ALTER TABLE system.academic_program
ADD CONSTRAINT uq_program_description UNIQUE(program, description);