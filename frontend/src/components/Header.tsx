import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './PageContent';
import { NavLink } from 'react-router';

type SelectedPageName =
	| 'Home'
	| 'Canchas'
	| 'Reservas';

interface HeaderOptions {
	selectedPageName: SelectedPageName;
}

export default function Header({ selectedPageName }: HeaderOptions) {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="mb-4 flex flex-row items-center justify-between border-b border-solid border-background-200 px-4 py-2 dark:border-background-800">
			<h1>Paddler</h1>

			<nav className="flex flex-row space-x-4">
				{[
					{ label: 'Inicio', pageName: 'Home', route: '/' },
					{ label: 'Canchas', pageName: 'Canchas', route: '/canchas' },
					{ label: 'Reservar', pageName: 'Reservas', route: '/reservas' },
				].map(({ label, pageName, route }, i) => {
					if (selectedPageName === pageName)
						return (
							<div key={i} className="my-auto font-semibold hover:cursor-default">
								{label}
							</div>
						);
					else
						return (
							<NavLink key={i} className="my-auto block font-light" to={route} end>
								{label}
							</NavLink>
						);
				})}

				<button
					onClick={toggleTheme}
					className="h-9 w-9 rounded-md bg-secondary-900 text-text-50 hover:bg-secondary-800 active:bg-secondary-700 dark:bg-secondary-100 dark:text-text-950 dark:hover:bg-secondary-50 dark:active:bg-secondary-200"
				>
					{(theme === 'light') ? (
						<FontAwesomeIcon icon={faMoon} />
					) : (
						<FontAwesomeIcon icon={faSun} />
					)}
				</button>
			</nav>
		</div>
	);
}
