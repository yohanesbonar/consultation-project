import React from 'react';
import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { MdError } from 'react-icons/md';

type Props = {
	data: {
		title: string;
		desc: string;
		cancelButtonText: string;
		okButtonText: string;
		cancelButtonId: string;
		okButtonId: string;
		descComponent?: React.ReactNode;
	};
	callback: (param: string) => void;
	isDisabled?: boolean;
	isLoading?: boolean;
};

const PopupBottomsheetConfirmation = ({
	data,
	callback,
	isDisabled = false,
	isLoading = false,
}: Props) => {
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={data != null}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) callback(CALLBACK_CONST_POPUPBOTTOMSHEET.CALLBACK_CLOSE);
			}}
			footerComponent={
				<div className="tw-p-4 tw-flex tw-flex-row tw-gap-2">
					<ButtonHighlight
						id={data?.cancelButtonId}
						color="grey"
						onClick={() => {
							callback(CALLBACK_CONST_POPUPBOTTOMSHEET.CALLBACK_CANCEL);
						}}
						text={data?.cancelButtonText}
						isDisabled={isDisabled}
					/>
					<ButtonHighlight
						id={data?.okButtonId}
						onClick={() => {
							callback(CALLBACK_CONST_POPUPBOTTOMSHEET.CALLBACK_OK);
						}}
						text={data?.okButtonText}
						isDisabled={isDisabled}
						isLoading={isLoading}
					/>
				</div>
			}
		>
			<div className="tw-mb-4 tw-mx-4 tw-mt-9 tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center tw-text-center">
				<div>
					<MdError size={100} color={'#FFB300'} />
					<p className="title-18-medium tw-mt-5">{data?.title}</p>
					<div className="label-14-medium tw-mt-2 tw-px-1">
						<span className="tw-font-normal">{data?.desc}</span>
					</div>
				</div>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetConfirmation;

export const CALLBACK_CONST_POPUPBOTTOMSHEET = {
	CALLBACK_OK: 'CALLBACK_OK',
	CALLBACK_CANCEL: 'CALLBACK_CANCEL',
	CALLBACK_CLOSE: 'CALLBACK_CLOSE',
};
