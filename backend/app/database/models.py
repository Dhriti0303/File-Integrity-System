from sqlalchemy import Column, Integer, String, DateTime,ForeignKey
from app.database.database import Base
from datetime import datetime, timezone
class Files(Base):
    __tablename__ = "Files"
    id=Column(Integer,primary_key=True,index=True)
    file_name=Column(String)
    file_path=Column(String)
    upload_time = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    file_hash=Column(String)
    last_verified_time=Column(String)
    status=Column(String)

class FileChanges(Base):
    __tablename__="FileChanges"
    id=Column(Integer,primary_key=True,index=True)
    file_id = Column(Integer,ForeignKey("Files.id"))
    file_name=Column(String)
    old_hash=Column(String)
    new_hash=Column(String)
    detected_at=Column(DateTime, default=lambda: datetime.now(timezone.utc))
    action=Column(String)
    change_type=Column(String)