from typing import Optional
from fastapi import APIRouter
from db import MakeSession, crud, schemas

router = APIRouter(prefix='/canchas')

@router.get('/')
def raíz_reservas():
	session = MakeSession()
	session.close()
	return { 'what': 'lmao' }

@router.get('/q')
def get_canchas(
	min: Optional[int] = None,
	max: Optional[int] = None,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> list[schemas.Cancha]:
	session = MakeSession()
	
	if(max is not None and min is None):
		min = 0
	
	if(min is not None and max is None):
		max = 2 ** 53 - 1

	canchas = crud.get_canchas(session,
		nombre = nombre,
		rango = (min, max) if (min is not None and max is not None) else None,
		techada = techada,
	)
	session.close()
	
	return canchas

@router.get('/id/{id}')
def get_cancha(id: int) -> schemas.Cancha:
	session = MakeSession()
	cancha = crud.get_cancha(session, id)
	session.close()

	return cancha
