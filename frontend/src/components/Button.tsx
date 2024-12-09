import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type ButtonKind = 'primary' | 'secondary' | 'success' | 'danger';

interface ButtonProps {
	children?: string;
	kind?: ButtonKind;
	stretched?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
	icon?: import('@fortawesome/fontawesome-svg-core').IconDefinition;
}

export default function Button(props: ButtonProps) {
	const {
		children,
		kind: variant = 'secondary',
		stretched = false,
		disabled = false,
		onClick = () => {},
		className = '',
		icon = null,
	} = props;

	const baseStyles = `${stretched && 'w-full'} px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold flex items-center gap-2 transition-all`;
	const variantsStyles: { [K in ButtonKind]: string } = {
		primary:
			'bg-primary-600 text-text-950 hover:bg-primary-500 active:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700',
		secondary:
			'bg-secondary-500 text-text-950 hover:bg-opacity-35 active:bg-opacity-45 dark:bg-secondary-400 dark:text-text-50 bg-opacity-30 dark:hover:brightness-110 dark:active:brightness-90 dark:saturate-[.25]',
		success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
		danger: 'bg-red-500 text-white hover:bg-red-700 active:bg-red-800',
	};
	const disabledStyles = 'opacity-50 cursor-not-allowed';

	return (
		<button
			className={`${baseStyles} ${
				variantsStyles[variant] || variantsStyles.primary
			} ${disabled ? disabledStyles : ''} ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{icon && <FontAwesomeIcon icon={icon} />}
			{children}
		</button>
	);
}
