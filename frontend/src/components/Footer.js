import React from 'react';

export default function Footer() {
	return (
		<div className='text-sm mt-4 flex flex-col items-center border-t border-background-200 text-background-800 px-4 py-2 dark:border-background-800 dark:text-background-400'>
			<div className='flex flex-row items-center space-x-2'>
				<span>UTN</span>
				<span>•</span>
				<span>TUP</span>
				<span>•</span>
				<span>Lab 4</span>
				<span>•</span>
				<span>2024</span>
				<span>•</span>
				<a href="https://github.com/PapitaConPure">Papita con Puré (I. Z.)</a>
			</div>
		</div>
	);
}
