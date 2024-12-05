from typing import Optional, TypeVar
from sqlalchemy.orm import Session as _Session, Query as _Query, Mapped as _Mapped
from .models import Cancha, Reserva
from .schemas import CanchaCreate, ReservaCreate

T = TypeVar('T')

def _buscar_rango_u_exacto(
	query: _Query[T],
	columna: _Mapped[int],
	argumento: int | Optional[tuple[int, int]] = None,
) -> _Query[T]:
	filtrado = False

	if isinstance(argumento, int):
		query = query.filter(columna == argumento)
		filtrado = True

	if (
		isinstance(argumento, tuple)
		and isinstance(argumento[0], int)
		and isinstance(argumento[1], int)
	):
		(rmin, rmax) = argumento
		if rmin > rmax:
			(rmin, rmax) = (rmax, rmin)

		query = query.filter(columna >= argumento[0] and columna < argumento[1])
		filtrado = True

	if not filtrado and argumento is not None:
		nom_var = f"{argumento=}".split("=")[0]
		raise TypeError(
			f'El criterio "{nom_var}" debe ser un entero o tupla de dos enteros'
		)

	return query

def create_cancha(session: _Session,
	cancha: CanchaCreate
) -> Cancha:
	"""Crea una nueva Cancha en la BDD y devuelve el objeto que la representa"""

	db_cancha = Cancha(nombre=cancha.nombre, techada=cancha.techada)
	session.add(db_cancha)
	session.commit()

	return db_cancha

def create_reserva(session: _Session,
	reserva: ReservaCreate,
) -> Reserva:
	"""Crea una nueva Reserva en la BDD y devuelve el objeto que la representa"""

	db_reserva = Reserva(
		id_cancha=reserva.id_cancha,
		dia=reserva.dia,
		hora=reserva.hora,
		duración_minutos=reserva.duración_minutos,
		teléfono=reserva.teléfono,
		nombre_contacto=reserva.nombre_contacto,
	)
	session.add(db_reserva)
	session.commit()

	return db_reserva


def get_cancha(session: _Session,
	cancha_id: int,
) -> Cancha | None:
	"""Busca una Cancha en la BDD con la ID especificada y la devuelve"""
	return session.query(Cancha).get(cancha_id)

def get_reserva(session: _Session,
	id_reserva: Optional[int] = None,
	id_cancha: Optional[int] = None,
) -> Reserva | None:
	"""Busca una Reserva en la BDD con la ID especificada y la devuelve"""
	if id_reserva is not None:
		return session.query(Reserva).get(id_reserva)

	if id_cancha is not None:
		return (
			session.query(Reserva)
			.filter(Reserva.id_cancha == id_cancha)
			.first()
		)

	raise TypeError("Se esperaba o una ID de reserva o una ID de cancha")

def get_canchas(session: _Session,
	rango: Optional[tuple[int, int]] = None,
	nombre: Optional[str] = None,
	techada: Optional[bool] = None,
) -> list[Cancha]:
	"""Devuelve una lista de objetos que representan Canchas encontradas en la BDD"""

	query = session.query(Cancha)

	if nombre is not None:
		if len(nombre) == 0:
			raise ValueError("No puedes buscar un nombre vacío")

		query = query.filter(Cancha.nombre == nombre)

	if techada is not None:
		if not isinstance(techada, bool):
			raise ValueError(
				"El criterio de si la cancha está techada debe ser True, False o None"
			)

		query = query.filter(Cancha.techada == techada)

	if rango is not None:
		if (
			not isinstance(rango, tuple)
			or not isinstance(rango[0], int)
			or not isinstance(rango[1], int)
		):
			raise TypeError("El rango debe ser una tupla de 2 enteros")

		query = query.offset(rango[0]).limit(rango[1] - rango[0])

	result = query.all()

	return result if result is not None else []

def get_reservas(session: _Session,
	id_cancha: Optional[int] = None,
	rango: Optional[tuple[int, int]] = None,
	dia: Optional[int | tuple[int, int]] = None,
	hora: Optional[int | tuple[int, int]] = None,
	duración_minutos: Optional[int | tuple[int, int]] = None,
	teléfono: Optional[str] = None,
	nombre_contacto: Optional[str] = None,
) -> list[Reserva]:
	"""Devuelve una lista de objetos que representan Canchas encontradas en la BDD"""

	query = session.query(Reserva)

	if id_cancha:
		if not isinstance(id_cancha, int):
			raise TypeError("La ID de Cancha debe ser un entero")

		query = query.filter(Reserva.id_cancha == id_cancha)

	query = _buscar_rango_u_exacto(query, columna=Reserva.dia, argumento=dia)
	query = _buscar_rango_u_exacto(query, columna=Reserva.hora, argumento=hora)
	query = _buscar_rango_u_exacto(
		query, columna=Reserva.duración_minutos, argumento=duración_minutos
	)

	if teléfono is not None:
		query = query.filter(Reserva.teléfono == str(teléfono))

	if nombre_contacto is not None:
		query = query.filter(Reserva.nombre_contacto == str(nombre_contacto))

	if rango is not None:
		if (
			not isinstance(rango, tuple)
			or not isinstance(rango[0], int)
			or not isinstance(rango[1], int)
		):
			raise TypeError("El rango debe ser una tupla de 2 enteros")

		query = query.offset(rango[0]).limit(rango[1] - rango[0])

	return query.all()


def update_reserva(session: _Session,
	id_reserva: Optional[int] = None,
	dia: Optional[int] = None,
	hora: Optional[int] = None,
	duración_minutos: Optional[int] = None,
	teléfono: Optional[str] = None,
	nombre_contacto: Optional[str] = None,
) -> Reserva | None:
	db_reserva = get_reserva(session, id_reserva)

	if db_reserva is None:
		return None

	if dia is not None:
		db_reserva.dia = dia

	if hora is not None:
		db_reserva.hora = hora

	if duración_minutos is not None:
		db_reserva.duración_minutos = duración_minutos

	if teléfono is not None:
		db_reserva.teléfono = teléfono

	if nombre_contacto is not None:
		db_reserva.nombre_contacto = nombre_contacto

	session.commit()

	return db_reserva


def delete_cancha(session: _Session,
	id_cancha: int,
) -> Cancha | None:
	"""Busca una Cancha en la BDD con la ID especificada, la elimina y y la devuelve"""

	db_cancha_por_eliminar = session.query(Cancha).filter(Cancha.id == id_cancha).first()

	if db_cancha_por_eliminar is None:
		return None

	session.delete(db_cancha_por_eliminar)
	session.commit()

	return db_cancha_por_eliminar

def delete_reserva(session: _Session,
	id_reserva: int,
) -> Reserva | None:
	"""Busca una Resrva en la BDD con la ID especificada, la elimina y la devuelve"""

	db_reserva_por_eliminar = session.query(Reserva).filter(Reserva.id == id_reserva).first()

	if db_reserva_por_eliminar is None:
		return None

	session.delete(db_reserva_por_eliminar)
	session.commit()

	return db_reserva_por_eliminar
