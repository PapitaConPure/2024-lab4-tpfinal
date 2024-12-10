export function isoStringToDate(str: string): Date {
	const dateParts = str
		.slice(0, 'XXXX-XX-XX'.length)
		.split('-');

	if(dateParts.length !== 3)
		throw TypeError(`String ISO inválido: ${str}`);

	const [ year, month, day ] = dateParts as [ string, string, string ];
	
	return new Date(Date.UTC(+year, +month, +day));
}
