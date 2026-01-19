import { decryptData } from '../Common';

export const getSessionStorage = async (key: string) => {
	const res = (await sessionStorage.getItem(key)) ?? null;
	return res;
};

export const getSessionParseDecrypt = async (key: string) => {
	try {
		return JSON.parse(await decryptData(sessionStorage.getItem(key)));
	} catch (error) {
		console.log('error : ', error);
	}
};

export const SESSIONSTORAGE = {
	ORDER: 'ORDER',
	CONSULTATION: 'CONSULTATION',
};
