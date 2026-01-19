import React, { useEffect } from 'react';
import { Alert } from 'reactstrap';

interface Props {
	className?: string;
	timeout?: number;
	alertMessage?: string;
	setAlertMessage: (val?: string) => void;
}

const PopupAlert = ({
	className = '',
	timeout = 3000,
	alertMessage = '',
	setAlertMessage,
}: Props) => {
	useEffect(() => {
		if (alertMessage) {
			setTimeout(() => {
				setAlertMessage('');
			}, timeout);
		}
	}, [alertMessage]);

	return (
		alertMessage && (
			<div className={'absolute-bottom-16  ' + className}>
				<Alert color="danger" toggle={() => setAlertMessage('')}>
					<p className="tw-mb-0">{alertMessage}</p>
				</Alert>
			</div>
		)
	);
};
export default PopupAlert;
