interface AudioAsset {
    is_checked: boolean;
    filename: string;
    content_type: string;
    file_extension: string;
    absolute_path: string,
    relative_path: string;
}

interface DBAudioAsset {
    uuid: string;
    content_type: string;
    file_extension: string;
    original_filename: string;
    storage_uri: string;
    created_date_utc: string;
    last_modified_date_utc: string;
}