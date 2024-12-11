import { useEffect, useState } from 'react';
import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import Button from '../components/forms/Button';
import Table, { TabularData } from '../components/presentation/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import type { CanchaSchema, ReservaSchema } from '../schemas';
import axios from 'axios';
import endpoint from '../backend';
import { useNavigate } from 'react-router';

export default function Dashboard() {
	const [ canchas, setCanchas ] = useState<Array<CanchaSchema>>([]);
	const [ reservas, setReservas ] = useState<Array<ReservaSchema>>([]);
	const [ canchasLoading, setCanchasLoading ] = useState(true);
	const [ reservasLoading, setReservasLoading ] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const canchas = await axios.get(endpoint('/canchas/'));
			if(canchas == null) return console.error('No se pudieron recuperar las canchas desde la API');
			setCanchas(canchas.data);
			setCanchasLoading(false);
		})();

		(async () => {
			const reservas = await axios.get(endpoint('/reservas/'));
			if(reservas == null) return console.error('No se pudieron recuperar las reservas desde la API');
			setReservas(reservas.data);
			setReservasLoading(false);
		})();
	}, []);

	return (
		<PageContent>
			<Header selectedPageName="Home" />

			<Main>
				<h2>Dashboard</h2>
				<p className='pb-6'>Panel de Control de Canchas y Reservas</p>
				<h3>Canchas</h3>
				<Section>
					<Table
						spread
						loading={canchasLoading}
						className='max-h-[36rem] md:max-h-[24rem] lg:max-h-[32rem]'
						data={new TabularData('ID', 'Nombre', 'Techada', 'Acciones')
							.setColumnStyles({
								Nombre: { template: 'auto' },
								Acciones: { template: 'max-content' },
							})
							.addRows(
								...canchas.map(cancha => ({
									ID: <div className='text-accent-600 dark:text-accent-500 font-semibold dark:font-normal'>{cancha.id}</div>,
									Nombre: cancha.nombre,
									Techada: <FontAwesomeIcon className={cancha.techada ? 'text-emerald-700 dark:text-green-500' : 'text-red-700 dark:text-red-400'} icon={cancha.techada ? faCheck : faX} />,
									Acciones: (
										<div className='flex flex-row flex-wrap space-x-2'>
											<Button onClick={() => updateCancha(cancha.id)} icon={faPen} />
											<Button onClick={() => deleteCancha(cancha.id)} kind='danger' icon={faTrash} />
										</div>
									),
								}))
							)}
					/>
				</Section>
				<h3 className='pt-3'>Reservas</h3>
				<Section>
					<Table
						spread
						loading={reservasLoading}
						className='max-h-[36rem] md:max-h-[24rem] lg:max-h-[32rem]'
						data={new TabularData('ID', 'Día', 'Hora', 'Tiempo', 'Contacto', 'Teléfono', 'IDC', 'Acciones')
							.setColumnStyles({
								Día: { template: 'max-content' },
								Contacto: { template: 'auto' },
								Teléfono: { template: 'max-content' },
								Acciones: { template: 'max-content' },
							})
							.addRows(
								...reservas.map(reserva => ({
									ID: <div className='text-accent-600 dark:text-accent-500 font-semibold dark:font-normal'>{reserva.id}</div>,
									Día: reserva.dia.replaceAll('-', '.'),
									Hora: `${reserva.hora}:00`,
									Tiempo: reserva.duración_minutos > 120
										? `${reserva.duración_minutos / 60}h`
										: `${reserva.duración_minutos}min`,
									Contacto: reserva.nombre_contacto,
									Teléfono: reserva.teléfono
										.replace(/^(\d{2})?(\d)?(\d{3})?(\d{3})(\d{4})$/, '+$1 $2 $3 $4-$5')
										.replace('+ ', '')
										.trim(),
									IDC: reserva.id_cancha,
									Acciones: (
										<div className='flex flex-row flex-wrap space-x-2'>
											<Button onClick={() => updateReserva(reserva.id)} icon={faPen} />
											<Button onClick={() => deleteReserva(reserva.id)} kind='danger' icon={faTrash} />
										</div>
									),
								}))
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
