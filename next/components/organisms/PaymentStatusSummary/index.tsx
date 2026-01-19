import React, { useMemo } from 'react';

import { LABEL_CONST, STATUS_CONST, STATUS_LABEL, numberToIDR } from '../../../helper';
import { TextLabelSide } from '@molecules';
import { IconAlertSuccess, IconBill, IconClockOrangeLarge, IconDkonsulSmall } from '@icons';
import { IoIosCloseCircle } from 'react-icons/io';
import moment from 'moment';
import { Divider } from '@atoms';
import Router from 'next/router';
import Skeleton from 'react-loading-skeleton';

interface Props {
	data?: any;
	meta?: any;
	type: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING';
	isLoading?: boolean;
	isFreePaid?: boolean;
}

const PaymentStatusSummary = ({ data, meta, type, isLoading = false, isFreePaid }: Props) => {
	const isXenditPayment = data?.payment_method?.name === 'Xen Invoice';
	const paymentName = data?.payment_method?.name ?? data?.payment_method?.title;

	const labelPayment =
		isXenditPayment && type == STATUS_CONST.PENDING
			? LABEL_CONST.NEED_TO_PAY
			: isXenditPayment && type === STATUS_CONST.EXPIRED
			? LABEL_CONST.FAIL_TO_PAY
			: isFreePaid
			? LABEL_CONST.FREE_PAID_CONSULTATION
			: paymentName;

	const iconPayment =
		isXenditPayment && type == STATUS_CONST.PENDING ? (
			<IconBill />
		) : isFreePaid ? (
			<IconDkonsulSmall />
		) : (
			<img
				src={data?.payment_method?.logo ?? data?.payment_method?.logo_url}
				className="tw-h-9 tw-w-9 tw-object-contain"
			/>
		);

	const valuePayment =
		data?.paid_amount || data?.total_price || isFreePaid
			? numberToIDR(isFreePaid ? 0 : data?.paid_amount ?? data?.total_price)
			: '-';

	const isPendingButExpired = useMemo(
		() =>
			(data?.payment_status == STATUS_CONST.PENDING ||
				data?.payment_status == STATUS_CONST.CREATED) &&
			moment(meta?.at).isAfter(moment(data?.payment_expired_at)),
		[data, meta],
	);

	return (
		<view className="tw-mx-4 tw-p-4 tw-my-6 tw-flex-1 tw-flex tw-flex-col tw-z-10 tw-relative tw-bg-white tw-rounded-2xl tw-shadow-md">
			{isLoading ? (
				<div className="tw-flex tw-justify-center">
					<Skeleton className="tw-rounded-full tw-h-[90px] tw-w-[90px]" />
				</div>
			) : type === STATUS_CONST.SUCCESS ? (
				<IconAlertSuccess className="tw-self-center" />
			) : (type === STATUS_CONST.PENDING || type === STATUS_CONST.CREATED) &&
			  !isPendingButExpired ? (
				<IconClockOrangeLarge className="tw-self-center" size={90} />
			) : (
				<IoIosCloseCircle className="tw-self-center" size={90} color="#B00020" />
			)}
			<p className="title-20-medium tw-mt-5 tw-mb-0 tw-self-center">
				{isLoading ? (
					<Skeleton className="tw-w-40" />
				) : type != null ? (
					type == STATUS_CONST.SUCCESS ? (
						STATUS_LABEL.PAYMENT_SUCCESS
					) : type == STATUS_CONST.FAILED ||
					  type == STATUS_CONST.EXPIRED ||
					  type == STATUS_CONST.CANCELLED ||
					  isPendingButExpired ? (
						STATUS_LABEL.PAYMENT_FAILED
					) : (
						STATUS_LABEL.PAYMENT_PENDING
					)
				) : (
					''
				)}
			</p>
			{isLoading ? (
				<p className="tw-mt-3 tw-mb-0 tw-self-center">
					<Skeleton className="tw-w-52" />
				</p>
			) : (
				<p className="tw-mt-3 tw-mb-0 tw-self-center">
					{type === STATUS_CONST.PENDING && !isPendingButExpired ? 'Sebelum ' : ''}
					<span
						className={`${
							type === STATUS_CONST.PENDING && !isPendingButExpired
								? 'tw-text-error-600 tw-font-roboto'
								: 'tw-font-roboto'
						}`}
					>
						{type === STATUS_CONST.PENDING && !isPendingButExpired
							? !data?.payment_expired_at
								? '-'
								: moment(
										type === STATUS_CONST.PENDING
											? data?.payment_expired_at
											: data?.updated_at,
								  ).format('D MMM YYYY [jam] HH:mm')
							: moment(data?.updated_at).format('D MMM YYYY [jam] HH:mm')}
					</span>
				</p>
			)}
			<Divider />

			{data?.payment_method || isLoading ? (
				<div>
					<TextLabelSide
						data={{
							label: labelPayment,
							labelPrefixIcon: iconPayment,
							value: valuePayment,
							labelPrefixIconClassName: 'tw-mr-2',
						}}
						labelBold
						classNameValue="tw-text-base tw-items-center"
						isLoading={isLoading}
					/>
					<Divider />
				</div>
			) : null}

			<p className="tw-mb-0 tw-self-center tw-text-center tw-font-roboto">
				{isLoading ? (
					<Skeleton className="tw-w-56" count={2.5} />
				) : type === STATUS_CONST.SUCCESS ? (
					Router?.query?.presc ? (
						<>
							Pesanan telah diteruskan ke apotek. Silakan tunggu update selanjutnya melalui
							email
						</>
					) : (
						<>
							Anda bisa melakukan telekonsultasi. Kuota telekonsultasi Anda berlaku hingga{' '}
							<br />
							<span className="tw-text-error-600">
								{data?.consultation_expired_at
									? moment(data?.consultation_expired_at).format('D MMM YYYY [jam] HH:mm')
									: ''}
							</span>
						</>
					)
				) : type === STATUS_CONST.FAILED ? (
					'Maaf pembayaran Anda gagal. Dana otomatis kembali ke saldo Anda.'
				) : type === STATUS_CONST.EXPIRED || isPendingButExpired ? (
					'Maaf pembayaran Anda gagal karena sudah melewati batas waktu'
				) : type === STATUS_CONST.CANCELLED ? (
					data?.failed_reason
				) : (
					<div>
						Mohon lakukan pembayaran. Setelah Anda melakukan pembayaran, tekan tombol “Cek
						Status Pembayaran”
					</div>
				)}
			</p>
		</view>
	);
};

export default PaymentStatusSummary;
