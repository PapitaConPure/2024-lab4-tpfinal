from unittest import TestCase
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestAPI(TestCase):
	"""Tests de endpoints base"""
	def test_api_root_get(self):
		response = client.get('/')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertEqual(data, 'Server en funcionamiento')

class TestAPICanchas(TestCase):
	"""Tests de los endpoints para Canchas"""
	def test_api_canchas_get(self):
		response = client.get('/canchas')
		self.assertEqual(response.status_code, 200)
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

	def test_api_canchas_get_id(self):
		response = client.get('/canchas/id/174')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertIsNotNone(data['id'])
		self.assertIsNotNone(data['nombre'])
		self.assertIsNotNone(data['techada'])

		self.assertEqual(type(data['id']), int)
		self.assertEqual(type(data['nombre']), str)
		self.assertEqual(type(data['techada']), bool)

	def test_api_canchas_get_query(self):
		response = client.get('/canchas/q?qmin=3&qmax=8&nombre=cancha1&techada=1')
		self.assertEqual(response.status_code, 200)
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

	def test_api_canchas_post(self):
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
			self.assertEqual(response.status_code, 200)
			data = response.json()
			response.close()
			self.assertDictEqual(data, equalities[i])

	def test_api_canchas_put(self):
		response = client.put('/canchas/id/172?nombre=CanchaPrueba42&teclada=1')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertDictEqual(data, { 'nombre': 'CanchaPrueba42', 'techada': True })


		response = client.put('/canchas/id/172?nombre=CanchaPrueba42&teclada=0')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertDictEqual(data, { 'nombre': 'CanchaPrueba24', 'techada': False })

	def test_api_canchas_delete_id(self):
		response = client.post('/canchas?nombre=temporal&techada=0')
		self.assertEqual(response.status_code, 200)
		data = response.json()

		response = client.delete(f'/canchas/id/{data['id']}')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertDictEqual(data, { 'nombre': 'CanchaPrueba42', 'techada': True })

	def test_api_canchas_delete_query(self):
		response = client.delete('/canchas/q?qmax=1&nombre=cancha4&techada=1')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			self.assertDictEqual(data[0], { 'nombre': 'cancha4', 'techada': True })


class TestAPIReservas(TestCase):
	"""Tests de los endpoints para Reservas"""
	@classmethod
	def verificar_reserva(cls, self, reserva):
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

	def test_api_reservas_get(self):
		response = client.get('/reservas')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			TestAPIReservas.verificar_reserva(self, data[0])

	def test_api_reservas_get_id(self):
		response = client.get('/reservas/id/174')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		TestAPIReservas.verificar_reserva(self, data)

	def test_api_reservas_get_query(self):
		response = client.get('/reservas/q?qmax=5&id_cancha=200')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)
		self.assertGreaterEqual(len(data), 0)
		self.assertLessEqual(len(data), 5)

		for cancha in data:
			TestAPIReservas.verificar_reserva(self, cancha)

	def test_api_reservas_post(self):
		responses = [
			#TODO: Agregar client.post() válidos aquí
		]

		equalities = [
			#TODO: Agregar verificadores de reservas correspondientes aquí
		]

		for i, response in enumerate(responses):
			self.assertEqual(response.status_code, 200)
			data = response.json()
			response.close()
			self.assertDictEqual(data, equalities[i])

	def test_api_reservas_put(self):
		response = client.put('/reservas/id/172?') #TODO: Agregar datos válidos
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		#TODO: Reemplazar por dict válido para Reserva
		self.assertDictEqual(data, { 'nombre': 'CanchaPrueba42', 'techada': True })


		response = client.put('/reservas/id/172?') #TODO: Agregar datos válidos
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		#TODO: Reemplazar por dict válido para Reserva
		self.assertDictEqual(data, { 'nombre': 'CanchaPrueba24', 'techada': False })

	def test_api_reservas_delete_id(self):
		response = client.post('/reservas?') #TODO: Agregar datos válidos
		self.assertEqual(response.status_code, 200)
		data = response.json()

		response = client.delete(f'/reservas/id/{data['id']}')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		#TODO: Reemplazar por dict válido para Reserva
		self.assertDictEqual(data, { 'nombre': 'CanchaPrueba42', 'techada': True })

	def test_api_reservas_delete_query(self):
		response = client.delete('/reservas/q?qmax=2&id_cancha=220')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		response.close()

		self.assertEqual(type(data), list)

		if len(data) > 0:
			#TODO: Reemplazar por dict válido para Reserva
			self.assertDictEqual(data[0], { 'nombre': 'cancha4', 'techada': True })
