import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { ButtonHighlight } from '@atoms';

type Props = {
	isOpenBottomsheet?: boolean;
	setIsOpenBottomsheet?: (val: boolean) => void;
	onConfirm: () => void;
	onDecline: () => void;
};

const PopupBottomsheetArrivedConfirmation = (props: Props) => {
	const { isOpenBottomsheet, setIsOpenBottomsheet } = props;
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={isOpenBottomsheet}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) setIsOpenBottomsheet(false);
			}}
			footerComponent={
				<div className="tw-flex tw-gap-4 tw-pb-6 tw-px-4 tw-pt-1">
					<ButtonHighlight
						classNameBtn="!tw-bg-monochrome-150 !tw-text-black tw-border-none"
						onClick={props.onDecline}
					>
						NANTI SAJA
					</ButtonHighlight>
					<ButtonHighlight onClick={props.onConfirm}>KONFIRMASI</ButtonHighlight>
				</div>
			}
		>
			<div className="tw-px-4 tw-pt-6">
				<p className="title-18-medium">Sudah Terima Pesanan Ini?</p>
				<p className="body-14-regular">
					Dengan klik pesanan diterima, maka Anda <br /> menyatakan produk sudah Anda terima
					dan tidak ada masalah pada pesanan Anda
				</p>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetArrivedConfirmation;
