import React from 'react';
import { ImageLoading } from '@atoms';
import { IconDkonsulSmall } from '@icons';
import { LABEL_CONST, numberToIDR } from 'helper';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';

interface PaymentLabelSideProps {
	title: string;
	iconUrl?: any;
	iconLabel?: string;
	classNameParent?: string;
	loading?: boolean;
	isFreePaid?: boolean;
	paymentData?: any;
	transactionData?: any;
}

const PaymentLabelSide: React.FC<PaymentLabelSideProps> = ({
	title,
	iconUrl,
	iconLabel,
	classNameParent,
	loading = false,
	isFreePaid,
	paymentData,
	transactionData,
}) => {
	const isBcaVa = iconLabel === 'BCA Virtual Account';
	const isQris = transactionData?.qr_code != null;
	return (
		<div className={cx(classNameParent ?? '', 'tw-flex tw-justify-between tw-items-center')}>
			{isQris ? null : !isFreePaid ? (
				<div>{loading ? <Skeleton className="tw-w-40" /> : title}</div>
			) : (
				<div className="tw-flex tw-items-center">
					<IconDkonsulSmall />
					<p className="label-14-medium tw-mb-0 tw-ml-2">
						{LABEL_CONST.FREE_PAID_CONSULTATION}
					</p>
				</div>
			)}

			<div className="tw-flex tw-shrink tw-justify-end tw-items-center tw-gap-2">
				<div className={`tw-w-9 tw-h-9 tw-relative`}>
					{loading ? null : (
						<ImageLoading
							data={{
								url: iconUrl,
								noImg: !(iconUrl != null && iconUrl != '' && title != null && title != ''),
							}}
							alt="payment-icon"
							className="tw-object-scale-down tw-object-right"
						/>
					)}
				</div>
				{isQris ? null : (
					<div className="label-14-medium tw-flex-1">{isBcaVa ? 'BCA' : iconLabel}</div>
				)}
			</div>
			{isQris ? (
				<div className="tw-flex tw-justify-end title-16-medium">
					{numberToIDR(transactionData?.paid_amount ?? transactionData?.total_price)}
				</div>
			) : null}
		</div>
	);
};

export default PaymentLabelSide;
