from fastapi import FastAPI
from db import create_models
from routers import canchas, reservas

create_models()
app = FastAPI()

@app.get('/', status_code=200)
def raíz() -> str:
	return 'Server en funcionamiento'

app.include_router(canchas.router)
app.include_router(reservas.router)

if __name__ == '__main__':
	import uvicorn
	uvicorn.run('main:app')
