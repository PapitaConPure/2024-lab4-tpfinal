import React from 'react'

interface TextInputProps {
	id: string;
	checked: boolean;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	label?: string;
	className?: string;
}

export default function Toggle({ id, checked, onChange, label, className }: TextInputProps) {
	return (
		<div className={className ? className : ''}>
			<label className="flex flex-row items-center">
				<span className="font-medium transition-all dark:font-light">
					{label}
				</span>
				<input
					type="checkbox"
					id={id}
					checked={checked}
					onChange={onChange}
					className="before:content:[''] before:z-1 after:content:[''] after:z-2 ml-2 h-6 w-10 appearance-none border-0 bg-transparent before:absolute before:ml-1 before:mt-1 before:h-4 before:w-8 before:rounded-3xl before:active:h-3 before:active:mt-1.5 before:bg-background-300 before:transition-all after:absolute after:h-6 after:w-6 after:hover:w-7 after:hover:h-7 after:hover:-mt-0.5 after:hover:-ml-0.5 after:checked:hover:ml-3.5 after:rounded-full after:border-[3px] after:border-background-50 after:bg-accent-600 after:transition-all after:checked:ml-4 hover:cursor-pointer after:hover:bg-accent-700 after:active:bg-accent-800 dark:before:bg-background-800 dark:after:border-background-900 dark:after:bg-accent-500 before:checked:bg-primary-500 after:checked:bg-primary-500 dark:after:hover:bg-accent-200 after:checked:hover:bg-primary-200 dark:after:active:bg-accent-600 after:checked:active:bg-primary-600"
				/>
			</label>
		</div>
	)
}
