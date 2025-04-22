-- conversation
ALTER TABLE chat.conversation
    ADD CONSTRAINT fk_conversation_participant_1 FOREIGN KEY (participant_1) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE chat.conversation
    ADD CONSTRAINT fk_conversation_participant_2 FOREIGN KEY (participant_2) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- message
ALTER TABLE chat.message
    ADD CONSTRAINT fk_message_conversation_id FOREIGN KEY (conversation_id) REFERENCES chat.conversation(conversation_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE chat.message
    ADD CONSTRAINT fk_message_sender_id FOREIGN KEY (sender_id) REFERENCES enrollment.user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;