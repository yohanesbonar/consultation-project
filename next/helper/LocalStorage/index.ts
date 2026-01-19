/* eslint-disable no-unsafe-finally */
import { decryptData, encryptData } from '../Common';

export const getLocalStorage = async (key: string | null) => {
	if (typeof window === 'undefined') return null;
	const res = (await localStorage.getItem(key)) ?? null;
	return res;
};

export const getParsedLocalStorage = async (key: string | null) => {
	if (typeof window === 'undefined') return null;
	let res;
	try {
		res = (await localStorage.getItem(key)) ?? null;
		res = JSON.parse(res);
	} catch (error) {
		console.log('error : ', error);
	} finally {
		return res;
	}
};

export const setLocalStorage = async (key: string, value: any) => {
	if (typeof window === 'undefined') return;
	await localStorage.setItem(key, value);
};

export const setStringifyLocalStorage = async (key: string, value: any) => {
	if (typeof window === 'undefined') return;
	try {
		const valStringify = JSON.stringify(value);
		await localStorage.setItem(key, valStringify);
	} catch (error) {
		console.log('error : ', error);
	}
};

export const removeLocalStorage = async (key: string) => {
	if (typeof window === 'undefined') return;
	try {
		await localStorage.removeItem(key);
	} catch (error) {
		console.log('error : ', error);
	}
};

export const getStorageParseDecrypt = async (key: string) => {
	try {
		// Check if running in browser (client-side)
		if (typeof window === 'undefined') {
			return null;
		}

		const data = localStorage.getItem(key);
		if (!data) return null;

		const res = await decryptData(data);
		return JSON.parse(res);
	} catch (error) {
		console.log('error getStorageParseDecrypt: ', error);
		return null;
	}
};

export const getStorageDecrypt = async (key: string) => {
	if (typeof window === 'undefined') return null;
	try {
		const temp = localStorage.getItem(key);
		if (temp) {
			return await decryptData(temp);
		} else {
			null;
		}
	} catch (error) {
		console.log('error : ', error);
		return null;
	}
};

export const setStorageEncrypt = async (key: string, body: any) => {
	if (typeof window === 'undefined') return;
	try {
		return localStorage.setItem(key, await encryptData(body));
	} catch (error) {
		console.log('error : ', error);
	}
};

export const LOCALSTORAGE = {
	USER: 'USER',
	FORM_CONSULTATION: 'FORM_CONSULTATION',
	CHATDETAIL_COACHMARK: 'CHATDETAIL_COACHMARK',
	VERIFY_TOKEN: 'VERIFY_TOKEN',
	CHAT_EXPIRED_ALREADY: 'CHAT_EXPIRED_ALREADY',
	ORDER: 'ORDER',
	ORDER_NUMBER: 'ORDER_NUMBER',
	ORDER_DETAIL: 'ORDER_DETAIL',
	CONSULTATION: 'CONSULTATION',
	XID: 'XID',
	INITIAL_FORM: 'INITIAL_FORM',
	EMAILED_PRESCRIPTION: 'EMAILED_PRESCRIPTION',
	PARTNER_CONSUL: 'PARTNER_CONSUL',
	REDIRECT_URL: 'REDIRECT_URL',
	LOGO: 'LOGO',
	TRANSACTION: 'TRANSACTION',
	PRODUCT_TRANSACTION: 'PRODUCT_TRANSACTION',
	PAYMENT: 'PAYMENT',
	ATTACHMENT: 'ATTACHMENT',
	ADDRESS: 'ADDRESS',
	TEMP_ADDRESS: 'TEMP_ADDRESS',
	CART: 'CART',
	SHIPMENT: 'SHIPMENT',
	BACKTOTRX: 'BACKTOTRX',
	CR_PARTNER: 'CR_PARTNER',
	DEVICE: 'DEVICE',
	CART_TOAST: 'CART_TOAST',
	PARTNER_CLOSED: 'PARTNER_CLOSED',
	CHECKOUT_VOUCHER: 'CHECKOUT_VOUCHER',
	TEMP_POPUP_PRESC: 'TEMP_POPUP_PRESC',
	THEME: 'THEME',
	CONSULTATION_ENDED_PRESC: 'CONSULTATION_ENDED_PRESC',
	BACK_URL: 'BACK_URL',
	PARTNER: 'PARTNER',
};
