from fastapi import FastAPI
from app.database import models
from app.database.database import init_db
from app.routes.files import router
from app.routes.logs import routerlog
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.services.monitor import monitor


@asynccontextmanager
async def lifespan(app:FastAPI):
    task=asyncio.create_task(monitor())
    yield
    task.cancel()


app=FastAPI(lifespan=lifespan)
init_db() 



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(routerlog)