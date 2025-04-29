ALTER TABLE enrollment.access_list 
ADD CONSTRAINT fk_access_list_user_id 
FOREIGN KEY(user_id) REFERENCES enrollment.user(user_id);