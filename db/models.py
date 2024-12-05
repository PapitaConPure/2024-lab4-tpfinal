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

	reservas: Mapped[List['Reserva']] = relationship(backref='cancha')

class Reserva(Base):
	__tablename__ = 'reservas'

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	dia: Mapped[int] = mapped_column(SmallInteger, nullable=False)
	hora: Mapped[int] = mapped_column(SmallInteger, nullable=False)
	duración_minutos: Mapped[int] = mapped_column(Integer, nullable=False)
	teléfono: Mapped[str] = mapped_column(String, nullable=False)
	nombre_contacto: Mapped[str] = mapped_column(String)
	id_cancha: Mapped[int] = mapped_column(Integer, ForeignKey('canchas.id'), nullable=False)
