import { PageContent } from '../components/structure/PageContent';
import Header from '../components/structure/Header';
import Main from '../components/structure/Main';
import Section from '../components/structure/Section';
import Footer from '../components/structure/Footer';
import { useState } from 'react';
import Button from '../components/forms/Button';
import Toggle from '../components/forms/Toggle';
import axios from 'axios';
import config from '../config.json';
import type { CanchaSchema } from '../schemas';

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
						<div className="flex flex-col">
							<label
								htmlFor="nombre"
								className="mb-0.5 block font-bold transition-all dark:font-medium"
							>
								Nombre
							</label>
							<input
								type="text"
								id="nombre"
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								required
								className="rounded-md bg-white px-3 py-1 font-medium transition-all dark:bg-background-800 dark:font-light"
							/>
						</div>

						<Toggle
							label="Techada"
							id="techada"
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
