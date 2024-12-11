import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import { useEffect, useState } from 'react';
import Button from '../components/forms/Button';
import Toggle from '../components/forms/Toggle';
import axios from 'axios';
import type { CanchaSchema } from '../schemas';
import FieldInput from '../components/forms/FieldInput';
import FormReport, { useFormReport } from '../components/forms/FormReport';
import endpoint from '../backend';
import { useSearchParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';

export default function Canchas() {
	const [searchParams] = useSearchParams();
	const [nombre, setNombre] = useState('');
	const [techada, setTechada] = useState(false);
	const [formReport, setFormReport] = useFormReport();
	const [cancha, setCancha] = useState<CanchaSchema>();
	const [canchaLoading, setCanchaLoading] = useState(false);

	const editId = searchParams.get('id');
	const modifies = editId != null;

	useEffect(() => {
		if (!modifies) {
			setNombre('');
			setTechada(false);
			return;
		}

		setCanchaLoading(true);

		(async () => {
			const response = await axios.get(endpoint(`/canchas/id/${editId}`));
			if (response.status !== 200)
				return console.error('No se pudieron recuperar las canchas desde la API');
			const cancha: CanchaSchema = response.data;
			setCancha(cancha);
			setNombre(cancha.nombre);
			setTechada(cancha.techada);
			setCanchaLoading(false);
		})();
	}, [editId, modifies]);

	const handleSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();

		let response;
		try {
			if (modifies)
				response = await axios.patch(endpoint(`/canchas/id/${editId}`), null, {
					params: {
						nombre,
						techada,
					},
				});
			else
				response = await axios.post(endpoint('/canchas/'), null, {
					params: {
						nombre,
						techada,
					},
				});

			const cancha = response.data as CanchaSchema;

			if (!modifies) {
				setNombre('');
				setTechada(false);
			}

			setFormReport({
				kind: 'success',
				desc: `Se ${modifies ? 'modificó' : 'registró'} la cancha "${cancha.nombre}" de ID ${cancha.id}.`,
				response,
			});
		} catch (error) {
			console.error(error);
			setFormReport({
				kind: 'error',
				desc: `Ocurrió un error de servidor al intentar ${modifies ? 'modificar' : 'registrar'} la cancha.`,
				response,
			});
		}
	};

	return (
		<PageContent>
			<Header selectedPageName={modifies ? '*Modificar Cancha' : 'Canchas'} />

			<Main>
				{!modifies && <h2>Registra una Cancha</h2>}
				{!modifies && (
					<p>
						Puedes modificarla o darla de baja cuando desees en la <b>Dashboard</b>.
					</p>
				)}

				{modifies && <h2>Modifica una Cancha</h2>}
				{modifies && (
					<p>
						Estás a punto de modificar la cancha{' '}
						{canchaLoading ? (
							<span className="animate-pulse">
								<FontAwesomeIcon className="animate-spin" icon={faHourglass} />
							</span>
						) : (
							<b>{`"${cancha?.nombre}"`}</b>
						)}
						, cuya ID es {editId}.
					</p>
				)}

				{!modifies || !canchaLoading ? (
					<Section>
						<form className="mx-4 my-4 space-y-4" onSubmit={handleSubmit}>
							<FieldInput
								id="nombre"
								type="text"
								label="Nombre"
								value={nombre}
								required
								onChange={(e) => setNombre(e.target.value)}
							/>

							<Toggle
								id="techada"
								label="Techada"
								checked={techada}
								onChange={(e) => setTechada(e.target.checked)}
							/>

							<FormReport report={formReport} />

							<Button submit kind="primary">
								{modifies ? 'Modificar' : 'Registrar'}
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
}
