import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type ButtonKind = 'primary' | 'secondary' | 'success' | 'danger';

interface ButtonProps {
	children?: string;
	kind?: ButtonKind;
	stretched?: boolean;
	disabled?: boolean;
	submit?: boolean;
	reset?: boolean;
	onClick?: () => void;
	className?: string;
	icon?: import('@fortawesome/fontawesome-svg-core').IconDefinition;
}

export default function Button({
	children,
	kind: variant = 'secondary',
	stretched = false,
	disabled = false,
	submit = false,
	reset = false,
	onClick = () => {},
	className = '',
	icon = undefined,
}: ButtonProps) {
	const baseStyles = `${stretched && 'w-full'} ${children ? 'px-3 sm:px-4' : 'px-1.5 sm:px-2'} py-1.5 sm:py-2 rounded-lg font-semibold flex items-center gap-2 transition-all`;
	const variantsStyles: { [K in ButtonKind]: string } = {
		primary:
			'bg-primary-500 text-text-950 hover:bg-primary-600 active:bg-primary-700',
		secondary:
			'bg-secondary-400 text-text-950 hover:bg-opacity-45 active:bg-opacity-65 dark:bg-secondary-400 dark:text-text-50 bg-opacity-35 dark:hover:brightness-110 dark:active:brightness-90 dark:saturate-[.25]',
		success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
		danger: 'bg-red-500 text-white hover:bg-red-700 active:bg-red-800',
	};
	const disabledStyles = 'opacity-50 cursor-not-allowed';

	return (
		<button
			className={`${baseStyles} ${
				variantsStyles[variant] || variantsStyles.primary
			} ${disabled ? disabledStyles : ''} ${className}`}
			type={submit ? "submit" : (reset ? "reset" : "button")}
			onClick={onClick}
			disabled={disabled}
		>
			{icon && <FontAwesomeIcon icon={icon} />}
			{children}
		</button>
	);
}
