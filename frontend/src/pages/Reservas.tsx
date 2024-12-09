import Main from '../components/Main';
import { PageContent } from '../components/PageContent';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Reservas() {
	return (
		<PageContent>
			<Header selectedPageName='Reservas' />

			<Main>
				Acá irían las cosas de reservas.
			</Main>

			<Footer />
		</PageContent>
	);
}
