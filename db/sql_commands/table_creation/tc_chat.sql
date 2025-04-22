CREATE SCHEMA IF NOT EXISTS chat;
-- conversation
CREATE TABLE IF NOT EXISTS chat.conversation (
    conversation_id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    participant_1 INT NOT NULL,
    participant_2 INT NOT NULL,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_conversation PRIMARY KEY (conversation_id),
    constraint uq_conversation UNIQUE (participant_1, participant_2),
    constraint ck_conversation CHECK (participant_1 != participant_2)
);

-- message
CREATE TABLE IF NOT EXISTS chat.message (
    message_id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_message PRIMARY KEY (message_id)
);
