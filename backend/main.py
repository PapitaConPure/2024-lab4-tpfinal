from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import db.models  # noqa: F401
from routers import canchas, reservas

app = FastAPI()

@app.get('/', status_code=200)
def raíz() -> str:
	return 'Server en funcionamiento'

app.include_router(canchas.router)
app.include_router(reservas.router)

origins = ['http://127.0.0.1:3000', 'http://localhost:3000']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == '__main__':
	import uvicorn
	uvicorn.run('main:app')
