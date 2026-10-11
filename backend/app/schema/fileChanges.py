from pydantic import BaseModel,field_serializer
from datetime import datetime

class FileChangeResponse(BaseModel):
        id:int
        file_id:int 
        file_name:str
        old_hash:str
        new_hash:str | None
        detected_at:datetime
        @field_serializer('detected_at')
        def serialize_lt(self,dt:datetime, _info):
                return dt.strftime('%d-%m-%Y')
        action:str
        change_type:str 