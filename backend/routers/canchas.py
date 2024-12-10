from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from db import MakeSession, crud
from db.models import Cancha
from db.schemas import CanchaSchema, CanchaCreate

router = APIRouter(prefix='/canchas')

@router.get('/', status_code = status.HTTP_200_OK, response_model = List[CanchaSchema])
def obtener_todas_las_canchas() -> list[Cancha]:
	session = MakeSession()
	canchas = crud.get_canchas(session)
	session.close()
	return canchas

@router.get('/id/{id_cancha}', status_code = status.HTTP_200_OK, response_model = CanchaSchema)
def obtener_cancha_por_id(id_cancha: int) -> Cancha:
	session = MakeSession()
	cancha = crud.get_cancha(session, id_cancha)
	session.close()

	if cancha is None:
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se encontró ninguna cancha con la ID: {id_cancha}'
		)

	return cancha

@router.get('/q', status_code = status.HTTP_200_OK, response_model = List[CanchaSchema])
def obtener_canchas_por_consulta(
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> list[Cancha]:
	session = MakeSession()

	try:
		rango = crud.qparams_a_rango(qmin, qmax)

		canchas = crud.get_canchas(
			session,
			nombre = nombre,
			rango = rango,
			techada = techada,
		)

		return canchas
	finally:
		session.close()

@router.post('/', status_code = status.HTTP_201_CREATED, response_model = CanchaSchema)
def crear_cancha(
	nombre: str,
	techada: bool = False
) -> Cancha:
	session = MakeSession()
	cancha = crud.create_cancha(session, CanchaCreate(nombre=nombre, techada=techada))
	session.close()

	return cancha

@router.patch('/id/{id_cancha}', status_code = status.HTTP_200_OK, response_model = CanchaSchema)
def modificar_cancha(
	id_cancha: int,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> Cancha:
	session = MakeSession()
	cancha = crud.get_cancha(session, id_cancha=id_cancha)

	if cancha is None:
		session.close()
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se encontró ninguna cancha con la ID: {id_cancha}',
		)

	if nombre is None and techada is None:
		raise HTTPException(
			status.HTTP_400_BAD_REQUEST,
			'No se instruyó ninguna modificación',
		)

	try:
		if nombre is not None:
			cancha.nombre = nombre

		if techada is not None:
			cancha.techada = techada

		session.commit()
	finally:
		session.close()

	return cancha

@router.delete('/id/{id_cancha}', status_code = status.HTTP_200_OK, response_model = CanchaSchema)
def eliminar_cancha_por_id(id_cancha: int) -> Cancha:
	session = MakeSession()
	cancha_eliminada = crud.delete_cancha(session, id_cancha=id_cancha)
	session.close()

	if cancha_eliminada is None:
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se eliminó ninguna cancha porque no había una cancha con la ID: {id_cancha}',
		)

	return cancha_eliminada

@router.delete('/q', status_code = status.HTTP_200_OK, response_model = List[CanchaSchema])
def eliminar_canchas_por_consulta(
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> list[Cancha]:
	session = MakeSession()

	try:
		rango = crud.qparams_a_rango(qmin, qmax)
		canchas_eliminadas = crud.delete_canchas(
			session,
			rango=rango,
			nombre=nombre,
			techada=techada,
		)
		return canchas_eliminadas
	finally:
		session.close()
