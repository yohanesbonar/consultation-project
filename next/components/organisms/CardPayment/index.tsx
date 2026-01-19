import { PaymentBefore } from '@molecules';
import classNames from 'classnames';
import InfoPayment from 'components/molecules/InfoPayment';
import PaymentLabelSide from 'components/molecules/PaymentLabelSide';
import React, { ReactNode } from 'react';

interface CardPaymentProps {
	classContainer: string;
	title: string;
	Icon?: any;
	iconLabel: string;
	infoContent?: ReactNode;
	bodyContent?: ReactNode;
	loading?: boolean;
	isFreePaid?: boolean;
	paymentData?: any;
	transactionData?: any;
	showCountdown?: boolean;
}

const CardPayment: React.FC<CardPaymentProps> = ({
	classContainer,
	title,
	Icon,
	iconLabel,
	infoContent,
	bodyContent,
	loading = false,
	isFreePaid,
	paymentData,
	transactionData,
	showCountdown = false,
}) => {
	const isQris = transactionData?.qr_code != null;

	return (
		<div
			className={classNames(
				`tw-flex tw-flex-col tw-p-4 tw-rounded-lg tw-shadow-[0_1px_4px_0px_rgba(0,0,0,0.12)] ${classContainer}`,
				'tw-pt-0 tw-px-0 tw-overflow-clip',
			)}
		>
			{showCountdown ? (
				<PaymentBefore loading={loading} transactionData={transactionData} />
			) : null}

			<PaymentLabelSide
				isFreePaid={isFreePaid}
				title={title}
				iconUrl={Icon?.src ?? Icon}
				iconLabel={iconLabel}
				loading={loading}
				paymentData={paymentData}
				transactionData={transactionData}
				classNameParent={classNames(' tw-px-4', showCountdown ? '' : 'tw-pt-4')}
			/>
			{showCountdown ? null : <hr className="divide-monochrome-500 tw-mx-4" />}
			<div className="tw-px-4">
				{infoContent && <InfoPayment>{infoContent}</InfoPayment>} {bodyContent}
			</div>
		</div>
	);
};

export default CardPayment;
