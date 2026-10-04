import { useState } from "react";
interface ErrorProps {
    error:string | null;
}
interface SuccessProps {
    error:string | null;
    message:string | null;
}
interface SuccessProps {
    error:string | null;
    message:string | null;
}
interface CopyProps {
   id:number ;
   hash:string;
}
export const RecordMessage = () => {
  return (
    <>
      <div role="alert" className="alert alert-vertical sm:alert-horizontal" id="alert-response">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current text-info h-6 w-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>No Records Found</span>
      </div>
        
    </>
  )
}

export const ErrorMessage=({error}:ErrorProps)=>{
  return (
    <>
       {error?<div role="alert" className="alert alert-error"  id="alert">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error}</span>
</div>:''}
    </>
  )
}

export const SuccessMessage=({error,message}:SuccessProps)=>{

  return (
    <>
      {!error && message ?
        <div role="alert" className="alert alert-success" id="alert">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{message}</span>
</div>:''
}
    </>
  )
}

export const CopyMessage=({id,hash}:CopyProps)=>{
   const [copiedId, setCopiedId] = useState<number | null>(null);
 const handleCopy=async(id:number,hash:string)=>{
        try{
            await navigator.clipboard.writeText(hash);
            setCopiedId(id);
            setTimeout(() => {
        setCopiedId(null);
      }, 2000);
        }catch(error){
            console.error("Failed to copy")
        }
    }
  return (
    <>
  <button className="copy-button" onClick={() => handleCopy(id,hash)}> {copiedId===id?"✔":"🗐"}</button>
    
    </>
  )
}