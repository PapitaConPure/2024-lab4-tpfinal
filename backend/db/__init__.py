from os import getenv
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
pg_uri = getenv('POSTGRES_URI')

if pg_uri is None:
	raise LookupError('No se encontró POSTGRES_URI en el environment')

engine = create_engine(pg_uri)
MakeSession = sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

def create_models():
	"""Crea todos los modelos definidos para la base de datos"""
	Base.metadata.create_all(engine)
