CREATE TABLE IF NOT EXISTS audio_assets (
	uuid TEXT PRIMARY KEY
		DEFAULT (
			lower(
                hex(randomblob(4)) || '-' ||
                hex(randomblob(2)) || '-4' ||
                substr(hex(randomblob(2)), 2) || '-' ||
                substr('89ab', abs(random()) % 4 + 1, 1) ||
                substr(hex(randomblob(2)), 2) || '-' ||
                hex(randomblob(6))
			)
		) NOT NULL,
	filename TEXT NOT NULL,
	content_type TEXT NOT NULL,
    file_extension TEXT NOT NULL,
	absolute_path TEXT NOT NULL,
	relative_path TEXT NOT NULL,
	tags TEXT NOT NULL,

	-- Store UTC as ISO-8601 text like: 2025-12-20T19:23:45.123Z
	created_date_utc TEXT NOT NULL
		DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

	last_modified_date_utc TEXT NOT NULL
		DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Checks
    CHECK (length(content_type) > 0),
    CHECK (length(absolute_path) > 0),
    CHECK (length(relative_path) > 0),
	-- basic UUID
	CHECK (
		length(uuid) = 36
		AND substr(uuid, 9, 1)  = '-'
		AND substr(uuid, 14, 1) = '-'
		AND substr(uuid, 19, 1) = '-'
		AND substr(uuid, 24, 1) = '-'
	)
);