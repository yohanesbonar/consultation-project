import React, { useRef } from 'react';

import { COMPONENT_TYPE, TRANSACTION_LABEL, numberToIDR } from '../../../helper';
import { TextLabelSide } from '@molecules';
import { CardBox } from '@atoms';
import { DetailTransactionData } from '@types';
import { IconWarningOrange } from '@icons';
import Skeleton from 'react-loading-skeleton';

interface Props {
	data?: DetailTransactionData;
	handleHowToPay?: () => void;
	isLoading?: boolean;
}

const TransactionRefundSummary = ({ data, handleHowToPay, isLoading = false }: Props) => {
	const containerRef = useRef<any>(null);

	const renderBody = () => {
		return (
			<div className="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
				<TextLabelSide
					data={{
						label: TRANSACTION_LABEL.TOTAL_REFUND,
						value: numberToIDR(data?.paid_amount),
					}}
					classNameValue="tw-text-base"
					classNameLabel="tw-text-base"
					isLoading={isLoading}
				/>
				<div className="tw-h-[1px] tw-w-full tw-bg-monochrome-300" />
				<TextLabelSide
					data={{
						label: TRANSACTION_LABEL.INVOICE_NO,
						value: data?.invoice_number != '' ? data?.invoice_number : '-',
						type: data?.invoice_number != '' ? COMPONENT_TYPE.TEXT_COPY : null,
					}}
					classNameLabel="tw-w-[120px]"
					isLoading={isLoading}
				/>
				<div className="tw-py-3 tw-px-2 tw-bg-info-50 tw-rounded-lg tw-flex tw-gap-2 tw-mt-1">
					<div className="tw-text-info-def">
						<IconWarningOrange />
					</div>
					{isLoading ? (
						<p className="tw-mb-0 tw-flex-1">
							<Skeleton count={1.7} />
						</p>
					) : (
						<p className="tw-mb-0 tw-flex-1">
							Anda akan diarahkan ke{' '}
							<span className="tw-font-roboto tw-font-medium">
								Whatsapp Customer Service
							</span>{' '}
							untuk melanjutkan
						</p>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="tw-px-4 tw-my-5 tw-flex-1">
			<CardBox
				containerRef={containerRef}
				className={'card-border-16px tw-overflow-hidden '}
				body={renderBody()}
			/>
		</div>
	);
};

export default TransactionRefundSummary;
