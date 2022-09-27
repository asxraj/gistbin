CREATE TABLE IF NOT EXISTS users (
    id bigserial PRIMARY KEY,
    username citext NOT NULL,
    email citext UNIQUE NOT NULL,
    hashed_password bytea NOT NULL
);
