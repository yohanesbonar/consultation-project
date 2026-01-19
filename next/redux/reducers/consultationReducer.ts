import {
	SUBMIT_CONSULTATION,
	PATIENT_DETAIL,
	PROFESSION_LIST,
	PIVOT_PARAMS,
	GENERAL_SETTING,
} from '../actions/consultationAction';

const initialState = {
	consultation: {
		result: false,
		loading: false,
		error: false,
	},
	patient: {
		result: false,
		loading: false,
		error: false,
	},
	profession: {
		result: [],
		loading: false,
		error: false,
	},
	pivotParams: {},
	generalSetting: {
		result: false,
		loading: false,
		error: false,
	},
};

const consultationReducer = (
	state = initialState,
	action: {
		type: string;
		payload: any;
	},
) => {
	switch (action.type) {
		case SUBMIT_CONSULTATION:
			return {
				...state,
				consultation: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case PATIENT_DETAIL:
			return {
				...state,
				patient: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case PROFESSION_LIST:
			return {
				...state,
				profession: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		case PIVOT_PARAMS:
			return {
				...state,
				pivotParams: action.payload,
			};
		case GENERAL_SETTING:
			return {
				...state,
				generalSetting: {
					result: action.payload.data,
					loading: action.payload.loading,
					error: action.payload.errorMessage,
				},
			};
		default:
			return { ...state };
	}
};

export default consultationReducer;
