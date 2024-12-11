import { useEffect, useState } from 'react';
import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import Button from '../components/forms/Button';
import Table, { TabularData } from '../components/presentation/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFilter, faPen, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import type { CanchaSchema, ReservaSchema } from '../schemas';
import axios from 'axios';
import endpoint from '../backend';
import { useNavigate } from 'react-router';
import FieldInput from '../components/forms/FieldInput';
import DateInput from '../components/forms/DateInput';
import { numberStringToTelephoneString } from '../utils';

const DAMPEN_TIME_MS = 400;

export default function Dashboard() {
	const navigate = useNavigate();

	const [canchas, setCanchas] = useState<Array<CanchaSchema>>([]);
	const [reservas, setReservas] = useState<Array<ReservaSchema>>([]);
	const [canchasLoading, setCanchasLoading] = useState(true);
	const [reservasLoading, setReservasLoading] = useState(true);

	const [reservaDampenedQueryNombreCancha, setReservaDampenedQueryNombreCancha] =
		useState<string>('');
	const [reservaQueryNombreCancha, setReservaQueryNombreCancha] = useState<string>('');

	const [reservaDampenedQueryDía, setReservaDampenedQueryDía] = useState<string>('');
	const [reservaQueryDía, setReservaQueryDía] = useState<string>('');

	const [reservaDampenedQueryDíaMax, setReservaDampenedQueryDíaMax] = useState<string>('');
	const [reservaQueryDíaMax, setReservaQueryDíaMax] = useState<string>('');

	const [reservaQueryDíaLast, setReservaQueryDíaLast] = useState<string>('');

	useEffect(() => {
		setCanchasLoading(true);

		(async () => {
			const canchas = await axios.get(endpoint('/canchas/'));
			if (canchas == null)
				return console.error('No se pudieron recuperar las canchas desde la API');
			setCanchas(canchas.data);
			setCanchasLoading(false);
		})();
	}, []);

	useEffect(() => {
		const handler = setTimeout(() => {
			setReservaDampenedQueryNombreCancha(reservaQueryNombreCancha);
		}, DAMPEN_TIME_MS);

		return () => {
			clearTimeout(handler);
		};
	}, [reservaQueryNombreCancha]);

	useEffect(() => {
		console.info({ reservaQueryDía, reservaQueryDíaMax });

		if (reservaQueryDía > reservaQueryDíaMax) {
			setReservaQueryDía(reservaQueryDíaLast);
			setReservaQueryDíaMax(reservaQueryDíaLast);
			return;
		}

		const handler = setTimeout(() => {
			setReservaDampenedQueryDía(reservaQueryDía);
			setReservaDampenedQueryDíaMax(reservaQueryDíaMax);
		}, DAMPEN_TIME_MS);

		return () => {
			clearTimeout(handler);
		};
	}, [reservaQueryDía, reservaQueryDíaMax, reservaQueryDíaLast]);

	useEffect(() => {
		const queried = reservaDampenedQueryNombreCancha || reservaDampenedQueryDía;

		(async () => {
			let response;

			const diaValOrRange =
				(reservaDampenedQueryDía
				&& (reservaDampenedQueryDía < reservaDampenedQueryDíaMax
					? `${reservaDampenedQueryDía}:${reservaDampenedQueryDíaMax}`
					: reservaDampenedQueryDía))
				|| undefined;

			if (queried)
				response = await axios.get(endpoint('/reservas/q/'), {
					params: {
						nom_cancha: reservaDampenedQueryNombreCancha || undefined,
						dia: diaValOrRange,
					},
				});
			else response = await axios.get(endpoint('/reservas/'));

			if (response.status !== 200)
				return console.error('No se pudieron recuperar las reservas desde la API');

			setReservas(response.data);
			setReservasLoading(false);
		})();
	}, [reservaDampenedQueryNombreCancha, reservaDampenedQueryDía, reservaDampenedQueryDíaMax]);

	return (
		<PageContent>
			<Header selectedPageName="Home" />

			<Main>
				<h2>Dashboard</h2>
				<p className="pb-6">Panel de Control de Canchas y Reservas</p>
				<h3>Canchas</h3>
				<Section>
					<Table
						spread
						loading={canchasLoading}
						className="max-h-[36rem] md:max-h-[24rem] lg:max-h-[32rem]"
						data={new TabularData('ID', 'Nombre', 'Techada', 'Acciones')
							.setColumnStyles({
								Nombre: { template: 'auto' },
								Acciones: { template: 'max-content' },
							})
							.addRows(
								...canchas.map((cancha) => ({
									ID: (
										<div className="font-semibold text-accent-600 dark:font-normal dark:text-accent-500">
											{cancha.id}
										</div>
									),
									Nombre: cancha.nombre,
									Techada: (
										<FontAwesomeIcon
											className={
												cancha.techada
													? 'text-emerald-700 dark:text-green-500'
													: 'text-red-700 dark:text-red-400'
											}
											icon={cancha.techada ? faCheck : faX}
										/>
									),
									Acciones: (
										<div className="flex flex-row flex-wrap space-x-2">
											<Button
												onClick={() => updateCancha(cancha.id)}
												icon={faPen}
											/>
											<Button
												onClick={() => deleteCancha(cancha.id)}
												kind="danger"
												icon={faTrash}
											/>
										</div>
									),
								})),
							)}
					/>
				</Section>
				<h3 className="pt-3">Reservas</h3>
				<p>Puedes usar los filtros a continuación para refinar tus resultados</p>
				<Section className="pb-3">
					<form className="flex flex-row flex-wrap justify-between">
						<div className="flex w-full flex-col sm:w-max">
							<FieldInput
								id="reservaQueryNombreCancha"
								type="text"
								label={<>
									<FontAwesomeIcon icon={faFilter} className='mr-1'/>
									<span>Nombre de cancha</span>
								</>}
								value={reservaQueryNombreCancha}
								onChange={(e) => setReservaQueryNombreCancha(e.target.value)}
								className="mb-3 mr-2 w-full sm:w-max"
							/>
							<sup className="mt-1 mb-3 text-background-600">
								Utiliza un comodín "*" para buscar coincidencias parciales
							</sup>
						</div>
						<div className="flex flex-row">
							<DateInput
								id="reservaQueryNombreCancha"
								label={<>
									<FontAwesomeIcon icon={faFilter} className='mr-1'/>
									<span>Día de reserva</span>
								</>}
								value={reservaQueryDía}
								onChange={(e) => {
									setReservaQueryDía(e.target.value);
									setReservaQueryDíaLast(e.target.value);
								}}
								className="mb-3 mr-2 w-max"
							/>
							<DateInput
								id="reservaQueryNombreCancha"
								label="(máx.)"
								value={reservaQueryDíaMax}
								onChange={(e) => {
									setReservaQueryDíaMax(e.target.value);
									setReservaQueryDíaLast(e.target.value);
								}}
								className="mb-3 w-max"
							/>
						</div>
					</form>
				</Section>
				<Section>
					<Table
						spread
						loading={reservasLoading}
						className="max-h-[36rem] md:max-h-[24rem] lg:max-h-[32rem]"
						data={new TabularData(
							'ID',
							'IDC',
							'Día',
							'Hora',
							'Tiempo',
							'Contacto',
							'Teléfono',
							'Acciones',
						)
							.setColumnStyles({
								Día: { template: 'max-content' },
								Contacto: { template: 'auto' },
								Teléfono: { template: 'max-content' },
								Acciones: { template: 'max-content' },
							})
							.addRows(
								...reservas.map((reserva) => ({
									ID: (
										<div className="font-semibold text-accent-600 dark:font-normal dark:text-accent-500">
											{reserva.id}
										</div>
									),
									Día: reserva.dia.replaceAll('-', '.'),
									Hora: `${reserva.hora}:00`,
									Tiempo:
										reserva.duración_minutos > 120
											? `${reserva.duración_minutos / 60}h`
											: `${reserva.duración_minutos}min`,
									Contacto: reserva.nombre_contacto,
									Teléfono: numberStringToTelephoneString(reserva.teléfono),
									IDC: reserva.id_cancha,
									Acciones: (
										<div className="flex flex-row flex-wrap space-x-2">
											<Button
												onClick={() => updateReserva(reserva.id)}
												icon={faPen}
											/>
											<Button
												onClick={() => deleteReserva(reserva.id)}
												kind="danger"
												icon={faTrash}
											/>
										</div>
									),
								})),
							)}
					/>
				</Section>
			</Main>

			<Footer />
		</PageContent>
	);

	function updateCancha(id: number) {
		navigate(`/canchas?id=${id}`);
	}

	function deleteCancha(id: number) {
		navigate(`/delete-conf?t=canchas&id=${id}`);
	}

	function updateReserva(id: number) {
		navigate(`/reservas?id=${id}`);
	}

	function deleteReserva(id: number) {
		navigate(`/delete-conf?t=reservas&id=${id}`);
	}
}
