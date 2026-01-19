import snapConfig from 'config';
import { getParsedLocalStorage, getStorageParseDecrypt, LOCALSTORAGE } from '../../LocalStorage';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';
import { groupBy, map } from 'lodash';
import { MESSAGE_CONST, ORDER_TYPE } from 'helper/Const';
import Router from 'next/router';

export const postRequestTransaction = async (
	body: object,
	token: string,
	type = ORDER_TYPE.PIVOT,
) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_REQUEST,
			data: body,
			method: 'POST',
			headers: {
				...(type == ORDER_TYPE.PIVOT ? { token: token } : { ct: token }),
			},
		};
		const response = await API_CALL(options, 'application/json; charset=UTF-8', true);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const getTransactionDetail = async (params: {
	id: string;
	token?: string;
	noAuth?: boolean;
}) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_DETAIL + '/' + params?.id,
			headers: {
				token: params?.token,
				'Cache-Control': 'no-cache',
			},
			noAuth: params?.noAuth,
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get detail transaction : ', error);
		return errorHandler(error);
	}
};

export const getProductTransactionDetail = async (params: { id: string; token?: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.PRODUCT_TRANSACTION_DETAIL + '/' + params?.id,
			headers: {
				token: params?.token,
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get product detail transaction : ', error);
		return errorHandler(error);
	}
};

export const getPaymentDetail = async (id: string) => {
	try {
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);

		// const options = {
		// 	url: snapConfig.BASE_API_URL + API.PRESCRIPTION_DETAIL,
		// 	data: {
		// 		id: id,
		// 	},
		// 	headers: {
		// 		auth:
		// 			global.tokenAuthorization ?? consulSession?.tokenAuthorization,
		// 	},
		// 	method: 'GET',
		// };
		// const response = await API_CALL(options);

		/////////// temporary : response transaction detail ///////////

		const response = {
			meta: {
				acknowledge: true,
				status: 200,
				message: 'Success to get e prescription',
				at: '2023-07-05T13:54:16.074Z',
			},
			data: {
				id: 66673,
				issued_at: '31-Oktober-2022',
				invoice_no: 'INV1234567890',
				order_date: '2023-06-05T13:57:46Z',
				partnerName: "Bonskii's Partner",
				expired_at: '2023-06-06T13:57:46Z',
				summary: {
					consultation_status: 'CONSULTATION_NOT_STARTED',
					doctor: {
						specialist_name: 'Specialis Kandungan',
						specialist_id: 123,
					},
					patient: {
						name: 'Rika Andrean',
						email: 'rika@andrean.com',
					},
					price: 20000,
				},
				payment: {
					status: 'SUCCESS',
					at: '2023-06-05T13:57:46Z',
					method: {
						id: 123,
						name: 'Gopay',
						category: 'DIGITAL',
						category_name: 'Dompet Digital',
						logo: 'https://gopay.co.id/icon.png',
					},
				},
				pricing: {
					total: 20000,
					other: [
						{
							label: 'Biaya Platform',
							value: 0,
						},
						{
							label: 'Biaya Layanan',
							value: 0,
						},
					],
					other_total: 0,
					discount: -2000,
					grand_total: 18000,
				},
			},
		};

		return response;
	} catch (error) {
		console.log('error on get detail paynment : ', error);
		return errorHandler(error);
	}
};

export const getPaymentMethod = async (params: { token: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.PAYMENT_LIST,
			headers: {
				token: params.token,
				'Cache-Control': 'no-cache',
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get payment method: ', error);
		return errorHandler(error);
	}
};

export const transactionPay = async ({ body, token }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_PAY,
			data: body,
			method: 'POST',
			headers: {
				token: token,
			},
		};
		const response = await API_CALL(options, 'application/json; charset=UTF-8', true);
		return response;
	} catch (error) {
		return errorHandler(error);
	}
};

export const getHistoryData = async (params: {
	token: string;
	status: string;
	page?: number;
	limit?: number;
}) => {
	try {
		const _params = {
			status: params.status,
			sort: 'date',
			sort_type: 'dsc',
			page: params.page,
			limit: params.limit,
		};

		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_HISTORY,
			headers: {
				token: params.token,
			},
			method: 'GET',
			params: _params,
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get history data method: ', error);
		return errorHandler(error);
	}
};

export const getCheckoutHistory = async (params: {
	token: string;
	status: string;
	page?: number;
	limit?: number;
}) => {
	try {
		const _params = {
			status: params.status,
			sort: 'date',
			sort_type: 'dsc',
			page: params.page,
			limit: params.limit,
		};
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_PRODUCT_HISTORY,
			headers: {
				token: params.token,
			},
			method: 'GET',
			params: _params,
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get product history data method: ', error);
		return errorHandler(error);
	}
};

export const getPaymentInstruction = async ({
	token,
	merchantId,
}: {
	token: string;
	merchantId: string;
}) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_INSTRUCTION + `/${merchantId}`,
			headers: {
				token: token,
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get history data method: ', error);
		return errorHandler(error);
	}
};

export const getVoucherDetail = async (params: { token: string; code: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.VOUCHERS + '/' + params.code,
			headers: {
				token: params.token,
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get vouchers detail: ', error);
		return errorHandler(error);
	}
};

export const getVoucherList = async ({
	code,
	token,
	transaction_xid,
}: {
	code: string;
	token: string;
	transaction_xid: string;
}) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.VOUCHER,
			headers: {
				token: token,
			},
			params: { transaction_xid, code },
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get voucher list: ', error);
		return errorHandler(error);
	}
};

export const postApplyVoucher = async ({ body, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.APPLY_VOUCHER,
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

export const postApplyCheckoutVoucher = async ({ body, token, presc_id }: any) => {
	const payload = { ...body, prescription_id: presc_id };

	delete payload?.enabled;
	delete payload?.isSelected;
	delete payload?.name;

	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.APPLY_CHECKOUT_VOUCHER,
			headers: {
				token: token,
			},
			data: payload,
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		errorHandler(error);
		return error;
	}
};

export const postRollbackCheckoutVoucher = async ({ body, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.ROLLBACK_CHECKOUT_VOUCHER,
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

// seamless checkout

export const getCheckoutVoucherList = async ({
	presc_id,
	token,
}: {
	presc_id?: string;
	token?: string;
}) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT_VOUCHER,
			headers: {
				token: token,
			},
			params: { presc_id },
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get checkout voucher list: ', error);
		return errorHandler(error);
	}
};

export const getCheckoutVoucherDetail = async (params: { token: string; code: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT + API.VOUCHERS + '/' + params.code,
			headers: {
				token: params.token,
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.log('error on get checkout vouchers detail: ', error);
		return errorHandler(error);
	}
};

// end seamless checkout

export const postRetryTransaction = async ({ xid, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_RETRY,
			headers: {
				token: token,
			},
			data: {
				xid: xid,
			},
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		errorHandler(error);
		return error;
	}
};

export const postCancelTransaction = async ({ xid, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.TRANSACTION_CANCEL,
			headers: {
				token: token,
			},
			data: {
				xid: xid,
			},
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		errorHandler(error);
		return error;
	}
};

export const checkoutCart = async ({ data, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT_CART,
			headers: {
				token: token,
			},
			data: data,
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on checkout cart : ', error);
	}
};

export const getCheckoutPaymentMethod = async (params: { id: number; token?: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT_PAYMENT_METHOD + '/' + params?.id,
			headers: {
				token: params?.token,
				'Cache-Control': 'no-cache',
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on get payemnt method : ', error);
	}
};

export const getCheckoutPayments = async (id?: any) =>
	// eslint-disable-next-line no-async-promise-executor
	new Promise(async (resolve, reject) => {
		{
			try {
				const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
				const cart = await getParsedLocalStorage(LOCALSTORAGE.CART);
				const partnerToken = Router?.query?.token_order ?? order?.partnerToken;
				const presc_id = cart?.data?.id;
				const params = { id: presc_id, token: partnerToken };
				if (!presc_id || !partnerToken) throw 'presc id or partner token unavailable';
				const res: any = await getCheckoutPaymentMethod(params);
				if (res?.meta?.acknowledge) {
					let dataTemp = res?.data;
					if (id) {
						dataTemp = dataTemp?.find((e: any) => e?.id == id);
						if (!dataTemp && cart?.data?.payment_method?.id == id) {
							dataTemp = cart?.data?.payment_method;
						}
						resolve({
							data: dataTemp,
						});
					}
					dataTemp = groupBy(dataTemp ?? [], 'group_title');
					resolve({
						data: map(dataTemp),
						status: res?.meta?.status,
					});
				} else {
					resolve({
						error: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					});
				}
			} catch (error) {
				resolve({
					error: MESSAGE_CONST.SOMETHING_WENT_WRONG,
				});
			}
		}
	});

export const postCheckoutPay = async (params: any) => {
	try {
		const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		const partnerToken = Router?.query?.token_order ?? order?.partnerToken;

		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT_PAY,
			headers: {
				token: Router?.query?.token_order ?? params?.token ?? partnerToken,
			},
			data: params,
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on post checkout pay : ', error);
	}
};

export const postCheckoutShipment = async (params: any) => {
	try {
		const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		const partnerToken = Router?.query?.token_order ?? order?.partnerToken;

		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT_SHIPMENT,
			headers: {
				token: Router?.query?.token_order ?? params?.token ?? partnerToken,
			},
			data: params,
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on post checkout pay : ', error);
	}
};

export const postValidateVoucher = async ({ body, token }: any) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.VALIDATE_VOUCHER,
			headers: {
				token: token,
			},
			data: body,
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on checkout cart : ', error);
	}
};
