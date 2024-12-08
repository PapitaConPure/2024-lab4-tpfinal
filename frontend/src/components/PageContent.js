import React, { createContext, useState, useContext } from 'react';

/**@typedef {'light' | 'dark'} Theme*/

const ThemeContext = createContext(true);

export function PageContent({ children }) {
	const [ theme, setTheme ] = useState(
		localStorage.getItem('theme') ?? 'dark'
	);

	const toggleTheme = () => {
		const next = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', next);
		setTheme(next);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<div className={`${theme} flex min-h-full font-default-sans`}>
				<div
					className={`min-h-full min-w-full bg-background-100 text-text-950 dark:bg-background-900 dark:text-text-50`}
				>
					{children}
				</div>
			</div>
		</ThemeContext.Provider>
	);
}

/**
 * 
 * @returns {{ theme: string, toggleTheme: () => void }}
 */
export function useTheme() {
	return useContext(ThemeContext);
}
