from datetime import date, datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from db import MakeSession, crud
from db.models import Reserva, ReservaCompleta
from db.schemas import ReservaSchema, ReservaCreate, ReservaCompletaSchema

router = APIRouter(prefix='/reservas')

def obtener_rango_u_valor_int(
	x: str | None,
	nom_criterio: str='<<criterio desconocido>>',
) -> int | tuple[int, int] | None:
	if x is None:
		return None

	mensaje_error_formato = f'El criterio de búsqueda según {nom_criterio} ({x=})'\
		' debe expresarse como un entero o un rango bajo el formato "min:max"'

	if ':' not in x:
		return int(x)

	partes = x.split(':')

	if len(partes) != 2:
		raise HTTPException(
			status.HTTP_400_BAD_REQUEST,
			mensaje_error_formato)

	try:
		val_min = int(partes[0]) if len(partes[0]) > 0 else 0
		val_max = int(partes[1]) if len(partes[1]) > 0 else 2**53 - 1
	except ValueError as exc:
		raise HTTPException(
			status.HTTP_400_BAD_REQUEST,
			f'El criterio de búsqueda según {nom_criterio} recibido tenía un formato de entero inválido ({x=})',
		) from exc

	return (val_min, val_max)

def obtener_rango_u_valor_date(
	x: str | None,
	nom_criterio: str='<<criterio desconocido>>',
) -> date | tuple[date, date] | None:
	if x is None:
		return None

	mensaje_error_formato = f'El criterio de búsqueda según {nom_criterio} ({x=})'\
		' debe expresarse como un entero o un rango bajo el formato "min:max"'

	if ':' not in x:
		return datetime.fromisoformat(x)

	partes = x.split(':')

	if len(partes) != 2:
		raise HTTPException(
			status.HTTP_400_BAD_REQUEST,
			mensaje_error_formato,
		)

	try:
		date_min = datetime.fromisoformat(partes[0]) if len(partes[0]) > 0 else datetime.min
		date_max = datetime.fromisoformat(partes[1]) if len(partes[1]) > 0 else datetime.max
	except ValueError as exc:
		raise HTTPException(
			status.HTTP_400_BAD_REQUEST,
			f'El criterio de búsqueda según {nom_criterio} recibido tenía un formato de fecha inválido ({x=})',
		) from exc

	return (date_min, date_max)

@router.get('/', status_code=status.HTTP_200_OK, response_model = List[ReservaSchema] | List[ReservaCompletaSchema])
def obtener_todas_las_reservas(full: bool = False) -> list[Reserva] | list[ReservaCompleta]:
	session = MakeSession()
	reservas = crud.get_reservas(session, full=full)
	session.close()
	return reservas

@router.get('/id/{id_reserva}',
	status_code=status.HTTP_200_OK,
	response_model = ReservaSchema | ReservaCompletaSchema,
)
def obtener_reserva_por_id(id_reserva: int, full: bool = False) -> Reserva | ReservaCompleta:
	session = MakeSession()
	reserva = crud.get_reserva(session, id_reserva) if not full else crud.get_reserva_completa(session, id_reserva)

	session.close()

	if reserva is None:
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se encontró ninguna reserva con la ID: {id_reserva}'
		)

	return reserva

@router.get('/q',
	status_code=status.HTTP_200_OK,
	response_model = List[ReservaSchema] | List[ReservaCompletaSchema],
)
def obtener_reservas_por_consulta(
	id_cancha: Optional[int] = None,
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	dia: Optional[str] = None,
	hora: Optional[str] = None,
	dur_mins: Optional[str] = None,
	tel: Optional[str] = None,
	nom_contacto: Optional[str] = None,
	nom_cancha: Optional[str] = None,
	full: bool = False,
) -> list[Reserva] | list[ReservaCompleta]:
	session = MakeSession()

	try:
		rango = crud.qparams_a_rango(qmin, qmax)

		dia_rango_u_valor = obtener_rango_u_valor_date(dia, 'día')
		hora_rango_u_valor = obtener_rango_u_valor_int(hora, 'hora')
		dur_mins_rango_u_valor = obtener_rango_u_valor_int(dur_mins, 'duración en minutos')

		reservas = crud.get_reservas(
			session,
			id_cancha=id_cancha,
			rango=rango,
			dia=dia_rango_u_valor,
			hora=hora_rango_u_valor,
			duración_minutos=dur_mins_rango_u_valor,
			teléfono=tel,
			nombre_contacto=nom_contacto,
			nombre_cancha=nom_cancha,
			full=full,
		)
		return reservas
	finally:
		session.close()

@router.post('/cancha/{id_cancha}', status_code=status.HTTP_201_CREATED, response_model = ReservaSchema)
def crear_reserva(
	id_cancha: int,
	dia: date,
	hora: int,
	dur_mins: int,
	tel: str,
	nom_contacto: str,
) -> Reserva:
	session = MakeSession()

	cancha = crud.get_cancha(session, id_cancha)

	if cancha is None:
		session.close()
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se encontró ninguna cancha con la ID: {id_cancha}, al intentar realizar una reserva'
		)

	try:
		reserva_creada = crud.create_reserva(session, ReservaCreate(
			id_cancha = id_cancha,
			dia = dia,
			hora = hora,
			duración_minutos = dur_mins,
			teléfono = tel,
			nombre_contacto = nom_contacto,
		))

		return reserva_creada
	finally:
		session.close()

@router.patch('/id/{id_reserva}', status_code=status.HTTP_200_OK, response_model = ReservaSchema)
def modificar_reserva(
	id_reserva: int,
	dia: Optional[date] = None,
	hora: Optional[int] = None,
	dur_mins: Optional[int] = None,
	tel: Optional[str] = None,
	nom_contacto: Optional[str] = None,
) -> Reserva:
	session = MakeSession()

	reserva = crud.get_reserva(session, id_reserva=id_reserva)

	if reserva is None:
		session.close()
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se encontró ninguna reserva con la ID: {id_reserva}'
		)

	if dia is None and hora is None and dur_mins is None and tel is None and nom_contacto is None:
		raise HTTPException(
			status.HTTP_400_BAD_REQUEST,
			'No se instruyó ninguna modificación',
		)

	try:
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
	finally:
		session.close()

	return reserva

@router.delete('/id/{id_reserva}', status_code=status.HTTP_200_OK, response_model = ReservaSchema)
def quitar_reserva_por_id(id_reserva: int) -> Reserva:
	session = MakeSession()
	reserva_eliminada = crud.delete_reserva(session, id_reserva=id_reserva)
	session.close()

	if reserva_eliminada is None:
		raise HTTPException(
			status.HTTP_404_NOT_FOUND,
			f'No se eliminó ninguna reserva dado que no existe una con la ID indicada: {id_reserva}'
		)

	return reserva_eliminada

@router.delete('/q', status_code=status.HTTP_200_OK, response_model = List[ReservaSchema])
def quitar_reservas_por_consulta(
	id_cancha: Optional[int] = None,
	qmin: Optional[int] = None,
	qmax: Optional[int] = None,
	dia: Optional[str] = None,
	hora: Optional[str] = None,
	dur_mins: Optional[str] = None,
	tel: Optional[str] = None,
	nom_contacto: Optional[str] = None,
	nom_cancha: Optional[str] = None,
) -> list[Reserva]:
	session = MakeSession()

	try:
		rango = crud.qparams_a_rango(qmin, qmax)
		dia_rango_u_valor = obtener_rango_u_valor_date(dia, 'día')
		hora_rango_u_valor = obtener_rango_u_valor_int(hora, 'hora')
		dur_mins_rango_u_valor = obtener_rango_u_valor_int(dur_mins, 'duración en minutos')

		reservas = crud.delete_reservas(
			session,
			id_cancha=id_cancha,
			rango=rango,
			dia=dia_rango_u_valor,
			hora=hora_rango_u_valor,
			duración_minutos=dur_mins_rango_u_valor,
			teléfono=tel,
			nombre_contacto=nom_contacto,
			nombre_cancha=nom_cancha,
		)

		return reservas
	finally:
		session.close()
