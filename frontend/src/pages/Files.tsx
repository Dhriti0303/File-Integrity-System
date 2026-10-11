import {verifyFile,deleteFile,uploadFile,fetchFilesPage, fetchFilesCount} from "../services/api";
import FileTable from "../components/FileTable";             
import { useState,useEffect ,useRef} from "react";
import type { MonitoredFile } from "../types/file";
import UploadFile from "../components/UploadFile"
import {ErrorMessage, SuccessMessage} from "../components/Message"
import "./Files.css"
const Files= () => {
        const [files,setFiles]=useState<MonitoredFile[]>([]);
        const [error,setError]=useState<string | null>('')
        const [message,setMessage]=useState<string | null>('')
        const [loading,setLoading]=useState<boolean>(false)
        const [currentPage, setCurrentPage] = useState(1);
        const [totalFiles, setTotalFiles] = useState(0);
        const filesContainerRef = useRef<HTMLDivElement>(null);

        const PAGE_SIZE = 10;
        const totalPages = Math.ceil(totalFiles / PAGE_SIZE);
        const offset = (currentPage - 1) * PAGE_SIZE;
        
        const refreshFiles = async (page: number = currentPage) => {
        const [filesResult, countResult] = await Promise.all([
            fetchFilesPage(PAGE_SIZE, (page - 1) * PAGE_SIZE),
            fetchFilesCount()
        ]);

        setFiles(filesResult);
        setTotalFiles(countResult.total);
        };
            
        useEffect(() => {
        filesContainerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        }, [currentPage]);

        useEffect(() => {
            const loadFiles = async () => {
                setLoading(true);

                try {
                    const [filesResult, countResult] = await Promise.all([
                        fetchFilesPage(PAGE_SIZE, (currentPage - 1) * PAGE_SIZE),
                        fetchFilesCount()
                    ]);

                    setFiles(filesResult);
                    setTotalFiles(countResult.total);
                    setError(null);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? `Failed to load files: ${err.message}`
                            : "Failed to load files"
                    );
                } finally {
                    setLoading(false);
                }
            };

    loadFiles();
}, [currentPage]);


        const handleVerify=async(id:number)=>{
            setLoading(true)
            try{
                await verifyFile(id);
                await refreshFiles();
                setError(null)
                setMessage("File Verified Successfully!")
             setTimeout(() => {
                setMessage(null)
            }, 2000);
            }catch(error) {
                if (error instanceof Error) {
                    setError(`Verification failed: ${error.message}`)
                } else {
                    setError("Verification failed")
                }

            }finally{
            setLoading(false)
            }
    }
        const handleDelete=async(file_name:string)=>{
            setLoading(true)
            try{
                await deleteFile(encodeURIComponent(file_name));
                const remainingCount = (await fetchFilesCount()).total;
                const lastPage = Math.max(1, Math.ceil(remainingCount / PAGE_SIZE));

                if (currentPage > lastPage) {
                    setCurrentPage(lastPage);
                } else {
                    await refreshFiles();
                }
                setError(null)
                setMessage("File Deleted Successfully!")
             setTimeout(() => {
                setMessage(null)
            }, 2000);                
            }catch(error) {
                if (error instanceof Error) {
                    setError(`Delete failed: ${error.message}`)
                } else {
                    setError("Delete failed")
                }
            }finally{
            setLoading(false)
            }
    }
         const handleUpload=async(file:File)=>{
            setLoading(true)
            try{
                await uploadFile(file);
                setCurrentPage(1);
                await refreshFiles(1);
                setError(null)
                setMessage("File Uploaded Successfully!")
             setTimeout(() => {
                setMessage(null)
            }, 2000);
            }catch(error) {
                if (error instanceof Error) {
                    setError(`Upload failed: ${error.message}`)
                } else {
                    setError("Upload failed")
                }
            }finally{
            setLoading(false)
            }
    } 

  return (
    <div className="file-layout">
    <header>
        <h1>Files</h1>
        <p>Monitor your files and verify their integrity using SHA-256 hashes.</p>
    </header>
    <main>
    <section className="upload-section">
       <div className="upload-file"> <span className="symbols">&#9729; </span> <h3> Upload File</h3></div> 
        <p>Select a file to upload and add it to the integrity monitoring system.</p>
        <UploadFile onUpload={handleUpload}/>
    </section>

        {error &&<ErrorMessage error={error} /> }
        <SuccessMessage error={error} message={message}/>
    <section className="file-section"  ref={filesContainerRef}>

        
        <FileTable
            files={files}
            onVerify={handleVerify}
            onDelete={handleDelete}
            onUpload={handleUpload}
            error={error}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />

    </section>
    </main>
    </div>
  )
}

export default Files;

