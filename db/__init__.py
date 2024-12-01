from dotenv import load_dotenv
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
pg_uri = getenv('POSTGRES_URI')
engine = create_engine(pg_uri)
Session = sessionmaker(bind=engine)
Base = declarative_base()

def session_factory():
    Base.metadata.create_all(engine)
    return Session()
