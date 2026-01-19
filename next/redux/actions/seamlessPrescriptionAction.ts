import toast from 'react-hot-toast';
import {
	getAutocompleteAddress,
	getAddressFromLatLng,
	getShippingMthod,
	getMerchentList,
} from '../../helper/Network/seamless';
import debounce from 'debounce-promise';
import { SEAMLESS_CONST } from 'helper';
import { setCart } from './transactionAction';
const debouncedFetchAddressData = debounce(getAutocompleteAddress, 1000);
const debouncedFetchCurrentAddressData = debounce(getAddressFromLatLng, 1000);

export const SET_ADRESS = 'SEAMLESS/SET_ADRESS';
export const SET_CURRENT_ADRESS = 'SEAMLESS/SET_CURRENT_ADRESS';
export const SET_SHIPPING_LIST = 'SEAMLESS/SET_SHIPPING_LIST';
export const SET_MERCHECNT_LIST = 'SEAMLESS/SET_MERCHECNT_LIST';
export const SET_LAT_LONG = 'SEAMLESS/SET_LAT_LONG';
export const SET_PERMISSION_LOCATION = 'SEAMLESS/SET_PERMISSION_LOCATION';

export const setAdressAction = (data: any) => ({
	type: SET_ADRESS,
	payload: data,
});

export const setCurrentAddressAction = (data: any) => ({
	type: SET_CURRENT_ADRESS,
	payload: data,
});

export const setShippingListAction = (data: any) => ({
	type: SET_SHIPPING_LIST,
	payload: data,
});

export const setCurrentLatLong = (data: any) => ({
	type: SET_LAT_LONG,
	payload: data,
});

export const setLocationPermission = (data: any) => ({
	type: SET_PERMISSION_LOCATION,
	payload: data,
});

export const setMerchentListAction = (data: any) => ({
	type: SET_MERCHECNT_LIST,
	payload: data,
});

export const fetchAddress: any = (
	keyword: string,
	types: string,
	components: string,
	language: string,
) => {
	return async (dispatch: any) => {
		dispatch(setAdressAction({ data: [], loading: true, error: false }));
		try {
			if (keyword.length < 3) {
				dispatch(setAdressAction({ data: [], loading: false, error: false }));
			} else {
				const res: any = await debouncedFetchAddressData({
					keyword,
					types,
					components,
					language,
				});
				dispatch(setAdressAction({ data: res?.predictions, loading: false, error: false }));
			}
		} catch (error) {
			console.error('error: ', error);
			dispatch(setAdressAction({ data: [], loading: false, error: true }));
		}
	};
};

export const fetchCurrentAddress: any = (lat: number, lng: number) => {
	return async (dispatch: any) => {
		dispatch(
			setCurrentAddressAction({ data: false, loading: true, error: true, original: false }),
		);
		try {
			const res: any = await debouncedFetchCurrentAddressData(lat, lng);
			let components: any = [];
			if (res?.original?.address_components) {
				components = [...res.original.address_components];
			}
			components.forEach((component: any) => {
				component.is_city = false;
				component?.types.forEach((_type: any) => {
					if (_type === 'administrative_area_level_4' || _type === 'route')
						component.is_city = true;
				});
			});

			const city = components.find((value) => value?.is_city);
			dispatch(
				setCurrentAddressAction({
					data: res?.address,
					postalCode: res?.postalCode,
					placeId: res?.placeId,
					loading: false,
					error: false,
					original: { city: city?.long_name, full_address: res?.address },
				}),
			);
		} catch (error) {
			console.error('error: ', error);
			dispatch(
				setCurrentAddressAction({ data: false, loading: false, error: true, original: false }),
			);
		}
	};
};

export const fetchShippingMethod: any = (
	params: { id: number; token: any },
	callbackError: () => void,
) => {
	return async (dispatch: any) => {
		dispatch(setShippingListAction({ data: false, loading: true, error: true }));
		try {
			const res: any = await getShippingMthod(params);
			if (res?.meta?.acknowledge) {
				dispatch(setShippingListAction({ data: res.data, loading: false, error: false }));
			}
			if (res?.meta?.status === 400) {
				dispatch(
					setShippingListAction({ data: false, loading: false, error: res?.meta?.message }),
				);
				callbackError();
				toast.error(res?.meta?.message, {
					style: { background: '#B00020', color: '#FFFFFF' },
				});
			}
		} catch (error) {
			console.error('error: ', error);
			dispatch(setShippingListAction({ data: false, loading: false, error: true }));
		}
	};
};

export const fetchMerchentList: any = (
	params: { presc_id: number; token: any },
	callbackError: () => void,
) => {
	return async (dispatch: any) => {
		dispatch(setMerchentListAction({ data: false, loading: true, error: true }));
		try {
			const res: any = await getMerchentList(params);
			const _data = [...res.data];

			_data?.map((item: any) => {
				let subtotal = 0;
				item?.products?.forEach((product: any) => {
					subtotal += product?.price;
				});
				item.subtotal = subtotal;
				return item;
			});

			if (res?.meta?.acknowledge) {
				dispatch(setMerchentListAction({ data: _data, loading: false, error: false }));
			}
			if (res?.meta?.status === 400) {
				dispatch(
					setMerchentListAction({ data: false, loading: false, error: res?.meta?.message }),
				);
				callbackError();
				toast.error(res?.meta?.message, {
					style: { background: '#B00020', color: '#FFFFFF' },
				});
			}
		} catch (error) {
			console.error('error: ', error);
			dispatch(setMerchentListAction({ data: false, loading: false, error: true }));
		}
	};
};

export const getUserCurrentLocation: any = (fetchAddress = false) => {
	return async (dispatch: any) => {
		if (typeof navigator !== 'undefined' && navigator.geolocation) {
			const watchID = navigator.geolocation.watchPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					if (fetchAddress) {
						dispatch(fetchCurrentAddress(latitude, longitude));
					}
					dispatch(
						setCurrentLatLong({
							lat: latitude,
							lng: longitude,
							currLat: latitude,
							currLng: longitude,
						}),
					);
					dispatch(setLocationPermission(SEAMLESS_CONST.LOCATION_ALLOWED));
				},
				function (error) {
					if (error.code == error.PERMISSION_DENIED) {
						dispatch(setLocationPermission(SEAMLESS_CONST.LOCATION_DENIED));
						toast.error(SEAMLESS_CONST.PLEASE_CHECK_YOUR_DEVICE_LOCATION_PERMISSION, {
							style: { background: '#B00020', color: '#FFFFFF' },
						});
					}
				},
			);
			setTimeout(function () {
				navigator.geolocation.clearWatch(watchID);
			}, 5000);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	};
};

export const clearShippingData: any = (anotherAction: () => void) => {
	return async (dispatch: any, getState: any) => {
		const cartData = getState()?.transaction?.cart;

		dispatch(setShippingListAction({ data: false, loading: false, error: false }));
		dispatch(
			setCart({
				...cartData,
				result: {
					...cartData?.result,
					shipping: null,
					shipping_method: null,
				},
				sync: true,
			}),
		);
		anotherAction();
	};
};
