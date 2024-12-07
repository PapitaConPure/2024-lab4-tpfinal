from unittest import TestCase
from db.crud import verificar_y_normalizar_teléfono

class TestMisc(TestCase):
	def test_verificar_y_normalizar_teléfono(self):
		self.assertEqual(verificar_y_normalizar_teléfono('+54 9 343 450-2306'), '+5493434502306')
		self.assertEqual(verificar_y_normalizar_teléfono('+54 343 450 2306'), '+543434502306')
		self.assertEqual(verificar_y_normalizar_teléfono('343 450 2306'), '3434502306')
		self.assertEqual(verificar_y_normalizar_teléfono('9 343 450 2306'), '93434502306')

	def test_verificar_y_normalizar_teléfono_fails(self):
		self.assertRaises(TypeError, lambda: verificar_y_normalizar_teléfono(3434502306))
		self.assertRaises(ValueError, lambda: verificar_y_normalizar_teléfono(''))
		self.assertRaises(ValueError, lambda: verificar_y_normalizar_teléfono('54 9 343 450-2306'))
		self.assertRaises(ValueError, lambda: verificar_y_normalizar_teléfono('450-2306'))
		self.assertRaises(ValueError, lambda: verificar_y_normalizar_teléfono('Max Verstappen con Peluca'))
