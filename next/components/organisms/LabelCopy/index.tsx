import React, { useRef } from 'react';
import { IconCopy } from '@icons';
import { FormGroup, Input, InputGroup, Label } from 'reactstrap';
import { copyValue } from '../../../helper/Common/index';
import Skeleton from 'react-loading-skeleton';

interface LabelCopyProps {
	className?: string;
	id: string;
	title: string;
	classInput?: string;
	value: string;
	placeholder?: string;
	isLoading?: boolean;
}

const LabelCopy: React.FC<LabelCopyProps> = ({
	className,
	id,
	title,
	classInput,
	value,
	placeholder,
	isLoading = false,
}) => {
	const inputRef: any = useRef(null);

	return (
		<>
			<FormGroup className={className} id={id}>
				<Label className="tw-mb-3 form-label font-12 tw-font-medium tw-text-tpy-700">
					{isLoading ? <Skeleton className="tw-w-20" /> : title}
				</Label>
				<InputGroup className="tw-bg-monochrome-150 tw-rounded-lg">
					{isLoading ? (
						<Skeleton className="tw-w-36 tw-h-[21px] tw-mx-4 tw-my-4.5" />
					) : (
						<Input
							id={`${id}-${title}`}
							type={'text'}
							rows={1}
							style={{ resize: 'none' }}
							className={`form-control body-16-regular tw-border-0 ${classInput}`}
							value={value}
							disabled={true}
							placeholder={placeholder}
							ref={inputRef}
						/>
					)}
					<div
						onClick={() =>
							copyValue(
								value ? String(value).replace(/\D/g, '') : null,
								`${title} berhasil disalin`,
							)
						}
						className="tw-flex tw-pr-4 tw-justify-center tw-items-center tw-cursor-pointer secondary-ic"
					>
						{isLoading ? null : <IconCopy />}
					</div>
				</InputGroup>
			</FormGroup>
		</>
	);
};

export default LabelCopy;
