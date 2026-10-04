import type { MonitoredFile } from "../types/file";
import type { MonitoredFileChanges } from "../types/file";

const API_URL = "http://127.0.0.1:8000";

export async function getFiles(): Promise<MonitoredFile[]> {
  const response = await fetch(`${API_URL}/files`);

  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }

  return response.json();
}

export async function verifyFile(id:number):Promise<string> {
  const response = await fetch(`${API_URL}/files/${id}/verify`,{
    method:'POST'
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current status");
  }

  return response.json();
}

export async function deleteFile(file_name:string):Promise<string> {
  const response = await fetch(`${API_URL}/files/${file_name}`,{
    method:'DELETE'
  });

  if (!response.ok) {
    throw new Error("Failed to delete the file");
  }

  return response.json();
}

export async function uploadFile(file:File):Promise<MonitoredFile> {
  const formData=new FormData();
  formData.append('file',file);
  const response = await fetch(`${API_URL}/files/upload`,{
    method:'POST',
    body:formData
  });

  if (!response.ok) {
    throw new Error(`Error${response.status} Failed to upload File`);
  }

  return response.json();
}

export async function getFileChanges(): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/logs`);
  if(!response.ok){
    throw new Error("Failed to fetch log file");
  }
  return response.json();
}