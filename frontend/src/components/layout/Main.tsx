import React from 'react';

interface MainProps {
	children?: React.ReactNode;
}

export default function Main({ children }: MainProps) {
	return (
		<div className="mx-6 flex flex-col space-y-2 md:mx-12 lg:mx-auto lg:max-w-[56rem]">
			{children}
		</div>
	);
}
