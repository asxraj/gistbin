ALTER TABLE gistbins ADD COLUMN user_id bigint REFERENCES users ON DELETE CASCADE;
