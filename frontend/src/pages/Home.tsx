import { useEffect, useState } from 'react';
import { PageContent } from '../components/structure/PageContent';
import Header from '../components/structure/Header';
import Main from '../components/structure/Main';
import Section from '../components/structure/Section';
import Footer from '../components/structure/Footer';
import Button from '../components/forms/Button';
import Table, { TabularData } from '../components/presentation/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTrash, faX, faExclamation, faQuestion, faStar } from '@fortawesome/free-solid-svg-icons';
import type { CanchaSchema, ReservaSchema } from '../schemas';
import axios from 'axios';
import config from '../config.json';

export default function Home() {
	const [ canchas, setCanchas ] = useState<Array<CanchaSchema>>([]);
	const [ reservas, setReservas ] = useState<Array<ReservaSchema>>([]);
	const [ canchasLoading, setCanchasLoading ] = useState(true);
	const [ reservasLoading, setReservasLoading ] = useState(true);

	useEffect(() => {
		(async () => {
			const canchas = await axios.get(`${config.BACKEND_API_URI}/canchas/`);
			if(canchas == null) return console.error('No se pudieron recuperar las canchas desde la API');
			setCanchas(canchas.data);
			setCanchasLoading(false);
		})();

		(async () => {
			const reservas = await axios.get(`${config.BACKEND_API_URI}/reservas/`);
			if(reservas == null) return console.error('No se pudieron recuperar las reservas desde la API');
			setReservas(reservas.data);
			setReservasLoading(false);
		})();
	}, []);

	return (
		<PageContent>
			<Header selectedPageName="Home" />

			<Main>
				<h2>Un título</h2>
				<p>Un poquito de contenido</p>
				<Section flex='row' className='flex-wrap'>
					<Button onClick={() => alert('¡Hola!')} kind="primary">
						Prueba
					</Button>
					<Button onClick={() => alert('Adiós...')}>Prueba</Button>
					<Button onClick={() => alert('Bien ahí')} kind="success">
						Prueba
					</Button>
					<Button onClick={() => alert('Malísimo')} kind="danger">
						Prueba
					</Button>
				</Section>
				<Section flex='row' className='flex-wrap'>
					<Button onClick={() => alert('¡Hola!')} icon={faStar} kind="primary">
						Prueba
					</Button>
					<Button onClick={() => alert('Adiós...')} icon={faQuestion}>
						Prueba
					</Button>
					<Button onClick={() => alert('Bien ahí')} icon={faCheck} kind="success">
						Prueba
					</Button>
					<Button onClick={() => alert('Malísimo')} icon={faExclamation} kind="danger">
						Prueba
					</Button>
				</Section>
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
				<h2>Reservas</h2>
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
											<Button onClick={() => updateCancha(reserva.id)} icon={faPen} />
											<Button onClick={() => deleteCancha(reserva.id)} kind='danger' icon={faTrash} />
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
		
	}

	function deleteCancha(id: number) {
		(async () => {
			const canchas = await axios.get(`${config.BACKEND_API_URI}/canchas/`);
			if(canchas == null) return console.error('No se pudieron recuperar las canchas desde la API');
			setCanchas(canchas.data);
			setCanchasLoading(false);
		})();
	}
}
