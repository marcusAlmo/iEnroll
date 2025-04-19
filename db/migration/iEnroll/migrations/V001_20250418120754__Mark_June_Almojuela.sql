ALTER TABLE enrollment.file
ADD COLUMN school_id INT NOT NULL,
ADD COLUMN iv VARCHAR(255) NOT NULL,
ADD CONSTRAINT fk_file_school_id 
FOREIGN KEY (school_id) REFERENCES enrollment.school(school_id);