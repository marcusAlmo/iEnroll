ALTER TABLE system.system_log
ADD COLUMN school_id INTEGER;

ALTER TABLE system.system_log
ADD CONSTRAINT fk_school_history_logs FOREIGN KEY (school_id)
REFERENCES enrollment.school(school_id);

-- added the school id field for optional relationship between the record and the initiator specifics