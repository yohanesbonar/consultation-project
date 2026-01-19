import { IconWarningOrange } from '@icons';
import React from 'react';

interface InfoPaymentProps {
	children: React.ReactNode;
}

const InfoPayment: React.FC<InfoPaymentProps> = ({ children }) => {
	return (
		<div className="tw-flex tw-flex-col tw-justify-start tw-items-stretch tw-py-3 tw-px-2 tw-bg-info-50 tw-rounded-lg">
			<div className="tw-flex tw-flex-row tw-gap-1">
				<div className="tw-text-info-def">
					<IconWarningOrange />
				</div>
				<div className="tw-text-info-700 tw-font-roboto tw-font-medium">Info</div>
			</div>
			{children}
		</div>
	);
};

export default InfoPayment;
