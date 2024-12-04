from db import create_models
from fastapi import FastAPI
from routers import cancha, reserva

create_models()
app = FastAPI()

@app.get('/')
def raíz():
	return { 'Hola': ':)' }

app.include_router(cancha.router)
app.include_router(reserva.router)

if __name__ == '__main__':
	pass
