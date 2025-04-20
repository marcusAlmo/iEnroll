CREATE OR REPLACE FUNCTION enrollment.fn_school_subscription_update()
RETURNS TRIGGER AS $$
/**
 * School Subscription Update Validation Trigger
 * 
 * Comprehensive validation mechanism for school subscription modifications
 * ensuring data integrity, preventing unauthorized changes, and maintaining
 * strict control over subscription lifecycle.
 * 
 * Core Validation Checks:
 * 1. Prevent modifications to active subscriptions
 * 2. Enforce immutable subscription core attributes
 * 3. Maintain audit trail and timestamp tracking
 * 
 * Constraint Enforcement Strategies:
 * - Block changes to critical subscription metadata
 * - Restrict modifications based on subscription state
 * - Ensure transparent and traceable updates
 * 
 * Performance Characteristics:
 * - Minimal computational overhead
 * - Constant-time complexity
 * - Atomic transaction validation
 * 
 * Key Validation Rules:
 * - Immutable attributes for active subscriptions
 * - Controlled state transitions
 * - Automatic timestamp updates
 * 
 * Immutable Subscription Attributes:
 * - Plan code
 * - School identifier
 * - Subscription duration
 * - Start and end dates
 * - Associated invoice
 * 
 * Input Parameters:
 * @param NEW Updated row data
 * @param OLD Original row data before update
 * 
 * @returns TRIGGER result (NEW or raises exception)
 * 
 * @usage Automatically triggered on school_subscription table updates
 * 
 * @note Prevents unauthorized subscription modifications
 * @note Maintains subscription lifecycle integrity
 * 
 * @author almojuela_mj
 * @version 1.4.0
 * @date 2025-03-22
 */
DECLARE
    -- Predefined critical attributes for validation
    c_critical_attrs CONSTANT TEXT[] := ARRAY[
        'plan_code', 
        'school_id', 
        'duration_days', 
        'start_datetime', 
        'end_datetime', 
        'invoice_id'
    ];
    
    -- Track any critical attribute changes
    v_critical_change BOOLEAN := FALSE;
    
    -- Loop variable for FOREACH
    v_attr TEXT;
BEGIN
    -- Check for changes when activating/deactivating subscription
    IF NEW.is_active <> OLD.is_active THEN
        -- Prevent modifications during state change
        FOREACH v_attr IN ARRAY c_critical_attrs LOOP
            CASE v_attr
                WHEN 'plan_code' THEN 
                    IF NEW.plan_code <> OLD.plan_code THEN 
                        v_critical_change := TRUE; 
                    END IF;
                WHEN 'school_id' THEN 
                    IF NEW.school_id <> OLD.school_id THEN 
                        v_critical_change := TRUE; 
                    END IF;
                WHEN 'duration_days' THEN 
                    IF NEW.duration_days <> OLD.duration_days THEN 
                        v_critical_change := TRUE; 
                    END IF;
                WHEN 'start_datetime' THEN 
                    IF NEW.start_datetime <> OLD.start_datetime THEN 
                        v_critical_change := TRUE; 
                    END IF;
                WHEN 'end_datetime' THEN 
                    IF NEW.end_datetime <> OLD.end_datetime THEN 
                        v_critical_change := TRUE; 
                    END IF;
                WHEN 'invoice_id' THEN 
                    IF NEW.invoice_id <> OLD.invoice_id THEN 
                        v_critical_change := TRUE; 
                    END IF;
            END CASE;
        END LOOP;

        -- Raise exception if any critical attributes changed
        IF v_critical_change THEN
            RAISE EXCEPTION 'Cannot modify critical subscription attributes during state change.';
        END IF;
    
    -- Prevent modifications to an active subscription
    ELSIF NEW.is_active = TRUE THEN
        RAISE EXCEPTION 'Cannot modify an active school subscription.';
    
    -- Enforce strict update constraints for inactive subscriptions
    ELSE
        -- Validate that no critical attributes are being modified
        IF NEW.plan_code <> OLD.plan_code OR
           NEW.school_id <> OLD.school_id OR
           NEW.duration_days <> OLD.duration_days OR
           NEW.start_datetime <> OLD.start_datetime OR
           NEW.end_datetime <> OLD.end_datetime OR
           NEW.invoice_id <> OLD.invoice_id THEN
            RAISE EXCEPTION 'Subscription modifications are strictly controlled.';
        END IF;
    END IF;

    -- Automatic timestamp update for tracking
    NEW.update_datetime = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;