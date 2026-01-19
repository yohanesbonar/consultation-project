import { ButtonHighlight, TransactionRefundSummary, Wrapper } from '../../index.js';
import { BUTTON_CONST, BUTTON_ID, LABEL_CONST, PAGE_ID, REFUND_REASONS } from '../../../helper';
import { DetailTransactionData } from '@types';
import { useState } from 'react';
import { IconRadioOff, IconRadioOn } from '@icons';
import Skeleton from 'react-loading-skeleton';

interface Props {
	isLoading?: boolean;
	isSubmitting?: boolean;
	data?: DetailTransactionData;
	doSubmit?: (reason?: string) => void;
}

const TransactionRefundtemplate = ({
	isLoading = false,
	data = null,
	isSubmitting = false,
	doSubmit,
}: Props) => {
	const [selectedOption, setSelectedOption] = useState<{ id?: number; value?: string }>();

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 ">
				<div className="tw-flex tw-flex-col tw-flex-1 ">
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_SUBMIT_A_REFUND}
						onClick={() => doSubmit(selectedOption?.value)}
						text={BUTTON_CONST.SUBMIT_A_REFUND}
						isLoading={isSubmitting}
						isDisabled={selectedOption == null || isSubmitting || isLoading}
						circularContainerClassName="tw-h-[16px]"
						circularClassName="circular-inner-16"
					/>
				</div>
			</div>
		);
	};

	const renderOption = (item: any, idx: number) => {
		return (
			<div
				key={idx}
				className="tw-flex  tw-items-center btn-hover link-cursor tw-bg-monochrome-150 tw-mt-4 tw-rounded-lg"
				onClick={() => {
					setSelectedOption(item);
				}}
			>
				<p className="tw-flex-1 tw-mb-0 tw-mx-4 tw-py-3 tw-break-words tw-whitespace-normal tw-break-all">
					{item?.value}
				</p>
				<div className="tw-text-secondary-def">
					{selectedOption && item?.id == selectedOption?.id ? (
						<IconRadioOn />
					) : (
						<IconRadioOff />
					)}
				</div>
			</div>
		);
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.TRANSACTION_REFUND}
			title={LABEL_CONST.SUBMIT_REFUND}
			header={true}
			footer={true}
			footerComponent={renderFooterButton()}
			additionalStyleContent={{
				overflow: 'auto',
			}}
			headClass={'tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2]'}
		>
			<TransactionRefundSummary data={data} isLoading={isLoading} />
			<div className="tw-flex-1 tw-mt-6 tw-mx-4">
				<p className="tw-text-base tw-font-roboto tw-font-medium tw-mb-0">
					Apa alasan Anda mengajukan refund?
				</p>
				<div className="tw-flex tw-flex-col tw-max-w-full">
					{isLoading ? (
						<div>
							<Skeleton height={48} className="tw-mt-4" />
							<Skeleton height={48} className="tw-mt-4" />
						</div>
					) : (
						REFUND_REASONS?.map((e, i) => renderOption(e, i))
					)}
				</div>
			</div>
		</Wrapper>
	);
};

export default TransactionRefundtemplate;
