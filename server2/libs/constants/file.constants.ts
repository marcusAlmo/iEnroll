import { join } from 'path';

export const UPLOADDIR = join(__dirname, '..', '..', '..', 'uploads');
export const TEMPDIR = join(__dirname, '..', '..', '..', 'temp');
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
