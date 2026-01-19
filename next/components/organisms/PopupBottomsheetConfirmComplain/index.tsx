import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { ButtonHighlight } from '@atoms';
import { IconInfoWarningLarge } from '@icons';

type Props = {
	show: boolean;
	onShow: (val: boolean) => void;
	onSubmit: () => void;
	reason: string;
};

const PopupBottomsheetConfirmComplain = ({ show, onShow, onSubmit, reason }: Props) => {
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
						classNameBtn="!tw-bg-monochrome-150 !tw-text-black tw-border-none"
					>
						BATAL
					</ButtonHighlight>
					<ButtonHighlight onClick={onSubmit}>YAKIN</ButtonHighlight>
				</div>
			}
		>
			<div className="tw-pt-4 px-4 tw-flex tw-flex-col tw-items-center">
				<div className="tw-pb-5 tw-mt-3">
					<IconInfoWarningLarge />
				</div>
				<p className="title-18-medium tw-mb-2 tw-text-center">
					Anda Yakin untuk Ajukan Komplain Sekarang?
				</p>
				<p className="body-14-regular tw-text-center tw-mb-0">
					Anda akan diarahkan ke Whatsapp dan hanya bisa mengajukan komplain 1x
				</p>

				<div className="tw-flex tw-py-3 tw-px-4 tw-mt-4 tw-mb-5 tw-flex-col tw-items-center tw-gap-1 tw-self-stretch tw-rounded-lg tw-border-2 tw-border-dashed tw-border-monochrome-50 tw-bg-monochrome-100">
					<div className="font-12 tw-text-tpy-700 tw-flex tw-gap-2 tw-items-center">
						<div>Alasan</div>
					</div>
					<div className="label-14-medium">{reason}</div>
				</div>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetConfirmComplain;
