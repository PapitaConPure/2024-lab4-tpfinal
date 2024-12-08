import Main from '../components/Main';
import { PageContent } from '../components/PageContent';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Canchas() {
	return (
		<PageContent>
			<Header selectedPageName='Canchas' />

			<Main>
				Acá irían las cosas de canchas.
			</Main>

			<Footer />
		</PageContent>
	);
}
