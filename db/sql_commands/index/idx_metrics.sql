-- consumption_data table indexes
CREATE INDEX idx_consumption_data_school_acad_year_id ON metrics.consumption_data(school_acad_year_id);
CREATE INDEX idx_consumption_data_date ON metrics.consumption_data(date);

-- enrollment_data table indexes
CREATE INDEX idx_enrollment_data_school_acad_year_id ON metrics.enrollment_data(school_acad_year_id);
CREATE INDEX idx_enrollment_data_date ON metrics.enrollment_data(date);

-- performance_data table indexes
CREATE INDEX idx_performance_data_school_acad_year_id ON metrics.performance_data(school_acad_year_id);
CREATE INDEX idx_performance_data_date ON metrics.performance_data(date);
