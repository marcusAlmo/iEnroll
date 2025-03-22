CREATE OR REPLACE FUNCTION fn_count_active_applications(p_grade_level_offered_id INT)
RETURNS INTEGER AS $$
/**
 * Counts the number of active enrollment applications for a specific grade level.
 * 
 * This function provides a flexible mechanism to track active applications 
 * across different statuses for a given grade level.
 * 
 * Active Application Statuses:
 * - 'pending'
 * - 'accepted'
 * - 'invalid'
 * 
 * Counting Mechanism:
 * 1. Finds all grade levels offered by the school
 * 2. Checks enrollment applications for those grade levels
 * 3. Counts applications with specified active statuses
 * 
 * Key Features:
 * - Supports complex nested subquery
 * - Provides a dynamic count of active applications
 * - Can be used in various update and validation scenarios
 * 
 * @param NEW The current row being processed (implied context)
 * @returns INTEGER representing the count of active applications
 * 
 * @example
 * -- Usage in a trigger or update function
 * IF fn_count_active_applications() > 0 THEN
 *     RAISE EXCEPTION 'School has active applications';
 * END IF;
 * 
 * @author almojuela_mj
 * @version 1.0.0
 * @date 2025-03-22
 */
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM enrollment.enrollment_application 
        WHERE grade_level_offered_id = p_grade_level_offered_id AND (
            status = 'pending' OR 
            status = 'accepted' OR 
            status = 'invalid'
        )
    );
END;
$$ LANGUAGE plpgsql;