from db import Base
from sqlalchemy import Column, Integer, String, Boolean

class Cancha(Base):
	__tablename__ = 'canchas'

	id = Column(Integer, primary_key=True)
	nombre = Column(String)
	techada = Column(Boolean)

	def __init__(self, nombre, techada):
		self.nombre = nombre
		self.techada = techada
		pass
