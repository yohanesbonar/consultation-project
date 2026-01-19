import {
	GET_PRESCRIPTION,
	SET_TIME,
	SET_OPEN_BOTTOMSHEET_END_CONSUL,
	SET_FORM_PROGRESS,
	SET_IS_SENDING_CHAT,
	GET_FEEDBACK_LIST,
	SET_END_CONSULTATION,
	SHOW_END_CONSULTATION,
	SET_IS_PAGE_LOADING,
	GET_CONSUL_DETAIL,
	SET_IS_CHAT_EXPIRED,
	SET_NETWORK_STATE,
	GET_TNC_PATIENT,
	SET_OFFLINE_STATE,
	SET_ERROR_ALERT,
	SET_USER_INFO,
	GET_DASHBOARD_REASON,
	SET_CONTACT_URL,
	SET_THEME,
	SET_DEVICE_RESULT,
	SET_COLOR_CSS_OBJECT,
	SHIELD_START,
	SHIELD_SUCCESS,
	SHIELD_ERROR,
	SHIELD_TIMEOUT,
	SHIELD_RESET,
	SET_TOKEN_ORDER,
} from '../actions/generalAction';

const initialState = {
	contactUrl: 'https://wa.me/6281399969269',
	prescription: {
		result: false,
		loading: false,
		error: false,
	},
	userInfo: {
		result: null,
		error: false,
	},
	timeLeft: 100,
	openBottomsheetEndConsul: false,
	formProgress: null,
	isSendingChat: false,
	feedback: {
		result: [],
		loading: false,
		error: false,
	},
	endConsultation: {
		result: false,
		loading: false,
		error: false,
		meta: { acknowledge: false },
	},
	showEndConsultation: false,
	isPageLoading: false,
	consulDetail: {
		result: false,
		loading: false,
		error: false,
	},
	isChatExpired: false,
	networkState: {
		isOnline: true,
		isNeedToReconnect: false,
		isDetected: false,
	},
	isOpenOfflineBottomsheet: false,
	tncPatient: {
		result: false,
		loading: false,
		error: false,
	},
	errorAlert: {
		danger: true,
		data: null,
	},
	dashboardReason: {
		result: false,
		loading: false,
		error: false,
	},
	theme: {
		result: null,
		error: false,
		loading: true,
		isByLocal: false,
	},
	deviceResult: {
		result: null,
		loading: false,
		error: false,
	},
	tokenOrder: null,
	colorTonal: {
		brightness: 0,
	},
};

const generalReducer = (
	state = initialState,
	action: {
		type: string;
		payload: any;
	},
) => {
	switch (action.type) {
		case SET_CONTACT_URL:
			return {
				...state,
				contactUrl: action.payload,
			};
		case GET_PRESCRIPTION:
			return {
				...state,
				prescription: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case SET_TIME:
			return { ...state, timeLeft: action.payload };
		case SET_OPEN_BOTTOMSHEET_END_CONSUL:
			return { ...state, openBottomsheetEndConsul: action.payload };
		case SET_FORM_PROGRESS:
			return { ...state, formProgress: action.payload };
		case SET_IS_SENDING_CHAT:
			return { ...state, isSendingChat: action.payload };
		case GET_FEEDBACK_LIST:
			return {
				...state,
				feedback: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case SET_END_CONSULTATION:
			return {
				...state,
				endConsultation: {
					meta: action.payload.meta,
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case SHOW_END_CONSULTATION:
			return { ...state, showEndConsultation: action.payload };
		case SET_IS_PAGE_LOADING:
			return { ...state, isPageLoading: action.payload };
		case GET_CONSUL_DETAIL:
			return {
				...state,
				consulDetail: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case SET_IS_CHAT_EXPIRED: {
			return {
				...state,
				isChatExpired: action.payload,
			};
		}
		case SET_NETWORK_STATE:
			return {
				...state,
				networkState: action.payload,
			};
		case GET_TNC_PATIENT:
			return {
				...state,
				tncPatient: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case SET_OFFLINE_STATE:
			return {
				...state,
				isOpenOfflineBottomsheet: action.payload,
			};
		case SET_ERROR_ALERT:
			return {
				...state,
				errorAlert: action.payload,
			};
		case SET_USER_INFO:
			return {
				...state,
				userInfo: action.payload,
			};
		case SET_THEME:
			return {
				...state,
				theme: action.payload,
			};
		case GET_DASHBOARD_REASON:
			return {
				...state,
				dashboardReason: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case SET_DEVICE_RESULT:
			return { ...state, deviceResult: action.payload };

		case SET_COLOR_CSS_OBJECT:
			return { ...state, colorTonal: action.payload };

		case SHIELD_START:
			return {
				...state,
				deviceResult: {
					...state.deviceResult,
					loading: true,
					error: false,
					result: null,
				},
			};
		case SHIELD_SUCCESS:
			return {
				...state,
				deviceResult: {
					...state.deviceResult,
					loading: false,
					error: false,
					result: action.payload.result,
				},
			};
		case SHIELD_ERROR:
			return {
				...state,
				deviceResult: {
					...state.deviceResult,
					loading: false,
					error: true,
					result: action.payload.result,
					errorMessage: action.payload.errorMessage,
				},
			};
		case SHIELD_TIMEOUT:
			return {
				...state,
				deviceResult: {
					...state.deviceResult,
					loading: false,
					error: true,
					result: action.payload.result,
					errorMessage: action.payload.errorMessage,
				},
			};
		case SHIELD_RESET:
			return {
				...state,
				deviceResult: {
					...state.deviceResult,
					loading: false,
					error: false,
					result: null,
					errorMessage: null,
				},
			};
		case SET_TOKEN_ORDER:
			return {
				...state,
				tokenOrder: action.payload,
			};
		default:
			return { ...state };
	}
};

export default generalReducer;
