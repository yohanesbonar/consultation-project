import snapConfig from '../../../config';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';

export const sendConsultation = async (orderNumber: string, body) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION + `/${orderNumber}/patient`,
			data: body,
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const submitSelfOrderConsultation = async (body, token?: string, ct?: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION_ORDER_SELF,
			data: body,
			method: 'POST',
			headers: {
				...(token ? { token: token } : {}),
				...(ct ? { ct: ct } : {}),
			},
			noAuth: true,
		};
		const response = await API_CALL(options, 'application/json; charset=UTF-8', true);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const detailDoctorPatient = async (orderNumber: string, type: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION + `/${orderNumber}/${type}/user`,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const masterProfessionFeedback = async (type: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION + `/master/${type}`,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const tncDetail = async (slug: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TNC + `/${slug}/detail`,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const submitPartnerOrderConsultation = async (body) => {
	try {
		const options: any = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION_ORDER_PARTNER,
			data: {
				token: body.token,
				...(body?.consultation_id_full
					? { consultation_id_full: body?.consultation_id_full, device: body?.device }
					: { device: body?.device }),
			},
			method: 'POST',
		};
		if (body?.auth) {
			options.headers = {
				Authorization: body.auth,
			};
		}
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const getConsultationDetailPartner = async (token?: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION_DETAIL_PARTNER,
			headers: {
				token: token,
			},
			noAuth: true,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const actionConsultation = async () => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.ACTION_CONSULTATION,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const authToken = async (body) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.AUTH_TOKEN,
			data: {
				partner: body,
			},
			method: 'POST',
			headers: {
				Authorization: 'null',
			},
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const updateConsulStatus = async (body) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.UPDATE_CONSUL_STATUS,
			data: body,
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const getRoomStatus = async (waitingRoom?: string, token?: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.ROOM_STATUS,
			data: {
				waitingRoom: waitingRoom,
			},
			method: 'POST',
			headers: {
				token,
			},
			noAuth: true,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const getConsulationGeneralSetting = async () => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION_GENERAL_SETTING,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get consultation general setting ', error);
		return errorHandler(error);
	}
};
