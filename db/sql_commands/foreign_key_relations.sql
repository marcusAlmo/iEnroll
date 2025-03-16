-- role_permission_relation
ALTER TABLE enrollment.role_permission
    ADD CONSTRAINT fk_role_permission_role_code FOREIGN KEY (role_code) REFERENCES enrollment.role(role_code);
ALTER TABLE enrollment.role_permission
    ADD CONSTRAINT fk_role_permission_permission_id FOREIGN KEY (permission_id) REFERENCES enrollment.permission(permission_id);

-- user_role_relation
ALTER TABLE enrollment.user_role
    ADD CONSTRAINT fk_user_role_user_id FOREIGN KEY (user_id) REFERENCES enrollment.user(user_id);
ALTER TABLE enrollment.user_role
    ADD CONSTRAINT fk_user_role_role_code FOREIGN KEY (role_code) REFERENCES enrollment.role(role_code);
