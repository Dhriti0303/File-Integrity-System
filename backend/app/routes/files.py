from fastapi import APIRouter, Depends,UploadFile,Query
from app.schema.files import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.crud import  get_all_file, get_file,get_files_count
from app.services.intergrity import delete, upload, verify_file,verify_file_a
router = APIRouter()
 
# get all files
@router.get("/files",response_model=list[FileResponse])
def read_files(offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db: Session = Depends(get_db)):
    return get_all_file(offset,limit,db)

@router.get("/files/count")
def read_files_count(db: Session = Depends(get_db)):
   return get_files_count(db) 

# get a files
@router.get("/files/{id}",response_model=FileResponse)
def read_file(id: int, db: Session = Depends(get_db)):
    return get_file(id ,db)

#upload file
@router.post("/files/upload")
async def upload_file(
    file: UploadFile,
    db: Session = Depends(get_db)
):
    return await upload(file, db)

#delete file
@router.delete("/files/{filename}")
def remove_file(filename:str, db: Session = Depends(get_db)):
    return delete(filename,db)

#verify file
@router.post("/files/{id}/verify")
def verify(id: int,db: Session = Depends(get_db)):
    return verify_file(id,db)

#verify all file
@router.post("/files/verify-all")
def verift_all_files(db: Session = Depends(get_db)):
    return verify_file_a(db)
