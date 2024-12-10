import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import { useState } from 'react';
import Button from '../components/forms/Button';
import Toggle from '../components/forms/Toggle';
import axios from 'axios';
import type { CanchaSchema } from '../schemas';
import FieldInput from '../components/forms/FieldInput';
import FormReport, { useFormReport } from '../components/forms/FormReport';
import endpoint from '../backend';

export default function Canchas() {
	const [nombre, setNombre] = useState('');
	const [techada, setTechada] = useState(false);
	const [formReport, setFormReport] = useFormReport();

	const handleSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();

		let response;
		try {
			response = await axios.post(endpoint('/canchas'), null, { params: {
				nombre,
				techada,
			}});

			const cancha = response.data as CanchaSchema;

			setNombre('');
			setTechada(false);

			setFormReport({
				kind: 'success',
				desc: `Se registró una cancha "${cancha.nombre}" bajo la ID ${cancha.id}.`,
				response,
			});
		} catch (error) {
			console.error(error);
			setFormReport({
				kind: 'error',
				desc: 'Ocurrió un error de servidor al registrar la cancha.',
				response,
			});
		}
	};

	return (
		<PageContent>
			<Header selectedPageName="Canchas" />

			<Main>
				<h2>Registra una Cancha</h2>
				<p>Puedes modificarla o darla de baja cuando desees en la <b>Dashboard</b>.</p>
				<Section>
					<form className="mx-4 space-y-4" onSubmit={handleSubmit}>
						<FieldInput
							id="nombre"
							type="text"
							label="Nombre"
							value={nombre}
							required
							onChange={e => setNombre(e.target.value)}
						/>

						<Toggle
							id="techada"
							label="Techada"
							checked={techada}
							onChange={e => setTechada(e.target.checked)}
						/>

						<FormReport report={formReport}/>

						<Button submit kind="primary">
							Registrar
						</Button>
					</form>
				</Section>
			</Main>

			<Footer />
		</PageContent>
	);
}
