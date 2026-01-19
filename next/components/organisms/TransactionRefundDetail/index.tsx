import PaymentLabelSide from 'components/molecules/PaymentLabelSide';
import { LABEL_CONST } from 'helper';
import React from 'react';
import RefundDetailBody from '../RefundDetailBody';

interface Props {
	data?: any;
}

const TransactionRefundDetail = ({ data }: Props) => {
	return (
		<div className="tw-px-4">
			<div className="tw-bg-monochrome-100 tw-w-full tw-h-[1.5px]" />
			<div className=" tw-mt-5 tw-flex-1 tw-flex tw-flex-col tw-gap-3  ">
				<p className="tw-text-tpy-700 title-16-medium tw-mb-0">{LABEL_CONST.REFUND_DETAIL}</p>
				<RefundDetailBody data={data} />
				<div className="tw-mt-2">
					<div className="label-12-medium">Refund melalui</div>
					<PaymentLabelSide
						title={data?.payment_method?.type}
						iconUrl={data?.payment_method?.logo_url}
						iconLabel={data?.payment_method?.name}
						classNameParent="tw-mt-1"
					/>
				</div>
			</div>
		</div>
	);
};

export default TransactionRefundDetail;
