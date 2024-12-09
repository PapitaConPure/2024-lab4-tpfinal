import React from 'react';

interface ErrorReportProps {
	title?: string;
	subtitle?: string;
	error: Error;
}

export default function ErrorReport({
	title = ':(',
	subtitle = 'Algo salió mal',
	error,
}: ErrorReportProps) {
	return (
		<div className="h-full bg-red-700 px-4 py-8 text-white">
			<div className="mx-auto my-auto w-2/3">
				{title && <h1 className='text-4xl'>{title}</h1>}
				{subtitle && <h2>{subtitle}</h2>}

				<br />

				<h3>{error.name}</h3>
				<p>{error.message}</p>

				{!!error.cause && (
					<>
						<h3>Razón</h3>
						<p>{`${error.cause}`}</p>
					</>
				)}

				<h3>Stack</h3>
				<p>{error.stack}</p>
			</div>
		</div>
	);
}
