import React from 'react';
import Skeleton from 'react-loading-skeleton';

type Props = {
	data: {
		value: string;
		label: string;
	};
	className?: string;
	classNameTitle?: string;
	emptyValue?: string;
	emptyLabel?: string;
	Icon?: React.ReactNode;
	isLoadingValue?: boolean;
};

const TextLabel = ({
	data,
	className = '',
	classNameTitle = '',
	emptyValue = '',
	emptyLabel = '',
	Icon = '',
	isLoadingValue = false,
}: Props) => {
	// tw-justify-center
	return (
		<div className={`tw-flex-1 tw-mt-4 tw-justify-center ${className}`}>
			<div className={`tw-flex tw-flex-row tw-gap-2 ${classNameTitle}`}>
				{Icon}
				<p className="body-12-regular tw-text-tpy-700">
					{data?.label ? data?.label : emptyLabel}
				</p>
			</div>
			<p className="title-14-medium tw-mt-2 ">
				{isLoadingValue ? (
					<Skeleton className="tw-w-2/3" />
				) : data?.value ? (
					data?.value
				) : (
					emptyValue
				)}
			</p>
		</div>
	);
};
export default TextLabel;
