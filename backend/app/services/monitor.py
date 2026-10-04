import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.database import get_db
from app.services.intergrity import verify_file_a
db_url= "sqlite:///./database.db"
engine=create_engine(db_url)
Session=sessionmaker(autocommit=False,autoflush=False,bind=engine)
async def monitor():
    while True:
        db=Session()
        try:
            verify_file_a(db)
        except Exception :
            print("Some Error occured during automatic verification",)
        finally:
            db.close()
        await asyncio.sleep(30)

