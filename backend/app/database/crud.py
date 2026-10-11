from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database import models
from sqlalchemy import func
from datetime import datetime,timedelta,date,time
from dateutil.relativedelta import relativedelta

def get_all_file(offset:int,limit:int,db:Session):
    db_files=db.query(models.Files).order_by(
        models.Files.upload_time.desc(),
        models.Files.id.desc()
    ).offset(offset).limit(limit).all()
    return db_files

def get_files_count(db: Session) :
    total=db.query(models.Files).count()
    return {"total":total}

def get_file(id:int,db:Session):
    db_file=db.query(models.Files).filter(models.Files.id==id).first()
    if not db_file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    else:
        return db_file

def get_file_changes(name:str,offset:int,limit:int,db:Session):
    file_name=name.lower()
    db_file=db.query(models.FileChanges).filter(func.lower(models.FileChanges.file_name)==file_name) .order_by(
        models.FileChanges.detected_at.desc(),
        models.FileChanges.id.desc()
    ).offset(offset).limit(limit).all()
    if not db.query(models.Files).filter(func.lower(models.Files.file_name)==file_name).first():
        return "File not found"
    elif not db_file:
        return "No Changes Recorded"
    else:
        return db_file

def get_all_logs(offset:int,limit:int,db:Session):
    db_files=db.query(models.FileChanges).order_by(
    models.FileChanges.detected_at.desc(),
    models.FileChanges.id.desc()
).offset(offset).limit(limit).all()
    return db_files

def get_action_changes(action:str,offset:int,limit:int,db:Session):
    db_file=db.query(models.FileChanges).filter(models.FileChanges.action==action) .order_by(
        models.FileChanges.detected_at.desc(),
        models.FileChanges.id.desc()
    ).offset(offset).limit(limit).all()
    return db_file
    
def get_status_changes(status:str,offset:int,limit:int,db:Session):
    db_file=db.query(models.FileChanges).filter(models.FileChanges.change_type==status) .order_by(
        models.FileChanges.detected_at.desc(),
        models.FileChanges.id.desc()
    ).offset(offset).limit(limit).all()
    return db_file

def get_date_logs(selected_date:date,offset:int,limit:int,db:Session):
    selected_date_str=selected_date.strftime("%Y-%m-%d")
    db_file=db.query(models.FileChanges).filter(func.strftime("%Y-%m-%d",models.FileChanges.detected_at)==selected_date_str) .order_by(
        models.FileChanges.detected_at.desc(),
        models.FileChanges.id.desc()
    ).offset(offset).limit(limit).all()
    if not db_file:
        return []
    else:
        return db_file
    
def get_week_logs(offset:int,limit:int,db:Session):
    seven_days_ago=datetime.now()-timedelta(days=7)
    db_file=db.query(models.FileChanges).filter(models.FileChanges.detected_at>=seven_days_ago) .order_by(
        models.FileChanges.detected_at.desc(),
        models.FileChanges.id.desc()
    ).offset(offset).limit(limit).all()
    if not db_file:
        return []
    else:
        return db_file
    
def get_month_logs(offset:int,limit:int,db:Session):
    month_ago=datetime.now()-relativedelta(months=1)
    db_file=db.query(models.FileChanges).filter(models.FileChanges.detected_at>=month_ago) .order_by(
        models.FileChanges.detected_at.desc(),
        models.FileChanges.id.desc()
    ).offset(offset).limit(limit).all()
    if not db_file:
        return "Data not Found"
    else:
        return db_file
        
def get_logs_count(
    db: Session,
    status: str | None = None,
    action: str | None = None,
    selected_date: date | None = None,
    period: str | None = None,
    name: str | None = None,
):
    query = db.query(func.count(models.FileChanges.id))

    if status:
        query = query.filter(
            models.FileChanges.change_type == status
        )

    if action:
        query = query.filter(
            models.FileChanges.action == action
        )

    if selected_date:
        query = query.filter(
            func.strftime(
                "%Y-%m-%d", models.FileChanges.detected_at
            ) == selected_date.strftime("%Y-%m-%d")
        )

    if period == "week":
        query = query.filter(
            models.FileChanges.detected_at >= datetime.now() - timedelta(days=7)
        )
    elif period == "month":
        query = query.filter(
            models.FileChanges.detected_at >= datetime.now() - relativedelta(months=1)
        )

    if name:
        query = query.filter(models.FileChanges.file_name == name)

    return {"total": query.scalar() or 0}

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
