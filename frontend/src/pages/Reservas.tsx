import { PageContent } from '../components/structure/PageContent';
import Header from '../components/structure/Header';
import Main from '../components/structure/Main';
import Section from '../components/structure/Section';
//import Button from '../components/Button';
//import Table, { TabularData } from '../components/Table';
import Footer from '../components/structure/Footer';

export default function Reservas() {
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
						<div className='flex flex-col'>
							<label>What</label>
							<input type="date"/>
						</div>
					</form>
				</Section>
			</Main>

			<Footer />
		</PageContent>
	);
}
