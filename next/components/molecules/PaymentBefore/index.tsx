import classNames from 'classnames';
import CountdownBadge from 'components/atoms/CountdownBadge';
import { checkIsEmpty, getFormattedTimeFromSeconds, getTimeLeft } from 'helper';
import moment from 'moment';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import CountdownTimer from '../CountdownTimer';

interface PaymentBeforeProps {
	loading?: boolean;
	transactionData?: any;
}

const PaymentBefore: React.FC<PaymentBeforeProps> = ({ loading, transactionData }) => {
	const [duration, setDuration] = React.useState(null);

	React.useEffect(() => {
		if (checkIsEmpty(transactionData)) return;

		const expiredAt = transactionData?.payment_expired_at;
		const timeleft = getTimeLeft(expiredAt, moment().add(global.timeGap ?? 0, 'seconds'));
		setDuration(timeleft);
	}, [transactionData]);

	return (
		<div
			className={classNames(
				'tw-flex tw-justify-between tw-items-center tw-py-2 tw-px-4',
				'tw-bg-error-100 tw-mb-2',
			)}
		>
			<div className={classNames('tw-flex tw-gap-2 font-14 tw-items-center')}>
				<div className={classNames('tw-font-normal', 'tw-text-xs')}>Bayar sebelum</div>
				<div className={classNames('tw-font-bold', 'tw-text-xs')}>
					{loading ? (
						<Skeleton className="tw-w-36" />
					) : transactionData?.payment_expired_at ? (
						moment(transactionData?.payment_expired_at).format('DD MMM YYYY [jam] HH:mm')
					) : (
						'-'
					)}
				</div>
			</div>

			<div className="tw-justify-end">
				{duration ? <CountdownBadge value={getFormattedTimeFromSeconds(duration)} /> : null}
			</div>

			<CountdownTimer
				duration={duration ?? 0}
				updateTime={(time) => {
					if (duration != null && time <= 0) {
						window.location.reload();
					}
					setDuration(time);
				}}
			/>
		</div>
	);
};

export default PaymentBefore;
