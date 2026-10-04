import type { MonitoredFile } from "../types/file";
import "daisyui"
import {RecordMessage,CopyMessage} from "../components/Message"


interface F_Table{
    files:MonitoredFile[];
    onVerify:(id:number)=>void;
    onDelete:(file_name:string)=>void;
    onUpload:(file:File)=>Promise<void>; 
    error:string | null;
    loading:boolean;
}

const FileTable=({files,onVerify,onDelete,loading}:F_Table)=> {
   
    return (
        <>
        {loading?<p  className="loading loading-spinner loading-md">Loading Please Wait....</p>:''}
        {files.length!=0 ? 
        <table className="table-section">
            <thead>
                <tr className="table-header">
                    <th>ID</th>
                    <th>FILE NAME</th>
                    <th>HASH VALUE</th>
                    <th>UPLOAD TIME</th>
                    <th>LAST VERIFIED TIME</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                {files.map((file)=>(
    
                    <tr key={file.id}>
                        <td>{file.id}</td>
                        <td>{file.file_name}</td>
                        <td>
                            <div className="hash-container">
                                <p title={file.file_hash}>{file.file_hash.length > 10 ?`${file.file_hash.slice(0,10)}...`:file.file_hash}</p>
                               <CopyMessage id={file.id} hash={file.file_hash}/>
                            </div>
                        </td>
                        <td>{file.upload_time}</td>
                        <td>{file.last_verified_time}</td>
                        <td>
                            <span id={`status-${file.status.toLowerCase()}`} className="btn btn-primary">
                                {file.status}
                            </span>
                        </td>
                        <td>
                            <div className="file-actions">
                            <button onClick={() => onVerify(file.id)} className="btn btn-primary">Verify</button> 
                            <button onClick={() => onDelete(file.file_name)} className="btn btn-active btn-error">&#x1F5D1;</button> 
                           </div>
                        </td>
                    </tr>  
                ))
            }
            </tbody>
        </table>
        :<RecordMessage />}
        </>
    )
}
export default FileTable 