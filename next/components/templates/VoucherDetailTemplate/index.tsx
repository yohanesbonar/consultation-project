import { ButtonHighlight } from '@atoms';
import { Wrapper } from '@organisms';
import { VoucherDetailType } from '@types';
import VoucherDetailBox from 'components/organisms/VoucherDetailBox';
import { BUTTON_CONST, BUTTON_ID, PAGE_ID } from 'helper';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface Props {
	data?: VoucherDetailType;
	trxData?: any;
	onClickApply?: (discardVoucher?: boolean) => void;
	isSubmitting?: boolean;
	isLoading?: boolean;
}

const VoucherDetailTemplate = ({
	data,
	trxData,
	onClickApply,
	isSubmitting = false,
	isLoading = false,
}: Props) => {
	const renderFooterButton = () => {
		return (
			<div className="tw-pt-3 tw-p-4 box-shadow-m tw-bg-white">
				<div className="tw-flex tw-flex-col tw-flex-1 tw-gap-[16px]">
					{isLoading ? (
						<Skeleton className="tw-w-full tw-h-12 tw-rounded-lg" />
					) : (
						<ButtonHighlight
							id={
								trxData?.voucher
									? BUTTON_ID.BUTTON_CANCEL_VOUCHER
									: BUTTON_ID.BUTTON_USE_VOUCHER
							}
							onClick={() => {
								onClickApply(trxData?.voucher != null);
							}}
							color={trxData?.voucher ? 'grey' : 'primary'}
							isDisabled={isSubmitting}
							text={
								trxData?.voucher ? BUTTON_CONST.CANCEL_VOUCHER : BUTTON_CONST.USE_VOUCHER
							}
							isLoading={isSubmitting}
							childrenClassName="tw-font-roboto tw-font-medium tw-text-sm"
							circularContainerClassName="tw-h-[16px]"
							circularClassName="circular-inner-16"
							classNameBtn="tw-py-[14px] tw-border-none"
						/>
					)}
				</div>
			</div>
		);
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.VOUCHER_DETAIL}
			title={'Detail Voucher'}
			header={true}
			footer={true}
			footerComponent={renderFooterButton()}
			additionalStyleContent={{
				overflow: 'auto',
			}}
			headClass={'tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2]'}
		>
			<div className="tw-absolute tw-w-full tw-aspect-[8/5] tw-rounded-br-ellipsebg tw-rounded-bl-ellipsebg tw-bg-primary-def tw-max-w-[500px] tw-z-0" />
			<div className="tw-w-full">
				<VoucherDetailBox data={data} isLoading={isLoading} />
			</div>
		</Wrapper>
	);
};

export default VoucherDetailTemplate;
