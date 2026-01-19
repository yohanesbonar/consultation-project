/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ChatTemplate } from '../components/index.js';
import {
	checkIfFromPatient,
	getConsulVerify,
	CHAT_CONST,
	checkFormLocalData,
	getConsulHistory,
	checkIsEmpty,
	getStorageParseDecrypt,
	LOCALSTORAGE,
	getTimeGap,
	MESSAGE_CONST,
	storeOrderNumber,
	getPrescriptionDetail,
	CONSULTATION_TYPE,
	storePartnerXid,
	LABEL_CONST,
	STATUS_CONST,
	getParsedLocalStorage,
	fetchCachedTheme,
} from '../helper';
import {
	setVerifyData as setVerifyDataRedux,
	setErrorAlertRedux,
	setFormProgress as setFormProgressRedux,
	setIsPageLoading as setIsPageLoadingRedux,
} from '../redux/trigger';

import { connect, useDispatch } from 'react-redux';
import { generalSetting, patientDetail, setEndConsultation } from '../redux/actions';
import { ChatDetailResponse, ChatItem, DataChatDetail, PartnerTheme, Prescription } from '@types';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { mergePrescriptions } from 'helper/Prescription';

interface Props {
	getPatientDetail: (orderNumber: string, type: string) => void;
	verifyData: any;
	getGeneralSetting: () => any;
}

const ChatHistory = (props: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');
	const [chatData, setChatData] = useState<DataChatDetail>(null);
	const [consulDetail, setConsulDetail] = useState<ChatDetailResponse>();
	const [chats, setChats] = useState<ChatItem[]>([]);
	const [unReadIndex, setUnReadIndex] = useState<number>(null);
	const [atBottom, setAtBottom] = useState<boolean>(false);
	const [unreadMsg, setUnreadMsg] = useState<number>(0);
	const [prescriptionData, setPrescriptionData] = useState<Prescription[]>();
	const [generalSetting, setGeneralSetting] = useState({
		whitelist_link: [],
	});
	//trigger
	const [triggerScrollDown, setTriggerScrollDown] = useState<number>(0);
	//ref
	const chatsRef: any = useRef(chats);

	const optionalEndCondition = consulDetail?.data?.status
		? consulDetail?.data?.status !== STATUS_CONST.CLOSED
		: false;

	usePartnerInfo({ theme: themeData, token: partnerToken });

	const fetchTheme = async (token = null) => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		if (checkIsEmpty(token || orders?.partnerToken)) {
			return;
		}

		const responseTheme = await fetchCachedTheme(token || orders?.partnerToken);
		setPartnerToken(token || orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	useEffect(() => {
		return () => {
			setIsPageLoadingRedux(false);
		};
	}, []);

	useEffect(() => {
		fetchTheme();
		initData();
	}, [router.query]);

	useEffect(() => {
		chatsRef.current = chats;
		if (chats && atBottom) {
			setTriggerScrollDown(triggerScrollDown + 1);
			setAtBottom(false);
		}
	}, [chats]);

	useEffect(() => {
		try {
			if (unReadIndex != null) {
				console.log('unread', unReadIndex, chats);
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

	const checkAtBottom = () => {
		let result = false;
		const bottomChat = document.querySelector('#content');
		if (Math.ceil(bottomChat.scrollTop) + bottomChat.clientHeight == bottomChat.scrollHeight) {
			result = true;
		}
		setAtBottom(result);
		return result;
	};

	const initData = async () => {
		let params = router?.query;

		if (checkIsEmpty(params)) {
			params = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
		}

		if (params?.token == null) return;
		getData(params?.token);
	};

	const getData = async (token) => {
		try {
			setIsPageLoadingRedux(true);
			if (!props.verifyData.token) {
				const verifyToken = await getConsulVerify(token);

				if (!verifyToken?.meta?.acknowledge) {
					router.push('/404');
					return;
				} else {
					if (verifyToken?.data?.partner) {
						await storePartnerXid(verifyToken?.data?.partner);
					}
				}
				await setVerifyDataRedux(verifyToken.data);
				global.tokenAuthorization = verifyToken?.data?.token;
				global.orderNumber = verifyToken?.data?.orderNumber;
				storeOrderNumber(verifyToken?.data?.orderNumber);
			}

			///REAL DATA
			const consulDetail = await getConsulHistory(global.orderNumber);
			if (consulDetail?.meta?.acknowledge && consulDetail?.data?.token) {
				fetchTheme(consulDetail?.data?.token);
			}
			if (consulDetail?.meta?.status != 200) {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: consulDetail?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
				setIsPageLoadingRedux(false);
				return;
			}
			console.log('realData', consulDetail);
			setConsulDetail(consulDetail);

			const generalSetting = await props.getGeneralSetting();
			if (generalSetting?.meta?.acknowledge) {
				setGeneralSetting(generalSetting?.data);
			}

			await props.getPatientDetail(consulDetail?.data?.orderNumber, 'patient');

			if (consulDetail?.data?.consultationType == CONSULTATION_TYPE.APPROVAL) {
				const resPresc = await getPrescriptionDetail(global.orderNumber);
				try {
					if (resPresc?.meta?.acknowledge) {
						const prescriptionMerged: Prescription[] = mergePrescriptions(
							resPresc?.data?.prescriptions ?? [],
							resPresc?.data?.updatedPrescriptions ?? [],
							{ dropZeroQty: false },
						);
						setPrescriptionData(prescriptionMerged);
					}
				} catch (error) {
					console.log('error on setPresc intial : ', error);
				}
			}
			const gap = getTimeGap(new Date(), consulDetail?.meta?.at);
			global.timeGap = gap;

			global.patientMemberId = consulDetail?.data?.patientData?.id;
			global.orderNumber = consulDetail?.data?.orderNumber;
			global.roomId = consulDetail?.data?.roomId;

			setChatData(consulDetail?.data);
			setChats(consulDetail?.data?.messages);

			const trackProgressForm = await checkFormLocalData(consulDetail?.data);
			setFormProgressRedux(trackProgressForm);
			// console.log('trackProgressForm', trackProgressForm);
			setIsPageLoadingRedux(false);
		} catch (error) {
			setIsPageLoadingRedux(false);
			console.log('error on get data chat detail : ', error);
		}
	};

	const handleNewMessage = (res) => {
		if (res?.action == CHAT_CONST.READ_RECEIPT) {
			try {
				const unreadIdx = chatsRef.current.findIndex((e) => e?.status != CHAT_CONST.READ);
				if (unreadIdx > -1) {
					setUnReadIndex(unreadIdx);
				}
			} catch (error) {
				console.log('error on read receipt : ', error);
			}
		} else if (res?.action == CHAT_CONST.UPDATE_MESSAGE) {
			const index = chatsRef.current?.findIndex((e) => e?.type == res?.type);

			replaceChat(index, res);
		} else {
			if (checkIfFromPatient({ from: res.user })) {
				// setInputValue('');
			}

			const index =
				res?.localId != null
					? chatsRef.current?.findIndex((e) => e?.localId == res?.localId)
					: -1;

			if (index == -1) {
				const bottomPos = checkAtBottom();
				if (!bottomPos) {
					setUnreadMsg((unreadMsg) => unreadMsg + 1);
				}
				setChats((prev) => [...prev, res]);
			} else {
				res.status = res.status != CHAT_CONST.SENT ? res.status : CHAT_CONST.DELIVERED;
				replaceChat(index, res);
			}
		}
	};

	const replaceChat = (index, chat) => {
		const newChats = Object.assign([], chatsRef.current);
		newChats[index] = chat;
		setChats(newChats);
	};

	const handleForceEndConsultation = () => {
		const body: any = {
			feedback: {
				id: 99,
				message: LABEL_CONST.FORCE_END_BY_ADMIN,
			},
		};
		dispatch(setEndConsultation(global.orderNumber, body));
		setTimeout(() => {
			getData(router?.query?.token);
		}, 500);
	};

	return (
		<ChatTemplate
			isHistory={true}
			chatData={chatData}
			consulDetail={consulDetail}
			chats={chats}
			coachmarkIndex={3}
			unreadMsg={unreadMsg}
			initData={initData}
			handleNewMessage={handleNewMessage}
			triggerScrollDown={triggerScrollDown}
			// addParentHeaderClassname={'body-width tw-fixed tw-w-full tw-z-10'}
			prescriptionData={prescriptionData}
			optionalShowEndConsultation={optionalEndCondition}
			onForceEndConsultaiton={handleForceEndConsultation}
			whitelistLink={generalSetting?.whitelist_link ?? []}
		/>
	);
};

const mapStateToProps = (state) => ({
	verifyData: state.verifyData.verifyData,
	general: state.general,
});

const mapDispatchToProps = (dispatch) => ({
	getPatientDetail: (orderNumber, type) => dispatch(patientDetail(orderNumber, type)),
	getGeneralSetting: () => dispatch(generalSetting()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHistory);
