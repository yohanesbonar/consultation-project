'use client';
/* eslint-disable react/no-unknown-property */
// TODO: fix these lints
/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Router, { useRouter } from 'next/router';
import {
	Coachmark,
	Wrapper,
	PopupBottomsheetDetailChat,
	Gallery,
	PopupBottomsheetEndConsultation,
	SkeletonSummary,
	SkeletonChat,
	SkeletonInputChat,
	PopupBottomsheetConsultationInfo,
	InitialReceipt,
	PopupBottomSheetFormConsultation,
	PopupBottomsheetChatAction,
	ChatReplyItem,
} from '../../organisms';
import { ChatBubble, ButtonHighlight, PopupAlert } from '../../atoms';
import {
	CountdownTimerBar,
	InputChat,
	ExpiredChat,
	PreviewImage,
	CustomPopup,
} from '../../molecules';

import {
	getLocalStorage,
	LOCALSTORAGE,
	PhoenixClient,
	CHAT_CONST,
	CALLBACK_CONST,
	createNewChat,
	GENERAL_CONST,
	PAGE_ID,
	BUTTON_ID,
	removeLocalStorage,
	FILE_CONST,
	STATUS_CONSULTATION,
	CONSULTATION_TYPE,
	LABEL_CONST,
	CHAT_ACTION,
	CHAT_TYPE,
	showToast,
	validateLink,
	encryptData,
	getCurrentTimeByTimeGap,
	getFormattedTimeFromDate,
	BUTTON_CONST,
	ORDER_TYPE,
	navigateWithQueryParams,
	setLocalStorage,
	checkIsEmpty,
	extractLastMedicalActionIndex,
	addLog,
	backHandling,
	PARTNER_CONST,
} from '../../../helper';
import {
	IconChevronRightBlue,
	IconCloseGray,
	IconConsulTimeout,
	IconFormConsultation,
	IconInfo,
	IconInfoWarningLarge,
	IconPrescPopup,
	IconScrollDown,
} from '../../../assets/icons';
import { setIsOpenOfflineBottomsheet as setIsOpenOfflineBottomsheetRedux } from '../../../redux/trigger';
import { connect, useSelector } from 'react-redux';
import { patientDetail, consulDetailData } from '../../../redux/actions';
import { ChatDetailResponse, ChatItem, DataChatDetail, Prescription } from '@types';
import { LottieProcess } from '@lotties';
import { PopupBottomsheetRating } from '@organisms';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';
import Lottie from 'lottie-react';
import cx from 'classnames';
import useAlertNavigation from 'hooks/useAlertNavigation';
import Image from 'next/image';
import { ChatBackground } from '@images';

interface Props {
	isHistory?: boolean;
	general: {
		isPageLoading: boolean;
		formProgress: any;
		endConsultation: {
			result: any;
			loading: boolean;
			error: boolean;
			meta: { acknowledge: boolean };
		};
		networkState: {
			isOnline: boolean;
			isNeedToReconnect: boolean;
			isDetected: boolean;
		};
		errorAlert: {
			danger: boolean;
			data: any;
		};
		showEndConsultation: boolean;
		isOpenOfflineBottomsheet?: boolean;
	};
	chatData?: DataChatDetail;
	consulDetail?: ChatDetailResponse;
	chats?: ChatItem[];
	timeLeft?: number;
	setTimeLeft?: (val: number) => void;
	coachmarkIndex?: number;
	onHandleChangeCoachmark?: (val: number) => void;
	handleOnScroll?: (e: any) => void;
	isRedeemType?: boolean;
	unreadMsg?: number;
	isGettingDataRef?: any;
	initData?: (val: boolean) => void;
	sendNewChat?: (chatTemp: any, chat: ChatItem) => void;
	sendNewChatWithSocket?: (chatTemp: any, chat: ChatItem, isIndicator?: boolean) => void;
	handleNewMessage?: (newChat: ChatItem) => void;
	pushMessageById?: string | number;
	setPushMessageById?: (val?: string | number) => void;
	chatErrorCallback?: (id?: number | string) => void;
	resendChat?: (element: ChatItem) => void;
	sendAlreadyFillFormMessage?: (messages?: ChatItem[]) => void;
	triggerScrollDown?: number;
	addParentHeaderClassname?: string;
	prescriptionData?: Prescription[];
	optionalShowEndConsultation?: boolean;
	onForceEndConsultaiton?: () => void;
	indicator?: string;
	preview?: any;
	whitelistLink?: string[];
	patientData?: any;
	isPreview?: boolean;
	refreshData?: () => void;
}

const ChatTemplate = ({
	isHistory = false,
	general,
	chatData,
	consulDetail,
	chats,
	timeLeft,
	setTimeLeft,
	coachmarkIndex,
	onHandleChangeCoachmark,
	handleOnScroll,
	isRedeemType,
	unreadMsg,
	isGettingDataRef,
	initData,
	sendNewChat,
	sendNewChatWithSocket,
	handleNewMessage,
	pushMessageById,
	setPushMessageById,
	chatErrorCallback,
	resendChat,
	sendAlreadyFillFormMessage,
	triggerScrollDown = 0,
	addParentHeaderClassname,
	prescriptionData = null,
	optionalShowEndConsultation = false,
	onForceEndConsultaiton,
	indicator,
	preview,
	whitelistLink = [],
	patientData,
	isPreview,
	refreshData,
}: Props) => {
	const router = useRouter();
	const theme = useSelector(({ general }) => general?.theme);

	const [isOpenBottomsheetDetail, setIsOpenBottomsheetDetail] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [isShowCoachmarkResend, setIsCoachmarkResend] = useState<string | number>(null);
	const [popupFormConsultation, setPopupFormConsultation] = useState<boolean>(false);
	const [popupFormConsultationCount, setPopupFormConsultationCount] = useState<number>(0);
	const [previewImageData, setPreviewImageData] = useState<any>(false);
	const [isOpenInfoBottomsheet, setIsOpenInfoBottomsheet] = useState<boolean>(false);
	const [triggerFocusChat, setTriggerFocusChat] = useState<number>(0);
	const [fileTemp, setFileTemp] = useState<any>();
	const [inputValue, setInputValue] = useState<string>('');
	const [prescriptionStatus, setPrescriptionStatus] = useState<null | string>(null);
	const [patientIndicator, setPatientIndicator] = useState<any>();
	const [isShowPrescNotePopup, setIsShowPrescNotePopup] = useState(false);
	const [hidePrescNotePopup, setHidePrescNotePopup] = useState(false);
	const [isShowPopupEndConsul, setIsShowPopupEndConsul] = useState(false);
	const [isShowRate, setIsShowRate] = React.useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	const toggleRate = () => setIsShowRate(!isShowRate);

	const [isShowMessageAction, setIsShowMessageAction] = useState(false);
	const [isActiveReply, setIsActiveReply] = useState(false);
	const [messagePerItem, setMessagePerItem] = useState<any>({});
	const [messageSelected, setMessageSelected] = useState<any>({});
	const [activeAnchorXid, setActiveAnchorXid] = useState('');
	const [shoBackPopup, setShoBackPopup] = React.useState(false);
	const [isErrorLoadAssets, setIsErrorLoadAssets] = useState({
		logo: false,
	});

	//ref
	const bottomContentRef: any = useRef(null);
	const tempFile: any = useRef(null);
	const prescriptionRef: any = useRef(null);
	const noteRef: any = useRef(null);
	const medicalActionRef: any = useRef(null);

	//query
	const consulEndHistory = router.query?.end ? router.query?.end == '1' : null;
	const endConsulFlag = general?.showEndConsultation || optionalShowEndConsultation;
	const isExpiredOrCompleted = useMemo(
		() =>
			(consulDetail?.data?.status == GENERAL_CONST.EXPIRED ||
				consulDetail?.data?.status == STATUS_CONSULTATION.COMPLETED ||
				consulDetail?.data?.status == GENERAL_CONST.CLOSED) &&
			!isHistory,
		[consulDetail?.data?.status],
	);

	useAlertNavigation(() => {
		if (consulDetail?.data?.consultationPartner?.toUpperCase().includes(PARTNER_CONST.SHOPEE)) {
			return;
		}
		if (consulDetail?.data?.status === STATUS_CONSULTATION.STARTED) {
			addLog({ consultation_log: 'CONSULTATION_IS_IN_PROGRESS' });
			setShoBackPopup(true);
		} else {
			addLog({ consultation_log: 'CONSULTATION_IS_DONE_OR_EXPIRED' });
			window.location.href = consulDetail?.data?.backUrl;
		}
	}, consulDetail);

	// TODO : jadi loop di historynya
	// useEffect(() => {
	// 	setInterval(function () {
	// 		history.pushState(null, '', location.href);
	// 	}, 1000);
	// }, []);

	useEffect(() => {
		if (
			(consulDetail?.data?.status == STATUS_CONSULTATION.COMPLETED ||
				consulDetail?.data?.status == GENERAL_CONST.CLOSED) &&
			!consulDetail?.data?.endUrl
		) {
			setIsShowPopupEndConsul(true);
		}
		if (consulDetail?.data?.patientData?.formFill === false && popupFormConsultationCount === 0) {
			setTimeout(() => {
				setPopupFormConsultation(true);
				setPopupFormConsultationCount(1);
			}, 600);
		}
	}, [consulDetail, popupFormConsultationCount]);

	useEffect(() => {
		if (timeLeft != null && timeLeft < 1) {
			if (consulDetail?.data != null && !consulDetail?.data?.endUrl)
				setIsShowPopupEndConsul(true);
		}
	}, [timeLeft]);

	useEffect(() => {
		if (fileTemp) setTriggerFocusChat(triggerFocusChat + 1);
	}, [fileTemp]);

	useEffect(() => {
		if (triggerScrollDown > 0 && activeAnchorXid == '' && Object.keys(messagePerItem).length == 0)
			scrollDownSmooth();
	}, [triggerScrollDown, activeAnchorXid]);

	useEffect(() => {
		let checkPrescription;
		let checkNote = false;
		chats?.forEach((val) => {
			if (val?.type == CHAT_CONST.PRESCRIPTION) {
				checkPrescription = val;
			} else if (val?.type == CHAT_CONST.NOTE) {
				checkNote = true;
				return;
			}
		});

		if (checkPrescription && checkNote && !isHistory && chatData?.status == 'STARTED') {
			setIsShowPrescNotePopup(true);
		}

		if (
			!isHistory &&
			checkPrescription &&
			checkNote &&
			consulDetail?.data?.redirectAfter &&
			consulDetail?.data?.status !== STATUS_CONSULTATION.EXPIRED &&
			consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL
		) {
			setIsShowRate(true);
			setPrescriptionStatus(checkPrescription?.data?.status?.toUpperCase());
		}
	}, [chats]);

	const scrollDownSmooth = () => {
		bottomContentRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	};

	const scrollToType = (type) => {
		if (type == 'PRESCRIPTION')
			prescriptionRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		if (type == 'NOTE')
			noteRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		if (type === 'MEDICAL_ACTION')
			medicalActionRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
	};

	const handleChangeMessage = (value: string) => {
		const sanitizedValue = DOMPurify.sanitize(value);
		setInputValue(sanitizedValue);

		scrollDownSmooth();
		const isActive = value != '';
		const chatIndicator: ChatItem = {
			action: CHAT_ACTION.TYPING,
			type: CHAT_TYPE.INDICATOR,
			userType: 'PATIENT',
			localId: new Date().getTime(),
			createdAt: getCurrentTimeByTimeGap(),
			message: '',
			data: {
				isActive: isActive,
			},
		};
		if (!patientIndicator && value != '') {
			sendNewChatWithSocket(null, chatIndicator, false);
			setPatientIndicator({ isActive: isActive });
		}
		if (!isActive) {
			sendNewChatWithSocket(null, chatIndicator, false);
			setPatientIndicator(null);
		}
	};

	const handleSendMessageByInput = (type: string, data: any) => {
		const chatPayload: any = { ...data.chat };

		chatPayload.xid = uuidv4();

		// logic if have replies
		if (Object.keys(messagePerItem).length > 0) {
			chatPayload.replyTo = messagePerItem?.xid ?? '';
			chatPayload.replyToDetail = {
				message: messagePerItem?.message,
				userType: messagePerItem?.userType,
				type: messagePerItem?.type,
			};
		}

		if (data?.type == CHAT_CONST.FILE) {
			tempFile.current = null;
			setFileTemp(null);
		}

		if (type == CALLBACK_CONST.SEND_WITH_API) {
			sendNewChat(data.chatsTemp, chatPayload);
			setInputValue('');
			setIsActiveReply(false);
		} else {
			if (
				validateLink({
					whitelistLink,
					message: data?.chat?.message,
				})
			) {
				sendNewChatWithSocket(data.chatsTemp, chatPayload);
			} else {
				// send invalid link
				sendNewChatWithSocket(data.chatsTemp, {
					...chatPayload,
					type: CHAT_CONST.BLOCKED_LINK,
				});
				setInputValue('');
			}
			setPatientIndicator(null);
			setIsActiveReply(false);
		}

		setMessagePerItem({});
		setTimeout(() => {
			scrollDownSmooth();
		}, 500);
	};

	const renderFooterButton = () => {
		if (general?.isPageLoading) {
			return <SkeletonInputChat />;
		} else if (!timeLeft) {
			return (
				<div className="tw-p-4 tw-flex tw-w-full tw-gap-4">
					{isRedeemType && (
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_INFO_CONSULTATION}
							color="grey"
							className="!tw-flex-none !tw-w-auto"
							children={<IconInfo />}
							onClick={() => {
								setIsOpenInfoBottomsheet(true);
							}}
						/>
					)}
					<ButtonHighlight
						className="tw-flex-1"
						id={BUTTON_ID.BUTTON_BACK_TO_APP}
						text={
							consulDetail?.data?.consultationPartner == ORDER_TYPE.PIVOT &&
							!consulDetail?.data?.endUrl &&
							(consulDetail?.data?.status == GENERAL_CONST.EXPIRED ||
								consulDetail?.data?.status == STATUS_CONSULTATION.COMPLETED ||
								consulDetail?.data?.status == GENERAL_CONST.CLOSED)
								? BUTTON_CONST.LIHAT_RESEP
								: consulDetail?.data?.ctaLabel?.toUpperCase()
						}
						onClick={async () => {
							const redirectUrl = await getLocalStorage(LOCALSTORAGE.REDIRECT_URL);
							if (redirectUrl || !checkIsEmpty(consulDetail?.data?.endUrl)) {
								if (!isRedeemType) {
									removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
								}
								const url = redirectUrl || consulDetail?.data?.endUrl;

								addLog({ partnerUrl: url });

								backHandling({ router, backToPartner: url });
							} else {
								Router.push({
									pathname: '/prescription-detail',
								});
							}
						}}
					/>
				</div>
			);
		} else {
			return (
				<div
					style={{
						touchAction: 'none', // Cegah gesture seperti scroll/zoom di mobile
						overflow: 'hidden', // Cegah scroll dalam div
					}}
					className={consulDetail?.data?.patientData?.formFill === false ? '' : 'box-shadow-m'}
				>
					<div className={`${unreadMsg == 0 ? 'tw-hidden' : 'tw-block'} tw-relative `}>
						<div
							id={BUTTON_ID.BUTTON_CHAT_SCROLL_DOWN}
							className="scrollDownBtn"
							onClick={() => {
								scrollDownSmooth();
							}}
						>
							<div className="tw-flex tw-absolute tw-top-[-20px] tw-w-full tw-justify-center">
								<div className="label-12-medium tw-flex tw-border-2 tw-border-solid tw-border-white tw-justify-center tw-bg-primary-def tw-rounded-[10px] tw-text-tpy-50 tw-px-[3px] tw-py-[1px]">
									{unreadMsg > 99 ? `${unreadMsg}+` : unreadMsg}
								</div>
							</div>
							<IconScrollDown className="buttonDown" />
						</div>
					</div>
					{indicator != null && indicator != '' ? (
						<div className="tw-flex tw-px-4 tw-pt-2 tw-gap-2 tw-items-center">
							<Lottie
								loop={true}
								autoPlay={true}
								animationData={LottieProcess}
								style={{ width: 26, height: 24 }}
							/>
							<p className="tw-mb-0 body-12-regular tw-text-tpy-700">
								{indicator == CHAT_CONST.TYPING
									? LABEL_CONST.DOCTOR_TYPING
									: indicator == CHAT_CONST.PRESCRIPTION
									? LABEL_CONST.DOCTOR_GIVE_PRESCRIPTION
									: indicator == CHAT_CONST.NOTES
									? LABEL_CONST.DOCTOR_GIVE_NOTES
									: null}
							</p>
						</div>
					) : null}
					{consulDetail?.data?.patientData?.formFill === false ? (
						<div
							className="tw-flex tw-flex-1 tw-p-4 tw-bg-info-50 tw-flex-row"
							onClick={() => setPopupFormConsultation(true)}
						>
							<div className="tw-w-[24px] tw-h-[24px] tw-mt-[4px] tw-mr-3">
								<IconFormConsultation />
							</div>
							<span className="tw-flex-1 tw-text-xs">
								Mohon isi <b>formulir</b> dahulu untuk mendapatkan <b>resep obat</b> dari
								dokter
							</span>
							<div className="tw-w-[24px] tw-h-[24px] tw-mt-[4px] tw-mr-3">
								<IconChevronRightBlue />
							</div>
						</div>
					) : null}
					{isActiveReply && (
						<div className="tw-flex tw-items-center tw-pl-5 tw-pt-1">
							<div className="tw-w-full tw-mt-2">
								<ChatReplyItem
									title={
										messagePerItem?.userType === CHAT_CONST.PATIENT
											? chatData?.patientData?.name
											: chatData?.doctorData?.name
									}
									type={messagePerItem?.type}
									message={messagePerItem?.message}
									isDefault
								/>
							</div>
							<div onClick={onCancelReply} className="tw-cursor-pointer tw-mx-2">
								<IconCloseGray />
							</div>
						</div>
					)}
					<div className="tw-flex tw-flex-1 tw-p-4">
						<InputChat
							triggerFocusChat={triggerFocusChat}
							coachmarkAddButtonData={{
								title: 'Unggah Berkas',
								desc: 'Anda dapat memberikan informasi lampiran foto dan file disini.',
								isShow: coachmarkIndex && coachmarkIndex == 2,
								onPressPrev: () => onHandleChangeCoachmark(1),
								onPressNext: () => onHandleChangeCoachmark(3),
								dotLength: 3,
								dotActivePosition: 3,
							}}
							onChange={handleChangeMessage}
							onCancel={() => {
								setFileTemp(null);
							}}
							onChangeFileInput={({ type, files, fileType }) => {
								tempFile.current = files;
								setFileTemp({
									type: type ?? FILE_CONST.PHOTO,
									files: files,
									activeIndex: 0,
									fileType: fileType,
								});
								if (!isGettingDataRef.current) {
									initData(false);
								}
							}}
							setTempFile={(val) => {
								tempFile.current = val;
							}}
							handleSendChat={(
								type = '',
								data?: {
									chatTemp?: any;
									chatsTemp?: any;
									chat?: ChatItem;
									type?: string;
								},
							) => handleSendMessageByInput(type, data)}
							fileTemp={fileTemp}
							value={inputValue}
							disabled={coachmarkIndex == null || coachmarkIndex < 3}
						/>
					</div>
				</div>
			);
		}
	};

	const renderSummary = () => {
		if (isExpiredOrCompleted) {
			return null;
		}
		if (general?.isPageLoading) {
			return <SkeletonSummary />;
		}
		const header = consulDetail?.data?.chatHeaders ?? [];

		if (header.length == 0) return <div></div>;

		return (
			<div className={cx('tw-p-4 card-border tw-bg-white', isHistory ? 'tw-mt-14' : '')}>
				{header.map((e, i) => {
					return (
						<div key={i} className="tw-flex tw-text-black tw-items-center">
							<div className="tw-flex-1 tw-mb-4">
								<p className="label-12-medium tw-text-tpy-700">{e.label}</p>
								<p className="label-14-medium tw-mt-2 ">{e.name}</p>
							</div>
							<div className="tw-w-[96px] tw-h-[54px]">
								<Image
									src={
										isErrorLoadAssets?.logo
											? e?.image
											: (e?.key == 'FASKES_NAME' && theme?.result?.data?.chatRoom?.logo
													? theme?.result?.data?.chatRoom?.logo
													: null) ||
											  preview?.logo ||
											  e?.image
									}
									width={92}
									className="tw-w-full tw-h-full tw-object-contain"
									alt={'img-header'}
									onError={() =>
										setIsErrorLoadAssets({ ...isErrorLoadAssets, logo: true })
									}
								/>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const renderChatList = () => {
		let temp = '';
		let isNewDate = false;
		const lastMedicalAction = extractLastMedicalActionIndex(chats);

		return (
			<div>
				{chats?.map((element: ChatItem, id: number) => {
					if (element?.createdAt != null) {
						const formattedDate = getFormattedTimeFromDate(
							element?.createdAt,
							'DD MMMM YYYY',
						);
						isNewDate = temp != formattedDate;
						if (isNewDate) {
							temp = formattedDate;
						}
					}
					return (
						<div
							key={
								'chatbubble_' +
								(element?.localId ?? element?.xid ?? id) +
								'_' +
								element?.message +
								'_' +
								element?.status
							}
						>
							<div
								className="label-14-medium tw-text-tpy-700 tw-my-2 "
								style={{ textAlign: 'center' }}
							>
								{isNewDate ? temp : ''}
							</div>

							<ChatBubble
								id={id}
								orderid={global.orderNumber}
								data={element}
								onClick={
									isHistory
										? null
										: (type, params) => {
												if (type == CHAT_CONST.FILL_FORM) {
													if (params?.progress < 100 || !params?.isSubmitted) {
														Router.push({
															pathname: '/form-consultation',
															query: Router?.query,
														});
													} else {
														setIsOpenBottomsheetDetail(true);
														setActiveTab(1);
													}
												}
										  }
								}
								errorOnClick={
									isHistory
										? null
										: () => {
												setIsCoachmarkResend(element.localId);
										  }
								}
								onResendClick={
									isHistory
										? null
										: () => {
												setIsCoachmarkResend(null);
												resendChat(element);
										  }
								}
								isShowResend={
									isShowCoachmarkResend != null && isShowCoachmarkResend == element.localId
								}
								setPreviewImageData={(data, index) => {
									setPreviewImageData({
										data: data,
										activeIndex: index,
									});
								}}
								prescriptionRef={prescriptionRef}
								noteRef={noteRef}
								medicalActionRef={medicalActionRef}
								scrollToType={scrollToType}
								consulDetail={consulDetail}
								onClickMoreItems={
									isHistory || isTimeLeft ? null : () => handleMessageAction(element)
								}
								preview={preview}
								chatData={chatData}
								onAnchorSetId={(id: any) => setActiveAnchorXid(id)}
								activeAnchorXid={activeAnchorXid}
								lastMedicalAction={lastMedicalAction}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	const isOverlay = () =>
		coachmarkIndex == null ||
		coachmarkIndex == 0 ||
		coachmarkIndex == 1 ||
		(coachmarkIndex == 2 && timeLeft > 0) ||
		isShowCoachmarkResend != null;

	const renderDuration = () => {
		return (
			<Coachmark
				className="tw-flex tw-flex-1"
				title="Durasi Telekonsultasi"
				desc="Anda bisa melihat durasi telekonsultasi disini."
				dotActivePosition={2}
				dotLength={3}
				onClickPrev={() => onHandleChangeCoachmark(0)}
				onClickNext={() => onHandleChangeCoachmark(2)}
				isPopoverOpen={coachmarkIndex && coachmarkIndex == 1}
				targetId="popoverDuration"
				idNext={BUTTON_ID.BUTTON_COACHMARK_NEXT_DURATION}
				idPrev={BUTTON_ID.BUTTON_COACHMARK_PREV_DURATION}
				isOverlay={isOverlay()}
			>
				<CountdownTimerBar
					duration={timeLeft}
					setTimeLeft={(time) => setTimeLeft(time)}
					consulDetail={consulDetail?.data}
				/>
			</Coachmark>
		);
	};

	const renderInitialPrescription = () => {
		if (!isHistory && isExpiredOrCompleted) {
			return null;
		} else if (
			consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL &&
			prescriptionData != null
		) {
			return <InitialReceipt data={prescriptionData} />;
		} else {
			return null;
		}
	};

	const isShowPopupPresc = useMemo(
		() =>
			isShowPrescNotePopup &&
			!hidePrescNotePopup &&
			!isShowPopupEndConsul &&
			!consulDetail?.data?.redirectAfter &&
			consulDetail?.data?.consultationType != CONSULTATION_TYPE.APPROVAL &&
			!isHistory &&
			!general?.isOpenOfflineBottomsheet &&
			!localStorage.getItem(LOCALSTORAGE.TEMP_POPUP_PRESC),
		[
			isShowPrescNotePopup,
			hidePrescNotePopup,
			isShowPopupEndConsul,
			consulDetail,
			isHistory,
			general,
		],
	);

	const isTimeLeft = useMemo(
		() => timeLeft === 0 && timeLeft !== null && !isShowRate && isShowPopupEndConsul,
		[timeLeft, isShowRate, isShowPopupEndConsul],
	);

	const popupCustomIsShowed = useMemo(
		() => (shoBackPopup && !isExpiredOrCompleted) || isShowPopupPresc || isShowRate || isTimeLeft,
		[shoBackPopup, isExpiredOrCompleted, isShowPopupPresc, isTimeLeft, isShowRate],
	);

	const renderCustomPopup = () => {
		return (
			<>
				<CustomPopup
					icon={<IconInfoWarningLarge />}
					title="Yakin untuk Tinggalkan Halaman Percakapan?"
					desc="Telekonsultasi Anda masih berjalan."
					primaryButtonLabel="TETAP DI HALAMAN"
					secondaryButtonLabel="YA TINGGALKAN"
					secondaryButtonAction={() => {
						setShoBackPopup(false);
						window.location.href = consulDetail?.data?.backUrl ?? consulDetail?.data?.endUrl;
					}}
					primaryButtonAction={() => setShoBackPopup(false)}
					show={shoBackPopup && !isExpiredOrCompleted}
					close={() => setShoBackPopup(false)}
				/>
				<CustomPopup
					icon={<IconPrescPopup />}
					show={isShowPopupPresc}
					title="Anda Sudah Mendapatkan Resep dan Catatan dari Dokter"
					desc={
						<>
							<span>
								Ringkasan resep dan catatan akan dikirimkan ke email{' '}
								<span className="label-14-medium">{patientData?.email ?? '-'} </span>
								saat telekonsultasi berakhir
							</span>
							<br />
							<br />
							<span>
								Jika sudah merasa cukup, Anda dapat akhiri konsultasi dengan klik{' '}
								<span className="label-14-medium">tombol akhiri</span> di pojok kanan atas
								halaman percakapan.
							</span>
						</>
					}
					primaryButtonLabel="LIHAT RESEP"
					primaryButtonAction={async () => {
						await setLocalStorage(LOCALSTORAGE.TEMP_POPUP_PRESC, 1);
						navigateWithQueryParams(
							'/prescription-detail',
							{
								id: await encryptData(global?.orderNumber),
								chat: 1,
							},
							'href',
						);
					}}
					secondaryButtonLabel="KEMBALI KE PERCAKAPAN"
					secondaryButtonAction={() => {
						setHidePrescNotePopup(true);
						setIsShowPrescNotePopup(false);
					}}
					classNameBtnSecondary="!tw-text-secondary-def"
				/>
				<CustomPopup
					icon={<IconConsulTimeout />}
					show={isTimeLeft}
					title="Telekonsultasi Sudah Berakhir"
					desc={
						<span>
							Ringkasan telekonsultasi sudah dikirimkan ke email{' '}
							<span className="label-14-medium">{patientData?.email ?? '-'}</span>. Anda juga
							dapat mengakses riwayat percakapan melalui email
						</span>
					}
					primaryButtonLabel={BUTTON_CONST.OK}
					primaryButtonAction={() => {
						setTimeLeft(null);
						setIsShowPopupEndConsul(false);
						toggleRate();
					}}
				/>
				<PopupBottomsheetEndConsultation
					email={patientData?.email}
					setPopupFeedback={toggleRate}
				/>
				<PopupBottomsheetRating
					show={isShowRate && !shoBackPopup}
					toggle={toggleRate}
					prescriptionStatus={prescriptionStatus}
					consulDetail={consulDetail?.data}
					callbackSubmit={() => {
						refreshData();
						toggleRate();
					}}
				/>
			</>
		);
	};

	const toggleMessageAction = () => setIsShowMessageAction(!isShowMessageAction);

	const handleMessageAction = (item: any) => {
		setMessageSelected(item);
		setIsActiveReply(false);
		toggleMessageAction();
	};

	const onCancelReply = () => {
		setIsActiveReply(false);
		setMessagePerItem({});
		setMessageSelected({});
	};

	const handleAddFile = (e: any) => {
		const _filesTemp = [...fileTemp.files];
		const _files = [...e.target.files];

		if (_filesTemp.concat(_files)?.length > 10) {
			setAlertMessage('Batas pilihan maksimum ' + 10 + ' ' + 'foto' + '.');
			return;
		}

		setFileTemp({
			type: FILE_CONST.PHOTO,
			files: _filesTemp.concat(_files),
			activeIndex: 0,
			fileType: fileTemp?.fileType,
		});
	};

	const handleDeleteFile = (idx: any) => {
		const _files = [...fileTemp.files];
		_files.splice(idx, 1);
		if (fileTemp.files?.length === 1) {
			setFileTemp(null);
		} else {
			setFileTemp({
				type: FILE_CONST.PHOTO,
				files: _files,
				activeIndex: 0,
				fileType: fileTemp?.fileType,
			});
		}
	};

	return (
		<>
			<div className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-z-[-1] tw-flex tw-justify-center tw-items-center">
				<img
					id="image-background"
					src={
						preview?.backgroundImage ??
						theme?.result?.chatRoom?.backgroundImage ??
						ChatBackground.src
					}
					className="tw-w-full tw-max-w-500 tw-h-screen tw-object-cover"
				/>
			</div>
			<Wrapper
				additionalId={isHistory ? PAGE_ID.CHAT_HISTORY : PAGE_ID.CHAT_DETAIL}
				title={chatData?.doctorData?.name}
				metaTitle="Chat Dokter"
				desc={chatData?.doctorData?.specialization}
				header={!fileTemp}
				headerImage={chatData?.doctorData?.photo}
				footer={true}
				footerComponent={chatData != null && !isHistory ? renderFooterButton() : null}
				additionalHeaderComponent={
					!fileTemp && chatData != null && !isHistory ? renderDuration() : null
				}
				coachmarkHeaderData={{
					title: 'Detail Informasi Dokter dan Pasien',
					desc: 'Anda bisa melihat informasi profil dokter dan Anda disini.',
					isShow: coachmarkIndex == null || (coachmarkIndex == 0 && !popupCustomIsShowed),
					onPressNext: () => onHandleChangeCoachmark(1),
					dotLength: 3,
					dotActivePosition: 1,
					idNext: BUTTON_ID.BUTTON_COACHMARK_NEXT_DETAIL,
				}}
				isOverlay={isOverlay()}
				onClickHeaderTitle={async () => {
					if (general?.networkState?.isOnline != null && !general?.networkState?.isOnline) {
						setIsOpenOfflineBottomsheetRedux(true);
					} else {
						setIsOpenBottomsheetDetail(true);
					}
				}}
				additionalClassNameContent={cx(
					fileTemp
						? ''
						: previewImageData
						? '!tw-static '
						: isExpiredOrCompleted
						? '!tw-flex'
						: '',
					// !general?.isPageLoading ? 'chat-background' : '',
				)}
				isDataEmpty={!isHistory && chatData == null && !general?.errorAlert}
				showEndHeader={
					!consulEndHistory &&
					endConsulFlag &&
					consulDetail?.data?.status != STATUS_CONSULTATION.COMPLETED &&
					consulDetail?.data?.status != GENERAL_CONST.CLOSED
				}
				optionalShowEndConsultation={optionalShowEndConsultation}
				onForceEndConsultaiton={onForceEndConsultaiton}
				handleOnScroll={!isHistory && handleOnScroll}
				additionalStyleContent={{
					paddingBottom: fileTemp ? 0 : isHistory ? 24 : '92px',
					paddingTop: fileTemp ? 0 : isHistory ? 0 : '105px',
				}}
				titleStyle={'!tw-text-[14px]'}
				headClass={`tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2] ${
					isExpiredOrCompleted ? 'tw-flex' : ''
				}`}
				disableBackButton={
					isHistory ||
					!(
						consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL &&
						!checkIsEmpty(consulDetail?.data?.backUrl) &&
						consulDetail?.data?.consultationPartner
							?.toUpperCase()
							.includes(PARTNER_CONST.SHOPEE)
					)
				}
				onClickBack={() => backHandling({ backToPartner: consulDetail?.data?.backUrl, router })}
				coachmarkIndex={coachmarkIndex}
				addParentHeaderClassname={addParentHeaderClassname}
				headerColor={preview?.headerColor}
				headerTextColor={preview?.headerTextColor}
				customPopupComponent={renderCustomPopup()}
				disableHeaderHeight
				disableFooterHeight
				isPreview={isPreview}
				preview={preview}
				customBackground
			>
				<PopupAlert
					className="tw-z-[100] !tw-bottom-[80px]"
					alertMessage={alertMessage}
					setAlertMessage={(msg) => setAlertMessage(msg)}
				/>
				{fileTemp ? (
					<Gallery
						data={fileTemp}
						idThumbnailPrefix={BUTTON_ID.BUTTON_UPLOAD}
						onClose={() => setFileTemp(null)}
						onDeletePerItem={(idx) => handleDeleteFile(idx)}
						onAddItem={(e: any) => handleAddFile(e)}
					/>
				) : (
					<div
						id="container"
						className={'tw-flex tw-flex-col  ' + (isExpiredOrCompleted ? 'tw-flex-1' : '')}
					>
						<div
							className={
								'tw-flex-1 tw-p-4 tw-pb-16' +
								(isExpiredOrCompleted ? 'tw-flex tw-flex-col tw-h-full' : '')
							}
						>
							{renderSummary()}
							{renderInitialPrescription()}
							{general?.isPageLoading ? (
								<SkeletonChat />
							) : !isHistory && isExpiredOrCompleted ? (
								<ExpiredChat
									data={consulDetail?.data}
									patientData={patientData}
									hasPresc={prescriptionData != null && prescriptionData?.length > 0}
								/>
							) : (
								// ) : !general?.networkState?.isOnline ? (
								// 	<Offline />
								<div className="tw-mt-4">{renderChatList()}</div>
							)}
							<div ref={bottomContentRef} />
						</div>
					</div>
				)}

				{!isPreview ? (
					<PhoenixClient
						data={consulDetail?.data}
						chats={chats}
						onReceiveMessage={(res) => {
							handleNewMessage(res);
						}}
						triggerPushMessageById={pushMessageById}
						clearTriggerPushMessage={
							isHistory
								? null
								: () => {
										setPushMessageById(null);
										setInputValue('');
								  }
						}
						chatErrorCallback={
							isHistory
								? null
								: (id) => {
										chatErrorCallback(id);
								  }
						}
					/>
				) : null}
				<PopupBottomsheetDetailChat
					isSwipeableOpen={isOpenBottomsheetDetail}
					setIsSwipeableOpen={(isOpen) => {
						setIsOpenBottomsheetDetail(isOpen);
					}}
					activeTab={activeTab}
					setActiveTab={(tabIndex) => {
						setActiveTab(tabIndex);
					}}
				/>

				<PopupBottomsheetConsultationInfo
					isOpenBottomsheet={isOpenInfoBottomsheet}
					setIsOpenBottomsheet={(isOpen) => setIsOpenInfoBottomsheet(isOpen)}
				/>
				{isHistory ? null : (
					<PopupBottomSheetFormConsultation
						show={popupFormConsultation && !(coachmarkIndex === null || coachmarkIndex < 3)}
						togglePopup={setPopupFormConsultation}
						onSubmitted={() => {
							createNewChat(
								CHAT_CONST.FILL_FORM_DONE,
								CHAT_CONST.FILL_FORM_DONE,
								general?.formProgress,
								(_ = '', data) => {
									sendNewChatWithSocket(data.chatsTemp, data.chat);
								},
							);
							setTimeout(() => {
								sendAlreadyFillFormMessage();
							}, 1000);

							initData(false);
							setPopupFormConsultation(false);
							showToast('Formulir berhasil diisi', {}, 'success');
						}}
					/>
				)}
				<PopupBottomsheetChatAction
					sender={
						messageSelected?.userType === CHAT_CONST.PATIENT
							? chatData?.patientData?.name
							: chatData?.doctorData?.name
					}
					show={isShowMessageAction}
					onShow={toggleMessageAction}
					message={messageSelected}
					onActiveReply={() => {
						setIsActiveReply(true);
						setMessagePerItem(messageSelected);
						toggleMessageAction();
						setTriggerFocusChat(1);
					}}
					isPatient={messageSelected?.userType === CHAT_CONST.PATIENT}
				/>
			</Wrapper>
			<PreviewImage
				data={previewImageData?.data}
				activeIndex={previewImageData?.activeIndex}
				setData={(data) => setPreviewImageData(data)}
			/>
		</>
	);
};

const mapStateToProps = (state) => ({
	verifyData: state.verifyData.verifyData,
	general: state.general,
	consulEnd: state.general.endConsultation,
});

const mapDispatchToProps = (dispatch) => ({
	getPatientDetail: (orderNumber, type) => dispatch(patientDetail(orderNumber, type)),
	consulDetailRedux: (orderNumber) => dispatch(consulDetailData(orderNumber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatTemplate);
