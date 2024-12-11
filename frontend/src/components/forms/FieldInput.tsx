import React from 'react';
import { numberStringToTelephoneString } from '../../utils';

interface BaseInputProps {
	id: string;
	label?: React.ReactNode;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	required?: boolean;
	className?: string;
}

interface TextInputProps extends BaseInputProps {
	type: 'text';
	value: string;
}

interface NumberInputProps extends BaseInputProps {
	type: 'number';
	value: number;
	min?: number;
	max?: number;
}

interface TelInputProps extends BaseInputProps {
	type: 'tel';
	value: string | number;
}

type FieldInputProps =
	| TextInputProps
	| NumberInputProps
	| TelInputProps;

export default function FieldInput(props: FieldInputProps) {
	const { id, className, label, ...inputProps } = props;

	return (
		<div className={`${className ? className : ''} flex flex-col`}>
			{label && (
				<label
					htmlFor={id}
					className="mb-0.5 block font-bold transition-all dark:font-medium"
				>
					{label}
				</label>
			)}
			<input
				{...inputProps}
				id={id}
				{...(props.type === 'tel'
					? {
							onChange: (e) => {
								e.target.value = numberStringToTelephoneString(e.target.value)
								return props.onChange(e);
							},
						}
					: {})}
				className="rounded-md border border-background-200 bg-white px-3 py-1 font-medium shadow-sm transition-all focus:border-x-4 focus:border-accent-600 dark:focus:border-x-4 dark:focus:border-accent-500 outline-none dark:border-opacity-0 dark:bg-background-800 dark:font-light"
			/>
		</div>
	);
}
