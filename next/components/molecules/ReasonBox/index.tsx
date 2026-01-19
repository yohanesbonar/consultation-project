import React from 'react';

interface ReasonBoxProps {
	title: string;
	body: string;
}

const ReasonBox: React.FC<ReasonBoxProps> = ({ title, body }) => {
	return (
		<div className="tw-flex tw-flex-col tw-px-4 tw-py-2 tw-bg-monochrome-100 tw-gap-1 tw-rounded">
			<div className="body-12-regular tw-text-tpy-700">{title}</div>
			<div>{body}</div>
		</div>
	);
};

export default ReasonBox;
