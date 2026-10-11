import type { MonitoredFile } from "../types/file";
import type { MonitoredFileChanges } from "../types/fileChange";
import type { LogFilter } from "../types/logFilter";

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

export async function getFileChanges( limit = 10,offset = 0): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/logs?limit=${limit}&offset=${offset}`);
  if(!response.ok){
    throw new Error("Failed to fetch log file");
  }
  return response.json();
}

export async function getSingleFileChange(limit=10,offset=0,name:string): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/log/${encodeURIComponent(name)}/changes?limit=${limit}&offset=${offset}`);
  if(!response.ok){
    throw new Error("Failed to fetch log file");
  }
  return response.json();
}

export async function getStatus(limit = 10,offset = 0,change_type:string): Promise<MonitoredFileChanges[]>{
 const response = await fetch(
        `${API_URL}/log/status?status=${encodeURIComponent(change_type)}&limit=${limit}&offset=${offset}`);
    if (!response.ok) {
       const error=await response.text();
        console.log(error)
        throw new Error("Failed to fetch status");   
         }
    return response.json();
    }

export async function getAction(limit=10, offset=0,action:string): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/log/action?action=${encodeURIComponent(action)}&limit=${limit}&offset=${offset}`);
  if(!response.ok){
    const error = await response.text();
     console.log(error)
    throw new Error("Failed to fetch action");
  }
  return response.json();
} 


export async function getWeekLogs(limit=10, offset=0,): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/logs/7-days?limit=${limit}&offset=${offset}`);
  if(!response.ok){
    const error = await response.text();
     console.log(error)
    throw new Error("Failed to fetch week log");
  }
  return response.json();
}

export async function getMonthLogs(limit=10, offset=0): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/logs/month?limit=${limit}&offset=${offset}`);
  if(!response.ok){
    const error = await response.text();
     console.log(error)
    throw new Error("Failed to fetch month log");
  }
  return response.json();
}

export async function getDayLogs(limit=10, offset=0,date:string): Promise<MonitoredFileChanges[]>{
  const response=await fetch(`${API_URL}/logs/day?date=${encodeURIComponent(date)}?limit=${limit}&offset=${offset}`);
  if(!response.ok){
    const error = await response.text();
     console.log(error)
    throw new Error("Failed to fetch log");
  }
  return response.json();
}

export async function fetchLogsPage(filter: LogFilter,limit: number,offset: number): Promise<MonitoredFileChanges[]> {
  const params = new URLSearchParams({limit: String(limit),offset: String(offset),});
  let endpoint = "/logs";
  switch (filter.type) {
    case "status":
      endpoint = "/log/status";
      params.set("status", filter.value);
      break;
    case "action":
      endpoint = "/log/action";
      params.set("action", filter.value);
      break;
    case "week":
      endpoint = "/logs/7-days";
      break;
    case "month":
      endpoint = "/logs/month";
      break;
    case "date":
      endpoint = "/logs/day";
      params.set("date", filter.value);
      break;
    case "file":
      endpoint = `/log/${encodeURIComponent(filter.value)}/changes`;
      break;
    case "all":
      break;
  }
  const response = await fetch(`${API_URL}${endpoint}?${params.toString()}`);
  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error("Failed to fetch logs");
  }
  return response.json();
}

export async function fetchLogsCount(filter: LogFilter): Promise<{ total: number }> {
  const params = new URLSearchParams();
  switch (filter.type) {
    case "status":
      params.set("status", filter.value);
      break;
    case "action":
      params.set("action", filter.value);
      break;
    case "week":
      params.set("period", "week");
      break;
    case "month":
      params.set("period", "month");
      break;
    case "date":
      params.set("selected_date", filter.value);
      break;
    case "file":
      params.set("name", filter.value);
      break;
    case "all":
      break;
  }
  const query = params.toString();
  const response = await fetch(`${API_URL}/logs/count${query ? `?${query}` : ""}`);
  if (!response.ok) {
    throw new Error("Failed to fetch log count");
  }
  return response.json();
}

export const fetchFilesPage = async (limit: number, offset: number) => {
  const response = await fetch(
    `${API_URL}/files?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }

  return response.json();
};

export const fetchFilesCount = async (): Promise<{ total: number }> => {
  const response = await fetch(`${API_URL}/files/count`);

  if (!response.ok) {
    throw new Error("Failed to fetch file count");
  }

  const data = await response.json();
  console.log("Files count API response:", data);

  return data;
};
