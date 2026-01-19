import React from 'react';

interface Props {
	data?: Array<any>;
	title?: string;
	children?: React.ReactNode;
}

const HorizontalSlider = ({ data, title, children }: Props) => {
	return (
		<div className="tw-p-4 tw-z-10 tw-relative">
			<div className="tw-mb-3 tw-flex tw-flex-1 title-16-medium">{title}</div>
			<div className="tw-flex tw-flex-1 tw-max-w-[100vw] tw-overflow-x-auto tw-gap-4 tw-pb-3">
				{children}
			</div>
		</div>
	);
};

export default HorizontalSlider;
