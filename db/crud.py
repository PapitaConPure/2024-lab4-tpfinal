from typing import Optional
from sqlalchemy import Column as _Column
from sqlalchemy.orm import Session as _Session, Query as _Query
from . import models, schemas

def _buscar_rango_u_exacto(query: _Query, columna: _Column, argumento: int | Optional[tuple[int, int]] = None) -> _Query:
	filtrado = False

	if isinstance(argumento, int):
		query = query.filter(columna == argumento)
		filtrado = True

	if isinstance(argumento, tuple) and isinstance(argumento[0], int) and isinstance(argumento[1], int):
		min = argumento[0]
		max = argumento[1]
		if(min > max):
			tmp = min
			min = max
			max = tmp
			
		query = query.filter(columna >= argumento[0] and columna < argumento[1])
		filtrado = True
	
	if not filtrado and argumento is not None:
		nombre_variable = f'{argumento=}'.split('=')[0]
		raise TypeError(f'La búsqueda según "{nombre_variable}" debe ser un entero o una tupla de enteros que especifique el rango de valores')
	
	return query

def get_cancha(session: _Session, cancha_id: int) -> schemas.Cancha:
	"""Busca una Cancha en la BDD con la ID especificada y la devuelve"""
	return session.query(models.Cancha).get(cancha_id)

def get_reserva(session: _Session, id_reserva: Optional[int] = None, id_cancha: Optional[int] = None) -> schemas.Reserva:
	"""Busca una Reserva en la BDD con la ID especificada y la devuelve"""
	if(id_reserva is not None):
		return session.query(models.Reserva).get(id_reserva)
	
	if(id_cancha is not None):
		return session.query(models.Reserva).filter(models.Reserva.id_cancha == id_cancha).first()
	
	raise TypeError('Se esperaba o una ID de reserva o una ID de cancha')

def get_canchas(session: _Session, rango: Optional[tuple[int, int]] = None, nombre: Optional[str] = None, techada: Optional[bool] = None) -> list[schemas.Cancha]:
	"""Devuelve una lista de objetos que representan Canchas encontradas en la BDD"""

	query = session.query(models.Cancha)
	
	if(nombre is not None):
		if len(nombre) == 0:
			raise ValueError('No puedes buscar un nombre vacío')
		
		query = query.filter(models.Cancha.nombre == nombre)
	
	if(techada is not None):
		if not isinstance(techada, bool):
			raise ValueError('El criterio de si la cancha está techada debe ser True, False o None')
		
		query = query.filter(models.Cancha.techada == techada)

	if(rango is not None):
		if not isinstance(rango, tuple) or not isinstance(rango[0], int) or not isinstance(rango[1], int):
			raise TypeError('El rango debe ser una tupla de 2 enteros')
		
		query = query.offset(rango[0]).limit(rango[1] - rango[0])
	
	result = query.all()

	return result if result is not None else []

def get_reservas(
	session: _Session,
	id_cancha: Optional[int] = None,
	rango: Optional[tuple[int, int]] = None,
	dia: Optional[int | tuple[int, int]] = None,
	hora: Optional[int | tuple[int, int]] = None,
	duración_minutos: Optional[int | tuple[int, int]] = None,
	teléfono: Optional[str] = None,
	nombre_contacto: Optional[str] = None,
) -> list[schemas.Reserva]:
	"""Devuelve una lista de objetos que representan Canchas encontradas en la BDD"""

	query = session.query(models.Reserva)

	if(id_cancha):
		if not isinstance(id_cancha, int):
			raise TypeError('La ID de Cancha debe ser un entero')
		
		query = query.filter(models.Reserva.id_cancha == id_cancha)
	
	query = _buscar_rango_u_exacto(query, columna=models.Reserva.dia, argumento=dia)
	query = _buscar_rango_u_exacto(query, columna=models.Reserva.hora, argumento=hora)
	query = _buscar_rango_u_exacto(query, columna=models.Reserva.duración_minutos, argumento=duración_minutos)

	if(teléfono is not None):
		query = query.filter(models.Reserva.teléfono == str(teléfono))
	
	if(nombre_contacto is not None):
		query = query.filter(models.Reserva.nombre_contacto == str(nombre_contacto))

	if(rango is not None):
		if not isinstance(rango, tuple) or not isinstance(rango[0], int) or not isinstance(rango[1], int):
			raise TypeError('El rango debe ser una tupla de 2 enteros')
		
		query = query.offset(rango[0]).limit(rango[1] - rango[0])
	
	return query.all()

def create_cancha(session: _Session, cancha: schemas.CanchaCreate) -> schemas.Cancha:
	"""Crea una nueva Cancha en la BDD y devuelve el objeto que la representa"""

	db_cancha = models.Cancha(nombre=cancha.nombre, techada=cancha.techada)
	session.add(db_cancha)
	session.commit()

	return db_cancha

def create_reserva(session: _Session, reserva: schemas.ReservaCreate) -> schemas.Reserva:
	"""Crea una nueva Cancha en la BDD y devuelve el objeto que la representa"""

	db_cancha = models.Reserva(
		id_cancha=reserva.id_cancha,
		dia=reserva.dia,
		hora=reserva.hora,
		duración_minutos=reserva.duración_minutos,
		teléfono=reserva.teléfono,
		nombre_contacto=reserva.nombre_contacto,
	)
	session.add(db_cancha)
	session.commit()

	return db_cancha
