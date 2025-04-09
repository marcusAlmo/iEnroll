CREATE OR REPLACE FUNCTION fn_remaining_plan_slot(p_school_id INTEGER, p_slot_type TEXT)
RETURNS INTEGER AS $$
/**
 * Dynamic Slot Availability Calculator
 * 
 * Calculates remaining available slots for a school based on subscription 
 * and current resource utilization across multiple dimensions.
 * 
 * Core Capabilities:
 * - Precise slot availability tracking
 * - Multi-dimensional resource management
 * - Flexible subscription-based allocation
 * 
 * Slot Type Calculations:
 * Computes remaining slots by subtracting used slots from total allocated slots
 * 
 * Supported Slot Types:
 * - 'student': Remaining student enrollment slots
 * - 'admin': Remaining administrative user slots
 * - 'form_field': Remaining form field configuration slots
 * - 'image': Remaining image upload slots
 * 
 * Calculation Strategy:
 * 1. Retrieve total subscription-based slots
 * 2. Subtract currently used slots
 * 3. Handle potential negative or null results
 * 
 * Performance Characteristics:
 * - Constant-time complexity
 * - Minimal function call overhead
 * - Predictable execution path
 * 
 * Input Parameters:
 * @param p_school_id Unique identifier of the school
 * @param p_slot_type Resource type to calculate remaining slots
 * 
 * @returns INTEGER representing available slots
 * 
 * @usage Examples:
 * SELECT fn_remaining_plan_slot(123, 'student');   -- Remaining student slots
 * SELECT fn_remaining_plan_slot(123, 'admin');     -- Remaining admin slots
 * SELECT fn_remaining_plan_slot(123, 'image');     -- Remaining image slots
 * 
 * @note Supports dynamic resource allocation tracking
 * @note Returns 0 if no slots are available
 * 
 * @author almojuela_mj
 * @version 1.2.0
 * @date 2025-03-22
 */
DECLARE
    v_count INTEGER;
BEGIN
    -- Use CASE for structured, extensible type handling
    CASE p_slot_type
        WHEN 'student' THEN
            v_count := fn_count_subscription_slot(p_school_id, 'student') - 
                       fn_count_slots_used(p_school_id, 'student');

        WHEN 'admin' THEN
            v_count := fn_count_subscription_slot(p_school_id, 'admin') - 
                       fn_count_slots_used(p_school_id, 'admin');

        WHEN 'form_field' THEN
            v_count := fn_count_subscription_slot(p_school_id, 'form_field') - 
                       fn_count_slots_used(p_school_id, 'form_field');

        WHEN 'image' THEN
            v_count := fn_count_subscription_slot(p_school_id, 'image') - 
                       fn_count_slots_used(p_school_id, 'image');

        ELSE
            RAISE EXCEPTION 'Invalid slot type: %. Supported types: student, admin, form_field, image', p_slot_type;
    END CASE;

    RETURN GREATEST(COALESCE(v_count, 0), 0);
END;
$$ LANGUAGE plpgsql;