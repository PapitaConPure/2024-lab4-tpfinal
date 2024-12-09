import Main from '../components/Main';
import { PageContent } from '../components/PageContent';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { faCheck, faExclamation, faQuestion, faStar } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
	return (
		<PageContent>
			<Header selectedPageName='Home' />

			<Main>
				<h2>Un título</h2>
				<p>
					Un poquito de contenido
				</p>
				<div className='flex flex-row space-x-2'>
					<Button kind='primary'>Pruebita</Button>
					<Button >Pruebita</Button>
					<Button kind='success'>Pruebita</Button>
					<Button kind='danger'>Pruebita</Button>
				</div>
				<div className='flex flex-row space-x-2'>
					<Button icon={faStar} kind='primary'>Pruebita</Button>
					<Button icon={faQuestion} >Pruebita</Button>
					<Button icon={faCheck} kind='success'>Pruebita</Button>
					<Button icon={faExclamation} kind='danger'>Pruebita</Button>
				</div>
			</Main>

			<Footer />
		</PageContent>
	);
}
