import React from 'react'

interface SectionProps {
	children?: React.ReactNode;
	className?: string;
	flex?: 'row' | 'col' | 'none';
}

export default function Section({ children, className, flex = 'none' }: SectionProps) {
	if(!children) return null;

	return (
		<div className={`${flex !== 'none' ? `flex flex-${flex} space-x-2` : ''} ${className ?? ''}`.trim()}>
			{children}
		</div>
	)
}
