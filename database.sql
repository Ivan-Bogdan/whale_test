CREATE DATABASE test;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_login VARCHAR(255) NOT NULL,
    type_login VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
)


INSERT INTO users(user_login, user_password) VALUES ('admin@admin.ru','123456');