export const SUBMIT_CONSULTATION = 'CONSULTATION/SUBMIT_CONSULTATION';
export const PATIENT_DETAIL = 'CONSULTATION/PATIENT_DETAIL';
export const PROFESSION_LIST = 'CONSULTATION/PROFESSION_LIST';
export const PIVOT_PARAMS = 'CONSULTATION/PIVOT_PARAMS';
export const GENERAL_SETTING = 'CONSULTATION/GENERAL_SETTING';

import {
	sendConsultation,
	detailDoctorPatient,
	masterProfessionFeedback,
	getConsulationGeneralSetting,
} from '../../helper/Network/consultation';

export const submitConsultation: any = (orderNumber: string, body: any) => {
	return async (dispatch: any) => {
		dispatch({
			type: SUBMIT_CONSULTATION,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const data = await sendConsultation(orderNumber, body);
			dispatch({
				type: SUBMIT_CONSULTATION,
				payload: {
					loading: false,
					data: data.results,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: SUBMIT_CONSULTATION,
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

export const patientDetail: any = (orderNumber: string, type: string) => {
	return async (dispatch: any) => {
		dispatch({
			type: PATIENT_DETAIL,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const data = await detailDoctorPatient(orderNumber, type);
			dispatch({
				type: PATIENT_DETAIL,
				payload: {
					loading: false,
					data: data.data,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: PATIENT_DETAIL,
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

export const professionList: any = (type: any) => {
	return async (dispatch: any) => {
		dispatch({
			type: PROFESSION_LIST,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const data = await masterProfessionFeedback(type);
			dispatch({
				type: PROFESSION_LIST,
				payload: {
					loading: false,
					data: data.data,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: PROFESSION_LIST,
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

export const generalSetting: any = () => {
	return async (dispatch: any) => {
		dispatch({
			type: GENERAL_SETTING,
			payload: {
				loading: true,
				data: false,
				errorMessage: false,
			},
		});

		try {
			const data = await getConsulationGeneralSetting();
			dispatch({
				type: GENERAL_SETTING,
				payload: {
					loading: false,
					data: data.data,
					errorMessage: false,
				},
			});
			return data;
		} catch (error) {
			dispatch({
				type: GENERAL_SETTING,
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

export const setPivotParamsAction = (object: any) => ({
	type: PIVOT_PARAMS,
	payload: object,
});
