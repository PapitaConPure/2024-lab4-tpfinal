from db import session_factory
from fastapi import FastAPI
from routers.cancha import Cancha

app = FastAPI()

def create_data():
	session = session_factory()
	cancha1 = Cancha('cancha1', True)
	session.add(cancha1)
	session.commit()
	session.close()

@app.get('/')
def read_root():
	return { 'Hello': 'World' }

if __name__ == '__main__':
	create_data()
