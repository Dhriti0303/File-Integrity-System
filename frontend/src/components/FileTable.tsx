import type { MonitoredFile } from "../types/file";
import "daisyui"
import {RecordMessage,CopyMessage} from "../components/Message"



interface F_Table {
    files: MonitoredFile[];
    onVerify: (id: number) => void;
    onDelete: (file_name: string) => void;
    onUpload: (file: File) => Promise<void>;
    error: string | null;
    loading: boolean;

    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}


const FileTable=({files,onVerify,onDelete,loading,currentPage,totalPages,onPageChange}:F_Table)=> {
    return (
        <>
        {loading?<button className="btn btn-square">
  <span className="loading loading-spinner" style={{"margin":"1rem"}}></span>
</button>:''}
        {files.length==0 ? 
        <RecordMessage />:(
        <table className="table-section">
            <thead>
                <tr>
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
        )
        }
        
{totalPages > 1 && (
    <div className="pagination">
        <button
            className="btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
        >
           Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            page => (
            <button
                key={page}
                className={`btn ${
                  currentPage === page ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}

            >
                {page}
            </button>
        ))}

        <button
            className="btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
        >
           next
        </button>

        <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

    </div>
)}
        </>
    )
}
export default FileTable 