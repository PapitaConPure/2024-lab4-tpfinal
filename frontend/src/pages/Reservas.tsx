import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Button from '../components/forms/Button';
import FieldInput from '../components/forms/FieldInput';
import DateInput from '../components/forms/DateInput';
import Footer from '../components/layout/Footer';
import { useEffect, useState } from 'react';
import endpoint from '../backend';
import type { CanchaSchema, ReservaSchema } from '../schemas';
import FormReport, { useFormReport } from '../components/forms/FormReport';
import axios from 'axios';
import Table, { TabularData } from '../components/presentation/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHandPointer, faX } from '@fortawesome/free-solid-svg-icons';

export default function Reservas() {
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

	useEffect(() => {
		(async () => {
			const canchas = await axios.get(endpoint('/canchas'));
			if (canchas == null)
				return console.error('No se pudieron recuperar las canchas desde la API');
			setIdCancha(canchas.data[0]?.id)
			setCanchas(canchas.data);
			setCanchasLoading(false);
		})();
	}, []);

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

			response = await axios.post(endpoint(`/reservas/cancha/${idCancha}`), null, {
				params: {
					dia: día,
					hora,
					dur_mins: duraciónMinutos,
					tel: teléfono,
					nom_contacto: nombreContacto,
				},
				validateStatus: (status) => status >= 200 && status < 500,
			});

			if (response.status >= 400) {
				return setFormReport({
					kind: 'error',
					desc: 'Hubo un problema al intentar registrar la reserva.',
					response,
				});
			}

			const reserva = response.data as ReservaSchema;

			setHora(0);
			setDuraciónMinutos(30);
			setTeléfono('');
			setNombreContacto('');

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
			<Header selectedPageName="Reservas" />

			<Main>
				<h2>Realiza una Reserva</h2>
				<p>
					Puedes modificarla o cancelarla cuando quieras en la <b>Dashboard</b>.
				</p>
				<Section>
					<form className="mx-4 space-y-4" onSubmit={handleSubmit}>
						<div>
							<Table
								spread
								loading={canchasLoading}
								className="max-h-[11.5rem] md:max-h-[16.5rem] lg:max-h-[18rem]"
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
														kind={
															idCancha === cancha.id
																? 'primary'
																: 'secondary'
														}
														onClick={() => setIdCancha(cancha.id)}
														icon={
															idCancha === cancha.id
																? faCheck
																: faHandPointer}
													>
														{
															idCancha === cancha.id
																? 'Seleccionada'
																: 'Seleccionar'
														}
													</Button>
												</div>
											),
										})),
									)}
							/>
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
							onChange={(e) => setTeléfono(e.target.value)}
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
			</Main>

			<Footer />
		</PageContent>
	);

	function acotarEntero(ent: number, min: number, max: number): number {
		return Math.max(min, Math.min(Math.round(ent), max));
	}
}
