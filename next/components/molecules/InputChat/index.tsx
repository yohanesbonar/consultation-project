import { ChatItem } from '@types';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
	IconAddBlue,
	IconAddDisable,
	IconCameraGray,
	IconSendOff,
	IconSendOn,
	IconSendWhite,
	IconSpinner,
} from '../../../assets';
import {
	BUTTON_ID,
	CHAT_CONST,
	createNewChat,
	FILE_TYPE,
	MESSAGE_CONST,
	showToast,
	uploadFile,
	validateSize,
	validateType,
} from '../../../helper';
import { setIsSendingChat as setIsSendingChatRedux } from '../../../redux/trigger';
import { ButtonHighlight, PopupAlert } from '../../atoms';
import { Coachmark, FilePicker } from '../../organisms';
import cx from 'classnames';
import DOMPurify from 'dompurify';
import classNames from 'classnames';

interface Props {
	triggerFocusChat: number;
	value: string;
	onFocus?: () => void;
	onBlur?: () => void;
	onChange: (val: string) => void;
	onChangeFileInput: (val?: any) => void;
	onCancel?: () => void;
	handleSendChat: (
		type: string,
		data?: {
			chatTemp?: any;
			chat?: ChatItem;
			type?: string;
		},
	) => void;
	setTempFile: (val?: boolean) => void;
	coachmarkAddButtonData?: {
		title?: string;
		desc?: string;
		isShow?: boolean;
		onPressPrev?: () => void;
		onPressNext?: () => void;
		dotLength?: number;
		dotActivePosition?: number;
	};
	disabled?: boolean;
	fileTemp?: any;
	general?: {
		isSendingChat?: boolean;
		timeLeft?: number;
	};
}

const InputChat = ({
	triggerFocusChat = 0,
	value,
	onChange,
	onChangeFileInput,
	handleSendChat,
	setTempFile,
	coachmarkAddButtonData,
	disabled = false,
	fileTemp = null,
	general,
	onFocus,
	onBlur,
}: Props) => {
	const [isOpenBottomsheetAdd, setIsOpenBottomsheetAdd] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>('');
	const inputAreaRef: any = useRef(null);

	useEffect(() => {
		// console.log('general state changed');
	}, [general]);

	useEffect(() => {
		if (triggerFocusChat > 0) {
			setTimeout(() => {
				inputAreaRef.current.focus();
			}, 500);
		}
	}, [triggerFocusChat]);

	const createChat = async (type?: string, message?: string, data?: any) => {
		if (type == CHAT_CONST.FILE) {
			setIsSendingChatRedux(true);
			try {
				const res = await uploadFile(data?.fileTemp?.files);
				console.log('res upload - ', res, res?.meta?.message);
				if (res?.meta?.acknowledge) {
					createNewChat(
						type,
						message,
						{
							uploadedFiles: res.data,
						},
						handleSendChat,
					);
				} else {
					setIsSendingChatRedux(false);

					setAlertMessage(
						res?.meta?.message ?? res?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					);
				}
			} catch (error) {
				setIsSendingChatRedux(false);
				console.log('error on upload file : ', error);
			}
		} else {
			setIsSendingChatRedux(false);
			createNewChat(type, message, null, handleSendChat);
		}
	};

	useEffect(() => {
		if (!fileTemp) checkHeight();
		// console.log('general', general.isSendingChat);
	}, [value, fileTemp, general]);

	const checkHeight = () => {
		const inputTextArea = inputAreaRef.current;
		inputAreaRef.current.style.height = '24px';
		inputAreaRef.current.style.height = value
			? inputTextArea.scrollHeight + 'px'
			: fileTemp
			? '80px'
			: '57px';
	};

	const onClickAdd = () => {
		if (disabled || general?.isSendingChat) {
			return;
		}
		setTempFile(true);
		setIsOpenBottomsheetAdd(true);
	};

	const onHandleSend = () => {
		const sanitizedValue = DOMPurify.sanitize(value);

		if ((sanitizedValue?.trim() || fileTemp) && !general?.isSendingChat) {
			createChat(fileTemp ? CHAT_CONST.FILE : CHAT_CONST.MESSAGE, sanitizedValue?.trim(), {
				fileTemp: fileTemp,
			});
		}
	};

	const handleChangeCamera = (event: any, type: string) => {
		const files = [...event.target.files];
		const fileType = type === FILE_TYPE.CAMERA ? 'foto' : 'file';

		if (files.length > 10) {
			setAlertMessage('Batas pilihan maksimum ' + 10 + ' ' + 'foto' + '.');
			return;
		}

		const resTypeValidation = validateType(files, fileType);
		if (!resTypeValidation.isValid) {
			setAlertMessage(resTypeValidation?.message);
			return;
		}

		const resValidation = validateSize(files);
		if (resValidation.isValid) {
			onChangeFileInput({
				type: fileType,
				files,
				fileType: type === FILE_TYPE.CAMERA ? FILE_TYPE.CAMERA : FILE_TYPE.DOCS,
			});
			if (type === FILE_TYPE.CAMERA) {
				showToast('Ukuran gambar disesuaikan otomatis.', { marginBottom: 80 }, 'success');
			}
		} else {
			setAlertMessage(resValidation?.message);
		}
	};

	return (
		<div className="tw-flex tw-flex-1 tw-items-center tw-bg-white">
			{fileTemp ? (
				<div className="tw-flex tw-items-center tw-w-full">
					{fileTemp?.fileType === FILE_TYPE.GALLERY ? (
						<p className="label-14-medium tw-w-[163px]">
							{fileTemp?.files?.length} gambar terpilih
						</p>
					) : (
						<ButtonHighlight
							classNameBtn="tw-mr-[10px] tw-flex tw-items-center tw-justify-center"
							text={
								<label htmlFor="button-chat-camera-picker" className="tw-whitespace-nowrap">
									{fileTemp?.fileType === FILE_TYPE.DOCS ? 'PILIH ULANG' : 'AMBIL ULANG'}
									{fileTemp?.fileType === FILE_TYPE.CAMERA ? (
										<input
											className="tw-hidden"
											id="button-chat-camera-picker"
											type="file"
											capture="environment"
											accept="image/jpeg, image/png'"
											onChange={(e) => handleChangeCamera(e, FILE_TYPE.CAMERA)}
										/>
									) : (
										<input
											className="tw-hidden"
											id="button-chat-camera-picker"
											type="file"
											accept={
												fileTemp?.fileType === FILE_TYPE.DOCS
													? 'application/pdf,.pdf'
													: 'image/jpeg, image/png'
											}
											onChange={(e) => handleChangeCamera(e, FILE_TYPE.DOCS)}
										/>
									)}
								</label>
							}
							color="grey"
							prefixIcon={
								fileTemp?.fileType === FILE_TYPE.CAMERA ? (
									<div className="tw-mr-4">
										<IconCameraGray />
									</div>
								) : (
									''
								)
							}
						/>
					)}
					<ButtonHighlight
						onClick={onHandleSend}
						id={BUTTON_ID.BUTTON_SEND}
						classNameBtn="tw-flex tw-items-center tw-justify-center"
						prefixIcon={
							<div className="tw-mr-4">
								<IconSendWhite />
							</div>
						}
						text="KIRIM"
						color="primary"
						isLoading={general?.isSendingChat}
					/>
				</div>
			) : (
				<>
					<div
						className={cx(
							'input-group',
							coachmarkAddButtonData?.isShow && general?.timeLeft > 0
								? ''
								: 'tw-overflow-clip',
						)}
					>
						<textarea
							ref={inputAreaRef}
							id={'InputArea ' + BUTTON_ID.INPUT_CHAT}
							name="InputArea"
							value={value}
							className="body-16-regular input-chat"
							placeholder="Berikan pesan disini…"
							onChange={(e) => onChange(e.target.value)}
							maxLength={2200}
							disabled={disabled || general?.isSendingChat}
							onKeyUp={checkHeight}
							onKeyDown={(event) => {
								console.log('@event', event.key, event);
								if (event.key == 'Enter' && !event.shiftKey) {
									event.preventDefault();
									onHandleSend();
								}
							}}
							onFocus={onFocus}
							onBlur={onBlur}
						/>
						<Coachmark
							className="tw-flex flex-0" // flex-0 was declarate in global.css
							title={coachmarkAddButtonData?.title ?? ''}
							desc={coachmarkAddButtonData?.desc ?? ''}
							dotActivePosition={coachmarkAddButtonData?.dotActivePosition ?? 1}
							dotLength={coachmarkAddButtonData?.dotLength ?? 1}
							onClickPrev={coachmarkAddButtonData?.onPressPrev}
							onClickNext={coachmarkAddButtonData?.onPressNext}
							isPopoverOpen={coachmarkAddButtonData?.isShow && general?.timeLeft > 0}
							targetId="popoverAddButton"
							classNameContainer="tw-flex flex-0"
							idNext={BUTTON_ID.BUTTON_COACHMARK_DONE_ADD_FILE}
							idPrev={BUTTON_ID.BUTTON_COACHMARK_PREV_ADD_FILE}
						>
							<div
								id={BUTTON_ID.BUTTON_ADD_FILE}
								className={classNames(
									'tw-cursor-pointer tw-bg-monochrome-150 tw-p-4 tw-border-none tw-ml-0 tw-rounded-lg',
									disabled || general?.isSendingChat ? '' : 'secondary-ic-first',
								)}
								onClick={onClickAdd}
							>
								{disabled || general?.isSendingChat ? (
									<IconAddDisable className="tw-self-end" />
								) : (
									<IconAddBlue className="tw-self-end" />
								)}
							</div>
						</Coachmark>
					</div>
					<div
						id={BUTTON_ID.BUTTON_SEND}
						className={
							'tw-rounded-half tw-w-14 tw-h-14 tw-self-end tw-text-secondary-def ' +
							(value?.trim() || fileTemp ? 'btn-hover' : '') +
							(general?.isSendingChat ? ' tw-p-2.5' : ' tw-p-4')
						}
						onClick={onHandleSend}
					>
						{general?.isSendingChat ? (
							<div className="tw-animate-spin">
								<IconSpinner />
							</div>
						) : value?.trim() || fileTemp ? (
							<IconSendOn />
						) : (
							<IconSendOff />
						)}
					</div>
					<FilePicker
						isSwipeableOpen={isOpenBottomsheetAdd}
						setIsSwipeableOpen={(isOpen) => {
							setIsOpenBottomsheetAdd(isOpen);
							if (!isOpen) {
								setTempFile(false);
							}
						}}
						onChange={(type?: string, val?: any, fileType?: string) => {
							setIsOpenBottomsheetAdd(false);
							onChangeFileInput({ type: type, files: val, fileType });
						}}
					/>
					<PopupAlert
						alertMessage={alertMessage}
						setAlertMessage={(msg) => setAlertMessage(msg)}
					/>
				</>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(InputChat);
