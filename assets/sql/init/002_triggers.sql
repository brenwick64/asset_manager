CREATE TRIGGER IF NOT EXISTS audio_asset_set_last_modified
AFTER UPDATE ON audio_assets
FOR EACH ROW
WHEN NEW.last_modified_date_utc = OLD.last_modified_date_utc
BEGIN
	UPDATE audio_assets
	SET last_modified_date_utc = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
	WHERE uuid = NEW.uuid;
END;