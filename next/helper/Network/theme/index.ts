import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '../requestHelper';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { COOKIES_CONST } from 'helper/Const';
import { checkIsEmpty, decryptData, encryptData } from 'helper/Common';
import moment from 'moment';
import { addLog } from '../master';

const SCHEME = {
	API: 'API',
	EXPIRED_TIME: 5, //TODO : make this 10 minutes or more
};

const NEXT_BASE =
	(typeof process !== 'undefined' && process.env.NEXT_PUBLIC_NEXT_BASE_API_URL) || null;

const resolveApiUrl = (path: string): string => {
	const base =
		NEXT_BASE ||
		(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
	const normalizedBase = base.replace(/\/+$/, '');
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const baseApiMatch = normalizedBase.match(/\/api(\/v\d+)?$/); // e.g., '/api' or '/api/v1'
	const pathApiMatch = normalizedPath.match(/^\/api(\/v\d+)?(\/.*)?$/);
	let finalPath = normalizedPath;
	if (baseApiMatch && pathApiMatch) {
		// Remove the same '/api' or '/api/vX' prefix from path to avoid duplication
		finalPath = normalizedPath.replace(new RegExp(`^${baseApiMatch[0]}`), '');
		if (!finalPath.startsWith('/')) finalPath = `/${finalPath}`;
	}
	return `${normalizedBase}${finalPath}`;
};

const checkIfSetCookies = (reqResServer?: { req: NextRequest; res: NextResponse } | {}) =>
	// eslint-disable-next-line no-async-promise-executor
	new Promise<boolean>(async (resolve) => {
		try {
			const result: string = await getCookie(
				COOKIES_CONST.THEME_COOkIES,
				checkIsEmpty(reqResServer) ? {} : reqResServer,
			);
			// resolve(!checkIsEmpty(result));
			// meaning accept all condition to set the cookies
			resolve(true);
		} catch (error) {
			console.log('error on  : ', error);
			resolve(false);
		}
	});

// Calls internal Next.js route handler instead of external base URL
export const getTheme = async (token: string | string[], reqResServer = null) => {
	try {
		// Use internal Next.js API route
		const internalUrl = resolveApiUrl('/api/v1/partner/gettheme');
		const res = await fetch(internalUrl, {
			method: 'GET',
			headers: { token: String(token ?? '') },
			credentials: 'same-origin',
			cache: 'no-store',
		});

		const response = await res.json();

		if (response?.meta?.acknowledge && response?.data) {
			//set cache
			const encrypted = await encryptData({
				result: response?.data,
				expired: new Date(new Date().getTime() + SCHEME.EXPIRED_TIME * 60000),
				requestToken: token,
			});

			const isSetCookies = await checkIfSetCookies(reqResServer);
			if (isSetCookies) {
				await setCookie(COOKIES_CONST.THEME_SESSION, encrypted, {
					...(reqResServer != null
						? { req: reqResServer?.req, res: reqResServer?.res }
						: null),
					maxAge: 60 * SCHEME.EXPIRED_TIME,
				});
			}
		}

		return response;
	} catch (error) {
		console.error('error on get theme : ', error);
		return errorHandler(error);
	}
};

// Calls internal Next.js route handler instead of external base URL
export const getThemeCss = async (token: string | string[]) => {
	try {
		const url = resolveApiUrl(
			`/api/v1/partner/getthemecss?token=${encodeURIComponent(String(token ?? ''))}`,
		);
		const resCss = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });

		let resc = await resCss?.text();
		resc = resc.replaceAll('\n', '');
		resc = resc.replaceAll('\r', '');
		resc = resc.replaceAll(' ', '');
		resc = resc.replaceAll('@tailwind', '@tailwind ');
		resc = resc.replaceAll('@layer', '@layer ');
		// resc = resc.replaceAll('tpy', 'monochrome'); // todo : temporary replace tpy to monochrome (delete this when whitelabel)
		// resc = resc.replaceAll('info', 'warning'); // todo : temporary replace tpy to monochrome (delete this when whitelabel)

		if (resCss?.status == 200) {
			//set cache
			const encryptedCss = await encryptData(resc);
			const encryptedData = await encryptData({
				expired: new Date(new Date().getTime() + SCHEME.EXPIRED_TIME * 60000),
				requestToken: token,
			});

			const isSetCookies = await checkIfSetCookies();
			if (isSetCookies) {
				if (encryptedCss?.length > 2000) {
					await setCookie(
						COOKIES_CONST.THEME_CSS_SESSION_2,
						encryptedCss.substring(2001, encryptedCss.length),
						{
							maxAge: 60 * SCHEME.EXPIRED_TIME,
						},
					);
				}
				await setCookie(
					COOKIES_CONST.THEME_CSS_SESSION,
					encryptedCss?.length > 2000 ? encryptedCss.substring(0, 2000) : encryptedCss,
					{
						maxAge: 60 * SCHEME.EXPIRED_TIME,
					},
				);

				await setCookie(COOKIES_CONST.THEME_CSS_SESSION_DATA, encryptedData, {
					maxAge: 60 * SCHEME.EXPIRED_TIME,
				});
			}
		}

		return resc;
	} catch (error) {
		console.log('error on get theme css : ', error);
		return errorHandler(error);
	}
};

export const fetchCachedTheme = async (
	token: string | string[],
	reqResServer?: { req: NextRequest; res: NextResponse } | {},
) => {
	try {
		const isSetCookies = await checkIfSetCookies(reqResServer);
		if (!isSetCookies) throw SCHEME.API; // Force to fetch new css
		const cached = await getCookie(
			COOKIES_CONST.THEME_SESSION,
			checkIsEmpty(reqResServer) ? {} : reqResServer,
		);
		if (!checkIsEmpty(cached)) {
			//if has cache
			let decrypted: any = await decryptData(cached);
			if (checkIsEmpty(decryptData)) throw SCHEME.API;
			decrypted = JSON.parse(decrypted);

			if (
				decrypted?.requestToken != token ||
				checkIsEmpty(decrypted?.result) ||
				moment().isAfter(moment(decrypted?.expired))
			) {
				throw SCHEME.API;
			}

			addLog({ status: 'getting theme from cached', cached });

			return {
				meta: {
					acknowledge: true,
					status: 200,
					message: 'Success',
					at: Date.now(),
				},
				data: decrypted?.result,
			};
		} else {
			throw SCHEME.API;
		}
	} catch (error) {
		console.log('error on  fetch cached : ', error);
		if (error != null && typeof error === 'string' && error == SCHEME.API) {
			await deleteCookie(
				COOKIES_CONST.THEME_SESSION,
				checkIsEmpty(reqResServer) ? {} : reqResServer,
			);
			return getTheme(token, reqResServer);
		}

		return errorHandler(error);
	}
};

export const fetchCachedThemeCss = async (token: string | string[]) => {
	try {
		const isSetCookies = await checkIfSetCookies();
		if (!isSetCookies) throw SCHEME.API; // Force to fetch new css
		let cached = await getCookie(COOKIES_CONST.THEME_CSS_SESSION);
		const cached2 = await getCookie(COOKIES_CONST.THEME_CSS_SESSION_2);
		if (!checkIsEmpty(cached2)) {
			cached += cached2; // Combine the two parts if the second part exists
		}
		const cachedData = await getCookie(COOKIES_CONST.THEME_CSS_SESSION_DATA);
		if (!checkIsEmpty(cached) && !checkIsEmpty(cachedData)) {
			//if has cache
			const decrypted: any = await decryptData(cached);
			let decryptedData: any = await decryptData(cachedData);
			if (checkIsEmpty(decrypted) || checkIsEmpty(decryptedData)) throw SCHEME.API;
			decryptedData = JSON.parse(decryptedData);

			if (
				decryptedData?.requestToken != token ||
				checkIsEmpty(decrypted) ||
				moment().isAfter(moment(decryptedData?.expired))
			) {
				throw SCHEME.API;
			}

			addLog({ status: 'getting theme css from cached', cachedData });
			return decrypted;
		} else {
			throw SCHEME.API;
		}
	} catch (error) {
		console.log('error on fetch theme css cached  : ', error);
		if (error != null && typeof error === 'string' && error == SCHEME.API) {
			await deleteCookie(COOKIES_CONST.THEME_CSS_SESSION);
			await deleteCookie(COOKIES_CONST.THEME_CSS_SESSION_2);
			await deleteCookie(COOKIES_CONST.THEME_CSS_SESSION_DATA);
			return getThemeCss(token);
		}

		return errorHandler(error);
	}
};
