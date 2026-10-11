
export interface MonitoredFileChanges {
  id: number;
  file_id:number;
  file_name: string;
  old_hash: string;
  new_hash: string | null;
  detected_at: string;
  action: string ;
  change_type: string;
}