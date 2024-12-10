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
	detail: Array<{
		type: string,
		loc: [ string | number ],
		msg: string,
		input: string,
	}>,
}

export type ValidationError = {
	loc: Array<string | number>,
	msg: string,
	type: string,
}

export type HTTPException = {
	detail: string,
}
