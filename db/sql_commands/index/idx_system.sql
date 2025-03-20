-- grade_level
CREATE INDEX idx_grade_level_academic_level_code ON system.grade_level(academic_level_code);
CREATE INDEX idx_grade_level_grade_level ON system.grade_level(grade_level);

-- system_log
CREATE INDEX idx_system_log_initiator ON system.system_log(initiator);
CREATE INDEX idx_system_log_log_datetime ON system.system_log(log_datetime);

