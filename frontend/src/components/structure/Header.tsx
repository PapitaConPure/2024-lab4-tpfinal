import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './PageContent';
import { NavLink, useNavigate } from 'react-router';

type SelectedPageName =
	| 'Home'
	| 'Canchas'
	| 'Reservas';

interface HeaderOptions {
	selectedPageName: SelectedPageName;
}

export default function Header({ selectedPageName }: HeaderOptions) {
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();

	return (
		<div className="mb-4">
			<div className="flex flex-row items-center justify-between border-b border-solid border-background-200 px-4 lg:px-8 py-2 dark:border-background-800">
				<h1 onClick={() => navigate('/')} className='hover:cursor-pointer '>Paddler</h1>

				<button
					onClick={() => document.getElementById('v-menu')?.classList.toggle('hidden')}
					className="m-0 p-0 pt-0.5 text-primary-700 transition-all hover:text-primary-600 active:text-primary-800 dark:text-primary-500 dark:hover:text-primary-300 dark:active:text-primary-700 md:hidden"
				>
					<FontAwesomeIcon size="2x" icon={faBars} />
				</button>
				<nav className="hidden flex-row space-x-6 md:flex">
					{[
						{ label: 'Dashboard', pageName: 'Home', route: '/' },
						{ label: 'Registrar Cancha', pageName: 'Canchas', route: '/canchas' },
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
								<NavLink
									key={i}
									className="my-auto block font-light"
									to={route}
									end
								>
									{label}
								</NavLink>
							);
					})}

					<button
						onClick={toggleTheme}
						className="h-9 w-9 rounded-md bg-secondary-900 text-text-50 hover:bg-secondary-800 active:bg-secondary-700 dark:bg-secondary-100 dark:text-text-950 dark:hover:bg-secondary-50 dark:active:bg-secondary-200"
					>
						{theme === 'light' ? (
							<FontAwesomeIcon icon={faMoon} />
						) : (
							<FontAwesomeIcon icon={faSun} />
						)}
					</button>
				</nav>
			</div>
			<div id="v-menu" className="hidden md:hidden">
				<nav className="flex flex-col bg-background-50 dark:bg-background-950">
					{[
						{ label: 'Dashboard', pageName: 'Home', route: '/' },
						{ label: 'Registrar Canchas', pageName: 'Canchas', route: '/canchas' },
						{ label: 'Reservar', pageName: 'Reservas', route: '/reservas' },
					].map(({ label, pageName, route }, i) => {
						if (selectedPageName === pageName)
							return (
								<div
									key={i}
									className="bg-black !bg-opacity-5 px-10 py-2 font-semibold hover:cursor-default dark:bg-white"
								>
									{label}
								</div>
							);
						else
							return (
								<NavLink
									key={i}
									className="my-auto block px-10 py-2 font-light hover:bg-black hover:bg-opacity-10 hover:no-underline dark:hover:bg-white dark:hover:bg-opacity-10"
									to={route}
									end
								>
									{label}
								</NavLink>
							);
					})}

					<button
						onClick={toggleTheme}
						className="space-x-2 bg-secondary-900 px-4 py-2 text-left text-text-50 hover:bg-secondary-800 active:bg-secondary-700 dark:bg-secondary-100 dark:text-text-950 dark:hover:bg-secondary-50 dark:active:bg-secondary-200"
					>
						{theme === 'light' ? (
							<FontAwesomeIcon className="w-4" icon={faMoon} />
						) : (
							<FontAwesomeIcon className="w-4" icon={faSun} />
						)}
						<span>Cambiar a tema {theme === 'light' ? 'Oscuro' : 'Claro'}</span>
					</button>
				</nav>
			</div>
		</div>
	);
}
