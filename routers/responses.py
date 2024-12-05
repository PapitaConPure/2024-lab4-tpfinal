from typing import TypedDict, TypeVar, Generic
from pydantic import BaseModel, ConfigDict

T = TypeVar('T')

class RequestResponse(TypedDict, Generic[T]):
	status: int
	status_message: str
	data: T

class RequestResponseSchema(BaseModel, Generic[T]):
	status: int
	status_message: str
	data: T
	model_config = ConfigDict(from_attributes=True)
