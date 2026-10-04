import React, { useState ,useRef,} from "react";
import "daisyui"

interface UploadProps {
    onUpload: (file: File) => Promise<void>;
}

const UploadFile = ({onUpload}:UploadProps) => {
     const [f, setFile] = useState<File | null>(null);
     const fileInputRef = useRef<HTMLInputElement | null>(null);

        const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
            if(e.target.files){
                setFile(e.target.files[0])
            }
        }

        const handleUploadClick=async()=>{
        if (f){
            await onUpload(f)
            setFile(null) 
             if(fileInputRef.current) {
                 fileInputRef.current.value = ''; 
      }
        }
    } 

  return (
    <>
    <input id="upload"  className="file-input file-input-neutral" type="file" ref={fileInputRef} onChange={handleChange}/> 
        <button onClick={handleUploadClick}  className="btn btn-active btn-info"><span>&#128228;</span>UPLOAD</button> 
    </>
  )
}
export default UploadFile