import React from 'react';

export interface BadgePaymentStatusProps {
	type:
		| 'PENDING'
		| 'SUCCESS'
		| 'FAILED'
		| 'REFUNDED'
		| 'EXPIRED'
		| 'COMPLETED'
		| 'CREATED'
		| 'SENT'
		| 'ARRIVE'
		| 'REJECTED'
		| 'COMPLAIN'
		| 'ON_PROCESS';
}

export const statusData = [
	{
		status: 'PENDING',
		color: 'tw-text-[#FFFFFF]',
		title: 'Menunggu Bayar',
		bgColor: 'tw-bg-[#BD5100]',
	},
	{
		status: 'CREATED',
		color: 'tw-text-[#BD5100]',
		title: 'Menunggu Konfirmasi',
		bgColor: 'tw-bg-[#FFF8E1]',
	},
	{
		status: 'SENT',
		color: 'tw-text-[#00429C]',
		title: 'Sedang Dikirim',
		bgColor: 'tw-bg-[#E2F1FC]',
	},
	{
		status: 'SUCCESS',
		color: 'tw-text-[#00429C]',
		title: 'Diproses',
		bgColor: 'tw-bg-[#E2F1FC]',
	},
	{
		status: 'ON_PROCESS',
		color: 'tw-text-[#00429C]',
		title: 'Diproses',
		bgColor: 'tw-bg-[#E2F1FC]',
	},
	{
		status: 'ARRIVE',
		color: 'tw-text-[#00429C]',
		title: 'Tiba di Tujuan',
		bgColor: 'tw-bg-[#E2F1FC]',
	},
	{
		status: 'COMPLETED',
		color: 'tw-text-[#178038]',
		title: 'Selesai',
		bgColor: 'tw-bg-[#E7F6EA]',
	},
	{
		status: 'CANCELLED',
		color: 'tw-text-[#D01E53]',
		title: 'Pembayaran Gagal',
		bgColor: 'tw-bg-[#FCE3EA]',
	},
	{
		status: 'FAILED',
		color: 'tw-text-[#D01E53]',
		title: 'Pembayaran Gagal',
		bgColor: 'tw-bg-[#FCE3EA]',
	},
	{
		status: 'EXPIRED',
		color: 'tw-text-[#D01E53]',
		title: 'Pembayaran Gagal',
		bgColor: 'tw-bg-[#FCE3EA]',
	},
	{
		status: 'REFUNDED',
		color: 'tw-text-[#BD5100]',
		title: 'Refund',
		bgColor: 'tw-bg-[#FFF8E1]',
	},
	{
		status: 'REJECTED',
		color: 'tw-text-[#D01E53]',
		title: 'Dibatalkan',
		bgColor: 'tw-bg-[#FCE3EA]',
	},
	{
		status: 'COMPLAIN',
		color: 'tw-text-[#BD5100]',
		title: 'Dikomplain',
		bgColor: 'tw-bg-[#FFF8E1]',
	},
];

const BadgePaymentStatus: React.FC<BadgePaymentStatusProps> = ({ type }) => {
	const data = statusData.find((item) => item.status == type);
	return (
		<div className="tw-flex tw-gap-1">
			<div
				className={`label-11-medium tw-flex tw-justify-center tw-px-2 tw-py-1 tw-rounded-full tw-items-center ${
					data?.color ?? ''
				} ${data?.bgColor ?? ''}`}
			>
				{data?.title}
			</div>
		</div>
	);
};

export default BadgePaymentStatus;
