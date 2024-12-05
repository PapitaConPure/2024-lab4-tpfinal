from typing import Optional, List
from fastapi import APIRouter
from db import MakeSession, crud
from db.models import Cancha
from db.schemas import CanchaSchema
from .responses import RequestResponse, RequestResponseSchema

router = APIRouter(prefix='/canchas')

@router.get('/', response_model = RequestResponseSchema[None])
def raíz_reservas() -> RequestResponse[None]:
	return RequestResponse(
		status=400,
		status_message='Bad Request',
		data=None,
	)

@router.get('/q', response_model = RequestResponseSchema[List[CanchaSchema]])
def get_canchas(
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> RequestResponse[list[Cancha]]:
	session = MakeSession()

	if qmax is not None and qmin is None:
		qmin = 0

	if qmin is not None and qmax is None:
		qmax = 2**53 - 1

	canchas = crud.get_canchas(
		session,
		nombre = nombre,
		rango = (qmin, qmax) if (qmin is not None and qmax is not None) else None,
		techada = techada,
	)
	session.close()

	return RequestResponse(
		status=200,
		status_message='OK',
		data=canchas,
	)

@router.get('/id/{id_cancha}', response_model=RequestResponseSchema[CanchaSchema | None])
def get_cancha(id_cancha: int) -> RequestResponse[Cancha | None]:
	session = MakeSession()
	cancha = crud.get_cancha(session, id_cancha)
	session.close()

	if cancha is None:
		return RequestResponse(
			status=404,
			status_message='Not Found',
			data=None,
		)

	return RequestResponse(
		status=200,
		status_message='OK',
		data=cancha,
	)
