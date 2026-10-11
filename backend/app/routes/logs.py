from fastapi import Depends,Query,APIRouter
from app.schema.fileChanges import FileChangeResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Literal
from datetime import date
from app.database.database import get_db
from app.database.crud import  get_file_changes,get_all_logs,get_action_changes,get_status_changes,get_week_logs,get_month_logs,get_date_logs,get_logs_count

routerlog = APIRouter()

#get all file changes
@routerlog.get("/logs",response_model=list[FileChangeResponse])
def read_all_logs(offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_all_logs(offset,limit,db)

#get a file changes
@routerlog.get("/log/{name}/changes",response_model=list[FileChangeResponse])
def read_File_change(name:str,offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_file_changes(name,offset,limit,db)

#logs for status
StatusTypes = Literal["RESTORED", "MISSING", "MODIFIED","SUCCESS"]
@routerlog.get("/log/status",response_model=list[FileChangeResponse])
def read_status_logs(status:StatusTypes,offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_status_changes(status,offset,limit,db)

#logs for action 
ActionTypes = Literal["Deleted", "Verification", "Uploaded"]
@routerlog.get("/log/action",response_model=list[FileChangeResponse])
def read_action_logs(action:ActionTypes,offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_action_changes(action,offset,limit,db)

#logs of last 7 days
@routerlog.get("/logs/7-days",response_model=list[FileChangeResponse])
def read_week_logs(offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_week_logs(offset,limit,db)

#logs of last month 
@routerlog.get("/logs/month",response_model=list[FileChangeResponse])
def read_month_logs(offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_month_logs(offset,limit,db)

#logs of specific day
@routerlog.get("/logs/day",response_model=list[FileChangeResponse])
def read_day_logs(date:date,offset:int=Query(default=0,ge=0),limit:int=Query(default=10,ge=1,le=100),db:Session=Depends(get_db)):
    return get_date_logs(date,offset,limit,db)

#logs count
@routerlog.get("/logs/count")
def read_logs_count(db: Session = Depends(get_db)):
   return get_logs_count(db) 