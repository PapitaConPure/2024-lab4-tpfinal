export type CanchaSchema = {
	id: number,
	nombre: string,
	techada: boolean,
}

export type ReservaSchema = {
	id: number
	id_cancha: number,
	dia: string,
	hora: number,
	duración_minutos: number,
	teléfono: string,
	nombre_contacto: string,
}

export type ReservaCompletaSchema = {
	id: number
	id_cancha: number,
	dia: string,
	hora: number,
	duración_minutos: number,
	teléfono: string,
	nombre_contacto: string,
}

export type HTTPValidationError = {
	detail: string,
}

export type ValidationError = {
	loc: [ string, number ],
	msg: string,
	type: string,
}
