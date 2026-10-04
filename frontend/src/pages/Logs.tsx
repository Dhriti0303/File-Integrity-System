import { useEffect, useState } from "react"
import { getFileChanges } from "../services/api"
import type { MonitoredFileChanges } from "../types/file"
import FileChangeTable from "../components/FileChangeTable"

const Logs = () => {
  const [fileChange,setFileChange]=useState<MonitoredFileChanges[]>([])
  useEffect(()=>{
    const data=async()=>{
      const result=await getFileChanges();
      setFileChange(result);
    };
    data();
  },[])
  return (
    <div>
      <FileChangeTable fileChanges={fileChange}/>
    </div>
  )
}
export default Logs