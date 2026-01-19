import { TextLabelSide } from '@molecules';
import { numberToIDR, TRANSACTION_LABEL } from 'helper';
import React from 'react';

interface Props {
	data?: any;
	type?: string;
}

const RefundDetailBody = ({ data, type }: Props) => {
	return (
		<view className=" tw-flex-1 tw-flex tw-flex-col">
			<div>
				<div className="tw-flex tw-flex-col tw-gap-3">
					<TextLabelSide
						data={{
							label: TRANSACTION_LABEL.GRAND_TOTAL,
							value: numberToIDR(data?.paid_amount),
						}}
					/>
					<div className="tw-h-[1px] tw-w-full tw-border-0 tw-border-dashed tw-border-t-[1px] tw-border-monochrome-50" />
					<TextLabelSide
						data={{
							label: TRANSACTION_LABEL.TOTAL_REFUND,
							value: numberToIDR(data?.paid_amount),
						}}
						classNameLabel="tw-text-base"
						classNameValue="tw-text-base"
					/>
				</div>
			</div>
		</view>
	);
};

export default RefundDetailBody;
