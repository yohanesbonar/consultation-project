/* eslint-disable react/no-unknown-property */
// need to check eslint
import React, { useEffect, useRef, useState } from 'react';
import { ImgFileBlue, ImgFileGray } from '../../../assets/images';
import { BUTTON_ID, FILE_CONST, FILE_TYPE, addLog, getUrls } from '../../../helper';
import { Document, pdfjs, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ImageLoading } from '../../atoms';
import { dataGallery, FileData } from '../../../types';
import { capitalize } from 'lodash';
import { IconCloseWhite, IconDeleteCircle, IconPlusGray } from '@icons';
import classNames from 'classnames';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
	data?: dataGallery;
	idThumbnailPrefix?: string;
	onClose?: () => void;
	onAddItem?: (e: any) => void;
	onDeletePerItem?: (idx: any) => void;
}

const Gallery = ({ data, idThumbnailPrefix = '', onClose, onDeletePerItem, onAddItem }: Props) => {
	const [files, setFiles] = useState<FileData[]>();
	const [activeFileIndex, setActiveFileIndex] = useState<number>(data?.activeIndex ?? 0);
	const [activeFile, setActiveFile] = useState<string>(null);
	const [tempImgSmallPreview, setTempImgSmallPreview] = useState([]);
	const [imageSize, setImageSize] = useState<any>(null);

	const thumbnailRef: any = useRef(null);

	useEffect(() => {
		setActiveFileIndex(data?.activeIndex ?? 0);
		if (data && data?.files?.length) {
			setFiles(data?.files);
			if (data?.type != FILE_CONST.UPLOADED_PHOTO) {
				getAllUrls();
			}
		}

		try {
			setTimeout(
				() =>
					thumbnailRef?.current?.scrollIntoView({
						behavior: 'smooth',
					}),
				5,
			);
		} catch (error) {
			console.log('error on scroll to thumbnail desired : ', error);
		}
	}, [data]);

	useEffect(() => {
		if (files != null) {
			setActiveFile(null);

			getFile();
		}
	}, [activeFileIndex, files]);

	const getAllUrls = () => {
		try {
			const temp = [];
			data?.files?.forEach((element) => {
				temp.push(getUrls(element));
			});
			setTempImgSmallPreview(temp);
		} catch (error) {
			addLog({ errorGetAllUrls: error });
			console.log('error on get all urls : ', error);
		}
	};

	const getFile = async () => {
		const fileStr =
			data?.type == FILE_CONST.UPLOADED_PHOTO
				? files[activeFileIndex]?.url
				: data?.type == FILE_CONST.PHOTO
				? getUrls(files[activeFileIndex])
				: getUrls(files[activeFileIndex]);
		console.log('file--', fileStr);
		setActiveFile(fileStr);
	};

	const setLayoutSize = (type: string, value: string) => {
		const myImg = document.getElementById('img' + activeFileIndex);
		myImg.style[type] = value;
		myImg.style['max' + capitalize(type)] = value;
	};

	const isPreview = data?.type == FILE_CONST.PHOTO || data?.type == FILE_CONST.UPLOADED_PHOTO;

	return (
		<div className="tw-relative">
			<div
				onClick={onClose}
				className="tw-w-full tw-bg-black tw-h-14 tw-flex tw-justify-start tw-pt-3 tw-pl-3 tw-absolute tw-top-0 tw-z-10"
			>
				<IconCloseWhite />
			</div>
			<div className="tw-h-full tw-bg-black tw-flex tw-flex-1 tw-flex-col tw-items-center tw-overflow-hidden">
				{activeFile ? (
					isPreview ? (
						<ImageLoading
							className="!tw-object-contain tw-h-4/5"
							data={{ url: activeFile }}
							idImage={'img' + activeFileIndex}
							layout={'raw'}
							classNameContainer={classNames(
								'tw-overflow-auto tw-flex tw-items-center',
								data?.fileType === FILE_TYPE.GALLERY ? '!tw-h-[70vh]' : '!tw-h-[100vh]',
							)}
						/>
					) : (
						<div id="pdf-viewer-container">
							<Document
								className="custom-pdf-container"
								file={activeFile}
								onLoadError={() => {
									console.log('error');
								}}
								onLoadProgress={() => {
									console.log('progress');
								}}
							>
								<Page
									pageNumber={1}
									renderTextLayer={false}
									renderAnnotationLayer={false}
								/>
							</Document>
						</div>
					)
				) : null}

				{data?.fileType == FILE_TYPE.GALLERY && (
					<div className="tw-bg-black tw-mb-24">
						<div className="tw-flex tw-flex-1 tw-max-w-[350px] scroll-container tw-pt-4 tw-px-4">
							<div className="tw-mx-1.5 tw-rounded-[8px] tw-bg-[#989898]">
								<label
									htmlFor="button-chat-gallery-picker"
									className="tw-w-[80px] tw-h-[80px] tw-flex tw-items-center tw-justify-center"
								>
									<IconPlusGray />
									<input
										className="tw-hidden"
										id="button-chat-gallery-picker"
										type="file"
										accept="image/jpeg, image/png"
										onChange={(e) => onAddItem(e)}
										multiple
									/>
								</label>
							</div>
							{data?.type == FILE_CONST.PHOTO || data?.type == FILE_CONST.UPLOADED_PHOTO
								? (data?.type == FILE_CONST.UPLOADED_PHOTO
										? files
										: tempImgSmallPreview
								  )?.map((element, index) => (
										<div className="tw-relative tw-mx-1.5" key={'_filesGallery' + index}>
											<div
												onClick={() => onDeletePerItem(index)}
												className="tw-absolute -tw-top-3 -tw-right-3 tw-z-10"
											>
												<IconDeleteCircle />
											</div>
											<div
												id={idThumbnailPrefix + BUTTON_ID.IMAGE_THUMBNAIL}
												ref={index == data?.activeIndex ? thumbnailRef : null}
												className={
													'tw-rounded-[8px] tw-w-[80px] tw-h-[80px] tw-items-center tw-justify-center ' +
													(index == activeFileIndex
														? 'tw-border-2 tw-border-white tw-border-solid'
														: '')
												}
												onClick={() => {
													if (imageSize?.originalWidth && imageSize?.originalHeight) {
														setLayoutSize('width', imageSize?.originalWidth + 'px');
														setLayoutSize('height', imageSize?.originalHeight + 'px');
														setImageSize(null);
													}
													setActiveFileIndex(index);
												}}
												style={{ flexShrink: 0 }}
											>
												<ImageLoading
													data={{
														url:
															data?.type == FILE_CONST.UPLOADED_PHOTO
																? element?.url
																: element,
													}}
												/>
											</div>
										</div>
								  ))
								: files.map((e, index) => (
										<div
											key={'_filesGallery' + index}
											id={idThumbnailPrefix + BUTTON_ID.FILE_THUMBNAIL}
											className={
												'tw-mx-1.5 tw-rounded-[8px] tw-w-[80px] tw-h-[80px] tw-items-center tw-justify-center tw-flex tw-bg-white ' +
												(index == activeFileIndex
													? 'tw-border-2 tw-border-primary-def tw-border-solid'
													: '')
											}
										>
											<img
												className="img-40"
												src={
													index == activeFileIndex ? ImgFileBlue.src : ImgFileGray.src
												}
												key={'_imagesGallery' + index}
												onClick={() => setActiveFileIndex(index)}
											/>
										</div>
								  ))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Gallery;
