import {getFiles,verifyFile,deleteFile,uploadFile} from "../services/api";
import FileTable from "../components/FileTable";             
import { useState,useEffect } from "react";
import type { MonitoredFile } from "../types/file";
import UploadFile from "../components/UploadFile"
import {ErrorMessage, SuccessMessage} from "../components/Message"

const Files= () => {
        const [files,setFiles]=useState<MonitoredFile[]>([]);
        const [error,setError]=useState<string | null>('')
        const [message,setMessage]=useState<string | null>('')
        const [loading,setLoading]=useState<boolean>(false)
        useEffect(()=>{
            const data=async()=>{
            const result=await getFiles();
            setFiles(result);
            };
            data();
        },[]);

        const handleVerify=async(id:number)=>{
            setLoading(true)
            try{
                await verifyFile(id);
                const result=await getFiles();
                setFiles(result);
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
                const result=await getFiles();
                setFiles(result);
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
                const result=await getFiles();
                setFiles(result);
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
    <div className="app-layout">
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
    <section className="file-section">
        <h2>Monitored Files</h2>
        <FileTable files={files} onVerify={handleVerify} onDelete={handleDelete}  onUpload={handleUpload} error={error} loading={loading} />
    </section>
    </main>
    </div>
  )
}

export default Files;

