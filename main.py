from fastapi import FastAPI
from db import create_models
from routers import canchas, reservas

create_models()
app = FastAPI()

@app.get('/')
def raíz():
	return { 'Hola': ':)' }

app.include_router(canchas.router)
app.include_router(reservas.router)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app')
