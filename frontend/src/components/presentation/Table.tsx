import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Row<Columns extends readonly string[]> = Record<Columns[number], any>;

type ColumnStyle = {
	template:
		| 'none'
		| 'min-content'
		| 'max-content'
		| 'auto'
		| `${string}%`
		| `${string}px`
		| `${string}rem`;
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
	.addRow({
		'Cargando...': (
			<div className="animate-pulse">
				<FontAwesomeIcon className="animate-spin" icon={faHourglass} />
			</div>
		),
	}) as TabularData<[string]>;

export default function Table({
	data,
	loading = false,
	spread = false,
	className = '',
}: TableProps) {
	const { columns, rows } = loading ? defaultTable.body : data.body;

	const tableBackgroundOddStyles = 'bg-secondary-400 dark:bg-secondary-300';
	const tableBackgroundEvenStyles = 'bg-secondary-700 dark:bg-secondary-400';

	//No sé quién me manda a hacer un componente de tabla por mi cuenta

	return (
		<div
			className={`border-1 overflow-clip rounded-md border-background-100 p-0 shadow-md dark:border-background-900 ${spread ? 'w-full' : ''}`}
		>
			<div
				style={{
					gridTemplateColumns: columns.map((column) => column.template).join(' '),
				}}
				className={`${className} inline-grid w-full overflow-auto focus:outline-none`}
			>
				{columns.map((column, i) => (
					<div
						key={i}
						className="bg-primary-500 px-1 py-1.5 text-center text-base font-bold text-text-950 sm:px-2 sm:text-lg md:px-3 lg:px-4"
					>
						{column.name}
					</div>
				))}
				{!rows.length &&
					columns.map((_, i) => (
						<div
							key={-i - 1}
							className={`text-foreground flex flex-wrap items-center justify-center bg-opacity-5 px-1 py-3 text-center text-sm font-semibold text-secondary-600 dark:bg-opacity-20 dark:font-medium dark:text-secondary-300 sm:px-1.5 sm:text-base md:px-4 ${tableBackgroundOddStyles}`}
						>
							-
						</div>
					))}
				{rows.length > 0 &&
					rows.map((row, i) => {
						return columns.map((column, j) => (
							<div
								key={i * rows.length + j}
								className={`text-foreground flex flex-wrap items-center justify-center bg-opacity-5 px-1 py-3 text-center text-sm font-light dark:bg-opacity-20 dark:font-extralight sm:px-1.5 sm:text-base md:px-4 ${i % 2 === 0 ? tableBackgroundEvenStyles : tableBackgroundOddStyles}`}
							>
								{row[column.name]}
							</div>
						));
					})}
			</div>
		</div>
	);
}
