import React from 'react';

interface DateInputProps {
	id: string;
	value: string | number;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	label?: string;
	required?: boolean;
	className?: string;
}

export default function DateInput({
	id,
	value,
	onChange,
	label,
	required,
	className,
}: DateInputProps) {
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
				type="date"
				id={id}
				value={value}
				onChange={onChange}
				required={required}
				className="rounded-md border border-background-200 bg-white px-3 py-1 font-medium shadow-sm transition-all dark:border-0 dark:border-opacity-0 dark:bg-background-800 dark:font-light"
			/>
		</div>
	);
}
