CREATE OR REPLACE FUNCTION enrollment.fn_count_subscription_slot(p_school_id INTEGER, p_slot_type TEXT)
RETURNS INTEGER AS $$
/**
 * Comprehensive Subscription Slot Allocation Retriever
 * 
 * Provides precise retrieval of maximum slot allocations for different 
 * resource types based on a school's current subscription plan.
 * 
 * Core Capabilities:
 * - Dynamic slot type allocation tracking
 * - Efficient plan-based resource management
 * - Robust error handling
 * - Consistent interface for slot inquiries
 * 
 * Supported Slot Types:
 * - 'student': Maximum student enrollment slots
 * - 'admin': Maximum administrative user slots
 * - 'form_field': Maximum form field configuration slots
 * - 'image': Maximum image upload slots
 * 
 * Performance Strategies:
 * - Minimized JOIN operations
 * - Direct column selection
 * - Early-exit type validation
 * - Predictable query execution
 * 
 * Optimization Techniques:
 * - Uses CASE for structured type handling
 * - Reduces repeated query patterns
 * - Provides clear error messaging
 * 
 * Input Parameters:
 * @param p_school_id Unique identifier of the school
 * @param p_slot_type Resource allocation type to retrieve
 * 
 * @returns INTEGER representing maximum allocated slots
 * 
 * @usage Examples:
 * SELECT fn_subscription_slot_count(123, 'student');   -- Student slot limit
 * SELECT fn_subscription_slot_count(123, 'admin');     -- Admin user slot limit
 * SELECT fn_subscription_slot_count(123, 'image');     -- Image upload limit
 * 
 * @note Supports dynamic subscription-based resource management
 * @note Provides constant-time complexity
 * 
 * @author almojuela_mj
 * @version 1.1.0
 * @date 2025-03-22
 */
DECLARE
    v_slot_count INTEGER;
BEGIN
    CASE p_slot_type
        WHEN 'student' THEN
            SELECT p.max_student_count INTO v_slot_count
            FROM enrollment.school_subscription ss
            JOIN system.plan p ON ss.plan_id = p.plan_id
            WHERE ss.school_id = p_school_id;

        WHEN 'admin' THEN
            SELECT p.max_admin_count INTO v_slot_count
            FROM enrollment.school_subscription ss
            JOIN system.plan p ON ss.plan_id = p.plan_id
            WHERE ss.school_id = p_school_id;

        WHEN 'form_field' THEN
            SELECT p.max_form_field_count INTO v_slot_count
            FROM enrollment.school_subscription ss
            JOIN system.plan p ON ss.plan_id = p.plan_id
            WHERE ss.school_id = p_school_id;

        WHEN 'image' THEN
            SELECT p.max_image_upload_count INTO v_slot_count
            FROM enrollment.school_subscription ss
            JOIN system.plan p ON ss.plan_id = p.plan_id
            WHERE ss.school_id = p_school_id;

        ELSE
            RAISE EXCEPTION 'Invalid slot type: %. Supported types: student, admin, form_field, image', p_slot_type;
    END CASE;

    RETURN COALESCE(v_slot_count, 0);
END;
$$ LANGUAGE plpgsql;