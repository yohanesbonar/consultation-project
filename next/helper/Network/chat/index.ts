import snapConfig from '../../../config';
import { getStorageParseDecrypt, LOCALSTORAGE } from '../../LocalStorage';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';
import { parse } from 'node-html-parser';

export const getConsulUser = async (orderNumber: string, type: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION + `/${orderNumber}/${type}/user`,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get user detail : ', error);
		return errorHandler(error);
	}
};

export const getConsulVerify = async (token: string, noAuth = false) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSUL_VERIFY + `/${token}`,
			noAuth,
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get user detail : ', error);
		return errorHandler(error);
	}
};

export const getConsulDetail = async (orderNumber: string, token?: string, noAuth = false) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSUL_DETAIL + `/${orderNumber}`,
			...(token
				? {
						headers: {
							Authorization: token,
						},
				  }
				: {}),
			noAuth,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on getConsulDetail : ', error);
		return errorHandler(error);
	}
};

export const getConsulHistory = async (orderNumber: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSUL_HISTORY + `/${orderNumber}`,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on getConsulDetail : ', error);
		return errorHandler(error);
	}
};

export const sendChat = async (params) => {
	try {
		// const consulSession = await getSessionParseDecrypt(
		// 	SESSIONSTORAGE.CONSULTATION,
		// );
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
		const options = {
			url: snapConfig.BASE_API_URL + API.SEND_CHAT,
			data: params?.data,
			method: 'POST',
			headers: {
				auth: global.tokenAuthorization ?? consulSession?.tokenAuthorization,
				room: global?.roomId,
			},
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on send chat : ', error);
		return errorHandler(error);
	}
};

export const endConsultation = async (orderNumber: string, body) => {
	try {
		// const consulSession = await getSessionParseDecrypt(
		// 	SESSIONSTORAGE.CONSULTATION,
		// );
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
		const options = {
			url: snapConfig.BASE_API_URL + API.TELECONSULTATION + `/${orderNumber}/close`,
			data: body,
			method: 'POST',
			headers: {
				auth: global.tokenAuthorization ?? consulSession?.tokenAuthorization,
			},
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on send chat : ', error);
		return errorHandler(error);
	}
};

export const getDocComplete = async (orderNumber: string) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSULTATION + `/${orderNumber}/document-complete`,
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on getDocComplete : ', error);
		return errorHandler(error);
	}
};

type FetchConsulDetailParamsType = {
	orderNumber: string;
	auth: string;
};
export const fetchConsulDetail = async ({ orderNumber, auth }: FetchConsulDetailParamsType) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CONSUL_DETAIL + `/${orderNumber}`,
			headers: { Authorization: auth },
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on fetchConsulDetail : ', error);
		return errorHandler(error);
	}
};

export const fetchMetadataInfo = async (url: string) => {
	try {
		if (url != '') {
			const abortController = new AbortController();
			const request = fetch(`${snapConfig.BASE_URL}/metadata?url=${url}`, {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
				},
				signal: abortController.signal,
			});
			const abortControllerTimeout = setTimeout(() => {
				abortController.abort();
			}, 3000);
			const responses = await request;
			clearTimeout(abortControllerTimeout);

			const html = await responses.text();

			if (responses?.ok) {
				const htmlParsed = parse(html);
				const title = htmlParsed.querySelector('title')?.text ?? '';
				const description =
					htmlParsed?.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
				const thumbnail =
					htmlParsed?.querySelector('meta[property="og:image"]')?.getAttribute('content') ??
					'';
				return {
					title,
					description,
					thumbnail,
				};
			}
			if (!responses?.ok) {
				throw new Error('Failed to fetch metadata');
			}
		}
	} catch (error) {
		console.error('Error fetching metadata:', error);
	}
};
