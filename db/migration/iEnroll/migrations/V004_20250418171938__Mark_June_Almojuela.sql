ALTER TABLE enrollment.file
DROP CONSTRAINT pk_file;

ALTER TABLE enrollment.file
ADD CONSTRAINT pk_file PRIMARY KEY (file_id);

ALTER TABLE enrollment.school_file
ADD CONSTRAINT fk_school_file_file_id 
FOREIGN KEY (file_id)
REFERENCES enrollment.file(file_id) 
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE enrollment.application_attachment
ADD CONSTRAINT fk_application_attachment_file_id 
FOREIGN KEY (file_id)
REFERENCES enrollment.file(file_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE enrollment.enrollment_fee_payment  
ADD CONSTRAINT fk_fee_payment_file_id 
FOREIGN KEY (file_id)
REFERENCES enrollment.file(file_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- restored the fk relationships with the file table
