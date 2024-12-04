from pydantic import BaseModel

class CanchaBase(BaseModel):
	nombre: str
	techada: bool

class CanchaCreate(CanchaBase):
	def __init__(self, nombre: str, techada: bool):
		self.nombre = nombre
		self.techada = techada

class Cancha(CanchaBase):
	id: int

class ReservaBase(BaseModel):
	id_cancha: int
	dia: int
	hora: int
	duración_minutos: int
	teléfono: str
	nombre_contacto: str

class ReservaCreate(ReservaBase):
	pass

class Reserva(ReservaBase):
	id: int
