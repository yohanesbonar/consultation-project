/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-var-requires */
import { getCookie } from 'cookies-next';
import { addLog, fetchConsulDetail } from '../Network';
import { getTimeGap, getTimeLeft } from '../Time';
import moment from 'moment';
import snapConfig from 'config';
import { capitalize } from 'lodash';
import {
	BUTTON_CONST,
	CHAT_CONST,
	MESSAGE_CONST,
	ORDER_TYPE,
	STATUS_CONST,
	horizontalTrack,
} from 'helper/Const';
import { toast } from 'react-hot-toast';
import {
	LOCALSTORAGE,
	getLocalStorage,
	removeLocalStorage,
	setStorageEncrypt,
} from 'helper/LocalStorage';
import { ReactNode } from 'react';
import * as linkify from 'linkifyjs';
import { PrescriptionDetailData } from '@types';
import { API_CALL } from 'helper/Network/requestHelper';

export const getFilenameUrl = (url: string): string => {
	const regex = /([\w\d_-]*)\.?[^\\\/]*$/;
	const mathces = regex.exec(url);
	const filename = mathces[0] ? mathces[0] : url;

	return filename;
};

export const convertMB = (val = 0) => {
	let res = '0 MB';
	try {
		if (val >= 1000000) {
			res = (val / 1000000).toFixed(2) + ' MB';
		} else if (val >= 1000) {
			res = (val / 1000).toFixed(2) + ' KB';
		} else {
			res = val.toFixed(2) + ' B';
		}
		return res;
	} catch (error) {
		console.log('error on convert MB : ', error);
		return res;
	}
};

export const REGEX_CONST = {
	numeric: /[^0-9]/g,
	alphabet: /[^A-Za-z ]/g,
	email: /[^0-9A-Za-z@._-]/g,
	alpha_numeric: /[^0-9A-Za-z ]/g,
	address: /^[0-9a-zA-Z .,-/\r\n]+$/,
	phone: /^((\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
	fullname:
		/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
	full_email: /^[a-z0-9._-]{1,64}@[a-z0-9._-]{1,64}\.[a-z0-9.-]{1,64}$/i,
	emoji: /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g,
};

export const removeCharByregex = (string: string, regex: RegExp) => {
	return string.replace(regex, '');
};

export const encryptData = (params?: any) =>
	new Promise<string>((resolve) => {
		if (params == undefined || params === null) {
			resolve(null);
		}
		try {
			const CryptoJS = require('crypto-js');

			let str = params;
			if (typeof str === 'object' || Array.isArray(str)) {
				str = JSON.stringify(str);
			} else {
				str = str?.toString(); //null
			}

			const ciphertext = CryptoJS.AES.encrypt(str, snapConfig.LATCH);
			// console.log('encrypted text : ', ciphertext.toString());

			resolve(ciphertext.toString());
			/////////// temporary : find another workaruond ///////////
			// storeData(params)
			// 	.then((res: any) => {
			// 		if (res?.meta?.acknowledge) {
			// 			resolve(res?.data);
			// 		} else {
			// 			resolve(null);
			// 		}
			// 	})
			// 	.catch((e) => {
			// 		throw e;
			// 	});
		} catch (error) {
			console.log('error on error store data : ', error);
			resolve(null);
		}
	});

export const decryptData = (params?: any) =>
	new Promise<string>((resolve) => {
		if (params == undefined || params === null) {
			resolve(null);
		}
		try {
			const CryptoJS = require('crypto-js');

			const bytes = CryptoJS.AES.decrypt(params, snapConfig.LATCH);
			const plaintext = bytes.toString(CryptoJS.enc.Utf8);

			resolve(plaintext);
			/////////// temporary : find another workaruond ///////////
			// getData(params)
			// 	.then((res: any) => {
			// 		if (res?.meta?.acknowledge) {
			// 			resolve(res?.data);
			// 		} else {
			// 			resolve(null);
			// 		}
			// 	})
			// 	.catch((e) => {
			// 		throw e;
			// 	});
		} catch (error) {
			console.log('error on error get data : ', error);
			resolve(null);
		}
	});

export const storePathValues = () => {
	const storage = globalThis?.sessionStorage;
	if (!storage) return;
	const prevPath = storage.getItem('currentPath');
	const currentPath = globalThis.location.pathname;
	if (prevPath !== currentPath) {
		storage.setItem('prevPath', prevPath);
		storage.setItem('currentPath', currentPath);
	}
};

export const checkIsEmpty = (value) => {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'object' && Object.keys(value).length === 0) ||
		(typeof value === 'string' && value.trim().length === 0)
	);
};

export const checkCookieSession = async (req, res) => {
	try {
		let sessionData;
		let timeGapServer;
		const getSession = await getCookie('consulSession', { req, res });
		if (getSession) {
			const decrypytdata = await decryptData(getSession);
			sessionData = JSON.parse(decrypytdata);

			try {
				const consulDetail = await fetchConsulDetail({
					orderNumber: sessionData.orderNumber,
					auth: sessionData.tokenAuthorization,
				});
				timeGapServer = getTimeGap(new Date(), consulDetail?.meta?.at);
				const timeLeftTemp = getTimeLeft(
					consulDetail?.data?.expiredAt,
					moment().add(timeGapServer ?? 0, 'seconds'),
				);
				return {
					timeLeft: timeLeftTemp,
					status: consulDetail?.data?.status ?? null,
					...(consulDetail?.data ?? {}),
				};
			} catch (error) {
				return error;
			}
		} else {
			return null;
		}
	} catch (error) {
		console.log('err', error);
	}
};

export const numberToIDR = (number?: number) => {
	return number != null ? 'Rp' + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
};

export const toAmmount = (number?: number) => {
	return number != null ? number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
};

export const capitalizeEachWords = (words: string) => {
	try {
		if (words != null) {
			const wordsArr = words.split(' ');
			let res = '';
			wordsArr.forEach((e) => {
				res += ' ' + capitalize(e);
			});
			return res.trim();
		} else {
			return words;
		}
	} catch (error) {
		console.log('error on capitalize each words : ', error);
		return words;
	}
};

export const getButtonTrxTextByConditionProduct = (data?: any, meta?: any) => {
	const isPendingButExpired =
		(data?.payment_status == STATUS_CONST.PENDING ||
			data?.payment_status == STATUS_CONST.CREATED) &&
		moment(meta?.at).isAfter(moment(data?.payment_expired_at));

	let text = BUTTON_CONST.VIEW_HOW_TO_PAY;
	if (data?.payment_status == STATUS_CONST.PENDING && !isPendingButExpired) {
		text = BUTTON_CONST.CHECK_PAYMENT;
	} else if (data?.shipping_status == STATUS_CONST.ARRIVED) {
		text = BUTTON_CONST.ORDER_RECEIVED;
	} else if (
		data?.payment_status === STATUS_CONST.SUCCESS &&
		(data?.shipping_status === STATUS_CONST.DONE ||
			data?.shipping_status === STATUS_CONST.COMPLETED)
	) {
		text = BUTTON_CONST.ORDER_AGAIN;
	} else if (
		data?.shipment_tracking?.length > 0 &&
		(data?.shipping_status == STATUS_CONST.SENT || data?.shipping_status == STATUS_CONST.PENDING)
	) {
		text = BUTTON_CONST.TRACK_ORDER;
	} else if (
		data?.payment_status == STATUS_CONST.EXPIRED ||
		data?.payment_status == STATUS_CONST.FAILED ||
		data?.payment_status === STATUS_CONST.CANCELLED ||
		isPendingButExpired
	) {
		text = BUTTON_CONST.TRY_AGAIN;
	} else if (
		data?.shipment_tracking?.length > 0 &&
		data?.shipping_status != STATUS_CONST.SENT &&
		data?.shipping_status != STATUS_CONST.ARRIVED
	) {
		text = BUTTON_CONST.VIEW_ORDER_STATUS;
	}

	return text;
};

export const getButtonTrxTextByCondition = (data?: any, type = ORDER_TYPE.ORDER, meta?: any) => {
	if (type == ORDER_TYPE.PRODUCT) {
		return getButtonTrxTextByConditionProduct(data, meta);
	}
	let text = BUTTON_CONST.START_CONSULTATION;
	if (data?.payment_status == STATUS_CONST.PENDING) {
		text = BUTTON_CONST.CHECK_PAYMENT;
	} else if (
		data?.payment_status == STATUS_CONST.REFUNDED ||
		(data?.payment_status === STATUS_CONST.SUCCESS &&
			data?.consultation_status === STATUS_CONST.EXPIRED)
	) {
		text = BUTTON_CONST.ORDER_AGAIN;
	} else if (
		data?.payment_status === STATUS_CONST.SUCCESS &&
		(data?.consultation_status === STATUS_CONST.DONE ||
			data?.consultation_status === STATUS_CONST.CANCELLED)
	) {
		text = BUTTON_CONST.LIHAT_RINGKASAN;
	} else if (
		data?.payment_status == STATUS_CONST.SUCCESS &&
		data?.consultation_status == STATUS_CONST.READY &&
		data?.shipment_tracking?.length === 0
	) {
		text = BUTTON_CONST.START_CONSULTATION;
	} else if (
		data?.payment_status == STATUS_CONST.SUCCESS &&
		data?.consultation_status == STATUS_CONST.STARTED
	) {
		text = BUTTON_CONST.CONTINUE_CONSULTATION;
	} else if (
		data?.payment_status == STATUS_CONST.EXPIRED ||
		data?.payment_status == STATUS_CONST.FAILED ||
		data?.payment_status === STATUS_CONST.CANCELLED
	) {
		text = BUTTON_CONST.TRY_AGAIN;
	}
	return text;
};

export const showToast = (
	msg = MESSAGE_CONST.SOMETHING_WENT_WRONG,
	additionalStyle: object = {},
	type: 'error' | 'success' = 'error',
	duration?: number,
) => {
	try {
		toast.dismiss();
		if (type == 'error') {
			toast.error(msg, {
				icon: null,
				style: { background: '#B00020', color: '#FFFFFF', width: '100%', ...additionalStyle },
				duration: duration && duration,
			});
		} else {
			toast.success(msg, { style: additionalStyle ?? null, duration: duration && duration });
		}
	} catch (error) {
		console.log('error on show Toast : ', error);
	}
};

export const setUserdata = async (params?: any) => {
	const patient = params?.patient ?? [];
	let userInfo = params?.patient_data;
	try {
		[
			'patient_phonenumber',
			'patient_address',
			'patient_detail_address',
			'patient_longitude',
			'patient_latitude',
			'patient_postal_code',
		].forEach((e: string) => {
			if (userInfo[e] == null) {
				userInfo[e] = patient?.find((e: any) => e?.label == e)?.value;
			}
		});
		userInfo = {
			...userInfo,
			patient_name: patient?.find((e: any) => e?.label == 'Nama Pasien')?.value,
			patient_gender: patient?.find((e: any) => e?.label == 'Jenis Kelamin')?.value,
			patient_age: patient?.find((e: any) => e?.label == 'Usia')?.value,
		};
	} catch (error) {
		console.log('error on set user data : ', error);
		userInfo = params?.patient_data;
	}

	userInfo = await setUserDataByLocalstorage(userInfo);
	return userInfo;
};

export const setUserDataByLocalstorage = async (params?: any) => {
	const userInfo = Object.assign({}, params);

	try {
		const address: any = await getLocalStorage(LOCALSTORAGE.ADDRESS);
		const addr = JSON.parse(address);
		if (!userInfo?.patient_postal_code) {
			userInfo.patient_postal_code = addr?.postalCode;
		}
		if (!userInfo?.patient_latitude) {
			userInfo.patient_latitude = addr?.lat;
		}
		if (!userInfo?.patient_longitude) {
			userInfo.patient_longitude = addr?.lng;
		}
		if (!userInfo?.patient_address) {
			userInfo.patient_address = addr?.name;
		}
	} catch (error) {
		console.log(error);
	}

	return userInfo;
};

export const checkShippmentStatus = (currentStatus: string, setTrack: any) => {
	const _track = [...horizontalTrack];
	_track.map((item: any) => {
		switch (currentStatus) {
			case STATUS_CONST.CREATED:
				if (item.id === 1) {
					item.isComplete = false;
					item.isActive = true;
				}
				break;
			case STATUS_CONST.ON_PROCESS:
				if (item.id === 1) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 2) {
					item.isComplete = false;
					item.isActive = true;
				}
				break;
			case STATUS_CONST.SENT:
				if (item.id === 1) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 2) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 3) {
					item.isComplete = false;
					item.isActive = true;
				}
				break;
			case STATUS_CONST.ARRIVED:
				if (item.id === 1) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 2) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 3) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 4) {
					item.isComplete = true;
					item.isActive = false;
				}
				break;
			case STATUS_CONST.COMPLETED:
				if (item.id === 1) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 2) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 3) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 4) {
					item.isComplete = true;
					item.isActive = false;
				}
				break;
			case STATUS_CONST.COMPLAIN:
				if (item.id === 1) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 2) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 3) {
					item.isComplete = true;
					item.isActive = false;
				}
				if (item.id === 4) {
					item.isComplete = true;
					item.isActive = false;
				}
				break;

			default:
				break;
		}
	});

	setTrack(_track);
};

export const copyValue = (value: string | number | ReactNode, message: string) => {
	try {
		if (typeof value === 'string') {
			navigator.clipboard.writeText(value);
			toast.dismiss();
			toast.success(message);
		}
	} catch (error) {
		console.log('error on copy : ', error);
	}
};

export const detectEmailProvider = (emailAddress: string) => {
	const domain = emailAddress.split('@')[1];

	const isGmail = 'gmail.com' || 'gmail.co.id';
	const isYahoo = 'yahoo.com' || 'ymail.com' || 'yahoo.co.id' || 'ymail.co.id';
	const isOutlook = 'outlook.com' || 'outlook.co.id';
	const isYopMail = 'yopmail.com' || 'yopmail.co.id';

	switch (domain) {
		case isGmail:
			return 'Gmail';
		case isYahoo:
			return 'Yahoo';
		case isOutlook:
			return 'Outlook';
		case isYopMail:
			return 'YOPmail';

		default:
			return 'Unknown';
	}
};

export const openMailApp = (email: string) => {
	const provider = detectEmailProvider(email);

	let _url: string;

	switch (provider) {
		case 'Gmail':
			_url = `https://mail.google.com/mail/u/0/#inbox`;
			break;
		case 'Yahoo':
			_url = `https://login.yahoo.com/config/login?.src=ym&.intl=us&.lang=en-US&authMechanism=primary&email=${email}`;
			break;
		case 'Outlook':
			_url = `https://outlook.live.com/mail/inbox`;
			break;
		case 'YOPmail':
			_url = `https://www.yopmail.com`;
			break;

		default:
			_url = `https://mail.google.com/mail/u/0/#inbox`;
			break;
	}
	window.location.href = _url;
};

export const setCRPartner = async (ct?: string, trx?: any) => {
	try {
		removeLocalStorage(LOCALSTORAGE.CR_PARTNER);
		if (ct) {
			setStorageEncrypt(LOCALSTORAGE.CR_PARTNER, {
				ct,
				trx,
				udpatedAt: Date.now(),
			});
		}
	} catch (error) {
		console.log('error on store cr partner : ', error);
	}
};

export const navigateWithQueryParams = (path: string, params: any, type?: 'replace' | 'href') => {
	const queryString = Object.keys(params)
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
		.join('&');

	// Append the query string to the URL using window.location.href / replace
	if (type == 'replace') {
		window.location.replace(path + (queryString ? '?' + queryString : ''));
	} else if (type == 'href') {
		window.location.href = path + (queryString ? '?' + queryString : '');
	}
};

export function extractUrls(text: string) {
	const urlRegex = /(https?:\/\/\S+|www\.\S+)/g;
	return text?.match(urlRegex) || [];
}

export const converToSnakeCase = (words: string) => {
	try {
		if (words != null) {
			const wordsArr = words.split(' ');
			let res = '';
			wordsArr.forEach((e) => {
				res += (res ? '_' : '') + e?.toLowerCase();
			});
			return res.trim();
		} else {
			return words;
		}
	} catch (error) {
		console.log('error on capitalize each words : ', error);
		return words;
	}
};

export const convertToObj = (arr: Array<any>, labelParam?: any, valueParam?: any) => {
	try {
		let res = {};
		if (labelParam != null && valueParam != null) {
			arr?.forEach((el: any) => {
				const label = converToSnakeCase(el[labelParam]);
				const value = el[valueParam];
				res[label] = value;
			});
		} else {
			res = arr?.reduce((k: any, v: any) => ({ ...k, [v.name]: v.value }), {});
		}
		return res;
	} catch (error) {
		console.error('error on convert to object : ', error);
		return arr;
	}
};

function encodeURIComponentSafe(str: string) {
	return encodeURIComponent(str).replace(/[!'()*]/g, escape);
}

export const objectToQueryString = (obj: any, prefix?: any) => {
	const queryString = Object.keys(obj)
		.map((key) => {
			const value = obj[key];
			const encodedKey = prefix
				? `${prefix}[${encodeURIComponentSafe(key)}]`
				: encodeURIComponentSafe(key);

			if (value === null || value === undefined) {
				return '';
			} else if (typeof value === 'object') {
				if (Array.isArray(value)) {
					return value
						.map((val, index) => objectToQueryString({ [index]: val }, encodedKey))
						.join('&');
				} else {
					return objectToQueryString(value, encodedKey);
				}
			} else {
				return `${encodedKey}=${encodeURIComponentSafe(value)}`;
			}
		})
		.filter(Boolean)
		.join('&');

	return queryString;
};

export function isWebView() {
	const userAgent = navigator.userAgent.toLowerCase();
	return (
		/(iphone|ipod|ipad|android|blackberry|windows phone).*applewebkit/i.test(userAgent) ||
		/\bwv\b/.test(userAgent) ||
		/(android|blackberry|windows phone).*version\/\d+(\.\d+)*\s+(chrome|samsungbrowser|edge|firefox)\//.test(
			userAgent,
		)
	);
}

export const isAccessedByBrowser = () => {
	const userAgent = navigator.userAgent;
	// Patterns for WebView detection
	const webViewPatterns = [
		'wv', // Generic WebView
		'Version/\\d+.\\d+(\\.\\d+)? Safari/', // iOS WebView
		// 'Chrome/[.0-9]* Mobile', // Android WebView
		';s*([^;s]+)s+Build/', // Generic Android WebView
	];

	return !webViewPatterns.some((pattern) => new RegExp(pattern).test(userAgent));
};

export const validateLink = ({ whitelistLink = [], message = '' }) => {
	const msg = message.split(/(?=https?:\/\/)/).join(' ');
	const cleanMessage = msg.split(/##|\?\?|@@|\$\$/).join(' ');

	const matches = linkify.find(cleanMessage);
	for (const match of matches) {
		let isLinkWhiteListed = false;
		for (const whitelist of whitelistLink) {
			if (match.value.includes(whitelist)) {
				isLinkWhiteListed = true;
			}
		}
		if (isLinkWhiteListed === false) {
			return false;
		}
	}
	return true;
};

export const handleSendManualPresc = (
	data: PrescriptionDetailData,
	contactUrl: string,
	orderNumber?: string,
) => {
	try {
		if (data?.contact_url) {
			handleOpenContactUrl(data?.contact_url);
		} else {
			const message = encodeURIComponent(`Halo Tim Dkonsul, mohon 
			bantuanya untuk proses penebusan
			resep *${orderNumber ?? ''}* ${
				data?.patient[0]?.value ? `atas nama * ${data?.patient[0]?.value}*` : ''
			}
			
			${
				data?.patient_data != null
					? `
					dengan detail pengiriman
					Alamat: *${data?.patient_data?.patient_address}*
					Kode pos: *${data?.patient_data?.patient_postal_code}*
					Detail alamat: *${data?.patient_data?.patient_detail_address ?? '-'}* 
					`
					: ''
			}`);

			handleOpenContactUrl(contactUrl + `?text=${message}`);
		}
	} catch (error) {
		console.log('error on handle send manual presc : ', error);
	}
};

export const handleClickUrl = (Router: any, url: string, isApproval = false) => {
	if (isApproval) {
		showToast('Mohon maaf, link ini tidak bisa dibuka di telekonsultasi ini.');
	} else {
		addLog({ isAccessedByBrowser: isAccessedByBrowser(), userAgent: navigator.userAgent });
		if (isAccessedByBrowser() || (isWebView() && navigator.userAgent.includes('Android'))) {
			const a = document.createElement('a');
			a.href = url;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.click();
		} else {
			setStorageEncrypt(LOCALSTORAGE.ATTACHMENT, { value: url });
			Router.push({
				pathname: '/attachments',
				query: {
					type: CHAT_CONST.WEB_VIEW,
				},
			});
		}
	}
};

export const countTotals = (arr: Array<any>, params = 'qty') => {
	try {
		let res = 0;
		arr?.forEach((element) => {
			res += element[params];
		});
		return res;
	} catch (error) {
		console.log('error on  : ', error);
		return 0;
	}
};

export const fetchAnimation = async (url: string) => {
	const options = {
		url: snapConfig.BASE_API_URL + '/animation/dexa',
		method: 'GET',
		params: { url },
	};

	const response = await API_CALL(options);
	return response;
};

export const fetchLottieJson = async (url: string) => {
	const options = {
		url: snapConfig.BASE_API_URL + '/lottie-json',
		method: 'GET',
		params: { url },
	};

	const response = await API_CALL(options);
	return response;
};

export const resetStorageAndCache = () => {
	// Clear localStorage
	const clearException = [LOCALSTORAGE.THEME];
	const exceptionStorage = [];
	clearException.forEach((e) => {
		exceptionStorage.push({ key: e, value: localStorage.getItem(e) });
	});

	localStorage.clear();
	exceptionStorage.forEach((e) => {
		localStorage.setItem(e.key, e.value);
	});

	// Clear sessionStorage
	sessionStorage.clear();

	// Clear cache if Cache API is available
	if ('caches' in window) {
		caches.keys().then((cacheNames) => {
			cacheNames.forEach((cacheName) => {
				caches.delete(cacheName);
			});
		});
	}
};

export const handleOpenContactUrl = (contactUrl) => {
	if (isAccessedByBrowser() || (isWebView() && navigator.userAgent.includes('Android'))) {
		const a = document.createElement('a');
		a.href = contactUrl;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		a.click();
	} else {
		window.location.href = contactUrl;
	}
};

export function findFieldIndexBySlug(slug: string, form: any) {
	return form.findIndex((item: any) => item?.slug === slug);
}
