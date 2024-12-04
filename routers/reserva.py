from fastapi import APIRouter
from db import MakeSession, crud, schemas
from typing import Optional

router = APIRouter(prefix='/reservas')

@router.get('/')
def raíz_reservas():
	session = MakeSession()
	session.close()
	return { 'what': 'lmao' }

@router.get('/q')
def get_reservas(
	id_cancha: Optional[int] = None,
	min: Optional[int] = None,
	max: Optional[int] = None,
	dia: Optional[str] = None,
	hora: Optional[str] = None,
	dur_mins: Optional[str] = None,
	tel: Optional[str] = None,
	nom_contacto: Optional[str] = None,
) -> list[schemas.Reserva]:
	session = MakeSession()
	
	if(max is not None and min is None):
		min = 0
	
	if(min is not None and max is None):
		max = 2 ** 53 - 1

	def obtener_rango_u_específico(x, nom_criterio = '<<criterio desconocido>>') -> int | tuple[int, int]:
		if x is None:
			return None
		
		mensaje_error_formato = f'El criterio de búsqueda según {nom_criterio} ({x=}) debe expresarse como un entero o un rango bajo el formato "min:max"'

		try:
			if ':' not in x:
				return int(x)

			partes = x.split(':')

			if(len(partes) != 2):
				raise ValueError(mensaje_error_formato)
			
			return (
				int(partes[0]) if len(partes[0]) > 0 else 0,
				int(partes[1]) if len(partes[1]) > 0 else 2 ** 53 - 1
			)
		except ValueError:
			raise ValueError(mensaje_error_formato)

	dia = obtener_rango_u_específico(dia, 'día')
	hora = obtener_rango_u_específico(hora, 'hora')
	dur_mins = obtener_rango_u_específico(dur_mins, 'duración en minutos')

	reservas = crud.get_reservas(session,
		id_cancha = id_cancha,
		rango = (min, max) if (min is not None and max is not None) else None,
		dia = dia,
		hora = hora,
		duración_minutos = dur_mins,
		teléfono = tel,
		nombre_contacto = nom_contacto,
	)
	session.close()

	return reservas

@router.get('/id/{id}')
def get_reserva(id: int) -> schemas.Reserva:
	session = MakeSession()
	reserva = crud.get_reserva(session, id)
	session.close()

	return reserva

@router.post('/cancha/{id_cancha}')
def crear_reserva(
	id_cancha: int,
	dia: int,
	hora: int,
	dur_mins: int,
	tel: str,
	nom_contacto: str,
):
	pass

@router.put('/id/{id}')
def modificar_reserva(
	id: int,
	dia: int,
	hora: int,
	dur_mins: int,
	tel: str,
	nom_contacto: str,
):
	pass

@router.delete('/id/{id}')
def quitar_reserva(id: int):
	pass
