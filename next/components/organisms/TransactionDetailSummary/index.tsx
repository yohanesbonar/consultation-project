import React from 'react';

import {
	BUTTON_CONST,
	COMPONENT_TYPE,
	STATUS_CONST,
	TRANSACTION_LABEL,
	capitalizeEachWords,
	checkIsEmpty,
} from '../../../helper';
import { TextLabelSide } from '@molecules';
import ReasonBox from 'components/molecules/ReasonBox';
import { CardBox } from '@atoms';
import { FiChevronRight } from 'react-icons/fi';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { AiFillInfoCircle } from 'react-icons/ai';

interface Props {
	data?: any;
	handleHowToPay?: () => void;
	isPageLoading?: boolean;
	type?: 'product' | 'order';
}

const TransactionDetailSummary = ({
	data,
	handleHowToPay,
	isPageLoading = false,
	type = 'order',
}: Props) => {
	return (
		<div className="tw-px-4 tw-my-5 tw-flex-1 tw-flex tw-flex-col tw-gap-4">
			<TextLabelSide
				data={{
					label: TRANSACTION_LABEL.INVOICE_NO,
					value: data?.invoice_number != '' ? data?.invoice_number : '-',
					type: data?.invoice_number != '' ? COMPONENT_TYPE.TEXT_COPY : null,
				}}
				isLoading={isPageLoading}
			/>
			<TextLabelSide
				data={{
					label: TRANSACTION_LABEL.PAYMENT_STATUS,
					value:
						!checkIsEmpty(data?.payment_status) &&
						data?.payment_status == STATUS_CONST.EXPIRED
							? STATUS_CONST.FAILED
							: data?.payment_status,
					type: COMPONENT_TYPE.TEXT_STATUS,
				}}
				isLoading={isPageLoading}
			/>
			<TextLabelSide
				data={{
					label:
						data?.payment_status === 'REFUNDED'
							? TRANSACTION_LABEL.WAKTU_PENGAJUAN
							: TRANSACTION_LABEL.ORDER_TIME,
					value: data?.created_at ?? data?.order_at,
					type: COMPONENT_TYPE.DATE,
					date_format: 'D MMM YYYY [jam] HH:mm',
				}}
				emptyValue="-"
				isLoading={isPageLoading}
			/>
			{data?.payment_status === 'REFUNDED' && (
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-stretch tw-py-3 tw-px-2 tw-bg-info-50 tw-rounded-lg">
					<div className="tw-flex tw-flex-row tw-gap-3 tw-items-center">
						<AiFillInfoCircle color="#BD5100" size={20} />
						<div className="tw-text body-12-regular">
							Dana akan dikembalikan sesuai dengan aturan standar pelayanan kami
						</div>
					</div>
				</div>
			)}
			{data?.shipping_status === STATUS_CONST.REJECTED && (
				<div className="tw-bg-monochrome-100 tw-pr-4 tw-px-4 tw-py-2 tw-rounded-lg">
					<p className="label-12-medium tw-mb-0 tw-text-tpy-700">Alasan Dibatalkan</p>
					<p className="body-14-regular tw-mb-0 tw-mt-1">
						{data?.merchant_reject_reason ?? '-'}
					</p>
				</div>
			)}
			{isPageLoading ? (
				<Skeleton height={56} className="tw-w-full" />
			) : (
				<>
					{data?.payment_status === STATUS_CONST.PENDING && (
						<CardBox
							className={'card-border-16px tw-overflow-hidden '}
							body={
								<div
									className="tw-flex tw-justify-between tw-cursor-pointer"
									onClick={handleHowToPay}
								>
									<div>
										{data?.deeplink_url || data?.invoice_url
											? capitalizeEachWords(BUTTON_CONST.PAY_NOW)
											: 'Lihat Cara Bayar'}
									</div>
									<FiChevronRight size={24} color="#666" />
								</div>
							}
						/>
					)}
				</>
			)}
			{data?.payment_status === STATUS_CONST.FAILED ||
			data?.payment_status === STATUS_CONST.EXPIRED ||
			data?.payment_status === STATUS_CONST.CANCELLED ? (
				<ReasonBox
					title="Alasan Gagal"
					body={
						data?.failed_reason ??
						(data?.payment_status === STATUS_CONST.EXPIRED
							? 'Pembayaran belum dilakukan sampai melewati batas waktu'
							: '')
					}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetailSummary);
