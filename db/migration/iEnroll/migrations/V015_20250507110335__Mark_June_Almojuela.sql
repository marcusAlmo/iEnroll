ALTER TABLE system.grade_level
ADD COLUMN ordinal_position INT;

DO $$ 
DECLARE 
    counter INT := 0;
BEGIN
    -- Assign ordinal_position based on the current order of rows
    UPDATE system.grade_level g
    SET ordinal_position = row_num
    FROM (
        SELECT grade_level_code, 
               ROW_NUMBER() OVER () AS row_num 
        FROM system.grade_level
    ) AS subquery
    WHERE g.grade_level_code = subquery.grade_level_code;
END $$;

ALTER TABLE system.grade_level
ALTER COLUMN ordinal_position SET NOT NULL;