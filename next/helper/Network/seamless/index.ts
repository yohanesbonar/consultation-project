import { SEAMLESS_CONST } from 'helper/Const';
import { API } from '../API';
import { API_CALL, errorHandler } from '../requestHelper';
import { LOCALSTORAGE, getParsedLocalStorage } from 'helper/LocalStorage';
import snapConfig from 'config';
import Router from 'next/router';

export const getAutocompleteAddress = async ({
	keyword,
	types,
	components,
	language,
}: {
	keyword: string;
	types: string;
	components: string;
	language: string;
}) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + '/place/autocomplete/json',
			method: 'GET',
			params: { keyword, types, components, language },
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.error('error on get address list ', error);
		return errorHandler(error);
	}
};

export const getAddressComponent = (param: string, place: any) => {
	let temp: any;
	temp = place?.address_components?.find((component: any) => {
		return component.types.includes(param);
	});
	temp = temp?.long_name ?? temp?.short_name;
	return temp;
};

export const restrictTypesAddress = (param: string, result: any) => {
	try {
		let temp: any;
		let res: any;
		for (let index = 0; index < result?.length; index++) {
			const element = result[index];
			temp = element?.address_components?.find((component: any) => {
				return component.types.includes(param);
			});
			if (!temp) {
				res = element;
				break;
			}
		}
		return res;
	} catch (error) {
		console.log('err restrict', error);
		return null;
	}
};

export const getAddressFromLatLng = async (lat: number, lng: number) => {
	try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=id&sensor=true&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`,
			{ credentials: 'omit' },
		);
		const data = await response.json();

		if (data?.results?.length > 0) {
			const placeId = data.results[0]?.place_id;
			const address = restrictTypesAddress('plus_code', data.results);
			const postalCode = getAddressComponent(SEAMLESS_CONST.POSTAL_CODE, data.results[0]);
			const values = {
				address: address.formatted_address,
				original: address,
				postalCode,
				placeId,
			};
			return values;
		} else {
			console.error('No address found for the given coordinates.');
		}
	} catch (error) {
		console.error('Error getting address:', error);
	}
};

export const getShippingMthod = async (params: { id: number; token?: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.SHIPPING_LIST + '/' + params?.id,
			headers: {
				token: params?.token,
			},
			method: 'GET',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on get shipping method : ', error);
	}
};

export const postProductComplain = async (params: {
	reason_id: string;
	reason?: string;
	token?: string | string[];
	transaction_id?: any;
}) => {
	try {
		const options = {
			url:
				snapConfig.BASE_API_URL +
				API.CHECKOUT +
				`/${params.transaction_id}` +
				API.PRODUCT_COMPLAIN,
			data: {
				reason_id: params.reason_id,
				reason: params.reason,
				transaction_id: params.transaction_id,
			},
			headers: {
				auth: params.token,
			},
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.error('error on post product complain : ', error);
	}
};

export const postCheckoutArriveConfirm = async (params: any) => {
	try {
		const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		const partnerToken = Router?.query?.token_order ?? order?.partnerToken;

		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT_ARRIVE_CONFIRM,
			headers: {
				token: params?.token ?? partnerToken,
			},
			data: { xid: params?.xid },
			method: 'POST',
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on post checkout arrive confirm : ', error);
	}
};

export const postRefundForm = async (params: {
	payload: any;
	token?: string | string[];
	xid: string | string[];
}) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.CHECKOUT + API.REFUND,
			data: {
				payment_method: params?.payload?.payment_method,
				payment_number: params?.payload?.payment_number,
				payment_customer_name: params?.payload?.payment_customer_name,
				phone_number: params?.payload?.phone_number,
				xid: params?.xid,
			},
			headers: {
				auth: params.token,
			},
			method: 'POST',
		};
		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.error('error on post refund form : ', error);
	}
};

export const getMerchentList = async (params: { presc_id: number | string; token?: string }) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.MERCHENT_LIST,
			headers: {
				token: params?.token,
			},
			method: 'GET',
			params: { presc_id: params.presc_id },
		};
		const response = await API_CALL(options);

		return response;
	} catch (error) {
		console.error('error on get merchent list : ', error);
	}
};
