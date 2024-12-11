import React, { useEffect, useState } from 'react';
import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import Button from '../components/forms/Button';
import { useNavigate, useSearchParams } from 'react-router';
import { faTrash, faWarning, faX } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import endpoint from '../backend';
import Table, { TabularData } from '../components/presentation/Table';
import type { ReservaSchema } from '../schemas';
import { numberStringToTelephoneString } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DeleteConfirmation() {
	const navigate = useNavigate();
	const [params] = useSearchParams();

	const [reservas, setReservas] = useState<Array<ReservaSchema>>([]);
	const [reservasLoading, setReservasLoading] = useState(false);

	const target = params.get('t') as 'canchas' | 'reservas' | null;
	const deleteId = params.get('id');

	useEffect(() => {
		if (target !== 'canchas') return;

		setReservasLoading(true);

		(async () => {
			const response = await axios.get(endpoint('/reservas/q/'), {
				params: {
					id_cancha: deleteId,
				},
			});

			if (response.status !== 200) {
				setReservas([
					{
						id: -1,
						id_cancha: -1,
						dia: 'Error',
						hora: -1,
						duración_minutos: -1,
						nombre_contacto: 'Error',
						teléfono: 'Error',
					},
				]);
				setReservasLoading(false);
				return;
			}

			const reserva = response.data as Array<ReservaSchema>;

			setReservas(reserva);
			setReservasLoading(false);
		})();
	}, [target, deleteId]);

	return (
		<PageContent>
			<Header selectedPageName="*Confirmar Eliminación" />

			<Main>
				<h2>¿Estás seguro?</h2>
				<h3>Esta acción no puede deshacerse</h3>
				<p>
					Estás a punto de eliminar una{' '}
					<b>{target === 'canchas' ? 'cancha' : 'reserva'}</b> de ID {deleteId}.
				</p>

				{target === 'canchas' && (
					<Section className='pt-2'>
						{reservas.length > 0 ? (
							<div className="flex flex-row space-x-4 items-center justify-stretch">
								<FontAwesomeIcon icon={faWarning} size='4x' className='text-red-500' />
								<div>
									<p>
										<span className="font-semibold text-red-500">
											¡Wow! ¡Cuidado!
										</span>{' '}
										La cancha que intentas dar de baja tiene{' '}
										<span className="font-black text-red-500">
											{reservas.length}
										</span>{' '}
										<span className="font-semibold text-red-500">
											reserva{reservas.length > 1 && 's'} registrada{reservas.length > 1 && 's'}
										</span>
										.
									</p>
									<p>
										Si eliminas esta cancha,{' '}
										<b className="text-red-500">
											sus reservas también se eliminarán permanentemente
										</b>
										.
									</p>
								</div>
							</div>
						) : (
							<>
								La cancha que intentas dar de baja no tiene ninguna reserva registrada.{' '}
								<span className="font-semibold text-emerald-700 dark:text-green-500">¡Qué bien!</span>
							</>
						)}
					</Section>
				)}

				{target === 'canchas' && reservas.length > 0 && (
					<Section>
						<Table
							spread
							loading={reservasLoading}
							className="max-h-[36rem] md:max-h-[24rem] lg:max-h-[32rem]"
							data={new TabularData(
								'ID',
								'Día',
								'Hora',
								'Tiempo',
								'Contacto',
								'Teléfono',
							)
								.setColumnStyles({
									Día: { template: 'max-content' },
									Contacto: { template: 'auto' },
									Teléfono: { template: 'max-content' },
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
									})),
								)}
						/>
					</Section>
				)}

				<Section className={target === 'canchas' ? 'pt-4' : ''} flex="row">
					<Button kind="danger" icon={faTrash} onClick={confirmDelete}>
						Eliminar {target === 'canchas' ? 'Cancha' : 'Reserva'}
					</Button>
					<Button kind="secondary" icon={faX} onClick={() => navigate('/')}>
						Cancelar
					</Button>
				</Section>
			</Main>

			<Footer />
		</PageContent>
	);

	async function confirmDelete() {
		const response = await axios.delete(endpoint(`/${target}/id/${deleteId}/`));

		if (response.status !== 200)
			return console.error(`No se pudieron recuperar las ${target} desde la API`);

		navigate('/');
	}
}
