CREATE TABLE gistbins (
id bigserial PRIMARY KEY,
title text NOT NULL,
content text NOT NULL,
category text NOT NULL,
created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
expires timestamp with time zone
);

CREATE TABLE users (
    id bigserial PRIMARY KEY,
    username citext NOT NULL,
    email citext UNIQUE NOT NULL,
    hashed_password bytea NOT NULL
);

ALTER TABLE gistbins ADD COLUMN user_id bigint REFERENCES users ON DELETE CASCADE;

INSERT INTO users(email, username, hashed_password) VALUES (
    'asxraj@gmail.com',
    'asxraj',
    '$2a$12$nSs.WsLHDshJUb4JRIWGTOdLm5LmyP3ekwMCOelwjW1z1ENLamYA2'
);