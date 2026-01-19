import React, { useState } from 'react';

import { LABEL_CONST, TRANSACTION_LABEL } from '../../../helper';
import { PaymentDetailBody, PopupBottomsheetInfo } from '@organisms';
interface Props {
	data?: any;
}

const TransactionPaymentDetail = ({ data }: Props) => {
	const [isOpenInfoBottomsheet, setIsOpenInfoBottomsheet] = useState<boolean>(false);

	return (
		<view className="tw-px-4 tw-mt-5 tw-flex-1 tw-flex tw-flex-col tw-gap-4  ">
			<p className="tw-text-tpy-700 title-16-medium tw-mb-0">{LABEL_CONST.PAYMENT_DETAIL}</p>
			<PaymentDetailBody
				data={data}
				setIsOpenInfoBottomsheet={(isOpen) => setIsOpenInfoBottomsheet(isOpen)}
			/>
			<PopupBottomsheetInfo
				data={{
					title: TRANSACTION_LABEL.OTHER_FEE,
					body: (
						<div className="tw-px-4">
							<PaymentDetailBody
								data={data}
								type={TRANSACTION_LABEL.OTHER_FEE}
								setIsOpenInfoBottomsheet={(isOpen) => setIsOpenInfoBottomsheet(isOpen)}
							/>
						</div>
					),
				}}
				type="info"
				isOpenBottomsheet={isOpenInfoBottomsheet}
				setIsOpenBottomsheet={(isOpen?: boolean) => setIsOpenInfoBottomsheet(isOpen)}
			/>
		</view>
	);
};

export default TransactionPaymentDetail;
