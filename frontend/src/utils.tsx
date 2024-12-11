export function isoStringToDate(str: string): Date {
	const dateParts = str
		.slice(0, 'XXXX-XX-XX'.length)
		.split('-');

	if(dateParts.length !== 3)
		throw TypeError(`String ISO inválido: ${str}`);

	const [ year, month, day ] = dateParts as [ string, string, string ];
	
	return new Date(Date.UTC(+year, +month, +day));
}

export function numberStringToTelephoneString(str: string): string {
	str = str.replace(/\D+/g, '');

	if(str.length < 10)
		return str;

	str = str.slice(0, 13);

	//Tabla de consulta "largo → formato"
	switch(str.length) {
	case 13: return str.replace(/(\d{2})(\d)(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4-$5');
	case 12: return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3-$4');
	case 11: return str.replace(/(\d)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3-$4');
	case 10: return str.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2-$3');
	default: return str;
	}
}
