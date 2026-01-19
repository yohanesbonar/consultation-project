import React, { useMemo } from 'react';
import styles from '../../../pages/payment/method/index.module.css';
import { IconOtherPayment, IconXendit } from '@icons';
import Skeleton from 'react-loading-skeleton';
import { toAmmount } from 'helper';
import { ImageLoading } from '@atoms';
import { BrokenImg } from '@images';
import classNames from 'classnames';

type Props = {
	label: string;
	icon: any;
	payment_id: string;
	choosePayment?: (payment_id: string) => void;
	isLoading?: boolean;
	minimumTotalInvoice?: number;
	totalAmount?: number;
};

const CardListPayment = (props: Props) => {
	const {
		label,
		icon,
		choosePayment,
		payment_id,
		minimumTotalInvoice = 0,
		totalAmount = 0,
		isLoading = false,
	} = props;

	const isDisabled = useMemo(
		() => totalAmount < minimumTotalInvoice,
		[totalAmount, minimumTotalInvoice],
	);

	return (
		<div
			onClick={isDisabled || isLoading ? null : () => choosePayment(payment_id)}
			className={classNames(styles.cardPaymentContainer, 'tw-bg-white')}
			style={isDisabled ? { filter: 'grayscale(100%)' } : {}}
		>
			<div className={styles.paymentGroup}>
				{isLoading ? (
					<Skeleton className="tw-w-[34px] tw-h-[34px]" />
				) : label === 'Xen Invoice' ? (
					<IconOtherPayment />
				) : (
					<div className="tw-relative tw-w-[34px] tw-aspect-square">
						<ImageLoading
							classNameContainer=" tw-overflow-hidden"
							className="!tw-object-contain"
							data={{ url: icon }}
							fallbackImg={BrokenImg.src}
						/>
					</div>
				)}

				<div className="tw-flex tw-flex-col">
					<label className="tw-ml-4">
						{isLoading ? (
							<Skeleton className="tw-w-36" />
						) : label === 'Xen Invoice' ? (
							'Pembayaran lainya'
						) : (
							label
						)}
					</label>
					{label === 'Xen Invoice' ? (
						<div className="tw-flex">
							<p className="body-12-regular tw-text-tpy-700 tw-mb-0 tw-ml-4 tw-mr-1">
								powered by
							</p>
							<IconXendit />
						</div>
					) : isDisabled ? (
						<label className="tw-ml-4 tw-text-tpy-700">
							{`minimal pembayaran Rp${toAmmount(minimumTotalInvoice)}`}
						</label>
					) : (
						''
					)}
				</div>
			</div>

			{isLoading ? null : <i className={`fa fa-chevron-right ${styles.icArrow}`}></i>}
		</div>
	);
};

export default CardListPayment;
