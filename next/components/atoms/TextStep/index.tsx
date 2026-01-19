import React from 'react';

type Props = {
	data: {
		value: string;
		label: string;
	};
	className?: string;
	emptyValue?: string;
	emptyLabel?: string;
};

const TextStep = ({ data, className = '', emptyValue = '', emptyLabel = '' }: Props) => {
	return (
		<div className={'tw-flex tw-gap-2 last:tw-items-start tw-items-stretch' + className}>
			<div className="tw-flex tw-flex-col tw-min-h-max tw-items-center">
				<div className="tw-border-0 tw-rounded-full tw-border-blue-secondary tw-border-solid tw-min-w-6 tw-aspect-square tw-flex tw-items-center tw-justify-center">
					<p className="body-14-regular tw-text-blue-secondary tw-mb-0">
						{data?.label ? data?.label : emptyLabel}
					</p>
				</div>
				{/* <div className="tw-w-0.5 tw-h-10 tw-flex-1 tw-bg-monochrome-300" /> */}
			</div>
			<p className="body-14-regular tw-text-black tw-pb-2">
				{data?.value ? data?.value : emptyValue}
			</p>
		</div>
	);
};
export default TextStep;
