import snapConfig from '../../../config';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';

export const storeData = async (params: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.STOREDATA,
			data: { params: params },
			method: 'POST',
			noAuth: true,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on store data: ', error);
		return errorHandler(error);
	}
};

export const getData = async (params: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.GETDATA,
			data: { params: params },
			method: 'POST',
			noAuth: true,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get data: ', error);
		return errorHandler(error);
	}
};
