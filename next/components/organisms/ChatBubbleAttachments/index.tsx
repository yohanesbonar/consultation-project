/* eslint-disable @typescript-eslint/no-empty-function */
import { IconDocumentWhite, IconLink } from '@icons';
import { CHAT_CONST, handleClickUrl, navigateWithQueryParams } from 'helper';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import {
	bubbleClass,
	isFromPatient,
	renderChatInfo,
	renderItemImage,
} from 'components/atoms/ChatBubble';

type Props = {
	data?: any;
	className?: string;
	setPreviewImageData?: (data: any, index: number | string) => void;
};

const ChatBubbleAttachments = ({ data, className, setPreviewImageData }: Props) => {
	const [attachmentData, setAttachmentData] = useState<any>();

	useEffect(() => {
		if (data?.data && data?.data?.length) {
			const tempData = {
				link: data?.data?.filter((e: any) => e?.type?.toUpperCase() === CHAT_CONST.LINK),
				pdf: data?.data?.filter((e: any) => e?.type?.toUpperCase() === CHAT_CONST.PDF),
				image: data?.data?.filter((e: any) => e?.type?.toUpperCase() === CHAT_CONST.IMAGE),
			};
			setAttachmentData(tempData);
		}
	}, [data]);

	const handleOnClick = (e?: any) => {
		try {
			handleClickUrl(Router, e?.value);
		} catch (error) {
			console.log('error on handle on click : ', error);
		}
	};

	const handleClickImage = (i: number) => {
		try {
			const temp = [];
			attachmentData?.image?.forEach((element: any) => {
				temp.push({
					type: 'image',
					url: element?.value ?? element?.src,
				});
			});
			setPreviewImageData(temp, i);
		} catch (error) {
			console.log('error on click image : ', error);
		}
	};

	const renderLink = () => {
		return attachmentData?.link?.map((e: any, i: number) => (
			<div
				className="tw-mt-3 first:tw-mt-0 tw-bg-secondary-600 tw-p-2 tw-rounded tw-flex tw-gap-3 tw-items-center"
				onClick={() => handleOnClick(e)}
				key={'attachment-link-' + i}
			>
				<IconLink />
				<span className="tw-flex-1 tw-text-xs">{e?.label}</span>
			</div>
		));
	};

	const renderPdf = () => {
		return attachmentData?.pdf?.map((e: any, i: number) => (
			<div
				className="tw-mt-3 first:tw-mt-0 tw-bg-secondary-600 tw-p-2 tw-rounded tw-flex tw-gap-3 tw-items-center"
				onClick={() =>
					navigateWithQueryParams(
						'/preview-pdf',
						{
							source: e?.url ?? e?.value,
						},
						'href',
					)
				}
				key={'attachment-image-' + i}
			>
				<IconDocumentWhite />
				<span className="tw-flex-1 tw-text-xs">{e?.label}</span>
			</div>
		));
	};

	const renderWrapper = (children?: any, isMessage = false, bubbleClassName?: string) => {
		return (
			<div
				className={
					'tw-items-center tw-mb-1.5 tw-flex ' +
					(isFromPatient(data) ? 'tw-justify-end' : 'tw-justify-start')
				}
			>
				<div className={bubbleClassName ?? bubbleClass(data)}>
					{isMessage ? (
						<p className="tx-chat body-14-regular tw-mb-3">{data?.message}</p>
					) : null}
					{children}
				</div>
			</div>
		);
	};

	return (
		<div className={'tw-mb-4 ' + className}>
			{renderWrapper(
				attachmentData?.link?.length
					? renderLink()
					: attachmentData?.pdf?.length
					? renderPdf()
					: null,
				true,
			)}
			{attachmentData?.pdf?.length
				? renderWrapper(attachmentData?.pdf?.length ? renderPdf() : null)
				: null}
			{attachmentData?.image?.length
				? renderWrapper(
						<div className="tw-w-full tw-gap-0 tw-justify-end">
							{attachmentData?.image?.map((e: any, i: number) =>
								renderItemImage(
									data,
									e,
									i,
									() => handleClickImage(i),
									attachmentData?.image,
								),
							)}
						</div>,
						false,
						'card-chat tw-p-0',
				  )
				: null}
			{renderChatInfo(data)}
		</div>
	);
};

export default ChatBubbleAttachments;
