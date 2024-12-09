type Row<Columns extends readonly string[]> = Record<Columns[number], any>;

type ColumnStyle = {
	template: 'none' | 'min-content' | 'max-content' | 'auto' | `${string}%` | `${string}px` | `${string}rem`;
	rowStyles?: string;
};

type ColumnStyles<Columns extends readonly string[]> = Record<Columns[number], ColumnStyle>;

/**Representa datos de una tabla*/
export class TabularData<Columns extends readonly string[] = readonly string[]> {
	readonly #columns: Columns;
	#columnStyles: ColumnStyles<Columns>;
	#rows: Array<Row<Columns>>;

	/**
	 * Crea una nueva instancia de datos tabulares con las columnas indicadas, sin filas
	 * @param columns Los nombres de las columnas que tendrá la tabla
	 */
	constructor(...columns: Columns) {
		{
			const testSet = new Set();
			for (const column of columns) {
				if (testSet.has(column))
					throw new TypeError('No se pueden tener columnas duplicadas');
				else testSet.add(column);
			}
		}

		this.#columns = columns as Columns;
		this.#columnStyles = {} as ColumnStyles<Columns>;
		for (const column of columns) {
			this.#columnStyles[column as keyof ColumnStyles<Columns>] = {
				template: 'min-content',
			};
		}
		this.#rows = [];
	}

	setColumnStyles(columnStyles: Partial<ColumnStyles<Columns>>): this {
		for (const [column, columnStyle] of Object.entries(columnStyles)) {
			const key = column as keyof ColumnStyles<Columns>;
			this.#columnStyles[key] = {
				...this.#columnStyles[key],
				...(columnStyle as ColumnStyle),
			};
		}
		return this;
	}

	/**Agrega una fila a la tabla*/
	addRow(row: Row<Columns>): this {
		this.#rows.push(row);
		return this;
	}

	/**Agrega varias filas a la tabla*/
	addRows(...rows: Array<Row<Columns>>): this {
		this.#rows.push(...rows);
		return this;
	}

	get columns() {
		return this.#columns.map((column) => ({
			name: column,
			template: this.#columnStyles[column as keyof ColumnStyles<Columns>].template,
			rowStyles: this.#columnStyles[column as keyof ColumnStyles<Columns>].rowStyles,
		}));
	}

	get rows() {
		return [...this.#rows] as const;
	}

	get body() {
		return {
			columns: this.columns,
			rows: this.rows,
		} as const;
	}
}

interface TableProps {
	data: TabularData;
	loading?: boolean;
	spread?: boolean;
	className?: string;
}

const defaultTable = new TabularData('Cargando...')
	.setColumnStyles({ 'Cargando...': { template: 'auto' } })
	.addRow({ 'Cargando...': '...' }) as TabularData<[string]>;

export default function Table({ data, loading = false, spread = false, className = '' }: TableProps) {
	const { columns, rows } = loading ? defaultTable.body : data.body;

	const tableBackgroundOddStyles = 'bg-secondary-400 dark:bg-secondary-200';
	const tableBackgroundEvenStyles = 'bg-secondary-600 dark:bg-secondary-300';

	return (
		<div
			className={`border-1 overflow-clip rounded-md border-background-100 p-0 dark:border-background-900 ${spread ? 'w-full' : ''}`}
		>
			<div
				style={{
					gridTemplateColumns: columns.map((column) => column.template).join(' '),
				}}
				className={`${className} grid w-full overflow-y-auto overflow-x-hidden focus:outline-none`}
			>
				{columns.map((column, i) => (
					<div
						key={i}
						className="bg-primary-600 px-1 py-1.5 text-center text-base sm:text-lg font-bold text-text-950 dark:bg-primary-500 sm:px-4 md:px-10"
					>
						{column.name}
					</div>
				))}
				{rows.map((row, i) => {
					return columns.map((column, j) => (
						<div
							key={i * rows.length + j}
							className={`text-foreground flex flex-wrap items-center justify-center bg-opacity-15 px-1 py-3 text-center font-light dark:bg-opacity-20 dark:font-extralight text-sm sm:text-base sm:px-1.5 md:px-4 ${i % 2 === 0 ? tableBackgroundOddStyles : tableBackgroundEvenStyles}`}
						>
							{row[column.name]}
						</div>
					));
				})}
			</div>
		</div>
	);
}
