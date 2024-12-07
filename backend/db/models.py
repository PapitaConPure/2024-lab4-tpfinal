from typing import List
from sqlalchemy import Integer, SmallInteger, String, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
	pass

class Cancha(Base):
	__tablename__ = 'canchas'

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	nombre: Mapped[str] = mapped_column(String(40))
	techada: Mapped[bool] = mapped_column(Boolean, nullable=False)

	reservas: Mapped[List['Reserva']] = relationship('Reserva', back_populates='cancha')

class Reserva(Base):
	__tablename__ = 'reservas'

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	dia: Mapped[int] = mapped_column(SmallInteger, nullable=False)
	hora: Mapped[int] = mapped_column(SmallInteger, nullable=False)
	duración_minutos: Mapped[int] = mapped_column(Integer, nullable=False)
	teléfono: Mapped[str] = mapped_column(String, nullable=False)
	nombre_contacto: Mapped[str] = mapped_column(String, nullable=False)
	id_cancha: Mapped[int] = mapped_column(ForeignKey('canchas.id'), nullable=False)

	cancha: Mapped['Cancha'] = relationship('Cancha', back_populates='reservas')

class ReservaCompleta:
	reserva: Reserva
	cancha: Cancha
	def __init__(self, reserva: Reserva, cancha: Cancha):
		self.reserva = reserva
		self.cancha = cancha
