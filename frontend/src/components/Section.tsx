import React from 'react'

interface SectionProps {
	children?: React.ReactNode;
	className?: string;
}

export default function Section({ children, className }: SectionProps) {
	if(!children) return null;
	
	return (
		<div className={`flex flex-row space-x-2 ${className}`}>
			{children}			
		</div>
	)
}
