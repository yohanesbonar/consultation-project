import Router from 'next/router';
import snapConfig from '../../../config';
import { getStorageParseDecrypt, LOCALSTORAGE, setLocalStorage } from '../../LocalStorage';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';
import { getConsulVerify } from '../chat';
import { MESSAGE_CONST } from 'helper/Const';
import { Prescription, PrescriptionDetailData } from '@types';
import { checkIsEmpty } from 'helper/Common';

const getEnablerToken = () => {
	let eToken = {};
	try {
		if (Router.query?.enabler_token != null) {
			eToken = { enabler_token: Router.query?.enabler_token };
		}
		return eToken;
	} catch (error) {
		console.log('error on  : ', error);
		return eToken;
	}
};

const addPartnerToLocalStorage = (data?: any) => {
	try {
		localStorage.removeItem(LOCALSTORAGE.PARTNER);
		if (checkIsEmpty(data?.partner)) return;
		setLocalStorage(LOCALSTORAGE.PARTNER, data?.partner);
	} catch (error) {
		console.error('error on add partner to localstorage : ', error);
	}
};

export const getPrescriptionDetail = async (id: string, auth?: string) => {
	try {
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);

		const options = {
			url: snapConfig.BASE_API_URL + API.PRESCRIPTION_DETAIL,
			data: {
				id: id,
				...getEnablerToken(),
			},
			...(auth ?? global.tokenAuthorization ?? consulSession?.tokenAuthorization
				? {
						headers: {
							auth: auth ?? global.tokenAuthorization ?? consulSession?.tokenAuthorization,
						},
				  }
				: {}),
			method: 'POST',
		};

		const response = await API_CALL(options);
		addPartnerToLocalStorage(response?.data);
		return response;
	} catch (error) {
		console.log('error on get detail prescription : ', error);
		return errorHandler(error);
	}
};

export const sendPrescriptionResponse = async (status: string) => {
	try {
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);

		const options = {
			url: snapConfig.BASE_API_URL + API.PRESCRIPTION_RESPONSE,
			data: {
				status: status,
				orderNumber: global.orderNumber ?? consulSession?.orderNumber,
			},
			headers: {
				auth: global.tokenAuthorization ?? consulSession?.tokenAuthorization,
			},
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get detail prescription : ', error);
		return errorHandler(error);
	}
};

export const getPatientRecommendation = async (id: string, auth?: string) => {
	try {
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);

		const options = {
			url: snapConfig.BASE_API_URL + API.PATIENT_RECOMMENDATION,
			data: {
				id: id,
				...getEnablerToken(),
			},
			...(auth ?? global.tokenAuthorization ?? consulSession?.tokenAuthorization
				? {
						headers: {
							auth: auth ?? global.tokenAuthorization ?? consulSession?.tokenAuthorization,
						},
				  }
				: {}),
			method: 'POST',
		};

		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on get patient recommendation : ', error);
		return errorHandler(error);
	}
};

export const getPrescData = (token?: string, orderNumber?: string) =>
	new Promise<{
		data?: PrescriptionDetailData | any;
		meta: {
			acknowledge: boolean;
			message?: string;
		};
		// eslint-disable-next-line no-async-promise-executor
	}>(async (resolve) => {
		try {
			const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
			let resVerify: any;
			if (checkIsEmpty(token) && consulSession?.tokenAuthorization) {
				resVerify = {
					meta: {
						acknowledge: true,
					},
					data: { token: consulSession?.tokenAuthorization },
				};
			} else {
				resVerify = await getConsulVerify(token);
			}
			if (resVerify?.meta?.acknowledge) {
				const resPresc = await getPrescriptionDetail(orderNumber, resVerify?.data?.token);
				if (resPresc?.meta?.acknowledge) {
					resolve(resPresc);
				} else {
					throw (
						resVerify?.meta?.message ??
						resVerify?.message ??
						MESSAGE_CONST.SOMETHING_WENT_WRONG
					);
				}
			} else {
				throw (
					resVerify?.meta?.message ?? resVerify?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG
				);
			}
		} catch (error) {
			console.log('error on get presc data : ', error);
			resolve({ meta: { acknowledge: false, message: error?.toString() } });
		}
	});

export const getConvertedProductToUpdate = (
	data: Prescription[] | any,
	updatedData: Prescription[] | any,
) => {
	try {
		const productToUpdate: Array<{
			product_id?: number;
			quantity: number;
		}> = [];
		const products = data;
		if (products && products?.length) {
			const productsTemp = Object.assign(
				[],
				updatedData && updatedData?.length ? updatedData : data,
			);
			productsTemp?.forEach((element: any) => {
				productToUpdate.push({
					product_id: element?.productId != null ? parseInt(element?.productId) : null,
					quantity: element?.updatedQty ?? element?.qty,
				});
			});
		}
		return { meta: { acknowledge: true }, data: productToUpdate };
	} catch (error) {
		console.log('error on get converted product to update : ', error);
		return {
			meta: {
				acknowledge: false,
				message: error?.toString() || MESSAGE_CONST.SOMETHING_WENT_WRONG,
			},
		};
	}
};
