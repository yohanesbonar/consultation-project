// TODO: fix these lints
/* eslint-disable react/prop-types */
import * as React from 'react';
import {
	IconFileSM,
	IconFileSMWhite,
	IconThumbAttachmentDark,
	IconThumbAttachmentLight,
	IconThumbImgDark,
	IconThumbImgLight,
} from '@icons';
import { CHAT_CONST, CHAT_TYPE } from 'helper';
import cx from 'classnames';
import style from './index.module.css';
import Scroll from 'react-scroll';

export interface IChatReplyItemProps {
	isDefault?: boolean;
	isPatient?: boolean;
	isMe?: boolean;
	type: string;
	title: string;
	message?: string;
	id?: string | number;
	onAnchorSetId?: any;
}

export default function ChatReplyItem(props: IChatReplyItemProps) {
	const { isPatient, type, title, message, id, onAnchorSetId, isDefault, isMe } = props;
	const scroller = Scroll.scroller;

	const onAnchor = () => {
		onAnchorSetId(id);
		scroller.scrollTo(`${id}`, {
			duration: 500,
			smooth: true,
			containerId: 'content',
			offset: -500,
			spy: true,
		});
	};
	return (
		<div
			onClick={onAnchor}
			className={cx(
				style.container,
				isDefault
					? isPatient
						? style.defaultPatient
						: style.defaultDoctor
					: isPatient
					? style.patientTheme
					: isMe
					? style.doctorThemeMe
					: style.doctorTheme,
			)}
		>
			<p className={cx(isMe ? 'tw-text-primary-300' : '', 'label-12-medium tw-mb-0 tw-pl-3')}>
				{title}
			</p>
			<Subtitle type={type} message={message} isDefault={isDefault} isMe={isMe} />
		</div>
	);
}

const Subtitle = ({ type, message, isDefault, isMe }) => {
	const chatTypeMessage = type !== CHAT_TYPE.TEXT && type !== CHAT_TYPE.MESSAGE;

	// message condition
	const renderMessage = () => {
		let _message = '';
		switch (type) {
			case CHAT_TYPE.TEXT:
				_message = message;
				break;
			case CHAT_TYPE.PRESCRIPTION:
				_message = 'Resep Elektronik';
				break;
			case CHAT_TYPE.NOTE:
				_message = 'Catatan Pasien';
				break;
			case CHAT_TYPE.MEDICAL_RECORD:
				_message = 'Saran Tindakan Medis';
				break;
			case CHAT_TYPE.IMAGE:
				_message = 'Gambar';
				break;
			case CHAT_TYPE.FILE:
				_message = 'File';
				break;
			case CHAT_CONST.PDF:
				_message = 'PDF';
				break;
			case CHAT_CONST.LINK:
				_message = 'Tautan';
				break;
			case CHAT_CONST.LINK_CLICKABLE:
				_message = 'Tautan';
				break;
			default:
				_message = message;
				break;
		}
		return _message;
	};

	// icon condition
	const renderIcon = () => {
		let _icon = null;
		switch (type) {
			case CHAT_TYPE.PRESCRIPTION:
				_icon = <IconFileSM />;
				break;
			case CHAT_TYPE.NOTE:
				_icon = <IconFileSM />;
				break;
			case CHAT_TYPE.MEDICAL_RECORD:
				_icon = <IconFileSM />;
				break;
			case CHAT_TYPE.IMAGE:
				if (isDefault) _icon = <IconThumbImgDark />;
				else _icon = <IconThumbImgLight />;
				break;
			case CHAT_TYPE.FILE:
				if (isMe) _icon = <IconFileSMWhite />;
				else _icon = <IconFileSM />;
				break;
			case CHAT_CONST.PDF:
				if (isMe) _icon = <IconFileSMWhite />;
				_icon = <IconFileSM />;
				break;
			case CHAT_CONST.LINK:
				if (isDefault) _icon = <IconThumbAttachmentDark />;
				else _icon = <IconThumbAttachmentLight />;
				break;
			case CHAT_CONST.LINK_CLICKABLE:
				if (isDefault) _icon = <IconThumbAttachmentDark />;
				else _icon = <IconThumbAttachmentLight />;
				break;
			default:
				_icon = message;
				break;
		}
		return _icon;
	};

	return (
		<div className="tw-flex tw-items-center">
			{chatTypeMessage && <div className="tw-pl-3 tw-mr-1">{renderIcon()}</div>}
			<p
				className={cx(
					'body-12-regular tw-mb-0 tw-mt-0.5 two-line-elipsis',
					!chatTypeMessage ? 'tw-pl-3' : '',
				)}
			>
				{renderMessage()}
			</p>
		</div>
	);
};
