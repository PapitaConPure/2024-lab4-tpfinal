from db import Base

class Reserva(Base):
	__tablename__ = 'reservas'

	def __init__(self, cancha, dia, hora, duración, teléfono, nombre_contacto):
		self.cancha = cancha
		self.dia = dia
		self.hora = hora
		self.duración = duración
		self.teléfono = teléfono
		self.nombre_contacto = nombre_contacto
		pass
