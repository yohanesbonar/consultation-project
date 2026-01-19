import React from 'react';
import { Input } from 'reactstrap';

interface Props {
	className?: string;
	id?: string;
	data?: any;
	acceptedType?: string;
	capture?: boolean | 'user' | 'environment' | undefined;
	onChange: (val: any) => void;
	body?: React.ReactNode;
}
const InputFile = ({ className, id = '', data, acceptedType, capture, onChange, body }: Props) => {
	return (
		<div
			className={
				'custom-file-input tw-flex tw-items-center tw-content-center tw-pt-2 ' + className
			}
		>
			{body ?? (
				<div className="tw-m-0 tw-py-4.5 tw-px-4 tw-bg-monochrome-150 tw-rounded">
					<p className="tw-mb-0 tw-flex-1 text-break body-16-regular">
						{data?.value ?? 'Pilih File'}
					</p>
				</div>
			)}
			<Input
				type="file"
				id={'inputFile ' + id}
				onChange={(e) => {
					console.log('change', e.target.files?.length);
					onChange(e.target.files);
				}}
				accept={acceptedType}
				capture={capture}
				value=""
				multiple
			/>
		</div>
	);
};
export default InputFile;
