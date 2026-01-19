import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { ButtonHighlight, InputRadio } from '@atoms';

type Props = {
	show: boolean;
	onShow: (val: boolean) => void;
	data?: any;
	onSetPaymentMethod?: (item: any) => void;
};

const PopupBottomsheetPaymentRefund = ({ show, onShow, data, onSetPaymentMethod }: Props) => {
	const [selected, setSelected] = React.useState<any>(null);

	const onSelectPayment = () => {
		onSetPaymentMethod(selected);
		onShow(false);
	};
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) onShow(false);
			}}
			headerComponent={
				<div className="tw-mt-[36px] tw-mx-4">
					<p className="title-18-medium tw-mb-0 tw-text-left">Pilih Metode Pengembalian</p>
				</div>
			}
		>
			{data?.map((item: any) => {
				return (
					<div className="tw-px-4" key={item.payment_group_id}>
						<p className="tw-mb-0 label-14-medium tw-text-tpy-700 tw-my-4">
							{item.payment_group_name}
						</p>

						{item?.payment_methods?.map((pay: any) => {
							return (
								<div
									key={pay.payment_method_id}
									className="tw-flex tw-justify-between tw-items-center tw-my-4"
								>
									<div className="tw-flex tw-items-center">
										<img
											className="tw-w-9 tw-h-9 tw-rounded-full tw-mr-4"
											src={pay?.logo_url}
										/>
										<label className="body-16-regular tw-mb-0">
											{pay?.payment_method_name}
										</label>
									</div>

									<InputRadio
										value={JSON.stringify(pay)}
										onChange={(e) => setSelected(JSON.parse(e.target.value))}
									/>
								</div>
							);
						})}
					</div>
				);
			})}
			<div className="tw-px-4 tw-mb-6">
				<ButtonHighlight onClick={onSelectPayment}>SIMPAN</ButtonHighlight>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetPaymentRefund;
