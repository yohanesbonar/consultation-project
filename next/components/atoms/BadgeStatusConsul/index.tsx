import { STATUS_LABEL } from 'helper';
import React from 'react';

interface BadgeStatusConsulProps {
	type: 'READY' | 'DONE' | 'EXPIRED' | 'CANCELED' | 'REFUNDED' | 'STARTED';
}

export const statusDataConsultation = [
	{
		status: 'READY',
		color: 'tw-text-secondary-800',
		bgColor: 'tw-bg-secondary-50',
		title: STATUS_LABEL.CONSULTATION_READY,
	},
	{
		status: 'DONE',
		color: 'tw-text-success-def',
		bgColor: 'tw-bg-success-50',
		title: STATUS_LABEL.CONSULTATION_USED,
	},
	{
		status: 'EXPIRED',
		color: 'tw-text-primary-def',
		bgColor: 'tw-bg-error-100',
		title: STATUS_LABEL.EXPIRED,
	},
	{
		status: 'CANCELED',
		color: 'tw-text-primary-def',
		bgColor: 'tw-bg-error-100',
		title: STATUS_LABEL.CANCEL,
	},
	{
		status: 'CANCELLED',
		color: 'tw-text-primary-def',
		bgColor: 'tw-bg-primary-100',
		title: STATUS_LABEL.CANCEL,
	},
	{
		status: 'STARTED',
		color: 'tw-text-info-700',
		bgColor: 'tw-bg-info-50',
		title: STATUS_LABEL.ONGOING,
	},
];

const BadgeStatusConsul: React.FC<BadgeStatusConsulProps> = ({ type }) => {
	const data = statusDataConsultation.find((item) => item.status == type);
	return (
		<div className="tw-flex tw-gap-1">
			<div
				className={`label-11-medium tw-flex tw-justify-center tw-px-2 tw-py-1 tw-rounded-full tw-items-center ${
					data?.color ?? ''
				} ${data?.bgColor ?? ''}`}
			>
				{data?.title ?? ''}
			</div>
		</div>
	);
};

export default BadgeStatusConsul;
