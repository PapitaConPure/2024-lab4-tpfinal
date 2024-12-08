import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';

export default function Home() {
	const darkModeState = useState(true);
	const [darkMode] = darkModeState;

	return (
		<div className={`${darkMode && 'dark'} flex min-h-full`}>
			<div
				className={`min-w-full min-h-full bg-background-100 text-text-950 dark:bg-background-900 dark:text-text-50`}
			>
				<Header darkModeState={darkModeState} />

				<Content>
					Un poquito de contenido
				</Content>
				
				<Footer />
			</div>
		</div>
	);
}
