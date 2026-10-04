from fastapi import APIRouter, Depends,UploadFile,Query
from app.schema.files import FileResponse,FileChangeResponse
from sqlalchemy.orm import Session
from typing import List, Literal
from datetime import datetime,date
from app.database.database import get_db
from app.database.crud import  get_all_file, get_file,get_file_changes,get_all_logs,get_action_changes,get_status_changes,get_week_logs,get_month_logs,get_date_logs
from app.services.intergrity import delete, upload, verify_file,verify_file_a
router = APIRouter()

# get all files
@router.get("/files",response_model=list[FileResponse])
def read_files(db: Session = Depends(get_db)):
    return get_all_file(db)

# get a files
@router.get("/files/{id}",response_model=FileResponse)
def read_file(id: int, db: Session = Depends(get_db)):
    return get_file(id, db)

#get all file changes
@router.get("/logs",response_model=list[FileChangeResponse])
def read_all_logs(db:Session=Depends(get_db)):
    return get_all_logs(db)

#get a file changes
@router.get("/log/{id}/changes",response_model=list[FileChangeResponse])
def read_File_change(id:int,db:Session=Depends(get_db)):
    return get_file_changes(id,db)

#logs for status
StatusTypes = Literal["RESTORED", "MISSING", "SAFE", "MODIFIED"]
@router.get("/log/status",response_model=list[FileChangeResponse])
def read_status_logs(status:StatusTypes,offset:int=Query(default=0,ge=0),limit:int=Query(default=20,ge=1,le=100),db:Session=Depends(get_db)):
    return get_status_changes(status,offset,limit,db)

#logs for action 
ActionTypes = Literal["Deleted", "Verification", "Uploaded"]
@router.get("/log/action",response_model=list[FileChangeResponse])
def read_action_logs(action:ActionTypes,offset:int=Query(default=0,ge=0),limit:int=Query(default=20,ge=1,le=100),db:Session=Depends(get_db)):
    return get_action_changes(action,offset,limit,db)

#logs of last 7 days
@router.get("/logs/7-days",response_model=list[FileChangeResponse])
def read_week_logs(db:Session=Depends(get_db)):
    return get_week_logs(db)

#logs of last month 
@router.get("/logs/month",response_model=list[FileChangeResponse])
def read_month_logs(db:Session=Depends(get_db)):
    return get_month_logs(db)

#logs of specific day
@router.get("/logs/day",response_model=list[FileChangeResponse])
def read_day_logs(date:date,db:Session=Depends(get_db)):
    return get_date_logs(db,date)

#upload file
@router.post("/files/upload")
async def upload_file(file:UploadFile,db: Session = Depends(get_db)):
    return await upload(db,file)

#delete file
@router.delete("/files/{filename}")
def remove_file(filename:str, db: Session = Depends(get_db)):
    return delete(filename, db)

#verify file
@router.post("/files/{id}/verify")
def verify(id: int, db: Session = Depends(get_db)):
    return verify_file(id,db)

#verify all file
@router.post("/files/verify-all")
def verift_all_files(db: Session = Depends(get_db)):
    return verify_file_a(db)