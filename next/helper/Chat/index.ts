/* eslint-disable @typescript-eslint/no-empty-function */
import { upperCase } from 'lodash';
import { FORM_CONSULTATION } from '../../pages/form-consultation';
import { CALLBACK_CONST, CHAT_CONST, MESSAGE_CONST, STATUS_CONSULTATION } from '../Const';
import { calculateAgeYearMonth, getCurrentTimeByTimeGap } from '../Time';
import {
	addLog,
	getConsulDetail,
	getConsulVerify,
	getConsultationDetailPartner,
	getPartnerDetail,
	getTheme,
} from 'helper/Network';
import {
	LOCALSTORAGE,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	setStorageEncrypt,
} from 'helper/LocalStorage';
import { checkIsEmpty, objectToQueryString } from 'helper/Common';
import { v4 as uuidv4 } from 'uuid';
import { PartnerTheme } from '@types';

type CheckPatientParamType = {
	from?: string;
};

export const checkIfFromPatient = (params: CheckPatientParamType) => {
	return params?.from == 'patient';
};

export const createNewChat = async (
	type: string,
	message: string,
	data: any,
	callback: (_type: string, _data: any) => void,
) => {
	let chat: any;
	if (type == CHAT_CONST.FILL_FORM_DONE) {
		let name: string;
		let age: string;
		let bornDate: string;
		let medicalComplaint: string;

		const localForm = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);

		localForm?.forms?.forEach((element: any) => {
			if (element.name == FORM_CONSULTATION.AGE) {
				bornDate = element.value;
				age = calculateAgeYearMonth(element.value);
			} else if (element.name == FORM_CONSULTATION.SYMPTOMS) {
				medicalComplaint = element.value;
			} else if (element.name == FORM_CONSULTATION.NAME) {
				name = element.value;
			}
		});

		const dataTemp = {
			bornDate: bornDate,
			age: age,
			medicalComplaint: medicalComplaint,
			name: name,
		};

		chat = {
			action: CHAT_CONST.DONE,
			type: CHAT_CONST.FILL_FORM,
			userType: CHAT_CONST.PATIENT,
			localId: new Date().getTime(),
			createdAt: getCurrentTimeByTimeGap(),
			message: '',
			data: dataTemp,
			status: CHAT_CONST.SENT,
			xid: uuidv4(),
			// authorization: global?.tokenAuthorization,
		};
		callback(CALLBACK_CONST.SEND_WITH_SOCKET, {
			chatsTemp: null,
			chat: chat,
			type: type,
		});
		// sendNewChatWithSocket(null, chat);
	} else if (type == CHAT_CONST.FILE) {
		const uploadedFiles = data?.uploadedFiles;
		if (uploadedFiles && uploadedFiles?.length) {
			chat = {
				action: CHAT_CONST.INCOMING_MESSAGE,
				type: uploadedFiles[0]?.type ? upperCase(uploadedFiles[0]?.type) : CHAT_CONST.FILE,
				data: uploadedFiles,
				userType: CHAT_CONST.PATIENT,
				localId: data?.localId ?? new Date().getTime(),
				createdAt: getCurrentTimeByTimeGap(),
				message: '',
				status: CHAT_CONST.SENT,
				// authorization: global?.tokenAuthorization,
			};
			callback(CALLBACK_CONST.SEND_WITH_SOCKET, {
				chatsTemp: null,
				chat: chat,
				type: type,
			});
			// sendNewChat(null, chat);

			// sendNewChatWithSocket(null, chat);
		}
		if (message != null && message != '') {
			setTimeout(() => {
				createNewChat(CHAT_CONST.MESSAGE, message, null, callback);
			}, 100);
		}
	} else if (type == CHAT_CONST.READ_RECEIPT) {
		chat = {
			action: CHAT_CONST.READ_RECEIPT,
			type: CHAT_CONST.READ_RECEIPT,
			userType: CHAT_CONST.PATIENT,
			localId: new Date().getTime(),
			createdAt: getCurrentTimeByTimeGap(),
			orderNumber: global?.orderNumber,
			// authorization: global?.tokenAuthorization,
		};
		callback(CALLBACK_CONST.SEND_WITH_SOCKET, {
			chatsTemp: null,
			chat: chat,
			type: type,
		});
	} else if (type == CHAT_CONST.EXPIRED) {
		chat = {
			action: CHAT_CONST.EXPIRED,
			type: CHAT_CONST.EXPIRED,
			userType: CHAT_CONST.PATIENT,
			localId: new Date().getTime(),
			createdAt: getCurrentTimeByTimeGap(),
			orderNumber: global?.orderNumber,
			// authorization: global?.tokenAuthorization,
		};
		callback(CALLBACK_CONST.SEND_WITH_SOCKET, {
			chatsTemp: null,
			chat: chat,
			type: type,
		});
	} else {
		chat = {
			action: CHAT_CONST.INCOMING_MESSAGE,
			type: CHAT_CONST.MESSAGE,
			userType: CHAT_CONST.PATIENT,
			localId: new Date().getTime(),
			createdAt: getCurrentTimeByTimeGap(),
			message: message,
			// status: CHAT_CONST.SENT,
			// authorization: global?.tokenAuthorization,
		};

		callback(CALLBACK_CONST.SEND_WITH_SOCKET, {
			chatsTemp: null,
			chat: chat,
			type: type,
		});
		// sendNewChat(null, chat);
		// sendNewChatWithSocket(null, chat);
	}
};

export const redirectToOrderDetail = async (res: any) => {
	return {
		redirect: {
			destination: `/order/detail?token=${res?.data?.transaction?.token}&transaction_xid=${res?.data?.transaction?.xid}&ct=${res?.data?.consultationRequestToken}`,
			permanent: false,
		},
	};
};

export const getThemeData = async (token: string) => {
	try {
		const response = await getTheme(token);
		let result: PartnerTheme;

		if (response?.meta?.acknowledge) {
			result = response?.data;
		}
		return result;
	} catch (error) {
		console.log('error on gettheme data : ', error);
		return null;
	}
};

export const checkConsultationByStatus = async (token?: string, noAuth = false) => {
	try {
		const res = await getConsultationDetailPartner(token);
		if (res?.meta?.acknowledge) {
			const partnerToken = res?.data?.partner?.token;
			const checkPartner = await getPartnerDetail(partnerToken, 'PARTNER');
			const isOutOfSchedule = checkPartner?.data?.data?.status == 'OUT_OFF_SCHEDULE';

			if (!checkPartner?.meta?.acknowledge && isOutOfSchedule) {
				const params = objectToQueryString({ token: partnerToken });
				const payload = {
					from: '/finding',
					query: { token: token },
					data: checkPartner?.data?.data,
				};
				setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
				return {
					redirect: {
						destination: '/partner-closed' + '?' + params,
						permanent: false,
					},
				};
			}

			if (
				res?.data?.status === STATUS_CONSULTATION.ON_TRANSACTION &&
				res?.data?.transaction?.token
			) {
				return redirectToOrderDetail(res);
			} else if (res?.data?.status === STATUS_CONSULTATION.VERIFIED) {
				if (res?.data?.transaction?.token) {
					return redirectToOrderDetail(res);
				}

				const resVerify = await getConsulVerify(res?.data?.token, noAuth);
				if (resVerify?.meta?.acknowledge) {
					const resDetail = await getConsulDetail(
						resVerify?.data?.orderNumber,
						resVerify?.data?.token,
						noAuth,
					);
					if (resDetail?.meta?.acknowledge) {
						if (resDetail?.data?.status === STATUS_CONSULTATION.FINDING) {
							//finding
							const paramsTemp = resDetail?.data?.patient ?? {};
							if (paramsTemp?.specialist_id) {
								paramsTemp.specialistId = paramsTemp?.specialist_id;
							}

							const resTheme = await getThemeData(partnerToken);

							return {
								props: {
									initialData: {
										waitingData: resDetail?.data,
										token: token,
										params: paramsTemp,
									},
									partnerToken: partnerToken ?? null,
									...(checkIsEmpty(resTheme) ? {} : { theme: resTheme }),
								},
							};
						} else if (resDetail?.data?.status === STATUS_CONSULTATION.STARTED) {
							//started
							return {
								redirect: {
									destination: resDetail?.data?.consultationUrl,
									permanent: false,
								},
							};
						} else if (resDetail?.data?.status === STATUS_CONSULTATION.EXPIRED) {
							//expired
							throw 'expired consultation';
						} else if (
							resDetail?.data?.status === STATUS_CONSULTATION.CLOSED ||
							resDetail?.data?.status === STATUS_CONSULTATION.DONE ||
							resDetail?.data?.status === STATUS_CONSULTATION.COMPLETED
						) {
							//completed
							return {
								redirect: {
									destination: `/prescription-detail?token=${res?.data?.token}`,
									permanent: false,
								},
							};
						}
					} else {
						throw resDetail?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG;
					}
				} else {
					throw resVerify?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG;
				}
			} else {
				//redirect to form consul with data
				//todo: go to form with data from response.
				return {
					redirect: {
						destination: `/order?ct=${token}`,
						permanent: false,
					},
				};
			}
		} else {
			throw res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG;
		}

		return {
			props: {
				initialData: {
					waitingData: res?.data,
					token: token,
					params: {},
				},
			},
		};
	} catch (error) {
		return {
			error: true,
			msg: error,
		};
	}
};

export const checkParamsForSubmit = async (params: any) => {
	try {
		const res = Object.assign({}, params);
		addLog({ checkparams: res });

		let localData = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
		localData = localData?.params;
		[
			FORM_CONSULTATION.SPECIALIST,
			FORM_CONSULTATION.NAME,
			FORM_CONSULTATION.EMAIL,
			FORM_CONSULTATION.PHONE,
			FORM_CONSULTATION.AGE,
			FORM_CONSULTATION.ADDRESS,
			FORM_CONSULTATION.GENDER,
			FORM_CONSULTATION.DETAIL_ADDRESS,
			FORM_CONSULTATION.LATITUDE,
			FORM_CONSULTATION.LONGITUDE,
			FORM_CONSULTATION.POSTAL_CODE,
			FORM_CONSULTATION.ALLERGIC,
			FORM_CONSULTATION.PREEXISTING_ALLERGY,
		].forEach((e: any) => {
			if (res[e] == null) {
				res[e] = localData[e];
			}
		});

		if (res?.birthdate) {
			res.age = res?.birthdate;
		}
		if (res?.specialistId == null) {
			res.specialistId = res?.specialist_id;
		}
		if (res?.preexistingAllergy == null) {
			res.preexistingAllergy = res?.preexisting_allergy;
		}
		return res;
	} catch (error) {
		return params;
	}
};
