import React from 'react';

interface BaseInputProps {
	id: string;
	label?: string;
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

type FieldInputProps = TextInputProps | NumberInputProps;

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
				className="rounded-md bg-white px-3 py-1 font-medium transition-all dark:bg-background-800 dark:font-light"
			/>
		</div>
	);
}
