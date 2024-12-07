from unittest import TestCase
from db import MakeSession
from db.crud import create_cancha, delete_cancha, get_cancha, get_canchas
from db.schemas import CanchaCreate

class TestBDDCanchas(TestCase):
	def test_add_remove(self):
		session = MakeSession()
		cancha1 = create_cancha(session, CanchaCreate.model_construct(nombre = 'cancha1', techada = True))

		self.assertEqual(cancha1.nombre, 'cancha1')
		self.assertTrue(cancha1.techada)

		session.add(cancha1)
		session.commit()

		resultado_delete = delete_cancha(session, id_cancha=cancha1.id)
		self.assertIsNotNone(resultado_delete)

		cancha1 = get_cancha(session, id_cancha=cancha1.id)
		self.assertIsNone(cancha1)

		session.commit()

		session.close()

	def test_query(self):
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
		self.assertEqual(canchas[0].techada, True)
		self.assertEqual(canchas[1].techada, True)
		self.assertEqual(canchas[2].techada, True)
		self.assertEqual(canchas[3].techada, True)
		self.assertEqual(canchas[4].techada, True)

		canchas = get_canchas(session, rango=(1,4), techada=True)
		self.assertLessEqual(len(canchas), 4)

		canchas = get_canchas(session, nombre='cancha2')
		self.assertEqual(canchas[0].nombre, 'cancha2')

		session.close()

	def test_update(self):
		session = MakeSession()
		canchas = get_canchas(session, rango=(0, 10), nombre='cancha2')
		session.commit()

		self.assertTrue(cancha == 'cancha2' for cancha in canchas)
		self.assertGreaterEqual(len(canchas), 0)
		self.assertLessEqual(len(canchas), 10)

		cancha = canchas[0]
		cancha.nombre='Paulo'
		cancha.techada=False

		self.assertEqual(cancha.nombre, 'Paulo')
		self.assertEqual(cancha.techada, False)

		session.close()
