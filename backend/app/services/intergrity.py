import shutil
from pydantic import FilePath
from app.utils.hash_utils import generate_hash
from app.database.crud import add_file, delete_file,add_file_change
from fastapi import  HTTPException, status, UploadFile
from app.database.models import Files
from datetime import datetime, timezone
from sqlalchemy import select
import os
from app.database import models
from pathlib import Path

async def upload(db, file: UploadFile):
    UPLOAD_DIR = Path("app/uploads/monitored_files")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename
    try:
        with file_path.open("wb") as chunk:
           shutil.copyfileobj(file.file, chunk)
    except Exception as e:
            print("ACTUAL ERROR:", repr(e)) 
            raise
    finally:
        await file.close() 
    generated_hash=generate_hash(str(file_path))
    file=models.Files(
            file_name=Path(file_path).name,
            file_path=str(file_path),
            file_hash=generated_hash,
            last_verified_time=None,
            status="UPLOADED"
        )
    latest_file=add_file(file,db)
    file_uploaded(file.id,db,generated_hash,file.file_name)
    return "File uploaded successfully!"

def verify(file_path:FilePath, stored_hash):
    if os.path.exists(file_path):
        current_hash = generate_hash(file_path)
        if current_hash == stored_hash:
            return {
                "status":"SAFE",
                "current_hash":current_hash
                } 
        else:
            return {
                "status":"MODIFIED",
                "current_hash":current_hash
                }
    else:
        return {
            "status":"MISSING",
            "current_hash":None
            }
      
def delete(file_name, db):
    db_file = db.query(models.Files).filter(models.Files.file_name == file_name).first()
    if not db_file:
        return "File not found"
    else:
        file_path = db_file.file_path
        id=db_file.id
        try:
           if os.path.exists(file_path):
              os.remove(file_path)
        except Exception as e:
            raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not delete physical file: {str(e)}")
        file_deleted(db_file.file_name,db,db_file.file_hash,db_file.id)
        delete_file(id,db)
    return (f"File {db_file.file_name} is deleted")

def verify_file(id,db):
    f=db.query(Files).filter(Files.id == id).first()     
    if f:
        result = verify(f.file_path, f.file_hash)
        if result["status"]=="SAFE":
            f.status="SAFE"
            f.last_verified_time=datetime.now(timezone.utc)
            check_restored(id,db,result)
            db.commit()
            return "File is safe!!"
        elif result["status"]=="MODIFIED":
            f.status="MODIFIED"
            f.last_verified_time=datetime.now(timezone.utc) 
            file_changed(id,db,result)
            db.commit() 
            return "File has been modified!!" 
        else:
            f.status="MISSING"
            f.last_verified_time=datetime.now(timezone.utc) 
            file_changed(id,db,result)
            return "File is Missing!!"
    else:
        return "File not found!!"

def verify_file_a(db):
    m_files=[]
    mis_files=[]
    for i in db.query(Files).all():
        result = verify(i.file_path, i.file_hash);
        if result["status"]=="SAFE": 
            i.status="SAFE"
            i.last_verified_time=datetime.now(timezone.utc)
            check_restored(i.id,db,result)
        elif result["status"]=="MODIFIED":
            i.status="MODIFIED" 
            m_files.append(i.file_name)
        else:
            i.status="MISSING"
            mis_files.append(i.file_name )
        i.last_verified_time=datetime.now(timezone.utc)
        if i.status=="MODIFIED"or i.status=="MISSING":
           file_changed(i.id,db,result)
    db.commit()
    if m_files or mis_files:
       return {
        "message": "Verification completed", 
        "modified files": m_files, 
        "missing file": mis_files
    }
    else:
        return "All files are safe!!"

def file_changed(id:int,db,result):
    i=db.query(Files).filter(Files.id == id).first()
    existing_change = db.execute(
    select(models.FileChanges).where(
    models.FileChanges.file_id == i.id,
    models.FileChanges.new_hash == result["current_hash"],
    models.FileChanges.change_type == i.status
    )
    ).scalar_one_or_none()
    if existing_change is None:
        file=models.FileChanges(
        file_id=i.id,
        file_name=i.file_name,
        old_hash=i.file_hash,
        new_hash=result["current_hash"],
        detected_at=i.last_verified_time,
        action="Verification",
        change_type=i.status
        )
        add_file_change(file,db)
    db.commit()
    return "Verification done"

def check_restored(id:int,db,result):
    i=db.query(Files).filter(Files.id == id).first()
    previous_change = db.execute(
    select(models.FileChanges).where(
        models.FileChanges.file_id == i.id
    )
    .order_by(models.FileChanges.detected_at.desc())
    ).scalars().first()
    if not previous_change:
        return "File does not exists"
    previous_status = previous_change.change_type 
    if (previous_status=="MODIFIED" or previous_status=="MISSING") and result["current_hash"]==i.file_hash:
        file=models.FileChanges(
            file_id=i.id,
            file_name=i.file_name,
            old_hash=i.file_hash,
            new_hash=i.file_hash,
            detected_at=i.last_verified_time,
            action="Verification",
            change_type="RESTORED"
            )
        add_file_change(file,db)
    db.commit()
    return "completed"

def file_uploaded(id:int,db,hash,name):

    fileN=models.FileChanges(
        file_id=id,
        file_name=name,
        old_hash=hash,
        new_hash=None,
        detected_at=datetime.now(timezone.utc),
        action="Uploaded",
        change_type="-"
    )
    add_file_change(fileN,db)
    db.commit()
    return fileN

def file_deleted(name,db,hash,id):
    fileN=models.FileChanges(
            file_id=id,
            file_name=name,
            old_hash=hash,
            new_hash=None,
            detected_at=datetime.now(timezone.utc),
            action="Deleted",
            change_type="-"
        )
    add_file_change(fileN,db)
    db.commit()
    return fileN