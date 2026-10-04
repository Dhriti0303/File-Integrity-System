from datetime import datetime
from pydantic import BaseModel
class File(BaseModel):
        id:int
        filename:str
        filepath:str
        file_hash:str
        upload_time:datetime
        last_verified:datetime
        status:str

        
class FileChanges(BaseModel):
        id:int
        file_id:int
        file_name:str
        old_hash:str
        new_hash:str
        detected_at:datetime
        action:str
        change_type:str
        