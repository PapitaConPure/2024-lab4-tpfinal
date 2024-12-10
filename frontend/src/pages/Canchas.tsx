import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import { useState } from 'react';
import Button from '../components/forms/Button';
import Toggle from '../components/forms/Toggle';
import axios from 'axios';
import config from '../config.json';
import type { CanchaSchema } from '../schemas';
import FieldInput from '../components/forms/FieldInput';

export default function Canchas() {
	const [nombre, setNombre] = useState('');
	const [techada, setTechada] = useState(false);
	const [message, setMessage] = useState<{ kind: 'success' | 'error'; desc: string }>();

	const handleSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				`${config.BACKEND_API_URI}/canchas?nombre=${nombre}&techada=${techada}`,
			);

			const cancha = response.data as CanchaSchema;

			setNombre('');
			setTechada(false);

			setMessage({
				kind: 'success',
				desc: `Se registró una cancha "${cancha.nombre}" bajo la ID ${cancha.id}.`,
			});
		} catch (error) {
			console.error(error);
			setMessage({
				kind: 'error',
				desc: 'Ocurrió un error de servidor al registrar la cancha.',
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

						{message && (
							<div
								className={`rounded-md border-2 px-4 py-2 ${
									message.kind === 'success'
										? 'border-green-800 bg-green-200 dark:border-green-700 dark:bg-green-800'
										: 'border-red-800 bg-red-200 dark:border-red-700 dark:bg-red-800'
								}`}
							>
								{message.desc}
							</div>
						)}

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
