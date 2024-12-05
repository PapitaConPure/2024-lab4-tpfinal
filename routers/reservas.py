from typing import Optional, List
from fastapi import APIRouter
from db import MakeSession, crud
from db.models import Reserva
from db.schemas import ReservaSchema, ReservaCreate
from .responses import RequestResponse, RequestResponseSchema

router = APIRouter(prefix='/reservas')

@router.get('/', response_model = RequestResponseSchema[None])
def raíz_reservas() -> RequestResponse[None]:
	return RequestResponse(
		status=400,
		status_message='Bad Request',
		data=None,
	)

@router.get('/q', response_model = RequestResponseSchema[List[ReservaSchema] | None])
def get_reservas(
	id_cancha: Optional[int] = None,
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	dia: Optional[str] = None,
	hora: Optional[str] = None,
	dur_mins: Optional[str] = None,
	tel: Optional[str] = None,
	nom_contacto: Optional[str] = None,
) -> RequestResponse[list[Reserva] | None]:
	session = MakeSession()

	if qmax is not None and qmin is None:
		qmin = 0

	if qmin is not None and qmax is None:
		qmax = 2**53 - 1

	def obtener_rango_u_valor(
		x: str | None,
		nom_criterio: str='<<criterio desconocido>>',
	) -> int | tuple[int, int] | None:
		if x is None:
			return None

		mensaje_error_formato = f'El criterio de búsqueda según {nom_criterio} ({x=})' \
			' debe expresarse como un entero o un rango bajo el formato "min:max"'

		try:
			if ':' not in x:
				return int(x)

			partes = x.split(':')

			if len(partes) != 2:
				raise ValueError(mensaje_error_formato)

			return (
				int(partes[0]) if len(partes[0]) > 0 else 0,
				int(partes[1]) if len(partes[1]) > 0 else 2**53 - 1,
			)
		except ValueError as exc:
			raise ValueError(mensaje_error_formato) from exc

	dia_rango_u_valor = None
	hora_rango_u_valor = None
	dur_mins_rango_u_valor = None

	try:
		dia_rango_u_valor = obtener_rango_u_valor(dia, 'día')
		hora_rango_u_valor = obtener_rango_u_valor(hora, 'hora')
		dur_mins_rango_u_valor = obtener_rango_u_valor(dur_mins, 'duración en minutos')
	except ValueError:
		session.close()
		return RequestResponse(
			status=400,
			status_message='Bad Request',
			data=None,
		)

	reservas = crud.get_reservas(
		session,
		id_cancha=id_cancha,
		rango=(qmin, qmax) if (qmin is not None and qmax is not None) else None,
		dia=dia_rango_u_valor,
		hora=hora_rango_u_valor,
		duración_minutos=dur_mins_rango_u_valor,
		teléfono=tel,
		nombre_contacto=nom_contacto,
	)
	session.close()

	return RequestResponse(
		status=200,
		status_message='OK',
		data=reservas,
	)

@router.get('/id/{id_reserva}', response_model = RequestResponseSchema[ReservaSchema | None])
def get_reserva(id_reserva: int) -> RequestResponse[Reserva | None]:
	session = MakeSession()
	reserva = crud.get_reserva(session, id_reserva)
	session.close()

	if reserva is None:
		return RequestResponse(
			status=404,
			status_message='Not Found',
			data=None,
		)

	return RequestResponse(
		status=200,
		status_message='OK',
		data=reserva,
	)


@router.post('/cancha/{id_cancha}', response_model = RequestResponseSchema[ReservaSchema | str | None])
def crear_reserva(
	id_cancha: int,
	dia: int,
	hora: int,
	dur_mins: int,
	tel: str,
	nom_contacto: str,
) -> RequestResponse[Reserva | str | None]:
	session = MakeSession()

	try:
		reserva_creada = crud.create_reserva(session, ReservaCreate(
			id_cancha = id_cancha,
			dia = dia,
			hora = hora,
			duración_minutos = dur_mins,
			teléfono = tel,
			nombre_contacto = nom_contacto,
		))
	except ValueError as exc:
		return RequestResponse(
			status=400,
			status_message='Bad Request',
			data=repr(exc),
		)
	finally:
		session.close()

	return RequestResponse(
		status=200,
		status_message='OK',
		data=reserva_creada,
	)

@router.put('/id/{id_reserva}', response_model = RequestResponseSchema[ReservaSchema | str | None])
def modificar_reserva(
	id_reserva: int,
	dia: Optional[int],
	hora: Optional[int],
	dur_mins: Optional[int],
	tel: Optional[str],
	nom_contacto: Optional[str],
) -> RequestResponse[Reserva | str | None]:
	session = MakeSession()
	reserva = crud.get_reserva(session, id_reserva=id_reserva)

	if reserva is None:
		session.close()
		return RequestResponse(
			status=404,
			status_message='Not Found',
			data=None,
		)
	if dia is not None:
		reserva.dia = dia

	if hora is not None:
		reserva.hora = hora

	if dur_mins is not None:
		reserva.duración_minutos = dur_mins

	if tel is not None:
		reserva.teléfono = tel

	if nom_contacto is not None:
		reserva.nombre_contacto = nom_contacto

	session.commit()
	session.close()

	return RequestResponse(
		status=200,
		status_message='OK',
		data=reserva,
	)

@router.delete('/id/{id_reserva}', response_model = RequestResponseSchema[ReservaSchema | None])
def quitar_reserva(id_reserva: int) -> RequestResponse[Reserva | None]:
	session = MakeSession()
	reserva_eliminada = crud.delete_reserva(session, id_reserva=id_reserva)
	session.close()

	if reserva_eliminada is None:
		return RequestResponse(
			status=404,
			status_message='Not Found',
			data=None,
		)

	return RequestResponse(
		status=200,
		status_message='OK',
		data=reserva_eliminada,
	)
