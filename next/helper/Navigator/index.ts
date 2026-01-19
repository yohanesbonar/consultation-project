import Router from 'next/router';
import { ORDER_TYPE, STATUS_CONST } from 'helper/Const';
import { addLog, postRetryTransaction } from 'helper/Network';
import {
	LOCALSTORAGE,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	removeLocalStorage,
} from 'helper/LocalStorage';
import moment from 'moment';
import { checkIsEmpty } from 'helper/Common';

const NAVIGATOR_CONST = {
	CLOSE_WINDOW: 'close_window',
};

export const openTnC = (type: string) => {
	Router.push({
		pathname: '/tnc',
		query: {
			type: type,
		},
	});
};

export const navigateFromTransactionStatus = async (query?: {
	transaction_xid?: string;
	token?: string;
}) => {
	Router.push({
		pathname: '/payment/status/result',
		query: Router.query ?? query,
	});
};

export const navigateFromTrxConditionProduct = async (data: any, token?: any, meta?: any) => {
	const isPendingButExpired =
		(data?.payment_status == STATUS_CONST.PENDING ||
			data?.payment_status == STATUS_CONST.CREATED) &&
		moment(meta?.at).isAfter(moment(data?.payment_expired_at));

	if (
		data?.payment_status === STATUS_CONST.SUCCESS &&
		(data?.shipping_status === STATUS_CONST.DONE ||
			data?.shipping_status === STATUS_CONST.COMPLETED)
	) {
		const url = `/order?token=${Router?.query?.token_order ?? token}`;
		Router.push(url);
	} else if (data?.payment_status == STATUS_CONST.SUCCESS && data?.shipping_status != null) {
		const cart = await getParsedLocalStorage(LOCALSTORAGE.CART);
		const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		let currToken = Router?.query?.token as string;
		currToken = Router?.query?.token_order ?? currToken ?? order?.partnerToken;

		const q = {
			token: currToken,
			transaction_xid: data?.xid,
			transaction_id: Router?.query?.transactionid ?? data?.xid,
		};
		Router.push({
			pathname:
				'/order/track/' +
				([STATUS_CONST.SENT, STATUS_CONST.PENDING].includes(data?.shipping_status)
					? 'shipping'
					: ''),
			query: q,
		});
	} else if (
		data?.payment_status == STATUS_CONST.EXPIRED ||
		data?.payment_status == STATUS_CONST.FAILED ||
		data?.payment_status === STATUS_CONST.CANCELLED ||
		isPendingButExpired
	) {
		if (data?.token) {
			window.location.href = `/prescription-detail?token=${data?.token}`;
		} else {
			window.location.href = `/invalid-prescription`;
		}
	} else {
		const q = {
			token: token,
			transaction_xid: data?.xid,
			checked: 1,
			...(Router?.query?.presc ? { presc: Router?.query?.presc } : {}),
			...(Router?.query?.token_order ? { token_order: Router?.query?.token_order } : {}),
			...(Router?.query?.methodId ? { methodId: Router?.query?.methodId } : {}),
		};
		Router.push({
			pathname: '/payment/waiting-payment',
			query: q,
		});
	}
};

export const navigateFromTrxCondition = async (
	data: any,
	token?: any,
	type = 'order',
	meta?: any,
) => {
	const prevUrl = Router.asPath;

	const query = {
		token: data?.transaction_token,
		transaction_xid: data?.xid,
		rf: '1',
		returnUrl: prevUrl,
	};

	if (type == ORDER_TYPE.PRODUCT) {
		navigateFromTrxConditionProduct(data, token, meta);
		return;
	}

	if (data?.payment_status === STATUS_CONST.PENDING) {
		const q = {
			token: token,
			transaction_xid: data?.xid,
			checked: 1,
			...(Router?.query?.presc ? { presc: Router?.query?.presc } : {}),
			...(Router?.query?.token_order ? { token_order: Router?.query?.token_order } : {}),
			...(Router?.query?.methodId ? { methodId: Router?.query?.methodId } : {}),
		};
		Router.push({
			pathname: '/payment/waiting-payment',
			query: q,
		});
	} else if (
		data?.payment_status === STATUS_CONST.REFUNDED ||
		(data?.payment_status === STATUS_CONST.SUCCESS &&
			data?.consultation_status === STATUS_CONST.EXPIRED)
	) {
		let url = `/order`;
		const crPartner = await getStorageParseDecrypt(LOCALSTORAGE.CR_PARTNER);
		if (crPartner?.trx?.xid == data?.xid && crPartner?.ct) {
			url = `/order?ct=${crPartner?.ct}`;
		} else {
			url = `/order?token=${token}`;
		}
		Router.push(url);
	} else if (
		data?.payment_status === STATUS_CONST.SUCCESS &&
		(data?.consultation_status === STATUS_CONST.STARTED ||
			data?.consultation_status === STATUS_CONST.READY ||
			data?.consultation_status === STATUS_CONST.DONE ||
			data?.consultation_status === STATUS_CONST.CANCELLED)
	) {
		Router.push({
			pathname: '/onboarding',
			query,
		});
	} else if (
		data?.payment_status == STATUS_CONST.EXPIRED ||
		data?.payment_status == STATUS_CONST.FAILED ||
		data?.payment_status === STATUS_CONST.CANCELLED
	) {
		const tryAgain = {
			pathname: '/order/detail',
			query: { token: token, transaction_xid: data?.xid, back: 1 },
		};
		try {
			const resRetry = await postRetryTransaction({
				xid: data?.xid,
				token,
			});
			if (resRetry?.meta?.acknowledge) {
				if (resRetry?.data?.xid) {
					tryAgain.query.transaction_xid = resRetry?.data?.xid;
				}
			}
		} catch (error) {
			console.error('error on retry transaction : ', error);
		}

		Router.push(tryAgain);
	} else {
		Router.push({
			pathname: '/onboarding',
			query,
		});
	}
};

const returnCallbackOrBack = (callback?: () => Promise<void>) => {
	if (callback != null) {
		callback();
	} else {
		Router.back();
	}
};

export const navigateBackTo = async (callback?: () => Promise<void>) => {
	try {
		removeLocalStorage(LOCALSTORAGE.BACKTOTRX);
		returnCallbackOrBack(callback);
	} catch (error) {
		console.log('error on back to : ', error);
		Router.back();
	}
};

export const backHandling = ({
	transactionData,
	router,
	onMethodCalled,
	callback,
	backToPartner,
}: any) => {
	try {
		onMethodCalled?.();
		if (!checkIsEmpty(backToPartner)) {
			let params = backToPartner;
			try {
				params = Object.fromEntries(new URLSearchParams(new URL(backToPartner).search));
			} catch (error) {
				console.log('error when backHandling', error);
			}
			if (params?.action && params?.action == NAVIGATOR_CONST.CLOSE_WINDOW) {
				window.close(); // if window opened by button
				if (window.history.length === 2) window.history.back(); // if window opened by copy paste url
				setTimeout(() => {
					if (!window.closed) {
						window.location.replace(backToPartner);
					}
				}, 500);
			} else {
				window.location.replace(backToPartner);
			}
		} else if (!checkIsEmpty(router.query?.presc && transactionData?.token)) {
			localStorage.removeItem(LOCALSTORAGE.CART);
			window.location.href = `/prescription-detail?token=${transactionData?.token}`;
		} else {
			callback?.();
		}
	} catch (error) {
		console.log('error on backhandling : ', error);
	}
};

export const stringifyQueryParams = (queryObj: any) => {
	if (!queryObj) return null;
	try {
		let parsedQuery = '';
		Object.keys(queryObj).forEach((key) => {
			parsedQuery += `${key}=${encodeURIComponent(queryObj[key])}&`;
		});
		return parsedQuery;
	} catch (error) {
		console.log('error on parseQueryParams : ', error);
		addLog({ errorParseQueryParams: error, queryObj });
		return null;
	}
};
