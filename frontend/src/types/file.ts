export interface MonitoredFile {
  id: number;
  file_name: string;
  file_hash: string;
  upload_time: string;
  last_verified_time: string | null;
  status: string;
}
