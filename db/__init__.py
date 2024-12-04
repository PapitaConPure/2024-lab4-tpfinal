from dotenv import load_dotenv
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
pg_uri = getenv('POSTGRES_URI')
engine = create_engine(pg_uri)
MakeSession = sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

def create_models():
    """Crea todos los modelos definidos para la base de datos"""
    Base.metadata.create_all(engine)
