import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { ButtonHighlight } from '@atoms';
import { IconInfoWarningLarge } from '@icons';

type Props = {
	show: boolean;
	onShow: (val: boolean) => void;
	onSubmit: () => void;
};

const PopupBottomsheetConfirmRefund = ({ show, onShow, onSubmit }: Props) => {
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) onShow(false);
			}}
			footerComponent={
				<div className="tw-flex tw-gap-4 tw-pb-6 tw-px-4">
					<ButtonHighlight
						onClick={() => onShow(false)}
						classNameBtn="!tw-bg-monochrome-150 tw-text-black tw-border-none"
					>
						CEK LAGI
					</ButtonHighlight>
					<ButtonHighlight onClick={onSubmit}>YAKIN</ButtonHighlight>
				</div>
			}
		>
			<div className="tw-pt-4 px-4 tw-flex tw-flex-col tw-items-center">
				<div className="tw-pb-5">
					<IconInfoWarningLarge />
				</div>
				<p className="title-18-medium tw-mb-2">Anda Yakin Data Sudah Benar?</p>
				<p className="body-14-regular tw-mb-5">Pastikan semua data sudah benar</p>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetConfirmRefund;
