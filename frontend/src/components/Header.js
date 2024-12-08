import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export default function Header({ darkModeState }) {
	const [darkMode, setDarkMode] = darkModeState;

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	return (
		<div className="mb-4 flex flex-row items-center justify-between border-b border-solid border-background-200 px-4 py-2 dark:border-background-800">
			<h1 className="text-2xl font-black">TUP Lab4 TP Final</h1>

			<nav className="flex flex-row space-x-4">
				<button>Inicio</button>
				<button>Canchas</button>
				<button>Reservar</button>

				<button
					onClick={toggleDarkMode}
					className="h-9 w-9 rounded-md bg-secondary-900 text-text-50 dark:bg-secondary-100 dark:text-text-950"
				>
					{darkMode ? (
						<FontAwesomeIcon icon={faSun} />
					) : (
						<FontAwesomeIcon icon={faMoon} />
					)}
				</button>
			</nav>
		</div>
	);
}
