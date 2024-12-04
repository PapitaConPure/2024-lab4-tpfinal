from db import create_models
from fastapi import FastAPI
from routers import canchas, reservas

create_models()
app = FastAPI()

@app.get('/')
def raíz():
	return { 'Hola': ':)' }

app.include_router(canchas.router)
app.include_router(reservas.router)

if __name__ == '__main__':
	pass
