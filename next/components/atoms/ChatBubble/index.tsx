/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useRef } from 'react';
import Router from 'next/router';
import {
	IconDelivered,
	IconFile,
	IconMoreHorizontal,
	IconInfoInvalidChat,
	IconRead,
	IconSent,
} from '../../../assets';
import {
	BUTTON_ID,
	CHAT_CONST,
	CONSULTATION_TYPE,
	MESSAGE_CONST,
	convertMB,
	getFilenameUrl,
	getFormattedTimeFromDate,
	handleClickUrl,
	navigateWithQueryParams,
} from '../../../helper';
import ButtonErrorIcon from '../ButtonErrorIcon';
import { ChatBubbleAttachments, ChatReplyItem, CoachmarkResend } from '../../organisms';
import { HealthCare, Notes, Receipt } from '../../molecules';
// import ChatBubbleForm from '../ChatBubbleForm';
import ImageLoading from '../ImageLoading';
import { ChatItem } from '../../../types/Chat';
import { Element } from 'react-scroll';
import cx from 'classnames';

export interface IChatBubbleProps {
	id: number;
	orderid: string;
	className?: string;
	data: ChatItem;
	onClick?: (type?: string, params?: any) => void;
	errorOnClick?: () => void;
	onResendClick?: () => void;
	setPreviewImageData?: (data: any, index: number | string) => void;
	isShowResend?: boolean;
	prescriptionRef?: any;
	noteRef?: any;
	medicalActionRef?: any;
	scrollToType?: (value: any) => void;
	consulDetail: any;
	preview?: any;
	onClickMoreItems?: any;
	chatData?: any;
	onAnchorSetId?: any;
	activeAnchorXid?: string;
	lastMedicalAction: number;
}

export const isFromPatient = (data?: ChatItem) => {
	return data?.userType == CHAT_CONST.PATIENT;
};

export const bubbleClass = (data?: ChatItem, nonChatType = false, activeAnchorXid?: any) => {
	const isSameId = activeAnchorXid === data.xid;
	let usedClass = `card-chat ${
		data?.type == CHAT_CONST.IMAGE || data?.type == CHAT_CONST.FILE
			? 'tw-p-0 '
			: isFromPatient(data)
			? isSameId
				? 'card-chat-blue-active'
				: 'card-chat-blue'
			: isSameId
			? 'card-chat-blue90-active'
			: 'card-chat-blue90'
	} ${
		data?.type == CHAT_CONST.IMAGE || data?.type == CHAT_CONST.ATTACHMENTS ? 'tw-max-w-650' : ''
	}`;

	if (nonChatType) usedClass = 'tw-w-full';
	return usedClass;
};

export const renderChatInfo = (data?: ChatItem, nonChatType = false) => {
	return (
		!nonChatType &&
		data?.createdAt && (
			<p
				className={
					'body-12-regular tw-text-tpy-700 ' + (isFromPatient(data) ? 'tw-text-right' : '')
				}
			>
				{isFromPatient(data) ? (
					data?.status == CHAT_CONST.READ ? (
						<span className="tw-mr-1">
							<IconRead /> Dibaca
						</span>
					) : data?.status == CHAT_CONST.DELIVERED ? (
						<span className="tw-mr-1">
							<IconDelivered /> Tersampaikan
						</span>
					) : (
						<span className="tw-mr-1">
							<IconSent /> Belum Tersampaikan
						</span>
					)
				) : null}
				{getFormattedTimeFromDate(data?.updated_at ?? data?.createdAt)}
			</p>
		)
	);
};

export const getSizeImage = (data?: ChatItem, dataAttachment?: any) => {
	return (dataAttachment ?? data?.data)?.length / 3 >= 1
		? 88
		: (dataAttachment ?? data?.data)?.length / 2 >= 1
		? 110
		: 200;
};

export const renderItemImage = (
	data?: ChatItem,
	element?: any,
	index?: number,
	setPreviewImageData?: (data: any, index: number | string) => void,
	dataAttachment?: any,
) => {
	return (
		<div
			id={BUTTON_ID.BUTTON_CHAT_PREVIEW_IMAGE}
			key={'imageItem_' + index}
			className={`tw-items-center tw-cursor-pointer ${
				(dataAttachment ?? data?.data)?.length / 3 >= 1
					? 'tw-w-4/12'
					: (dataAttachment ?? data?.data)?.length / 2 >= 1
					? 'tw-w-1/2'
					: 'tw-w-full'
			} tw-float-right tw-m-0.5 tw-rounded-2xl tw-overflow-hidden tw-max-h-214 tw-max-w-214`}
			onClick={() => setPreviewImageData(dataAttachment ?? data?.data, index)}
			style={{
				height: getSizeImage(data, dataAttachment),
				width: getSizeImage(data, dataAttachment),
				position: 'relative',
			}}
		>
			<ImageLoading data={{ url: element?.value ?? element?.url }} />
		</div>
	);
};

export default function Index(props: IChatBubbleProps) {
	const ref = useRef(null);
	const {
		id,
		orderid,
		className,
		data,
		errorOnClick,
		onResendClick,
		setPreviewImageData,
		isShowResend,
		scrollToType,
		consulDetail,
		prescriptionRef = ref,
		noteRef = ref,
		preview,
		medicalActionRef = ref,
		onClickMoreItems,
		chatData,
		onAnchorSetId,
		activeAnchorXid,
		lastMedicalAction,
	} = props;
	const [nonChatType, setNonChatType] = useState(false);

	const isApproval = consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL;

	useEffect(() => {
		if (
			data?.type == CHAT_CONST.PRESCRIPTION ||
			data?.type == CHAT_CONST.NOTE ||
			data?.type == CHAT_CONST.MEDICAL_ACTION
		) {
			setNonChatType(true);
		}
	}, [data, orderid]);

	const isFromPatient = (data) => {
		return data?.userType == CHAT_CONST.PATIENT;
	};

	if (data?.type == CHAT_CONST.FILL_FORM) {
		return null;
	}

	if (!isFromPatient(data) && data?.type === CHAT_CONST.BLOCKED_LINK) {
		return null;
	}

	if (
		data?.action == CHAT_CONST.READ_RECEIPT ||
		data?.type == CHAT_CONST.READ_RECEIPT ||
		data?.type == CHAT_CONST.EXPIRED ||
		data?.action == CHAT_CONST.EXPIRED ||
		(!(
			data?.type == CHAT_CONST.FILE ||
			data?.type == CHAT_CONST.IMAGE ||
			data?.type == CHAT_CONST.PRESCRIPTION ||
			data?.type == CHAT_CONST.NOTE ||
			data?.type == CHAT_CONST.MEDICAL_ACTION ||
			data?.type == CHAT_CONST.FILL_FORM
		) &&
			(data?.message == null || data?.message == ''))
	) {
		return null;
	}

	const renderItemFile = (element, index) => {
		return (
			<div
				key={'fileItem_' + index}
				className={
					'tw-p-3 card-chat-blue  tw-rounded-2xl link-cursor ' + (index > 0 ? 'tw-mt-4' : '')
				}
			>
				<div
					id={BUTTON_ID.BUTTON_CHAT_PREVIEW_FILE}
					className="tw-flex tw-items-center"
					onClick={() => {
						navigateWithQueryParams(
							'/preview-pdf',
							{
								source: element?.url,
							},
							'href',
						);
					}}
				>
					<div className="tw-bg-white tw-rounded-2xl tw-h-18 tw-w-18 tw-items-center tw-justify-center tw-self-center">
						<IconFile className="tw-m-4" />
					</div>

					<div className="tw-flex-1 tw-ml-3">
						<p className="tx-chat body-16-regular">{getFilenameUrl(element?.filename)}</p>
						<p className="tx-chat body-14-regular tw-mt-1">{convertMB(element?.size)}</p>
					</div>
				</div>
			</div>
		);
	};

	if (data?.type == CHAT_CONST.ATTACHMENTS && data?.data) {
		return (
			<ChatBubbleAttachments
				data={data}
				className={className}
				setPreviewImageData={setPreviewImageData}
			/>
		);
	}

	const urlRegex = /(https?:\/\/\S+|www\.\S+)/g;
	const elementReplacedUrl = isFromPatient(data)
		? `<span class='marked-url-sender'>$1</span>`
		: `<span class='marked-url-reciver'>$1</span>`;
	const markedText = data?.message
		?.replace(urlRegex, elementReplacedUrl)
		.replace(/\\newLine/g, '\n');

	const renderThubmanil = () => {
		const isHaveTitle = data?.data?.meta?.title && data?.data?.meta?.title !== '';
		return (
			<div>
				{isHaveTitle && data?.data?.meta?.thumbnail ? (
					<img
						className="tw-h-38 tw-w-full tw-object-cover"
						src={data?.data?.meta?.thumbnail}
						alt="img"
					/>
				) : null}

				{isHaveTitle && (
					<div
						className={cx(
							'tw-p-2 tw-mb-4 tw-rounded',
							isFromPatient(data) ? 'tw-bg-secondary-700' : 'tw-bg-monochrome-150',
						)}
					>
						<p className="label-14-medium tw-mb-0">{data?.data?.meta?.title}</p>
						<p className="body-12-regular tw-mb-0">{data?.data?.meta?.description}</p>
					</div>
				)}
			</div>
		);
	};

	const typeMessageWillReplied =
		data?.type == CHAT_CONST.TEXT ||
		data?.type == CHAT_CONST.MESSAGE ||
		data?.type == CHAT_CONST.ATTACHMENTS ||
		data?.type == CHAT_CONST.PDF ||
		data?.type == CHAT_CONST.FILE ||
		data?.type == CHAT_CONST.LINK ||
		data?.type == CHAT_CONST.LINK_CLICKABLE ||
		data?.type == CHAT_CONST.IMAGE;

	return (
		<Element name={`${data.xid}`} className={'tw-mb-4 ' + className}>
			<div
				className={
					'tw-items-center tw-mb-1.5 ' +
					(isFromPatient(data) ? 'tw-justify-end' : 'tw-justify-start')
				}
				style={{
					display: 'flex',
					...(preview?.primaryBubbleChatColor
						? {
								['--secondary-50']: preview?.primaryBubbleChatColor,
						  }
						: {}),
					...(preview?.secondaryBubbleChatColor
						? {
								['--secondary-def']: preview?.secondaryBubbleChatColor,
						  }
						: {}),
				}}
			>
				<CoachmarkResend
					className={
						'tw-flex tw-flex-1 tw-items-center ' +
						(isFromPatient(data) ? 'justify-content-end' : 'justify-content-start')
					}
					isPopoverOpen={isShowResend}
					targetId={'popoverChat' + id}
					onResendClick={onResendClick}
				>
					{isFromPatient(data) && typeMessageWillReplied && onClickMoreItems && (
						<div onClick={onClickMoreItems} className="tw-mr-2 tw-cursor-pointer">
							<IconMoreHorizontal />
						</div>
					)}
					<div
						className={bubbleClass(data, nonChatType, activeAnchorXid)}
						style={
							preview
								? {
										backgroundColor: !isFromPatient(data)
											? preview?.primaryBubbleChatColor
											: preview?.secondaryBubbleChatColor,
										color: !isFromPatient(data)
											? preview?.primaryBubbleTextColor
											: preview?.secondaryBubbleTextColor,
								  }
								: {}
						}
					>
						{data?.replyToDetail && Object.keys(data?.replyToDetail)?.length > 0 && (
							<div className="tw-mb-2">
								<ChatReplyItem
									id={data?.replyTo}
									title={
										data?.replyToDetail?.userType === CHAT_CONST.DOCTOR
											? chatData?.doctorData?.name
											: chatData?.patientData?.name
									}
									type={data?.replyToDetail?.type}
									message={data?.replyToDetail?.message}
									isPatient={!isFromPatient(data)}
									isMe={data?.replyToDetail?.userType === CHAT_CONST.PATIENT}
									onAnchorSetId={(id: any) => {
										onAnchorSetId(id);
										setTimeout(() => {
											onAnchorSetId(null);
										}, 800);
									}}
								/>
							</div>
						)}
						{data?.type == CHAT_CONST.FILE ? (
							data?.data && data?.data?.length ? (
								<div className="tw-w-full tw-gap-0">
									{data?.data.map((e, i) => renderItemFile(e, i))}
								</div>
							) : null
						) : data?.type == CHAT_CONST.IMAGE ? (
							data?.data && data?.data?.length ? (
								<div className="tw-w-full tw-gap-0 tw-justify-end">
									{data?.data.map((e, i) =>
										renderItemImage(data, e, i, setPreviewImageData),
									)}
								</div>
							) : null
						) : data?.type == CHAT_CONST.PRESCRIPTION ? (
							<Receipt
								detailReceipt={data}
								prescriptionRef={prescriptionRef}
								scrollToType={scrollToType}
								typePrescription={consulDetail?.data?.consultationType}
								onClickMoreItems={onClickMoreItems}
							/>
						) : data?.type == CHAT_CONST.NOTE ? (
							<Notes
								className="tw-bg-white"
								noteDetail={data}
								noteRef={noteRef}
								scrollToType={scrollToType}
								onClickMoreItems={onClickMoreItems}
							/>
						) : data?.type == CHAT_CONST.MEDICAL_ACTION ? (
							<HealthCare
								id={id}
								isChat
								medicalActions={data.data}
								chatDetail={data}
								medicalActionRef={medicalActionRef}
								scrollToType={scrollToType}
								lastMedicalAction={lastMedicalAction}
							/>
						) : data?.type === CHAT_CONST.BLOCKED_LINK ? (
							<div className="tw-flex">
								<IconInfoInvalidChat />
								<p className="tw-flex-1 tx-chat body-14-regular tw-mb-0 tw-ml-2">
									{MESSAGE_CONST.INVALID_LINK}
								</p>
							</div>
						) : (
							<div>
								{data?.data?.type == CHAT_CONST.LINK_CLICKABLE ? renderThubmanil() : null}
								<div className="tx-chat body-14-regular tw-mb-0">
									<div
										dangerouslySetInnerHTML={{ __html: markedText }}
										onClick={(e: any) => {
											if (
												e.target?.classList.contains('marked-url-sender') ||
												e.target?.classList.contains('marked-url-reciver')
											) {
												handleClickUrl(Router, e.target.textContent, isApproval);
											}
										}}
									/>
								</div>
							</div>
						)}
					</div>
					{!isFromPatient(data) && typeMessageWillReplied && onClickMoreItems && (
						<div
							onClick={() => onClickMoreItems(isFromPatient(data))}
							className="tw-ml-2 tw-cursor-pointer"
						>
							<IconMoreHorizontal />
						</div>
					)}
				</CoachmarkResend>

				{isFromPatient(data) && data.status == CHAT_CONST.FAILED && (
					<ButtonErrorIcon id={BUTTON_ID.BUTTON_CHAT_ERROR} onClick={errorOnClick} />
				)}
			</div>

			{data?.type !== CHAT_CONST.BLOCKED_LINK && renderChatInfo(data, nonChatType)}

			{/* {data?.type == CHAT_CONST.IMAGE || data?.type == CHAT_CONST.FILE
        ? data?.data && data?.data?.length
            ? data?.data.map((e) => renderItem(e))
            : renderItem()
        : renderItem()} */}
		</Element>
	);
}
