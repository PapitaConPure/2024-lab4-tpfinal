import React, { createContext, useState, useContext } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext: React.Context<{ theme: Theme, toggleTheme: () => void }> = createContext({ theme: 'dark' as Theme, toggleTheme: () => {} });

interface PageContentProps {
	children: React.ReactNode;
}

export function PageContent({ children }: PageContentProps) {
	const [ theme, setTheme ] = useState<Theme>(
		(localStorage.getItem('theme') as Theme) ?? 'dark'
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

export function useTheme() {
	return useContext(ThemeContext);
}
