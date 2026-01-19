import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import ChatReplyItem from '../ChatReplyItem';
import { IconCloseGray, IconCopyMessage, IconReplyMessage } from '@icons';
import { CHAT_TYPE, copyValue } from 'helper';

type Props = {
	message: any;
	show: boolean;
	sender: string;
	onShow: () => void;
	onActiveReply: () => void;
	isPatient: boolean;
};

const PopupBottomsheetChatAction = ({
	message,
	show,
	onShow,
	onActiveReply,
	sender,
	isPatient,
}: Props) => {
	const isMessageText = message?.type === CHAT_TYPE.TEXT || message?.type === CHAT_TYPE.MESSAGE;
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) onShow();
			}}
			headerComponent={
				<div className="tw-mt-8 tw-flex tw-items-center tw-mx-4">
					<div onClick={onShow}>
						<IconCloseGray />
					</div>
					<p className="title-18-medium tw-text-left tw-ml-4 tw-mb-0">Pengaturan Pesan</p>
				</div>
			}
		>
			<div className="tw-m-4 tw-flex tw-flex-col tw-gap-3">
				<div className="tw-mb-2">
					<ChatReplyItem
						title={sender}
						type={message?.type}
						message={message?.message}
						isDefault
						isPatient={isPatient}
					/>
				</div>
				{isMessageText && (
					<div
						onClick={() => {
							copyValue(message?.message, 'Pesan berhasil disalin');
							onShow();
						}}
						className="tw-flex tw-items-center tw-mb-4 tw-cursor-pointer"
					>
						<IconCopyMessage />
						<p className="label-14-medium tw-ml-4 tw-mb-0">Salin Pesan</p>
					</div>
				)}

				<div
					onClick={onActiveReply}
					className="tw-flex tw-items-center tw-mb-2 tw-cursor-pointer"
				>
					<IconReplyMessage />
					<p className="label-14-medium tw-ml-4 tw-mb-0">Balas Pesan</p>
				</div>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetChatAction;
