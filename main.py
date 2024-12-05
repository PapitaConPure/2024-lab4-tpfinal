from fastapi import FastAPI
from db import create_models
from routers import canchas, reservas
from routers.responses import RequestResponse, RequestResponseSchema

create_models()
app = FastAPI()

@app.get('/', response_model = RequestResponseSchema[None])
def raíz() -> RequestResponse[None]:
	return RequestResponse(
		status=200,
		status_message='OK',
		data=None,
	)

app.include_router(canchas.router)
app.include_router(reservas.router)

if __name__ == '__main__':
	import uvicorn
	uvicorn.run('main:app')
