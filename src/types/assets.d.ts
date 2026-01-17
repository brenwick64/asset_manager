interface AudioAsset {
    filename: string;
    content_type: string;
    file_extension: string;
    absolute_path: string,
    relative_path: string;
}

interface NewAudioAsset extends AudioAsset {
    is_checked: boolean;
    json_tags: string;
}

interface DBAudioAsset extends AudioAsset {
    uuid: string;
    created_date_utc: string;
    last_modified_date_utc: string;
}