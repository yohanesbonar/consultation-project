import { ORDER_TYPE } from 'helper/Const';
import snapConfig from '../../../config';
import { getStorageParseDecrypt, LOCALSTORAGE } from '../../LocalStorage';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';

export const getMasterTnc = async () => {
	try {
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);

		const options = {
			url: snapConfig.BASE_API_URL + API.MASTER_TNC,
			headers: {
				auth: global.tokenAuthorization ?? consulSession?.tokenAuthorization,
			},
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get master tnc : ', error);
		return errorHandler(error);
	}
};

export const getMasterTncPartner = async (xid: string | string[]) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.MASTER_TNC_PARTNER,
			headers: {
				xid: xid,
			},
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get master tnc partner : ', error);
		return errorHandler(error);
	}
};

export const getPartnerDetail = async (
	token: string | string[],
	type = ORDER_TYPE.PIVOT,
	noAuth = false,
) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.MASTER_PARTNER_DETAIL,
			headers: {
				...(type == null || type == ORDER_TYPE.PIVOT ? { token: token } : { ct: token }),
			},
			noAuth: type != ORDER_TYPE.PIVOT || noAuth,
		};
		const response = await API_CALL(options, 'application/json; charset=UTF-8', true);
		return response;
	} catch (error) {
		console.log('error on get parter detail : ', error);
		return errorHandler(error);
	}
};

export const getServerTime = async () => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.GET_SERVER_TIME,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get server time : ', error);
		return errorHandler(error);
	}
};

export const addLog = async (params) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.ADD_LOG,
			data: params,
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on add log: ', error);
		return errorHandler(error);
	}
};

export const checkWhitelist = async (params: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CHECK,
			data: params,
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on check whitelist: ', error);
		return errorHandler(error);
	}
};

export const getDashboard = async (token: string | string[]) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.DASHBOARD,
			headers: {
				token: token,
			},
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get dashboard : ', error);
		return errorHandler(error);
	}
};

export const getContactUrl = async (token: string | string[]) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONTACT_URL,
			headers: {
				token: token,
			},
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get contact_url ', error);
		return errorHandler(error);
	}
};

export const getMasterPostalCode = async (
	token: string | string[],
	params: { keyword: string; page: number },
) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.POSTAL_CODE,
			headers: {
				token,
			},
			params,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.error('error on get postal code : ', error);
		return errorHandler(error);
	}
};
