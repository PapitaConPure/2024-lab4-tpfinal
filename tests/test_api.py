from unittest import TestCase
from fastapi.testclient import TestClient
from db import MakeSession
from db.crud import create_cancha, get_canchas
from db.schemas import CanchaCreate
from main import app

class TestAPI(TestCase):
	client = TestClient(app)

	def test_api_root_get(self):
		response = self.client.get('/')
		self.assertEqual(response.status_code, 200)
		self.assertIsNone(response.data)
