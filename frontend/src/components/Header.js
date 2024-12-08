import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './PageContent';
import { NavLink } from 'react-router';

/**
 * @typedef {'Home' | 'Canchas' | 'Reservas'} SelectedPageName
 */

/**
 * @typedef {Object} HeaderOptions
 * @prop {SelectedPageName} selectedPageName
 * @param {HeaderOptions} props
 */
export default function Header(props) {
	const { selectedPageName } = props;
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="mb-4 flex flex-row items-center justify-between border-b border-solid border-background-200 px-4 py-2 dark:border-background-800">
			<h1 className="text-2xl font-black">Paddler</h1>

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
					className="h-9 w-9 rounded-md bg-secondary-900 text-text-50 dark:bg-secondary-100 dark:text-text-950"
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
