from pydantic import BaseModel
from datetime import datetime

class FileResponse(BaseModel):
        id:int
        file_name:str
        file_path:str
        file_hash:str
        upload_time:datetime
        last_verified_time:datetime | None
        status:str
        
class FileChangeResponse(BaseModel):
        id:int
        file_id:int 
        file_name:str
        old_hash:str
        new_hash:str | None
        detected_at:datetime
        action:str
        change_type:str | None
        