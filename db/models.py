from . import Base
from sqlalchemy import Column, Integer, SmallInteger, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, relationship
from typing import List

class Cancha(Base):
	__tablename__ = 'canchas'

	id = Column(Integer, primary_key=True, autoincrement=True)
	nombre = Column(String(40))
	techada = Column(Boolean, nullable=False)

	reservas: Mapped[List['Reserva']] = relationship(backref='cancha')

	def __init__(self, nombre: String, techada: Boolean):
		self.nombre = nombre
		self.techada = techada

class Reserva(Base):
	__tablename__ = 'reservas'

	id = Column(Integer, primary_key=True)
	dia = Column(SmallInteger, nullable=False)
	hora = Column(SmallInteger, nullable=False)
	duración_minutos = Column(Integer, nullable=False)
	teléfono = Column(String, nullable=False)
	nombre_contacto = Column(String)
	id_cancha = Column(Integer, ForeignKey('canchas.id'), nullable=False)

	def __init__(self, id_cancha, dia, hora, duración_minutos, teléfono, nombre_contacto):
		self.id_cancha = id_cancha
		self.dia = dia
		self.hora = hora
		self.duración_minutos = duración_minutos
		self.teléfono = teléfono
		self.nombre_contacto = nombre_contacto
