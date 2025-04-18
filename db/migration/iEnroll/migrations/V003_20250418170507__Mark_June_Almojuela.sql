ALTER TABLE enrollment.file 
DROP CONSTRAINT pk_file CASCADE;

ALTER TABLE enrollment.file
ADD CONSTRAINT pk_file PRIMARY KEY(file_id, uuid);

-- set a composite pk for non-conflicting id accross services