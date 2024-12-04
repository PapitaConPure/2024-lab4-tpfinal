import unittest
from db import MakeSession
from db.crud import create_cancha, get_canchas
from db.schemas import CanchaCreate

class TestDB(unittest.TestCase):
	def test_add_remove_cancha(self):
		session = MakeSession()
		cancha1 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha1', techada = True))

		self.assertAlmostEqual(cancha1.nombre, 'cancha1')
		self.assertTrue(cancha1.techada)

		session.add(cancha1)
		session.commit()
		session.close()

	def test_query_canchas(self):
		session = MakeSession()
		cancha0 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha0', techada = False))
		cancha1 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha1', techada = True))
		cancha2 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha2', techada = True))
		cancha3 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha3', techada = False))
		cancha4 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha4', techada = True))
		cancha5 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha5', techada = False))
		cancha6 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha6', techada = False))
		cancha7 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha7', techada = True))
		cancha8 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha8', techada = False))
		cancha9 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha9', techada = True))

		session.add(cancha0)
		session.add(cancha1)
		session.add(cancha2)
		session.add(cancha3)
		session.add(cancha4)
		session.add(cancha5)
		session.add(cancha6)
		session.add(cancha7)
		session.add(cancha8)
		session.add(cancha9)

		session.commit()

		canchas = get_canchas(session, techada=True)
		self.assertEqual(canchas[0].nombre, 'cancha1')
		self.assertEqual(canchas[1].nombre, 'cancha2')
		self.assertEqual(canchas[2].nombre, 'cancha4')
		self.assertEqual(canchas[3].nombre, 'cancha7')
		self.assertEqual(canchas[4].nombre, 'cancha9')

		canchas = get_canchas(session, rango=(1,4), techada=True)
		self.assertEqual(canchas[0].nombre, 'cancha2')
		self.assertEqual(canchas[1].nombre, 'cancha4')
		self.assertEqual(canchas[2].nombre, 'cancha7')

		canchas = get_canchas(session, nombre='cancha2')
		self.assertEqual(canchas[0].nombre, 'cancha2')

		session.close()
