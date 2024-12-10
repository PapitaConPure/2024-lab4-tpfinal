import type { AxiosResponse } from 'axios';
import React, { useState } from 'react'

export type FormReportBody = {
	kind: 'success' | 'error',
	desc: string,
	response: Partial<AxiosResponse> | undefined,
};

interface FormReportProps {
	report?: FormReportBody;
}

export default function FormReport({ report }: FormReportProps) {
	if(!report) return;

	const { kind, desc, response } = report;
	return (
		<div
			className={`rounded-md border-2 px-4 py-2 ${
				kind === 'success'
					? 'border-green-600 bg-green-200 dark:border-green-700 dark:bg-green-800'
					: 'border-red-800 bg-red-200 dark:border-red-700 dark:bg-red-800'
			}`}
		>
			<div className='flex flex-row space-x-3 items-center'>
				<h2 className='min-w-max'>{response?.status}</h2>
				<h3 className='min-w-max'>{response?.statusText}</h3>
				{response && <span className='hidden sm:block'>/</span>}
				{response && <h5 className='hidden sm:block'>{desc}</h5>}
			</div>
			{response && <h5 className='block sm:hidden'>{desc}</h5>}
			{response?.data?.detail && <p className='pt-4'>{response.data.detail[0]?.msg ?? response.data.detail ?? 'Sin detalles adicionales'}</p>}
		</div>
	);
}

export function useFormReport() {
	return useState<FormReportBody>();
}
