from pydantic import BaseModel,field_serializer
from datetime import datetime

class FileResponse(BaseModel):
        id:int
        file_name:str
        file_path:str
        file_hash:str
        upload_time:datetime
        @field_serializer('upload_time')
        def serialize_dt(self,dt:datetime, _info):
                return dt.strftime('%d-%m-%Y')
        last_verified_time:datetime | None
        @field_serializer('last_verified_time')
        def serialize_lt(self,dt:datetime, _info):
                if dt is None:
                        return None
                return dt.strftime('%d-%m-%Y %H:%M:%S')
        status:str
        
        