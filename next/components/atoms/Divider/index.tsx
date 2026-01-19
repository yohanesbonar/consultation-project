import React from 'react';

type Props = {
	type?: 'dashed';
	className?: string;
};

const Divider = ({ type, className }: Props) => {
	if (type === 'dashed') {
		return (
			<div
				className={`${className} tw-h-[1px] tw-w-full tw-border-0 tw-border-dashed tw-border-t-1 tw-border-monochrome-50`}
			/>
		);
	} else {
		return <div className={`${className}  tw-h-[1px] tw-w-full tw-bg-monochrome-100 tw-my-5`} />;
	}
};
export default Divider;
