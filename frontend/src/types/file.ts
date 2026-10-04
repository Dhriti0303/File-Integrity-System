export interface MonitoredFile {
  id: number;
  file_name: string;
  file_hash: string;
  upload_time: string;
  last_verified_time: string | null;
  status: string;
}

export interface MonitoredFileChanges {
  id: number;
  file_id:number;
  file_name: string;
  old_hash: string;
  new_hash: string | null;
  detected_at: string;
  action: string ;
  change_type: string | null;
}