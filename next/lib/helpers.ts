import CryptoJS from 'crypto-js';

const whitelists = ['juR1q5seqQpuppeteerprescript', 'DJe5MZ6Uautomation'];

export function checkWhitelist(k: string): boolean {
	return whitelists.some((e) => e === k);
}

export function encryptData(params?: any): string | null {
	if (params === undefined || params === null) {
		return null;
	}
	try {
		let str = params;
		if (typeof str === 'object' || Array.isArray(str)) {
			str = JSON.stringify(str);
		} else {
			str = str?.toString();
		}

		const ciphertext = CryptoJS.AES.encrypt(str, process.env.NEXT_PUBLIC_SNAP_KEY || '');

		return ciphertext.toString();
	} catch (error) {
		console.error('error on error encrypt : ', error);
		return null;
	}
}

export function decryptData(params?: any): string | null {
	if (params === undefined || params === null) {
		return null;
	}

	try {
		const bytes = CryptoJS.AES.decrypt(params, process.env.NEXT_PUBLIC_SNAP_KEY || '');
		const plaintext = bytes.toString(CryptoJS.enc.Utf8);
		return plaintext;
	} catch (error) {
		console.error('error on decrypt : ', error);
		return null;
	}
}

export function checkIsEmpty(value: any): boolean {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'object' && Object.keys(value).length === 0) ||
		(typeof value === 'string' && value.trim().length === 0)
	);
}

/**
 * Log API errors with simplified format
 * Only logs status and response data (which contains meta/acknowledge)
 */
export function logApiError(endpoint: string, error: any): void {
	const status = error?.response?.status || 500;
	const data = error?.response?.data || null;

	console.error(`[API Error] ${endpoint}`, {
		status,
		data,
	});
}
