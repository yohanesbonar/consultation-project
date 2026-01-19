export const SET_CONTACT_URL = 'GENERAL/SET_CONTACT_URL';
export const GET_PRESCRIPTION = 'GENERAL/GET_PRESCRIPTION';
export const SET_TIME = 'GENERAL/SET_TIME';
export const SET_OPEN_BOTTOMSHEET_END_CONSUL = 'GENERAL/SET_OPEN_BOTTOMSHEET_END_CONSUL';
export const SET_FORM_PROGRESS = 'GENERAL/FORM_PROGRESS';
export const SET_IS_SENDING_CHAT = 'GENERAL/IS_SENDING_CHAT';
export const GET_FEEDBACK_LIST = 'GENERAL/GET_FEEDBACK_LIST';
export const SET_END_CONSULTATION = 'GENERAL/SET_END_CONSULTATION';
export const SHOW_END_CONSULTATION = 'GENERAL/SHOW_END_CONSULTATION';
export const SET_IS_PAGE_LOADING = 'GENERAL/SET_IS_PAGE_LOADING';
export const GET_CONSUL_DETAIL = 'GENERAL/GET_CONSUL_DETAIL';
export const SET_IS_CHAT_EXPIRED = 'GENERAL/SET_IS_CHAT_EXPIRED';
export const SET_NETWORK_STATE = 'GENERAL/SET_NETWORK_STATE';
export const SET_OFFLINE_STATE = 'GENERAL/SET_OFFLINE_STATE';
export const SET_DEVICE_RESULT = 'GENERAL/SET_DEVICE_RESULT';

export const GET_TNC_PATIENT = 'GENERAL/GET_TNC_PATIENT';
export const SET_ERROR_ALERT = 'GENERAL/SET_ERROR_ALERT';

export const SET_USER_INFO = 'GENERAL/SET_USER_INFO';
export const SET_THEME = 'GENERAL/SET_THEME';

export const GET_DASHBOARD_REASON = 'GENERAL/GET_DASHBOARD_REASON';

export const SET_COLOR_CSS_OBJECT = 'GENERAL/SET_COLOR_CSS_OBJECT';
// Shield-specific actions
export const SHIELD_START = 'GENERAL/SHIELD_START';
export const SHIELD_SUCCESS = 'GENERAL/SHIELD_SUCCESS';
export const SHIELD_ERROR = 'GENERAL/SHIELD_ERROR';
export const SHIELD_TIMEOUT = 'GENERAL/SHIELD_TIMEOUT';
export const SHIELD_RESET = 'GENERAL/SHIELD_RESET';

export const SET_TOKEN_ORDER = 'GENERAL/SET_TOKEN_ORDER';

import { masterProfessionFeedback, tncDetail } from '../../helper/Network/consultation';
import { getPrescriptionDetail } from '../../helper/Network/prescription';
import { endConsultation, fetchMetadataInfo, getConsulDetail } from '../../helper/Network/chat';
import {
	CHAT_CONST,
	extractUrls,
	fetchCachedTheme,
	getContactUrl,
	getDashboard,
	getLocalStorage,
	getMasterTncPartner,
	getStorageDecrypt,
	LOCALSTORAGE,
	MESSAGE_CONST,
	setStringifyLocalStorage,
	setUserdata,
} from '../../helper';
import { SHIELD_ERROR_ID } from '../../helper/Shield';

export const contactUrlAction = (token: string | string[]) => {
	return async (dispatch: any) => {
		const resContactUrl = await getContactUrl(token);
		if (resContactUrl?.data?.contact_url) {
			dispatch({
				type: SET_CONTACT_URL,
				payload: resContactUrl.data.contact_url,
			});
		}
	};
};

export const setPrescription = (data: any) => ({
	type: GET_PRESCRIPTION,
	payload: data,
});

export const setUserInfo = (data: any, error = false) => ({
	type: SET_USER_INFO,
	payload: { result: data, error: error },
});

export const setTheme = (result: any, loading = false, error = false, isByLocal = false) => ({
	type: SET_THEME,
	payload: { result, loading, error, isByLocal },
});

export const getPrescription: any = (id: string) => {
	return async (dispatch: any, getState: any) => {
		const { verifyData } = getState();
		dispatch(
			setPrescription({
				loading: true,
				data: null,
				errorMessage: false,
			}),
		);

		let res: any;
		let auth = null;

		if (
			verifyData?.verifyData?.orderNumber != null &&
			verifyData?.verifyData?.orderNumber === id
		) {
			auth = verifyData?.verifyData?.token;
		}

		try {
			const data = await getPrescriptionDetail(id, auth);
			if (data?.meta?.acknowledge) {
				const themeData = await fetchCachedTheme(data?.data?.order_token);
				if (themeData?.meta?.acknowledge) {
					dispatch(setTheme(themeData?.data));
					setStringifyLocalStorage(LOCALSTORAGE.THEME, themeData?.data);
				}
				const dataTemp = data?.data;
				if (dataTemp?.patient) {
					const userInfo = await setUserdata(dataTemp);
					try {
						const address: any = await getLocalStorage(LOCALSTORAGE.ADDRESS);
						const addr = JSON.parse(address);
						if (!userInfo?.patient_postal_code) {
							userInfo.patient_postal_code = addr?.postalCode;
						}
						if (!userInfo?.patient_latitude) {
							userInfo.patient_latitude = addr?.lat;
						}
						if (!userInfo?.patient_longitude) {
							userInfo.patient_longitude = addr?.lng;
						}
						if (!userInfo?.patient_address) {
							userInfo.patient_address = addr?.name;
						}
					} catch (error) {
						console.log(error);
					}

					// make sure the address is 205 characters and detail address is 50 characters follow the GOA requirement
					if (userInfo?.patient_address) {
						userInfo.patient_address = String(userInfo?.patient_address)
							.substring(0, 205)
							.trim();
					}
					if (userInfo?.patient_detail_address) {
						userInfo.patient_detail_address = String(userInfo?.patient_detail_address)
							.substring(0, 50)
							.trim();
					}
					dispatch(setUserInfo(userInfo));
				}
				res = {
					loading: false,
					data: dataTemp,
					errorMessage: null,
				};
			} else {
				res = {
					loading: false,
					data: null,
					errorMessage:
						data?.meta?.message ?? data?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
				};
			}
			return res;
		} catch (error) {
			res = {
				type: GET_PRESCRIPTION,
				payload: {
					loading: false,
					data: false,
					errorMessage: error.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			};
			return res;
		} finally {
			dispatch(setPrescription(res));
		}
	};
};

export const setTimeLeftAction: any = (time: number) => ({
	type: SET_TIME,
	payload: time,
});

export const setIsOpenBottomsheetEndConsulAction = (bool: boolean) => ({
	type: SET_OPEN_BOTTOMSHEET_END_CONSUL,
	payload: bool,
});

export const setFormProgressAction = (data: any) => ({
	type: SET_FORM_PROGRESS,
	payload: data,
});

export const setIsSendingChatAction = (data: boolean) => ({
	type: SET_IS_SENDING_CHAT,
	payload: data,
});

export const setIsChatExpiredAction = (data: boolean) => ({
	type: SET_IS_CHAT_EXPIRED,
	payload: data,
});

export const feedbackList: any = (type) => {
	return async (dispatch: any) => {
		dispatch({
			type: GET_FEEDBACK_LIST,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const data = await masterProfessionFeedback(type);
			dispatch({
				type: GET_FEEDBACK_LIST,
				payload: {
					loading: false,
					data: data.data,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: GET_FEEDBACK_LIST,
				payload: {
					loading: false,
					data: false,
					errorMessage: error.message,
				},
			});
			return false;
		}
	};
};

export const setEndConsultation: any = (orderNumber: string, body: any) => {
	return async (dispatch: any) => {
		dispatch({
			type: SET_END_CONSULTATION,
			payload: {
				loading: true,
				data: false,
				meta: { acknowledge: false },
				errorMessage: false,
			},
		});

		try {
			const data = await endConsultation(orderNumber, body);
			dispatch({
				type: SET_END_CONSULTATION,
				payload: {
					loading: false,
					data: data.data,
					meta: data.meta,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: SET_END_CONSULTATION,
				payload: {
					loading: false,
					data: false,
					meta: { acknowledge: false },
					errorMessage: error.message,
				},
			});
			return false;
		}
	};
};

export const showEndConsulAction = (data: any) => ({
	type: SHOW_END_CONSULTATION,
	payload: data,
});

export const setIsPageLoadingAction = (bool: boolean) => ({
	type: SET_IS_PAGE_LOADING,
	payload: bool,
});

export const setNetworkStateAction = (data: {
	isOnline: boolean;
	isNeedToReconnect: boolean;
	isDetected: boolean;
}) => ({
	type: SET_NETWORK_STATE,
	payload: data,
});

export const setIsOpenOfflineBottomsheetAction = (data: boolean) => ({
	type: SET_OFFLINE_STATE,
	payload: data,
});

const checkMetaData = async (messages: any) => {
	try {
		const results = [];
		const urls = [];

		messages.forEach((items: any) => {
			const typeReq = items?.type == CHAT_CONST.MESSAGE || items?.type == CHAT_CONST.TEXT;
			const urlToMetadata = extractUrls(items?.message);
			if (urlToMetadata.length > 0) {
				urls.push(urlToMetadata[urlToMetadata?.length - 1]);
			}
			results.push({
				...items,
				metaUrl: typeReq ? urlToMetadata[urlToMetadata?.length - 1] ?? '' : '',
			});
		});

		// Array to store promises
		const promises = [];

		// Fetch data for each endpoint
		results.forEach((endpoint) => {
			promises.push(fetchMetadataInfo(endpoint.metaUrl));
		});

		// Wait for all promises to resolve
		const finalRes = await Promise.all(promises);

		// Combine data from all endpoints
		const combinedData = finalRes.reduce((acc, curr, index) => {
			const endpoint = results[index];
			return [
				...acc,
				{
					...endpoint,
					data:
						endpoint?.metaUrl?.length > 0
							? { meta: curr ?? {}, type: CHAT_CONST.LINK_CLICKABLE }
							: endpoint?.data ?? {},
				},
			];
		}, []);

		return combinedData;
	} catch (error) {
		console.log('error on check meta data : ', error);
		return null;
	}
};

export const consulDetailData: any = (orderNumber: string) => {
	return async (dispatch: any) => {
		dispatch({
			type: GET_CONSUL_DETAIL,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const data = await getConsulDetail(orderNumber);
			const newMessages =
				data?.data?.messages && data?.data?.messages?.length
					? await checkMetaData(data?.data?.messages)
					: null;
			const newData = { ...data?.data, ...(newMessages ? { messages: newMessages } : {}) };

			dispatch({
				type: GET_CONSUL_DETAIL,
				payload: {
					loading: false,
					data: newData,
					errorMessage: false,
				},
			});
			return { ...data, data: newData };
		} catch (error) {
			dispatch({
				type: GET_CONSUL_DETAIL,
				payload: {
					loading: false,
					data: false,
					errorMessage: error.message,
				},
			});
			return false;
		}
	};
};

export const getTncPatientAction: any = (slug: string) => {
	return async (dispatch: any) => {
		dispatch({
			type: GET_TNC_PATIENT,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const xidFromLocal = await getStorageDecrypt(LOCALSTORAGE.XID);

			const data = xidFromLocal
				? await getMasterTncPartner(xidFromLocal)
				: await tncDetail(slug);
			dispatch({
				type: GET_TNC_PATIENT,
				payload: {
					loading: false,
					data: data.data,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: GET_TNC_PATIENT,
				payload: {
					loading: false,
					data: false,
					errorMessage: error.message,
				},
			});
			return false;
		}
	};
};

export const setErrorAlertAction = (data: {
	danger: boolean;
	data?: {
		message?: string;
	};
}) => ({
	type: SET_ERROR_ALERT,
	payload: data,
});

export const fetchDashboardReason: any = (token: string | string[]) => {
	return async (dispatch: any) => {
		dispatch({
			type: GET_DASHBOARD_REASON,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const res = await getDashboard(token);
			dispatch({
				type: GET_DASHBOARD_REASON,
				payload: {
					loading: false,
					data: res?.data || [],
					errorMessage: false,
				},
			});
		} catch (error) {
			dispatch({
				type: GET_DASHBOARD_REASON,
				payload: {
					loading: false,
					data: false,
					errorMessage: error.message,
				},
			});
			return false;
		}
	};
};

export const setDeviceResult = (params?: { loading?: boolean; error?: boolean; result?: any }) => ({
	type: SET_DEVICE_RESULT,
	payload: params,
});

export const setColorTonal = (data: any) => ({
	type: SET_COLOR_CSS_OBJECT,
	payload: data,
});

// Shield action creators
export const shieldStart = () => ({
	type: SHIELD_START,
	payload: {
		loading: true,
		error: false,
		result: null,
	},
});

export const shieldSuccess = (deviceId: string) => ({
	type: SHIELD_SUCCESS,
	payload: {
		loading: false,
		error: false,
		result: deviceId,
	},
});

export const shieldError = (errorMessage: string) => ({
	type: SHIELD_ERROR,
	payload: {
		loading: false,
		error: true,
		result: SHIELD_ERROR_ID,
		errorMessage,
	},
});

export const shieldTimeout = () => ({
	type: SHIELD_TIMEOUT,
	payload: {
		loading: false,
		error: true,
		result: SHIELD_ERROR_ID,
		errorMessage: 'Shield operation timed out',
	},
});

export const shieldReset = () => ({
	type: SHIELD_RESET,
	payload: {
		loading: false,
		error: false,
		result: null,
	},
});

export const setTokenOrder = (tkn?: string) => ({
	type: SET_TOKEN_ORDER,
	payload: tkn,
});
