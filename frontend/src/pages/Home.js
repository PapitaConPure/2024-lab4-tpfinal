import Main from '../components/Main';
import { PageContent } from '../components/PageContent';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
	return (
		<PageContent>
			<Header selectedPageName='Home' />

			<Main>
				Un poquito de contenido
			</Main>

			<Footer />
		</PageContent>
	);
}
