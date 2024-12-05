from typing import Optional, List
from fastapi import APIRouter, Response, status
from db import MakeSession, crud
from db.models import Cancha
from db.schemas import CanchaSchema

router = APIRouter(prefix='/canchas')

@router.get('/', status_code=status.HTTP_200_OK, response_model=List[CanchaSchema])
def raíz_canchas() -> list[Cancha]:
	session = MakeSession()
	canchas = crud.get_canchas(session)
	session.close()
	return canchas

@router.get('/q', status_code=status.HTTP_200_OK, response_model = List[CanchaSchema] | str | None)
def get_canchas(
	response: Response,
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> list[Cancha] | str | None:
	session = MakeSession()

	try:
		if qmax is not None and qmin is None:
			qmin = 0

		if qmin is not None and qmax is None:
			qmax = 2**53 - 1

		if qmin is not None and qmax is not None and qmin > qmax:
			response.status_code = status.HTTP_400_BAD_REQUEST
			return 'El mínimo del rango no puede ser mayor que el máximo'

		canchas = crud.get_canchas(
			session,
			nombre = nombre,
			rango = (qmin, qmax) if (qmin is not None and qmax is not None) else None,
			techada = techada,
		)

		return canchas
	except ValueError as exc:
		response.status_code = status.HTTP_400_BAD_REQUEST
		return repr(exc)
	finally:
		session.close()

@router.get('/id/{id_cancha}', response_model=CanchaSchema | None)
def get_cancha(id_cancha: int, response: Response) -> Cancha | None:
	session = MakeSession()
	cancha = crud.get_cancha(session, id_cancha)
	session.close()

	if cancha is None:
		response.status_code = status.HTTP_404_NOT_FOUND
		return None

	return cancha
