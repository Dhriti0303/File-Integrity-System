from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database import models
from sqlalchemy import func
from datetime import datetime,timedelta,date,time
from dateutil.relativedelta import relativedelta

def get_all_file(db:Session):
    db_files=db.query(models.Files).all()
    return db_files

def get_file(id:int,db:Session):
    db_file=db.query(models.Files).filter(models.Files.id==id).first()
    if not db_file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    else:
        return db_file

def get_file_changes(id:int,db:Session):
    db_file=db.query(models.FileChanges).filter(models.FileChanges.file_id==id).all()
    if not db.query(models.Files).filter(models.Files.id==id).first():
        return "File not found"
    elif not db_file:
        return "No Changes Recorded"
    else:
        return db_file

def get_all_logs(db:Session):
    db_files=db.query(models.FileChanges).all()
    return db_files

def get_action_changes(action:str,offset:int,limit:int,db:Session):
    db_file=db.query(models.FileChanges).filter(models.FileChanges.action==action).offset(offset).limit(limit).all()
    return db_file
    
def get_status_changes(status:str,offset:int,limit:int,db:Session):
    db_file=db.query(models.FileChanges).filter(models.FileChanges.change_type==status).offset(offset).limit(limit).all()
    return db_file

def get_date_logs(db:Session,selected_date:date):
    selected_date_str=selected_date.strftime("%Y-%m-%d")
    db_file=db.query(models.FileChanges).filter(func.strftime("%Y-%m-%d",models.FileChanges.detected_at)==selected_date_str).all()
    if not db_file:
        return []
    else:
        return db_file
    
def get_week_logs(db:Session):
    seven_days_ago=datetime.now()-timedelta(days=7)
    db_file=db.query(models.FileChanges).filter(models.FileChanges.detected_at>=seven_days_ago).all()
    if not db_file:
        return []
    else:
        return db_file
    
def get_month_logs(db:Session):
    month_ago=datetime.now()-relativedelta(months=1)
    db_file=db.query(models.FileChanges).filter(models.FileChanges.detected_at>=month_ago).all()
    if not db_file:
        return "Data not Found"
    else:
        return db_file

def add_file(file:models.Files,db:Session):
    try:
        db.add(file)
        db.commit()
        db.refresh(file)
        return file
    except Exception:
        db.rollback()
        raise HTTPException(
        status_code=500,
        detail="Could not save file"
    )

def add_file_change(file:models.FileChanges,db:Session):
    try:
        db.add(file)
        db.commit()
        db.refresh(file)
    except Exception:
        db.rollback()
        raise HTTPException(
        status_code=500,
        detail="Could not save file"
    ) 

def update_file(id:int,file:models.Files,db:Session):
    db_file=db.query(models.Files).filter(models.Files.id==id).first()
    if not db_file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        ) 
    else:
        try:
            db_file.file_name=file.file_name
            db_file.file_path=file.file_path
            db_file.file_hash=file.file_hash
            db_file.last_verified_time=file.last_verified_time
            db_file.status=file.status 
            db.commit()
        except Exception:
            db.rollback()
            raise HTTPException(
            status_code=500,
            detail="Could not save file"
        )
    return "Updated Successfully!!"
    
def delete_file(id:int,db:Session):
     db_file=db.query(models.Files).filter(models.Files.id==id).first()
     if not db_file:
             raise HTTPException(
                 status_code=404,
                 detail="File not found"
             )
     else:
        try:
            db.delete(db_file)
            db.commit()
        except Exception:
            db.rollback()
            raise HTTPException(
            status_code=500,    
        detail="Could not delete file"
        )
        return "Deleted Successfully!!"