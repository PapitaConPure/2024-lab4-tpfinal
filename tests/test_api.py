from unittest import TestCase
from fastapi import status
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestAPI(TestCase):
	"""Tests de endpoints base"""
	def test_get(self):
		response = client.get('/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data, 'Server en funcionamiento')

class TestAPICanchas(TestCase):
	"""Tests de los endpoints para Canchas"""
	def test_get(self):
		response = client.get('/canchas')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			cancha = data[0]
			self.assertIsNotNone(cancha['id'])
			self.assertIsNotNone(cancha['nombre'])
			self.assertIsNotNone(cancha['techada'])

			self.assertEqual(type(cancha['id']), int)
			self.assertEqual(type(cancha['nombre']), str)
			self.assertEqual(type(cancha['techada']), bool)

	def test_get_id(self):
		response = client.get('/canchas/id/174')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertIsNotNone(data['id'])
		self.assertIsNotNone(data['nombre'])
		self.assertIsNotNone(data['techada'])

		self.assertEqual(type(data['id']), int)
		self.assertEqual(type(data['nombre']), str)
		self.assertEqual(type(data['techada']), bool)

	def test_get_query(self):
		response = client.get('/canchas/q?qmin=3&qmax=8&nombre=cancha1&techada=1')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)
		self.assertGreaterEqual(len(data), 0)
		self.assertLessEqual(len(data), 5)

		for cancha in data:
			self.assertIsNotNone(cancha['id'])
			self.assertEqual(type(cancha['id']), int)

			self.assertEqual(cancha['nombre'], 'cancha1')
			self.assertEqual(cancha['techada'], True)

	def test_post(self):
		responses = [
			client.post('/canchas?nombre=CanchaPrueba1&techada=0'),
			client.post('/canchas?nombre=CanchaPrueba2&techada=1'),
			client.post('/canchas?nombre=CanchaPrueba3'),
		]

		equalities = [
			{ 'nombre': 'CanchaPrueba1', 'techada': False },
			{ 'nombre': 'CanchaPrueba2', 'techada': True },
			{ 'nombre': 'CanchaPrueba3', 'techada': False },
		]

		for i, response in enumerate(responses):
			self.assertEqual(response.status_code, status.HTTP_201_CREATED)
			data = response.json()
			response.close()
			self.assertEqual(data['nombre'], equalities[i]['nombre'])
			self.assertEqual(data['techada'], equalities[i]['techada'])

	def test_patch(self):
		response = client.patch('/canchas/id/172?nombre=CanchaPrueba42&techada=1')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['nombre'], 'CanchaPrueba42')
		self.assertEqual(data['techada'], True)

		response = client.patch('/canchas/id/172?nombre=CanchaPrueba24&techada=0')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['nombre'], 'CanchaPrueba24')
		self.assertEqual(data['techada'], False)

		response = client.patch('/canchas/id/172?techada=1')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['nombre'], 'CanchaPrueba24')
		self.assertEqual(data['techada'], True)

		response = client.patch('/canchas/id/172?nombre=CanchaPrueba99')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['nombre'], 'CanchaPrueba99')
		self.assertEqual(data['techada'], True)

	def test_delete_id(self):
		response = client.post('/canchas?nombre=temporal&techada=0')
		data = response.json()

		response = client.delete(f'/canchas/id/{data['id']}')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['nombre'], 'temporal')
		self.assertEqual(data['techada'], False)

	def test_delete_query(self):
		response = client.delete('/canchas/q?qmax=1&nombre=cancha4&techada=1')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			cancha = data[0]
			self.assertEqual(cancha['nombre'], 'cancha4')
			self.assertEqual(cancha['techada'], True)

	def test_post_fails_nombre(self):
		response = client.post('/canchas?techada=1')
		self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)
		response.close()

	def test_get_query_fails_qmin(self):
		response = client.get('/canchas/q?qmin=:::')
		self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)
		response.close()

	def test_delete_query_fails_qmin(self):
		response = client.delete('/canchas/q?qmin=wasd')
		self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)
		response.close()


class TestAPIReservas(TestCase):
	"""Tests de los endpoints para Reservas"""
	@classmethod
	def verificar_reserva(cls, self, data):
		reserva = None
		cancha = None
		if 'reserva' in data and 'cancha' in data:
			reserva = data['reserva']
			cancha = data['cancha']
		else:
			reserva = data

		cls.assertIsNotNone(self, reserva['id'])
		cls.assertIsNotNone(self, reserva['dia'])
		cls.assertIsNotNone(self, reserva['hora'])
		cls.assertIsNotNone(self, reserva['duración_minutos'])
		cls.assertIsNotNone(self, reserva['teléfono'])
		cls.assertIsNotNone(self, reserva['id_cancha'])

		cls.assertEqual(self, type(reserva['id']), int)
		cls.assertEqual(self, type(reserva['dia']), int)
		cls.assertEqual(self, type(reserva['hora']), int)
		cls.assertEqual(self, type(reserva['duración_minutos']), int)
		cls.assertEqual(self, type(reserva['teléfono']), str)
		cls.assertEqual(self, type(reserva['id_cancha']), int)

		if reserva['nombre_contacto'] is not None:
			cls.assertEqual(self, type(reserva['nombre_contacto']), str)

		if cancha is not None:
			cls.assertEqual(self, type(cancha['id']), int)
			cls.assertEqual(self, type(cancha['nombre']), str)
			cls.assertEqual(self, type(cancha['techada']), bool)

	def test_get(self):
		response = client.get('/reservas')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			TestAPIReservas.verificar_reserva(self, data[0])

	def test_id(self):
		response = client.get('/reservas/id/174')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		TestAPIReservas.verificar_reserva(self, data)

	def test_id_completo(self):
		response = client.get('/reservas/id/174?full=1')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		TestAPIReservas.verificar_reserva(self, data)
		self.assertIsNotNone(data['cancha'])
		self.assertIsNotNone(data['cancha']['id'])
		self.assertIsNotNone(data['cancha']['nombre'])
		self.assertIsNotNone(data['cancha']['techada'])

	def test_get_query(self):
		response = client.get('/reservas/q?qmax=5&id_cancha=200')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)
		self.assertGreaterEqual(len(data), 0)
		self.assertLessEqual(len(data), 5)

		for cancha in data:
			TestAPIReservas.verificar_reserva(self, cancha)

	def test_get_query_uphalf(self):
		response = client.get('/reservas')
		data = response.json()
		response.close()

		total_count = len(data)
		half_count = int(total_count / 2)

		response = client.get(f'/reservas/q?qmin={half_count}')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()

		self.assertEqual(len(data), total_count - half_count)

	def test_post(self):
		response = client.post('/canchas?nombre=temporal')
		data = response.json()
		idc = data['id']

		responses = [
			client.post(f'/reservas/cancha/{idc}?dia=1&hora=18&dur_mins=45&tel=93434502306&nom_contacto=pocahontas'),
			client.post(f'/reservas/cancha/{idc}?dia=9&hora=19&dur_mins=180&tel=93434205774&nom_contacto=rodrigo'),
			client.post(f'/reservas/cancha/{idc}?dia=6&hora=22&dur_mins=90&tel=93439122017&nom_contacto=brayan'),
		]

		equalities = [
			{
				'id_cancha': idc,
				'dia': 1,
				'hora': 18,
				'duración_minutos': 45,
				'teléfono': '93434502306',
				'nombre_contacto': 'pocahontas',
			},
			{
				'id_cancha': idc,
				'dia': 9,
				'hora': 19,
				'duración_minutos': 180,
				'teléfono': '93434205774',
				'nombre_contacto': 'rodrigo',
			},
			{
				'id_cancha': idc,
				'dia': 6,
				'hora': 22,
				'duración_minutos': 90,
				'teléfono': '93439122017',
				'nombre_contacto': 'brayan',
			},
		]

		for i, response in enumerate(responses):
			self.assertEqual(response.status_code, status.HTTP_201_CREATED)
			reserve = response.json()
			response.close()
			equality = equalities[i]

			self.assertEqual(reserve['id_cancha'], equality['id_cancha'])
			self.assertEqual(reserve['dia'], equality['dia'])
			self.assertEqual(reserve['hora'], equality['hora'])
			self.assertEqual(reserve['duración_minutos'], equality['duración_minutos'])
			self.assertEqual(reserve['teléfono'], equality['teléfono'])
			self.assertEqual(reserve['nombre_contacto'], equality['nombre_contacto'])

			client.delete(f'reservas/id/{reserve['id']}').close()

		client.delete(f'canchas/id/{idc}').close()

	def test_patch(self):
		response = client.patch('/reservas/id/174?dia=12&hora=13&dur_mins=60&tel=3424202445&nom_contacto=sebastian')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['id'], 174)
		self.assertEqual(data['dia'], 12)
		self.assertEqual(data['hora'], 13)
		self.assertEqual(data['duración_minutos'], 60)
		self.assertEqual(data['teléfono'], '3424202445')
		self.assertEqual(data['nombre_contacto'], 'sebastian')

		response = client.patch('/reservas/id/174?dia=24&hora=7&dur_mins=120&tel=3434502306&nom_contacto=maurisio')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['dia'], 24)
		self.assertEqual(data['hora'], 7)
		self.assertEqual(data['duración_minutos'], 120)
		self.assertEqual(data['teléfono'], '3434502306')
		self.assertEqual(data['nombre_contacto'], 'maurisio')

	def test_delete_id(self):
		response = client.post('/canchas?nombre=temporal')
		data = response.json()
		idc = data['id']

		response = client.post(f'/reservas/cancha/{idc}?dia=8&hora=14&dur_mins=50&tel=9314451106&nom_contacto=juan')
		data = response.json()
		idr = data['id']

		response = client.delete(f'/reservas/id/{idr}')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(data['dia'], 8)
		self.assertEqual(data['hora'], 14)
		self.assertEqual(data['duración_minutos'], 50)
		self.assertEqual(data['teléfono'], '9314451106')
		self.assertEqual(data['nombre_contacto'], 'juan')

	def test_delete_query(self):
		response = client.post('/canchas?nombre=temporal&techada=1')
		data = response.json()
		idc = data['id']
		response.close()

		client.post(f'/reservas/cancha/{idc}?dia=1&hora=18&dur_mins=45&tel=93434502306&nom_contacto=pocahontas').close()
		client.post(f'/reservas/cancha/{idc}?dia=9&hora=19&dur_mins=180&tel=93434205774&nom_contacto=rodrigo').close()
		client.post(f'/reservas/cancha/{idc}?dia=6&hora=22&dur_mins=90&tel=93439122017&nom_contacto=brayan').close()

		response = client.delete(f'/reservas/q?qmax=5&id_cancha={idc}&dur=30:300')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			reserva = data[0]

			self.assertEqual(reserva['id_cancha'], idc)

		client.delete(f'reservas/q?id_cancha={idc}')
		client.delete(f'canchas/id/{idc}')

	def test_get_query_fails_dia_ab(self):
		response = client.get('/reservas/q?dia=a:b')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		response.close()

	def test_get_query_fails_dia_locura(self):
		response = client.get('/reservas/q?dia=::sdfsdvcsx:')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		response.close()

	def test_get_query_fails_dia_lonly(self):
		response = client.get('/reservas/q?dia=a:3')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		response.close()

	def test_get_query_fails_dia_ronly(self):
		response = client.get('/reservas/q?dia=2:b')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		response.close()

	def test_get_query_fails_dia_3elems(self):
		response = client.get('/reservas/q?dia=1:2:3')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		response.close()
