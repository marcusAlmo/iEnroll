-- message table indexes
CREATE INDEX idx_message_conversation ON chat.message(conversation_id);
CREATE INDEX idx_message_sender ON chat.message(sender_id);

-- conversation table indexes
CREATE INDEX idx_conversation_participant_1 ON chat.conversation(participant_1);
CREATE INDEX idx_conversation_participant_2 ON chat.conversation(participant_2);
