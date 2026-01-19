import axios from 'axios';
import moment from 'moment';
import snapConfig from '../../../config';
import { store } from '../../../redux/next-store-wrapper';
import { setNetworkState as setNetworkStateRedux } from '../../../redux/trigger';
import { MESSAGE_CONST } from '../../Const';
import { LOCALSTORAGE, getStorageParseDecrypt } from 'helper/LocalStorage';

// Custom fetch adapter for axios
const fetchAdapter = async (config: any) => {
	try {
		// Build URL with params
		let url = config.url;

		if (config.params) {
			const urlObj = new URL(url, window.location.origin);
			Object.entries(config.params).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					value.forEach((v) => urlObj.searchParams.append(key, v));
				} else if (value !== null && value !== undefined) {
					urlObj.searchParams.append(key, value as string);
				}
			});
			url = urlObj.toString();
		}

		// Build headers
		const headers = { ...config.headers };

		// Automatic JSON transformation for request body
		let body = config.data;
		if (body !== undefined && body !== null) {
			if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
				// Keep as-is for binary data
			} else if (typeof body === 'object') {
				// Automatically stringify objects
				body = JSON.stringify(body);
				if (!headers['Content-Type']) {
					headers['Content-Type'] = 'application/json';
				}
			}
		}

		const response = await fetch(url, {
			method: config?.method?.toUpperCase(),
			headers: headers,
			body: body,
			credentials: 'omit', // Don't send cookies!
			...(url?.endsWith?.('partner/gettheme') ? {} : { cache: 'no-store' }),
		});
		// Automatic JSON transformation for response
		let responseData;
		const contentType = response.headers.get('content-type');
		try {
			if (contentType && contentType.includes('application/json')) {
				const text = await response.text();
				responseData = text ? JSON.parse(text) : null;
			} else {
				responseData = await response.text();
			}
		} catch (e) {
			responseData = null;
		}

		// Build axios-style response object
		const axiosResponse = {
			data: responseData,
			status: response.status,
			statusText: response.statusText,
			headers: Object.fromEntries(response.headers.entries()),
			config: config,
			request: {
				responseURL: response.url,
			},
		};

		// Check if status is in success range (2xx)
		if (response.status >= 200 && response.status < 300) {
			return axiosResponse;
		}

		// Throw error for non-2xx status codes (matches axios behavior)
		const error: any = new Error(`Request failed with status code ${response.status}`);
		error.name = 'AxiosError';
		error.code = 'ERR_BAD_REQUEST';
		error.config = config;
		error.request = {
			responseURL: response.url,
		};
		error.response = axiosResponse;
		throw error;
	} catch (error) {
		console.log('error fetch -----', error);
		if (error.response) {
			throw error;
		}

		// Handle network errors (no response)
		const networkError: any = new Error(error.message || 'Network Error');
		networkError.name = 'AxiosError';
		networkError.code = 'ERR_NETWORK';
		networkError.config = config;
		networkError.request = {};
		throw networkError;
	}
};

export const API_CALL = async (
	option: any = 'GET',
	contentType = 'application/json; charset=UTF-8',
	returnErrResponse = false,
) => {
	try {
		let consulSession: any;
		try {
			if (!option?.headers?.Authorization && !option?.headers?.auth && !option?.noAuth) {
				consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
			}
		} catch (error) {
			console.log('error on get storage : ', error);
		}
		const timezone = moment().format('Z');
		const { verifyData } = store.getState();
		const auth =
			global.tokenAuthorization ||
			consulSession?.tokenAuthorization ||
			verifyData?.verifyData?.token;
		const API_OPTION = {
			...option,
			baseURL: snapConfig.BASE_API_URL,
			headers: {
				'Content-Type': contentType,
				...(auth ? { Authorization: auth, auth: auth } : {}),
				timezone: timezone,
				countrycode: 'ID',
				...(option?.headers ?? {}),
			},
			...(option?.url?.endsWith('/file/upload') ||
			option?.url?.endsWith('/file/') ||
			option?.url?.includes('blob')
				? {}
				: { adapter: fetchAdapter }),
		};
		// console.info('API OPTION API CALL -> ', API_OPTION);
		const res = await axios.request(API_OPTION);
		// console.log('res API CALL -> ', res);

		setNetworkStateRedux({
			isOnline: true,
			isNeedToReconnect: false,
			isDetected: false,
		});

		return responseHandler(res);
	} catch (error) {
		if (error?.code == 'ERR_NETWORK') {
			setNetworkStateRedux({
				isOnline: false,
				isNeedToReconnect: true,
				isDetected: false,
			});
		}
		// console.log('error on call api : ', error);
		const error_temp =
			error && error.response
				? returnErrResponse
					? error.response
					: error.response.data
				: error
				? error
				: { message: MESSAGE_CONST.SOMETHING_WENT_WRONG };
		return error_temp;
	}
};

//return data from response
export const responseHandler = (res) => {
	return res.data;
};

// convert error response from axios
export const errorHandler = (error) => {
	const response = error;

	return response;
};

export const isClientErrorCode = (code: number) => {
	return code >= 400 && code < 500;
};

export const isServerErrorCode = (code: number) => {
	return code >= 500 && code <= 599;
};

export const isBlockedUser = (code: number, message: string) => {
	return (
		code === 400 &&
		message === 'You are unable to do this action, please contact our customer service.'
	);
};
