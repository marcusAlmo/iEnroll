CREATE SCHEMA IF NOT EXISTS chat;

-- conversation
CREATE TABLE IF NOT EXISTS chat.conversation (
    conversation_id INT NOT NULL,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_conversation PRIMARY KEY (conversation_id),
    constraint uq_conversation UNIQUE (user_id_1, user_id_2),
    constraint ck_conversation CHECK (user_id_1 != user_id_2)
);

-- message
CREATE TABLE IF NOT EXISTS chat.message (
    message_id INT NOT NULL,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    constraint pk_message PRIMARY KEY (message_id)
);