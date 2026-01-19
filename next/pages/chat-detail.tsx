/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ChatTemplate } from '../components/index.js';
import moment from 'moment';
import {
	getLocalStorage,
	LOCALSTORAGE,
	setLocalStorage,
	encryptData,
	getConsulVerify,
	CHAT_CONST,
	getTimeLeft,
	sendChat,
	createNewChat,
	checkFormLocalData,
	GENERAL_CONST,
	getTimeGap,
	setStorageEncrypt,
	getStorageParseDecrypt,
	MESSAGE_CONST,
	removeLocalStorage,
	checkIsEmpty,
	storeOrderNumber,
	CONSULTATION_TYPE,
	getPrescriptionDetail,
	storePartnerXid,
	PAGE_ID,
	ORDER_TYPE,
	STATUS_CONSULTATION,
	extractUrls,
	fetchMetadataInfo,
	CHAT_TYPE,
	changeToDeletedMedicalAction,
	getParsedLocalStorage,
	showLocalNotification,
	fetchCachedTheme,
	PARTNER_CONST,
} from '../helper';
import {
	setVerifyData as setVerifyDataRedux,
	setTimeLeft as setTimeLeftRedux,
	setFormProgress as setFormProgressRedux,
	setIsSendingChat as setIsSendingChatRedux,
	setIsPageLoading as setIsPageLoadingRedux,
	setErrorAlertRedux,
} from '../redux/trigger';
import { connect } from 'react-redux';
import { patientDetail, consulDetailData, generalSetting } from '../redux/actions';
import { setCookie } from 'cookies-next';
import { setNetworkState as setNetworkStateRedux } from '../redux/trigger';
import { ChatDetailResponse, ChatItem, DataChatDetail, PartnerTheme, Prescription } from '@types';
import { mergePrescriptions } from 'helper/Prescription';
import usePartnerInfo from 'hooks/usePartnerInfo';

interface Props {
	consulEnd: {
		result: any;
		loading: boolean;
		error: boolean;
		meta: { acknowledge: boolean };
	};
	consulDetailData: ChatDetailResponse;
	general: {
		networkState: {
			isOnline: boolean;
			isNeedToReconnect: boolean;
			isDetected: boolean;
		};
	};
	getPatientDetail: (orderNumber: string, type: string) => any;
	consulDetailRedux: (orderNumber: string) => any;
	getGeneralSetting: () => any;
}

const ChatDetail = ({
	consulEnd,
	consulDetailData,
	general,
	getPatientDetail,
	consulDetailRedux,
	getGeneralSetting,
}: Props) => {
	const router = useRouter();

	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');
	const [chatData, setChatData] = useState<DataChatDetail>(null);
	const [consulDetail, setConsulDetail] = useState<ChatDetailResponse>();
	const [chats, setChats] = useState<ChatItem[]>([]);
	const [timeLeft, setTimeLeft] = useState<number>(null);
	// const [inputValue, setInputValue] = useState('');
	const [pushMessageById, setPushMessageById] = useState<string | number>(null);
	//int id
	const [coachmarkIndex, setCoachmarkIndex] = useState<number>(3);
	const [chatTempToSend, setChatTempToSend] = useState<any>(null);
	const [unReadIndex, setUnReadIndex] = useState<number>(null);
	const [unreadMsg, setUnreadMsg] = useState<number>(0);
	const [isRedeemType, setIsRedeemType] = useState<boolean>(false);
	const [prescriptionData, setPrescriptionData] = useState<Prescription[]>();
	const [indicator, setIndicator] = useState<any>();
	const [generalSetting, setGeneralSetting] = useState({
		whitelist_link: [],
	});
	const [patientData, setPatientData] = useState<any>(null);
	//trigger
	const [triggerScrollDown, setTriggerScrollDown] = useState<number>(0);
	//ref
	const isSendReadReceiptRef: any = useRef(false);
	const timeRef: any = useRef(null);
	const timeGapRef: any = useRef(null);
	const isGettingDataRef: any = useRef(false);
	const atBottomRef: any = useRef(false);

	usePartnerInfo({ theme: themeData, token: partnerToken });

	useEffect(() => {
		showLocalNotification({
			title: 'Click untuk membuka konsultasi kembali',
			body: 'Anda juga bisa membuka konsultasi kembali melalui link yang sudah dikirimkan ke email Anda.',
		});
	}, []);

	useEffect(() => {
		initData();
		setTimeout(async () => {
			const lastCoachmark = await getLocalStorage(LOCALSTORAGE.CHATDETAIL_COACHMARK);
			onHandleChangeCoachmark(lastCoachmark ?? 0);
		}, 500);

		if (consulEnd?.meta?.acknowledge) {
			//send chat
			createNewChat(CHAT_CONST.EXPIRED, null, null, (type = '', data) => {
				sendNewChatWithSocket(data.chatsTemp, data.chat);
			});
		}
	}, [router.query, consulEnd]);

	useEffect(() => {
		removeLocalStorage(LOCALSTORAGE.ATTACHMENT);
		document.addEventListener('visibilitychange', () => {
			if (
				!isGettingDataRef.current &&
				document.visibilityState === 'visible' &&
				document.documentURI.includes('/' + PAGE_ID.CHAT_DETAIL)
			) {
				initData(false);
			}
		});
		return () => {
			setIsPageLoadingRedux(false);
			document.removeEventListener('visibilitychange', () => {});
		};
	}, []);

	const chatsRef = useRef(chats);

	useEffect(() => {
		chatsRef.current = chats;

		if (chats && atBottomRef.current) {
			atBottomRef.current = false;
			setTimeout(() => {
				setTriggerScrollDown(triggerScrollDown + 1);
			}, 500);
		}
	}, [chats]);

	useEffect(() => {
		if (chatTempToSend) {
			try {
				setTriggerScrollDown(triggerScrollDown + 1);
			} catch (error) {
				console.log('error on scroll to bottom : ', error);
			} finally {
				setChatTempToSend(null);
			}
		}
	}, []);

	useEffect(() => {
		try {
			if (unReadIndex != null) {
				const temp = Object.assign(chats, []);
				for (let index = unReadIndex; index < temp.length; index++) {
					temp[index].status = CHAT_CONST.READ;
				}
				setChats(temp);
				setUnReadIndex(null);
			}
		} catch (error) {
			console.log('error on read receipt : ', error);
		}
	}, [unReadIndex]);

	useEffect(() => {
		if (consulDetailData && consulDetailData?.meta?.status != 200) {
			setErrorAlertRedux({
				danger: true,
				data: {
					message: consulDetailData?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			});
			return;
		} else {
			if (consulDetailData?.consultationPartner == ORDER_TYPE.PIVOT) {
				setIsRedeemType(true);
			}
		}
	}, [consulDetailData]);

	const isReloadingRev = useRef(false);

	useEffect(() => {
		console.log('------ network redux: ', general?.networkState);

		if (general?.networkState?.isNeedToReconnect && general?.networkState?.isOnline) {
			setTimeout(() => {
				if (!isReloadingRev.current) {
					isReloadingRev.current = true;
					console.log('----');
					if (!isGettingDataRef.current) {
						initData();
					}
					setNetworkStateRedux({
						isOnline: true,
						isNeedToReconnect: false,
						isDetected: false,
					});
				}
			}, 1000);
		}
	}, [general?.networkState]);

	const initData = async (showLoader = true) => {
		let params = router?.query;

		if (checkIsEmpty(params)) {
			params = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
		}

		if (params?.token == null) return;
		getData(params, showLoader);
		fetchTheme();
		isReloadingRev.current = false;
	};

	const checkAtBottom = () => {
		let result = false;
		const bottomChat = document.querySelector('#content');
		if (Math.ceil(bottomChat.scrollTop) + bottomChat.clientHeight == bottomChat.scrollHeight) {
			result = true;
		}
		atBottomRef.current = result;
		return result;
	};

	const checkSetToken = async (params) => {
		if (!params?.token) {
			const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
			global.tokenAuthorization = consulSession?.tokenAuthorization;
			global.orderNumber = consulSession?.orderNumber;
			setCookie(
				'consulSession',
				await encryptData({
					tokenAuthorization: consulSession?.tokenAuthorization,
					orderNumber: consulSession?.orderNumber,
				}),
			);
		} else {
			const verifyToken = await getConsulVerify(params?.token);
			if (!verifyToken?.meta?.acknowledge) {
				router.push('/404');
				return;
			} else {
				await setVerifyDataRedux(verifyToken.data);
				global.tokenAuthorization = verifyToken?.data?.token;
				global.orderNumber = verifyToken?.data?.orderNumber;
				storeOrderNumber(verifyToken?.data?.orderNumber);
				await setStorageEncrypt(LOCALSTORAGE.XID, verifyToken?.data?.partner);
				if (verifyToken?.data?.partner) {
					await storePartnerXid(verifyToken?.data?.partner);
				}

				await setStorageEncrypt(LOCALSTORAGE.CONSULTATION, {
					tokenAuthorization: verifyToken?.data?.token,
					orderNumber: verifyToken?.data?.orderNumber,
				});
				setCookie(
					'consulSession',
					await encryptData({
						tokenAuthorization: verifyToken?.data?.token,
						orderNumber: verifyToken?.data?.orderNumber,
					}),
				);
			}
		}
	};

	const checkMultipleUrl = async (urls: any) => {
		if (urls?.length > 0) {
			const params = urls?.length > 1 ? urls[urls?.length - 1] : urls[0];
			const meta = await fetchMetadataInfo(params);
			return { type: CHAT_CONST.LINK_CLICKABLE, meta };
		}
	};

	const checkSingleChatMetaData = async (chat: any) => {
		const singleUrl = extractUrls(chat?.message);
		const resSingleChat = await checkMultipleUrl(singleUrl);
		const _data =
			chat?.type === CHAT_TYPE.IMAGE ||
			chat?.type === CHAT_TYPE.FILE ||
			chat?.type === CHAT_TYPE.PRESCRIPTION ||
			chat?.type === CHAT_TYPE.NOTE ||
			chat?.type === CHAT_TYPE.MEDICAL_ACTION
				? chat?.data
				: resSingleChat;
		return { ...chat, data: _data ?? {} };
	};

	const fetchTheme = async (token = null) => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		if (checkIsEmpty(token || orders?.partnerToken)) {
			return;
		}
		const responseTheme = await fetchCachedTheme(token || orders?.partnerToken);
		setPartnerToken(token || orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	const getData = async (params: any, showLoader = true) => {
		try {
			localStorage.removeItem(LOCALSTORAGE.PARTNER);
			isGettingDataRef.current = true;
			if (showLoader) {
				setIsPageLoadingRedux(true);
			}
			await checkSetToken(params);
			///REAL DATA

			const consulDetail = await consulDetailRedux(global.orderNumber);
			setConsulDetail(consulDetail);
			if (consulDetail?.meta?.acknowledge && consulDetail?.data?.token) {
				fetchTheme(consulDetail?.data?.token);
			}

			if (!consulDetail?.meta?.acknowledge) {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: consulDetail?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
			}

			let tempConsul: any = (await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION)) ?? {};
			tempConsul = {
				...tempConsul,
				consultationType: consulDetail?.data?.consultationType ?? '',
			};
			await setStorageEncrypt(LOCALSTORAGE.CONSULTATION, tempConsul);

			const generalSetting = await getGeneralSetting();
			if (generalSetting?.meta?.acknowledge) {
				setGeneralSetting(generalSetting?.data);
			}

			const patientData = await getPatientDetail(consulDetail?.data?.orderNumber, 'patient');
			if (patientData?.meta?.acknowledge) {
				setPatientData(patientData?.data);
			}

			if (
				consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL ||
				consulDetail?.data?.status == GENERAL_CONST.EXPIRED ||
				consulDetail?.data?.status == STATUS_CONSULTATION.COMPLETED ||
				consulDetail?.data?.status == GENERAL_CONST.CLOSED
			) {
				const resPresc = await getPrescriptionDetail(global.orderNumber);
				const prescriptionMerged: Prescription[] = mergePrescriptions(
					resPresc?.data?.prescriptions ?? [],
					resPresc?.data?.updatedPrescriptions ?? [],
					{ dropZeroQty: false },
				);
				try {
					if (resPresc?.meta?.acknowledge) {
						setPrescriptionData(prescriptionMerged);
					}
				} catch (error) {
					console.log('error on setPresc intial : ', error);
				}
			}

			global.patientMemberId = consulDetail?.data?.patientData?.id;
			global.orderNumber = consulDetail?.data?.orderNumber;
			global.roomId = consulDetail?.data?.roomId;
			setChatData(consulDetail?.data);
			setChats(consulDetail?.data?.messages);
			if (
				consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL &&
				consulDetail?.data?.consultationPartner
					?.toUpperCase()
					?.includes(PARTNER_CONST.TOKOPEDIA)
			) {
				// only checking if comes from tokopedia
				const trackProgressForm = await checkFormLocalData(consulDetail?.data);
				setFormProgressRedux(trackProgressForm);
			}
			const gap = getTimeGap(new Date(), consulDetail?.meta?.at);
			global.timeGap = gap;
			timeGapRef.current = gap;
			if (
				consulDetail?.data?.status != GENERAL_CONST.EXPIRED &&
				consulDetail?.data?.status != STATUS_CONSULTATION.COMPLETED &&
				consulDetail?.data?.status != GENERAL_CONST.CLOSED
			) {
				timeRef.current = consulDetail?.data?.expiredAt;
				const timeLeftTemp = getTimeLeft(
					timeRef.current,
					moment().add(global?.timeGap ?? 0, 'seconds'),
				);

				setTimeLeft(timeLeftTemp);
				setTimeLeftRedux(timeLeftTemp);
			} else {
				setTimeLeft(0);
				setTimeLeftRedux(0);
				if (isRedeemType || consulDetail?.data?.consultationPartner == ORDER_TYPE.PIVOT) {
					// the action is move to popup
				} else {
					removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
				}
			}

			if (showLoader) {
				setIsPageLoadingRedux(false);
			}
		} catch (error) {
			if (showLoader) {
				setIsPageLoadingRedux(false);
			}
			console.log('error on get data chat detail : ', error);
		} finally {
			isGettingDataRef.current = false;
		}
	};

	const handleNewMessage = async (res) => {
		if (res?.type === CHAT_CONST.BLOCKED_LINK) {
			// do nothing
		} else if (res?.type == CHAT_TYPE.MEDICAL_ACTION && checkIsEmpty(res?.data)) {
			// delete last medical action
			setChats(changeToDeletedMedicalAction(chatsRef.current));
			return;
		} else if (res?.action == CHAT_CONST.READ_RECEIPT) {
			try {
				if (
					res?.orderNumber == global.orderNumber &&
					(res?.userType == null || res?.userType != CHAT_CONST.PATIENT)
				) {
					const unreadIdx = chatsRef.current.findIndex((e) => e?.status != CHAT_CONST.READ);
					if (unreadIdx > -1) {
						setUnReadIndex(unreadIdx);
					}
				} else {
					setUnReadIndex(null);
				}
			} catch (error) {
				console.log('error on read receipt : ', error);
			}
		} else if (res?.type == CHAT_CONST.INDICATOR) {
			if (res?.data?.isActive && res?.userType !== 'PATIENT') {
				setIndicator(res?.action);
			} else {
				setIndicator(null);
			}
		} else {
			const index =
				res?.localId != null
					? chatsRef.current?.findIndex((e) => e?.localId == res?.localId)
					: -1;

			if (index == -1) {
				const bottomPos = checkAtBottom();
				if (!bottomPos) {
					setUnreadMsg((unreadMsg) => unreadMsg + 1);
				}
				let newPrevChat = chatsRef.current;

				if (
					res?.type == CHAT_TYPE.PRESCRIPTION ||
					res?.type == CHAT_TYPE.NOTE ||
					res?.type === CHAT_TYPE.MEDICAL_ACTION
				) {
					newPrevChat = chatsRef.current?.map((val, i) => {
						if (val?.type == res?.type) val.statusMessage = 'EXPIRED';
						return val;
					});
				}

				let resManipulate = { ...res };
				if (
					res?.type == CHAT_TYPE.MESSAGE ||
					CHAT_TYPE.IMAGE ||
					CHAT_TYPE.FILE ||
					CHAT_TYPE.PRESCRIPTION ||
					CHAT_TYPE.NOTE ||
					(res?.type == CHAT_TYPE.MEDICAL_ACTION && !checkIsEmpty(res?.data))
				) {
					const newChat = await checkSingleChatMetaData(res);
					const notifData = {
						title: consulDetail?.data?.doctorData?.name ?? 'Dokter',
						body: '',
					};

					if (newChat?.type == CHAT_TYPE.MESSAGE) {
						notifData.body = newChat?.message;
					} else if (newChat?.type == CHAT_TYPE.IMAGE) {
						notifData.body = 'Dokter mengirimkan gambar';
					} else if (newChat?.type == CHAT_TYPE.FILE) {
						notifData.body = 'Dokter mengirimkan file';
					} else if (newChat?.type == CHAT_TYPE.PRESCRIPTION) {
						notifData.body = 'Dokter mengirimkan resep';
					} else if (newChat?.type == CHAT_TYPE.NOTE) {
						notifData.body = 'Dokter mengirimkan catatan';
					} else if (newChat?.type == CHAT_TYPE.MEDICAL_ACTION) {
						notifData.body = 'Dokter mengirimkan saran tindakan medis';
					}

					if (notifData.body) {
						showLocalNotification(notifData);
					}
					resManipulate = newChat;
				}
				setChats([...newPrevChat, resManipulate]);
			} else {
				res.status = res.status != CHAT_CONST.SENT ? res.status : CHAT_CONST.DELIVERED;
				replaceChat(index, res);
			}
		}
	};

	const replaceChat = async (index: number, chat: any) => {
		const newChats = Object.assign([], chatsRef.current);
		const newChat = await checkSingleChatMetaData(chat);
		newChats[index] = newChat;
		setChats(newChats);
	};

	const chatErrorCallback = (id) => {
		const index = chatsRef.current.findIndex((e) => e.localId == id);
		const tempChats = chatsRef.current.map((item) => ({ ...item }));
		if (tempChats[index].status != 'DELIVERED') {
			tempChats[index].status = 'FAILED';
		}
		setChats(tempChats);
	};

	const resendChat = async (element) => {
		const newChats = chatsRef.current.filter((e) => e.localId != element.localId);
		element.localId = new Date().getTime();
		element.createdAt = new Date();
		element.status = CHAT_CONST.SENT;

		sendNewChat(newChats, element);
	};

	const onHandleChangeCoachmark = (value) => {
		setLocalStorage(LOCALSTORAGE.CHATDETAIL_COACHMARK, value);
		setCoachmarkIndex(value);
	};

	const sendNewChatWithSocket = async (chatsTemp = null, chat: any, isIndicator?: boolean) => {
		try {
			if (!isIndicator) {
				if (chatsTemp != null) {
					setChats([...chatsTemp, chat]);
				} else {
					setChats((prev) => [...(prev ?? []), chat]);
				}
			}
			setPushMessageById(chat.localId);
			setChatTempToSend(chat);
			setIsSendingChatRedux(false);
		} catch (error) {
			console.log('error on send chat with : ', error);
		}
	};

	const sendNewChat = async (chatsTemp = null, chat) => {
		try {
			if (chatsTemp != null) {
				setChats([...chatsTemp, chat]);
			} else {
				setChats((prev) => [...(prev ?? []), chat]);
			}
			// setPushMessageById(chat.localId);
			setIsSendingChatRedux(true);
			setChatTempToSend(chat);
			const res = await sendChat({
				data: chat,
			});
			// console.log('res send chat', res);
			if (res?.meta?.acknowledge) {
				chat.status = CHAT_CONST.DELIVERED;
				replaceChat(chat.localId, chat);
			} else {
				chatErrorCallback(chat.localId);
			}
		} catch (error) {
			console.log('error on sendchat : ', error);
		} finally {
			setIsSendingChatRedux(false);
		}
	};

	const sendAlreadyFillFormMessage = () => {
		try {
			if (
				chats &&
				chats.length &&
				!chats.some((e) => e?.message == MESSAGE_CONST.ALREADY_FILLED_CONSULTATION_FORM)
			) {
				createNewChat(
					CHAT_CONST.MESSAGE,
					MESSAGE_CONST.ALREADY_FILLED_CONSULTATION_FORM,
					null,
					(_ = '', data) => {
						sendNewChatWithSocket(data.chatsTemp, data.chat);
					},
				);
			}
		} catch (error) {
			console.log('error on send already fill form : ', error);
		}
	};

	const handleOnScroll = (e) => {
		const offetHeight = e.target.offsetHeight ?? 0;
		const scrollTop = Math.ceil(e.target.scrollTop) ?? 0;
		const scrollHeight = e.target.scrollHeight ?? 0;
		const gapToBottom = scrollHeight - scrollTop - offetHeight;

		if (gapToBottom < 1 && !isSendReadReceiptRef.current) {
			if (unreadMsg > 0) setUnreadMsg(0);
			isSendReadReceiptRef.current = true;
			setTimeout(() => {
				createNewChat(CHAT_CONST.READ_RECEIPT, '', null, (type = '', data) => {
					sendNewChatWithSocket(data.chatsTemp, data.chat);
				});
				isSendReadReceiptRef.current = false;
			}, 500);
		}
	};

	return (
		<ChatTemplate
			chatData={chatData}
			consulDetail={consulDetail}
			chats={chats}
			timeLeft={timeLeft}
			setTimeLeft={setTimeLeft}
			coachmarkIndex={coachmarkIndex}
			onHandleChangeCoachmark={onHandleChangeCoachmark}
			handleOnScroll={handleOnScroll}
			isRedeemType={isRedeemType}
			unreadMsg={unreadMsg}
			isGettingDataRef={isGettingDataRef}
			initData={initData}
			sendNewChat={sendNewChat}
			sendNewChatWithSocket={sendNewChatWithSocket}
			handleNewMessage={handleNewMessage}
			pushMessageById={pushMessageById}
			setPushMessageById={setPushMessageById}
			chatErrorCallback={chatErrorCallback}
			resendChat={resendChat}
			sendAlreadyFillFormMessage={sendAlreadyFillFormMessage}
			triggerScrollDown={triggerScrollDown}
			// addParentHeaderClassname={'body-width tw-fixed tw-w-full tw-z-10'}
			prescriptionData={prescriptionData}
			indicator={indicator}
			whitelistLink={generalSetting?.whitelist_link ?? []}
			patientData={patientData}
			refreshData={initData}
		/>
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
	getGeneralSetting: () => dispatch(generalSetting()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetail);
