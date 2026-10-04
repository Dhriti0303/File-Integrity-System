from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
db_url= "sqlite:///./database.db"
engine=create_engine(db_url)
Session=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine) 

def get_db():
    db=Session()
    try:
        yield db
    finally:
        db.close()
