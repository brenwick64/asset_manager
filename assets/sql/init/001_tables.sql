CREATE TABLE IF NOT EXISTS audio_assets (
	uuid TEXT PRIMARY KEY,

	content_type TEXT NOT NULL,
    file_extension TEXT NOT NULL,
	original_filename TEXT NOT NULL,
	storage_uri TEXT NOT NULL,

	-- Store UTC as ISO-8601 text like: 2025-12-20T19:23:45.123Z
	created_date_utc TEXT NOT NULL
		DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

	last_modified_date_utc TEXT NOT NULL
		DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Checks
    CHECK (length(content_type) > 0),
    CHECK (length(original_filename) > 0),
    CHECK (length(storage_uri) > 0),
	-- basic UUID
	CHECK (
		length(uuid) = 36
		AND substr(uuid, 9, 1)  = '-'
		AND substr(uuid, 14, 1) = '-'
		AND substr(uuid, 19, 1) = '-'
		AND substr(uuid, 24, 1) = '-'
	)
);