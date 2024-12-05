from pydantic import BaseModel, ConfigDict

class CanchaBase(BaseModel):
	nombre: str
	techada: bool

class CanchaCreate(CanchaBase):
	pass

class CanchaSchema(CanchaBase):
	id: int
	model_config = ConfigDict(from_attributes=True)

class ReservaBase(BaseModel):
	id_cancha: int
	dia: int
	hora: int
	duración_minutos: int
	teléfono: str
	nombre_contacto: str

class ReservaCreate(ReservaBase):
	pass

class ReservaSchema(ReservaBase):
	id: int
	model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)
