-- update function
CREATE OR REPLACE FUNCTION fn_update_datetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- consumption_data trigger
CREATE TRIGGER t_update_consumption_data
    BEFORE UPDATE ON metrics.consumption_data
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- enrollmenet_data trigger
CREATE TRIGGER t_update_enrollment_data
    BEFORE UPDATE ON metrics.enrollment_data
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();

-- performance_data trigger
CREATE TRIGGER t_update_performance_data
    BEFORE UPDATE ON metrics.performance_data
    FOR EACH ROW EXECUTE FUNCTION fn_update_datetime();