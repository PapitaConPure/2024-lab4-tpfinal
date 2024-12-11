import React from 'react';
import { PageContent } from '../components/layout/PageContent';
import Header from '../components/layout/Header';
import Main from '../components/layout/Main';
import Section from '../components/layout/Section';
import Footer from '../components/layout/Footer';
import Button from '../components/forms/Button';
import { useNavigate, useSearchParams } from 'react-router';
import { faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import endpoint from '../backend';

export default function DeleteConfirmation() {
	const navigate = useNavigate();
	const [params] = useSearchParams();

	const target = params.get('t') as 'canchas' | 'reservas' | null;
	const deleteId = params.get('id');

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

			<Section flex="row">
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
		
		if(response.status !== 200)
			return console.error(`No se pudieron recuperar las ${target} desde la API`);

		navigate('/');
	}
}
