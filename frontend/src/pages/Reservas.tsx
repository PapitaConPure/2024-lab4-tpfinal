import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
//import Button from '../components/Button';
import Footer from '../components/layout/Footer';
import DateInput from '../components/forms/DateInput';
import FieldInput from '../components/forms/FieldInput';
import { useState } from 'react';

export default function Reservas() {
	const [ día, setDía ] = useState(() => new Date());
	const [ hora, setHora ] = useState(0);
	const [ duraciónMinutos, setDuraciónMinutos ] = useState(0);

	const handleSubmit: React.FormEventHandler = async (e) => {

		e.preventDefault();
	
		try {
			// const response = await axios.post(
			// 	`${config.BACKEND_API_URI}/canchas?nombre=${nombre}&techada=${techada}`,
			// );
	
			// const cancha = response.data as CanchaSchema;
	
			// setNombre('');
			// setTechada(false);
	
			// setMessage({
			// 	kind: 'success',
			// 	desc: `Se registró una cancha "${cancha.nombre}" bajo la ID ${cancha.id}.`,
			// });
		} catch (error) {
			// console.error(error);
			// setMessage({
			// 	kind: 'error',
			// 	desc: 'Ocurrió un error de servidor al registrar la cancha.',
			// });
		}
	};

	return (
		<PageContent>
			<Header selectedPageName='Reservas' />

			<Main>
				<h2>Realiza una Reserva</h2>
				<p>Puedes modificarla o cancelarla cuando quieras en la <b>Dashboard</b>.</p>
				<Section>
					<form className="mx-4 space-y-4" onSubmit={handleSubmit}>
						<DateInput
							id="dia"
							label="Día"
							value={+día}
							required
							onChange={e => setDía(new Date(e.target.value))}
						/>

						<FieldInput
							id="hora"
							type="number"
							label="Hora"
							value={hora}
							min={0}
							max={23}
							required
							onChange={e => setHora(+acotarEntero(+e.target.value, 0, 23))}
						/>

						<FieldInput
							id="duración"
							type="number"
							label="Duración (mins.)"
							value={duraciónMinutos}
							min={0}
							max={60 * 8}
							required
							onChange={e => setDuraciónMinutos(acotarEntero(+e.target.value, 1, 60 * 8))}
						/>
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
