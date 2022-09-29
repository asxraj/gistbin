CREATE TABLE IF NOT EXISTS gistbins (
id bigserial PRIMARY KEY,
title text NOT NULL,
content text NOT NULL,
category text NOT NULL,
created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
expires timestamp with time zone
);
