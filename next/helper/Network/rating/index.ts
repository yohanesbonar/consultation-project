import snapConfig from 'config';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';

export const getRatingList = async ({ token }: { token: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.RATING_LIST,
			headers: {
				token: token,
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get voucher list: ', error);
		return errorHandler(error);
	}
};

export const postSubmitRating = async ({ body, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.RATING_SUBMIT,
			headers: {
				token: token,
			},
			data: body,
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		errorHandler(error);
		return error;
	}
};
