import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Button from '../components/forms/Button';
import DateInput from '../components/forms/DateInput';
import Footer from '../components/layout/Footer';
import { useEffect, useState } from 'react';
import endpoint from '../backend';
import type { CanchaSchema, ReservaCompletaSchema, ReservaSchema } from '../schemas';
import FormReport, { useFormReport } from '../components/forms/FormReport';
import axios from 'axios';
import Table, { TabularData } from '../components/presentation/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHourglass, faX } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router';
import { numberStringToTelephoneString } from '../utils';
import FieldInput from '../components/forms/FieldInput';

export default function Reservas() {
	const [searchParams] = useSearchParams();
	const [canchas, setCanchas] = useState<Array<CanchaSchema>>([]);
	const [canchasLoading, setCanchasLoading] = useState(true);
	const [idCancha, setIdCancha] = useState(-1);
	const [día, setDía] = useState(() =>
		new Date(Date.now()).toISOString().slice(0, 'XXXX-XX-XX'.length),
	);
	const [hora, setHora] = useState(0);
	const [duraciónMinutos, setDuraciónMinutos] = useState(30);
	const [teléfono, setTeléfono] = useState('');
	const [nombreContacto, setNombreContacto] = useState('');
	const [formReport, setFormReport] = useFormReport();
	const [nombreCancha, setNombreCancha] = useState('');
	const [nombreCanchaLoading, setNombreCanchaLoading] = useState(false);

	const editId = searchParams.get('id');
	const modifies = editId != null;

	useEffect(() => {
		(async () => {
			const canchas = await axios.get(endpoint('/canchas/'));
			if (canchas.status !== 200)
				return console.error('No se pudieron recuperar las canchas desde la API');
			setIdCancha(canchas.data[0]?.id);
			setCanchas(canchas.data);
			setCanchasLoading(false);
		})();
	}, []);

	useEffect(() => {
		if (!modifies) {
			setIdCancha(-1);
			setDía(new Date(Date.now()).toISOString().slice(0, 'XXXX-XX-XX'.length));
			setHora(0);
			setDuraciónMinutos(30);
			setTeléfono('');
			setNombreContacto('');
			setNombreCanchaLoading(false);
			return;
		}

		setNombreCanchaLoading(true);

		(async () => {
			const response = await axios.get(endpoint(`/reservas/id/${editId}/`), {
				params: { full: true },
			});

			if (response.status !== 200)
				return console.error('No se pudieron recuperar las reservas desde la API');

			const { reserva, cancha }: ReservaCompletaSchema = response.data;

			setNombreCancha(cancha.nombre);
			setIdCancha(reserva.id_cancha);
			setDía(reserva.dia);
			setHora(reserva.hora);
			setDuraciónMinutos(reserva.duración_minutos);
			setTeléfono(numberStringToTelephoneString(reserva.teléfono));
			setNombreContacto(reserva.nombre_contacto);
			setNombreCanchaLoading(false);
		})();
	}, [editId, modifies]);

	const handleSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();

		let response;
		try {
			if (!teléfono.includes('-'))
				return setFormReport({
					kind: 'error',
					desc: 'El número de teléfono es inválido',
					response: {
						status: 400,
						statusText: 'Bad Request' as string,
						data: {
							detail:
								`El largo u formato del teléfono fue inválido: ${teléfono}.` +
								' Las formas aceptadas son "(+XX)? (X)? XXX XXX-XXXX" o similares',
						},
					},
				});

			if(modifies)
				response = await axios.patch(endpoint(`/reservas/id/${editId}/`), null, {
					params: {
						dia: día,
						hora,
						dur_mins: duraciónMinutos,
						tel: teléfono,
						nom_contacto: nombreContacto,
					},
					validateStatus: (status) => status >= 200 && status < 500,
				});
			else
				response = await axios.post(endpoint(`/reservas/cancha/${idCancha}/`), null, {
					params: {
						dia: día,
						hora,
						dur_mins: duraciónMinutos,
						tel: teléfono,
						nom_contacto: nombreContacto,
					},
					validateStatus: (status) => status >= 200 && status < 500,
				});

			if(response.status >= 400) {
				return setFormReport({
					kind: 'error',
					desc: 'Hubo un problema al intentar registrar la reserva.',
					response,
				});
			}

			const reserva = response.data as ReservaSchema;

			if (!modifies) {
				setHora(0);
				setDuraciónMinutos(30);
				setTeléfono('');
				setNombreContacto('');
			}

			setFormReport({
				kind: 'success',
				desc: `Se registró una reserva bajo la ID ${reserva.id}.`,
				response,
			});
		} catch (error) {
			console.error(error);
			console.info(response);
			setFormReport({
				kind: 'error',
				desc: 'Ocurrió un error de servidor al registrar la reserva.',
				response,
			});
		}
	};

	return (
		<PageContent>
			<Header selectedPageName={modifies ? '*Modificar Reserva' : 'Reservas'} />

			<Main>
				{!modifies && <h2>Realiza una Reserva</h2>}
				{!modifies && (
					<p>
						Puedes modificarla o cancelarla cuando quieras en la <b>Dashboard</b>.
					</p>
				)}

				{modifies && <h2>Modifica una Reserva</h2>}
				{modifies && (
					<p>
						Estás por modificar la reserva de ID {editId} a la cancha
						{nombreCanchaLoading ? (
							<span className="animate-pulse">
								<FontAwesomeIcon className="animate-spin" icon={faHourglass} />
							</span>
						) : (
							<b>{`"${nombreCancha}"`}</b>
						)}
						de ID {idCancha}.
					</p>
				)}

				{!modifies || !nombreCanchaLoading ? (
					<Section>
						<form className="mx-4 my-4 space-y-4" onSubmit={handleSubmit}>
							<div>
								{!modifies && (
									<label
										htmlFor={'idCancha'}
										className="mb-0.5 block font-bold transition-all dark:font-medium"
									>
										Seleccionar Cancha
									</label>
								)}
								{!modifies && (
									<Table
										spread
										loading={canchasLoading}
										className="max-h-[11.5rem] md:max-h-[16.5rem] lg:max-h-[18rem]"
										data={new TabularData(
											'ID',
											'Nombre',
											'Techada',
											'Selección',
										)
											.setColumnStyles({
												Nombre: { template: 'auto' },
												Selección: { template: 'max-content' },
											})
											.addRows(
												...canchas.map((cancha) => ({
													ID: (
														<div className="font-semibold text-accent-600 dark:font-normal dark:text-accent-500">
															{cancha.id}
														</div>
													),
													Nombre:
														idCancha === cancha.id ? (
															<b className="darl:font-bold font-extrabold text-primary-700 dark:text-primary-500">
																{cancha.nombre}
															</b>
														) : (
															cancha.nombre
														),
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
													Selección: (
														<div className="flex flex-row flex-wrap space-x-2">
															<Button
																kind={
																	idCancha === cancha.id
																		? 'primary'
																		: 'secondary'
																}
																onClick={() =>
																	setIdCancha(cancha.id)
																}
																className={`box-content h-6 w-6 !rounded-full [&_*]:m-auto ${idCancha === cancha.id ? '!p-0.5' : 'bg-opacity-25 dark:bg-opacity-60 hover:bg-secondary-200 active:bg-secondary-700 !p-0'}`}
																icon={
																	idCancha === cancha.id
																		? faCheck
																		: undefined
																}
															/>
														</div>
													),
												})),
											)}
									/>
								)}
							</div>

							<DateInput
								id="dia"
								label="Día"
								value={día}
								required
								onChange={(e) => {
									return setDía(e.target.value);
								}}
							/>

							<FieldInput
								id="hora"
								type="number"
								label="Hora"
								value={hora}
								min={0}
								max={23}
								required
								onChange={(e) => setHora(+acotarEntero(+e.target.value, 0, 23))}
							/>

							<FieldInput
								id="duración"
								type="number"
								label="Duración (mins.)"
								value={duraciónMinutos}
								min={0}
								max={60 * 8}
								required
								onChange={(e) =>
									setDuraciónMinutos(acotarEntero(+e.target.value, 1, 60 * 8))
								}
							/>

							<FieldInput
								id="teléfono"
								type="tel"
								label="Teléfono"
								value={teléfono}
								required
								onChange={(e) => setTeléfono(numberStringToTelephoneString(e.target.value))}
							/>

							<FieldInput
								id="nombreContacto"
								type="text"
								label="Nombre de Contacto"
								value={nombreContacto}
								required
								onChange={(e) => setNombreContacto(e.target.value)}
							/>

							<FormReport report={formReport} />

							<Button submit kind="primary">
								Registrar
							</Button>
						</form>
					</Section>
				) : (
					<Section className="animate-pulse">
						<FontAwesomeIcon className="animate-spin" icon={faHourglass} />
					</Section>
				)}
			</Main>

			<Footer />
		</PageContent>
	);

	function acotarEntero(ent: number, min: number, max: number): number {
		return Math.max(min, Math.min(Math.round(ent), max));
	}
}
