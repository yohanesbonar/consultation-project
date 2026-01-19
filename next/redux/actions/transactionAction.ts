import { OrderSummary, PrescriptionDetailData, VoucherType } from '@types';
import {
	LOCALSTORAGE,
	MESSAGE_CONST,
	ORDER_TYPE,
	STATUS_CONST,
	TOAST_MESSAGE,
	VOUCHER_CONST,
	checkIsEmpty,
	getMergeObjectTrxtoPresc,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	getTransactionDetail,
	handleSendManualPresc,
	redirectApplyPresc,
	setLocalStorage,
	setStorageEncrypt,
	setStringifyLocalStorage,
	showToast,
	storeOrderNumber,
} from 'helper';
import {
	checkoutCart,
	getCheckoutHistory,
	getCheckoutVoucherList,
	getHistoryData,
	getProductTransactionDetail,
	getVoucherList,
	postCheckoutShipment,
	postValidateVoucher,
} from '../../helper/Network/transaction';
import debounce from 'debounce-promise';
import { getPrescription, setIsPageLoadingAction } from './generalAction';
import Router from 'next/router';
import { setIsPageLoading } from 'redux/trigger';
import { setShippingListAction } from './seamlessPrescriptionAction';
import toast from 'react-hot-toast';
const debouncedFetchVoucher = debounce(getVoucherList, 1000);
const debouncedFetchCheckoutVoucher = debounce(getCheckoutVoucherList, 1000);
const debouncedFetchHistory = debounce(getHistoryData, 1000);

export const SET_VOUCHER = 'TRANSACTION/SET_VOUCHER';
export const SET_VOUCHER_LIST = 'TRANSACTION/SET_VOUCHER_LIST';
export const SET_TRANSACTION_DETAIL = 'TRANSACTION/SET_TRANSACTION_DETAIL';
export const SET_PRODUCT_TRANSACTION_DETAIL = 'TRANSACTION/SET_PRODUCT_TRANSACTION_DETAIL';
export const SET_VOUCHER_KEYWORD = 'TRANSACTION/SET_VOUCHER_KEYWORD';
export const SET_VOUCHER_SELECTED = 'TRANSACTION/SET_VOUCHER_SELECTED';
export const SET_CART = 'TRANSACTION/SET_CART';
export const SET_HISTORY = 'TRANSACTION/SET_HISTORY';
export const SET_VOUCHER_VALIDATOR = 'TRANSACTION/SET_VOUCHER_VALIDATOR';

export const setVoucherAction = (voucher?: VoucherType | object) => ({
	type: SET_VOUCHER,
	payload: voucher,
});

export const setVoucherList = (voucher: any) => ({
	type: SET_VOUCHER_LIST,
	payload: voucher,
});

export const setTransactionDetail = (data: any) => ({
	type: SET_TRANSACTION_DETAIL,
	payload: data,
});

export const setProductTransactionDetail = (data: any) => ({
	type: SET_PRODUCT_TRANSACTION_DETAIL,
	payload: data,
});

export const setVoucherKeyword = (keyword: string) => ({
	type: SET_VOUCHER_KEYWORD,
	payload: keyword,
});

export const setVoucherCode = (voucher: string) => ({
	type: SET_VOUCHER_SELECTED,
	payload: voucher,
});

export const setTransactionHistory = (data?: any, type = ORDER_TYPE.CONSULTATION) => ({
	type: SET_HISTORY,
	payload: {
		...data,
		type: type,
	},
});

export const setVoucherValidator = (data: string) => ({
	type: SET_VOUCHER_VALIDATOR,
	payload: data,
});

export const syncCart: any = (cart: any, productToUpdate = [], isUpdateUserInfo?: boolean) => {
	return async (dispatch: any, getState: any) => {
		const { transaction } = getState();
		dispatch(setCartData({ ...transaction?.cart, sync: false, loading: true }));
		try {
			const { transaction } = getState();
			const partnerToken =
				Router?.query?.token_order ??
				(await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION))?.partnerToken;
			let bodyReq = {};
			if (
				transaction?.cart?.result?.userInfo ||
				cart?.result?.userInfo ||
				cart?.result?.patient_data
			) {
				const uInfo =
					cart?.result?.userInfo ??
					transaction?.cart?.result?.userInfo ??
					cart?.result?.patient_data;
				bodyReq = {
					prescription_id: (cart ?? transaction?.cart)?.result?.id,
					address: uInfo?.patient_address,
					detail_address: uInfo?.patient_detail_address,
					phone_number: uInfo?.patient_phonenumber,
					postal_code: uInfo?.patient_postal_code,
					latitude: uInfo?.patient_latitude,
					longitude: uInfo?.patient_longitude,
				};
			} else {
				throw 'cannot get user info data';
			}

			const res = await checkoutCart({
				data: { ...bodyReq, products: productToUpdate },
				token: partnerToken,
			});

			if (res?.meta?.acknowledge) {
				if (isUpdateUserInfo) {
					dispatch(setCartData({ ...cart, sync: false, loading: false }));
				} else {
					dispatch(setShippingListAction({ data: null, loading: false, error: false }));
					dispatch(setCartData({ ...cart, sync: false, loading: false }));
					if (res?.data?.is_merchant_changed) {
						toast.success(TOAST_MESSAGE.MERCHENT_AJUSTED, {
							style: { marginBottom: 65 },
						});
						dispatch(fetchCart({ id: Router.query?.id }));
					} else {
						Router.push({
							pathname: '/transaction/summary',
							query: Router.query,
						});
					}
				}
			} else {
				console.log('res sync cart', res);
				showToast(res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
				dispatch(setCartData({ ...transaction?.cart, sync: false, loading: false }));
			}
		} catch (error: any) {
			dispatch(setCartData({ ...transaction?.cart, sync: false, loading: false }));
			console.log('err on sync cart', error);
		}
	};
};

export const setCart: any = (cart: any, isSubmitting?: boolean, isUpdateUserInfo?: boolean) => {
	return (dispatch: any, getState: any) => {
		const { transaction } = getState();
		try {
			if (cart?.sync && transaction?.cart?.sync) {
				return;
			}
			const temp = Object.assign({}, cart);
			let subtotal = 0;
			let totalQty = 0;

			const productToUpdate: Array<{
				product_id?: number;
				quantity?: number;
			}> = [];
			if (temp?.result?.products && temp?.result?.products?.length) {
				const productsTemp = Object.assign(
					[],
					temp?.result?.updatedProducts && temp?.result?.updatedProducts?.length
						? temp?.result?.updatedProducts
						: temp?.result?.products,
				);
				productsTemp?.forEach((element: any) => {
					subtotal += (element?.updatedQty ?? element?.qty) * element?.price;
					totalQty += element?.updatedQty ?? element?.qty;
					productToUpdate.push({
						product_id: element?.productId != null ? parseInt(element?.productId) : null,
						quantity: element?.updatedQty ?? element?.qty,
					});
				});
			}
			if (temp?.result) {
				temp.result.subtotal = subtotal;
				temp.result.grand_total = null;
				temp.result.shipping = null;
				temp.result.totalQty = totalQty;
			}
			if (isUpdateUserInfo) {
				dispatch(setCartData({ ...temp, sync: true }));
				dispatch(syncCart(temp, productToUpdate, isUpdateUserInfo));
			} else if (cart?.sync && isSubmitting) {
				dispatch(setCartData({ ...transaction?.cart, sync: true }));
				dispatch(syncCart(temp, productToUpdate));
			} else {
				dispatch(setCartData({ ...temp, sync: false }));
			}
		} catch (error) {
			console.log('error on set cart', error);
		}
	};
};

export const setCartData = (cart: any) => ({
	type: SET_CART,
	payload: cart,
});

export const fetchVoucher: any = (params: {
	token: string;
	transaction_xid: string;
	code: string;
	presc_id?: string;
}) => {
	return async (dispatch: any, getState: any) => {
		const { transaction } = getState();
		const isPrescription = Router.query?.presc;

		// start fetching
		dispatch(setVoucherList({ ...transaction.voucherList, loading: true }));

		try {
			const _params: any = {
				token: params.token,
				transaction_xid: params.transaction_xid,
				code: params.code,
				presc_id: params.presc_id,
			};

			// params conditioning
			if (params?.presc_id) {
				delete _params.transaction_xid;
				delete _params.code;
			} else {
				delete _params.presc_id;
			}

			const { data, meta }: any = isPrescription
				? await debouncedFetchCheckoutVoucher(_params)
				: await debouncedFetchVoucher(_params);

			// get detail transaction to get voucher code
			const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			const detailTransactionReslts = isPrescription
				? await getProductTransactionDetail({
						id: params?.transaction_xid,
						token: Router?.query?.token_order ?? order?.partnerToken,
				  })
				: await getTransactionDetail({
						id: params.transaction_xid,
						token: params.token,
				  });

			const localVoucher = await getStorageParseDecrypt(VOUCHER_CONST.SEAMLESS_VOUCHER);
			const voucher = detailTransactionReslts?.data?.voucher ?? localVoucher?.body ?? {};

			const voucherData = {
				...voucher,
				...localVoucher?.body,
				discount: detailTransactionReslts?.data?.discount ?? 0,
			};

			if (detailTransactionReslts?.data?.voucher) dispatch(setVoucherAction(voucherData));

			// success fetch voucher data
			if (meta?.acknowledge) {
				const availableVoucherMerged = data?.availableVoucher?.ListVoucherGeneral?.concat(
					data?.availableVoucher?.ListVoucherMerchant,
				);

				const ListVoucherMerchant =
					localVoucher?.body || !checkIsEmpty(detailTransactionReslts?.data?.voucher)
						? availableVoucherMerged?.some(
								(e: any) =>
									e?.code ==
									(localVoucher?.body?.code ||
										detailTransactionReslts?.data?.voucher?.code),
						  )
							? availableVoucherMerged
							: [
									{
										...(localVoucher?.body || detailTransactionReslts?.data?.voucher),
									},
							  ].concat(availableVoucherMerged)
						: availableVoucherMerged;

				// for seamless product only
				const coVoucherAvailable = ListVoucherMerchant ?? [];
				const coVoucherUnavailable =
					data?.unavailableVoucher?.ListVoucherGeneral?.concat(
						data?.unavailableVoucher?.ListVoucherMerchant,
					) ?? [];

				// manipulate & combine voucher data
				const voucherAvailable = !isPrescription
					? data.filter((v: VoucherType) => v?.enabled)
					: coVoucherAvailable;
				const voucherUnavailable = !isPrescription
					? data?.filter((v: VoucherType) => !v.enabled)
					: coVoucherUnavailable;

				const _canUse: any =
					detailTransactionReslts?.data?.paid_amount == 0 &&
					detailTransactionReslts?.data?.discount == 0 &&
					!isPrescription
						? []
						: voucherAvailable.map((item: VoucherType) => ({
								...item,
								enabled: isPrescription ? true : item?.enabled,
								isSelected: voucher?.code == item.code ? true : false,
						  }));

				_canUse.sort((a: any, b: any) => (a.isSelected ? -1 : 1)); // sort selected to top

				const _canotUse: any =
					detailTransactionReslts?.data?.paid_amount == 0 &&
					detailTransactionReslts?.data?.discount == 0
						? data ?? []
						: voucherUnavailable;

				dispatch(
					setVoucherList({
						result: {
							canUse: _canUse,
							canotUse: _canotUse,
							productDetail: isPrescription ? detailTransactionReslts?.data : null,
						},
						loading: false,
						error: false,
					}),
				);
			} else {
				dispatch(
					setVoucherList({
						result: { canUse: [], canotUse: [] },
						loading: false,
						error: false,
					}),
				);
			}
		} catch (error) {
			// error fetch data
			dispatch(
				setVoucherList({
					result: false,
					loading: false,
					error: error.message,
				}),
			);
		}
	};
};

export interface ParamsTransaction {
	params: { id: string; token: string };
	props: any;
	callback?: any;
}
export const fetchDetailTransaction: any = (payload: ParamsTransaction) => {
	const { props, params } = payload;
	return async (dispatch: any, getState: any) => {
		const { transaction } = getState();
		dispatch(setTransactionDetail({ ...transaction.transactionDetail, loading: true }));

		try {
			const { data, meta } = checkIsEmpty(props?.initialData)
				? await getTransactionDetail(params)
				: { data: props?.initialData, meta: { acknowledge: true } };

			if (meta?.acknowledge) {
				await setStringifyLocalStorage(LOCALSTORAGE.TRANSACTION, data);
				await setStorageEncrypt(LOCALSTORAGE.ORDER, {
					token: params.token,
					orderNumber: data?.transaction_id,
				});
				await storeOrderNumber(data?.transaction_id);

				// count total if there have other cost
				const _other_amount = data?.other_amount ? data?.other_amount : [];

				// if discount available
				const discounts = transaction.voucher.discounts || 0;
				let _total_other_amount = 0;
				const _total_amount = data?.paid_amount - discounts;
				_other_amount.map((item: any) => {
					_total_other_amount += item.value;
				});

				if (data?.back_url) {
					setTimeout(() => {
						localStorage.setItem(LOCALSTORAGE.BACK_URL, data?.back_url);
					}, 500);
				}

				const summary: OrderSummary = {
					name: data?.patient?.name,
					age: data?.patient?.age,
					gender: data?.patient?.gender,
					specialist: data?.specialist?.name,
					pricing_amount: data?.pricing_amount,
					other_amount: data?.other_amount,
					total_amount: _total_amount,
					total_other_amount: _total_other_amount,
					back_url: data?.back_url,
					discount: data?.discount,
					promo_price: data?.promo_price,
				};

				// set data
				dispatch(
					setTransactionDetail({
						error: false,
						loading: false,
						result: summary,
					}),
				);

				if (data?.voucher) {
					dispatch(
						setVoucherAction({
							...data?.voucher,
							...(data?.voucher?.discount
								? { discount: data?.voucher?.discount ?? 0 }
								: { discount: data?.discount ?? 0 }),
						}),
					);
				} else {
					dispatch(setVoucherAction({}));
				}
			}
		} catch (error) {
			dispatch(setTransactionDetail({ result: false, loading: false, error: error.message }));
		}
	};
};

export const fetchProductDetailTransaction: any = (payload: ParamsTransaction) => {
	const { props, params, callback } = payload;
	return async (dispatch: any, getState: any) => {
		setIsPageLoading(true);
		const { transaction } = getState();

		dispatch(
			setProductTransactionDetail({ ...transaction?.productTransactionDetail, loading: true }),
		);

		try {
			const { data, meta } = checkIsEmpty(props?.initialData)
				? await getProductTransactionDetail(params)
				: { data: props?.initialData, meta: { acknowledge: true } };

			if (meta?.acknowledge) {
				await setStringifyLocalStorage(LOCALSTORAGE.PRODUCT_TRANSACTION, data);
				await storeOrderNumber(data?.transaction_id);

				// count total if there have other cost
				const _other_amount = data?.other_amount ? data?.other_amount : [];

				// if discount available
				const discounts = transaction.voucher.discounts || 0;

				let _total_other_amount = 0;
				const _total_amount = data?.paid_amount - discounts;
				_other_amount.map((item: any) => {
					_total_other_amount += item.value;
				});

				const summary: OrderSummary = {
					...data,
					name: data?.patient?.name,
					age: data?.patient?.age,
					gender: data?.patient?.gender,
					specialist: data?.specialist?.name,
					pricing_amount: data?.pricing_amount,
					other_amount: data?.other_amount,
					total_amount: _total_amount,
					total_other_amount: _total_other_amount,
				};

				// set data
				dispatch(
					setProductTransactionDetail({
						error: false,
						loading: false,
						result: summary,
					}),
				);
				setIsPageLoading(false);

				if (data?.voucher) {
					dispatch(
						setVoucherAction({
							...data?.voucher,
							...(data?.voucher?.discount
								? { discount: data?.voucher?.discount ?? 0 }
								: { discount: data?.discount ?? 0 }),
						}),
					);
				} else {
					dispatch(setVoucherAction({}));
				}

				if (callback) {
					callback({ result: summary });
				}
			}
		} catch (error) {
			dispatch(
				setProductTransactionDetail({ result: false, loading: false, error: error.message }),
			);
			setIsPageLoading(false);
		} finally {
			setIsPageLoading(false);
		}
	};
};

const handleIfNoSeamless = async (
	data: PrescriptionDetailData,
	orderNumber?: string,
	contactUrl?: string,
) => {
	try {
		handleSendManualPresc(data, contactUrl, orderNumber);
	} catch (error) {
		console.log('error on  : ', error);
	}
};

const handleForAddressOrCart = async (dispatch: any, res?: any) => {
	try {
		// voucher init from product detail
		let voucher: any = null;
		let total_price = 0;

		let shipping_method: any = null;
		if (res?.data?.transaction_xid) {
			try {
				const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
				const resCheckoutDetail = await getProductTransactionDetail({
					id: res?.data?.transaction_xid,
					token: Router?.query?.token_order ?? res?.data?.order_token ?? order?.partnerToken,
				});

				if (resCheckoutDetail?.meta?.acknowledge) {
					voucher = resCheckoutDetail?.data?.voucher ?? null;
					total_price = resCheckoutDetail?.data?.total_price;
					if (resCheckoutDetail?.data?.shipping_method) {
						shipping_method = {
							...resCheckoutDetail?.data?.shipping_method,
							price: resCheckoutDetail?.data?.shipping_fee,
						};
					}
					if (resCheckoutDetail?.data?.payment_status != STATUS_CONST.CREATED) {
						const q = {
							token: Router?.query?.token,
							transaction_xid: res?.data?.transaction_xid,
							checked: 1,
							presc: 1,
							...(Router?.query?.token_order
								? { token_order: Router?.query?.token_order }
								: {}),
							...(resCheckoutDetail?.data?.payment_method?.id
								? { methodId: resCheckoutDetail?.data?.payment_method?.id }
								: {}),
						};

						Router.replace({
							pathname: '/payment/waiting-payment',
							query: q,
						});
						return;
					}
				}
			} catch (error) {
				console.log('error on get product trx detail : ', error);
			}
		}

		const dataTemp = res?.data;
		dataTemp.products = Object.assign([], dataTemp?.prescriptions);

		// manipulate with qty to show on ui from (transaction_product)
		const presc = getMergeObjectTrxtoPresc(
			dataTemp?.transaction_products,
			dataTemp?.prescriptions,
		);

		dataTemp.updatedProducts = Object.assign([], presc);
		dataTemp.isUpdated = false;
		dataTemp.voucher = voucher;
		dataTemp.total_price = total_price;
		dataTemp.shipping_method =
			!checkIsEmpty(voucher) &&
			!checkIsEmpty(shipping_method) &&
			!Object.keys(voucher)?.length &&
			!Object.keys(shipping_method)?.length
				? null
				: shipping_method;

		//termporary : change this with real data
		dataTemp.merchant = {
			id: dataTemp?.merchant?.merchant_id ?? '',
			distance_label: dataTemp?.merchant?.distance_label ?? '',
			name: dataTemp?.merchant?.merchant_name ? dataTemp?.products[0]?.merchantName : null,
			location: dataTemp?.products?.length ? dataTemp?.products[0]?.merchantAddress : null,
			img: dataTemp?.products?.length ? dataTemp?.products[0]?.merchantImage : null,
		};

		dispatch(
			setCart({
				result: dataTemp,
				error: false,
				loading: false,
			}),
		);
	} catch (error) {
		console.log('error on  : ', error);
	}
};

export const fetchCart: any = (payload: {
	id?: string;
	token?: string;
	isAlreadyRedirect?: boolean;
}) => {
	const { id, token, isAlreadyRedirect = false } = payload;
	return async (dispatch: any, getState: any) => {
		try {
			dispatch(
				setCart({
					result: null,
					error: false,
					loading: true,
				}),
			);
			dispatch(setIsPageLoadingAction(true));
			const res = await dispatch(getPrescription(id));

			if (!res?.errorMessage && res?.data?.prescriptionStatus == STATUS_CONST.INVALID) {
				window.location.href = `/prescription-detail?token=${Router?.query?.token}`;
				return;
			}

			// make sure the address is 205 characters and detail address is 50 characters follow the GOA requirement
			if (res?.data?.patient_data?.patient_address) {
				res.data.patient_data.patient_address = String(res?.data?.patient_data?.patient_address)
					.substring(0, 205)
					.trim();
			}
			if (res?.data?.patient_data?.patient_detail_address) {
				res.data.patient_data.patient_detail_address = String(
					res?.data?.patient_data?.patient_detail_address,
				)
					.substring(0, 50)
					.trim();
			}

			const d = new Date();
			setStringifyLocalStorage(LOCALSTORAGE.CART, {
				orderNumber: id ?? Router?.query?.id,
				token: Router?.query?.token,
				data: res,
				updatedAt: d,
			});

			if (res?.errorMessage) {
				throw res?.errorMessage;
			} else {
				const { general } = getState();

				if (isAlreadyRedirect) {
					handleForAddressOrCart(dispatch, res);
				} else {
					redirectApplyPresc(res?.data, {
						contactUrl: general?.contactUrl,
						orderNumber: id ?? (Router?.query?.id as string),
						isSameAddressAndCartHandling: true,
						isReplacePage: true,
						handleSeamlessCart: async () => {
							handleForAddressOrCart(dispatch, res);
						},
					});
				}
			}
		} catch (error) {
			console.log('err fetch cart', error);
			dispatch(
				setCart({
					result: null,
					loading: false,
					error: error ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
				}),
			);
		} finally {
			dispatch(setIsPageLoadingAction(false));
		}
	};
};

export const fetchHistory: any = (payload: {
	token?: string;
	type?: string;
	status?: string;
	page?: number;
	limit?: number;
}) => {
	const { token, type = ORDER_TYPE.CONSULTATION, status = 'all', page = 1, limit = 10 } = payload;
	return async (dispatch: any, getState: any) => {
		const { transaction } = getState();
		const previousData = transaction?.history?.result || [];
		dispatch(
			setTransactionHistory({
				...transaction.history,
				loading: true,
			}),
		);
		try {
			setTransactionHistory({
				...(transaction?.history ? transaction?.history : {}),
				loading: true,
			});

			let historyData: any;
			let currToken: any;
			const tempToken = token ?? Router.query?.token;

			if (type == ORDER_TYPE.CONSULTATION) {
				const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
				let transactionDetail: any;
				if (tempToken == null) {
					const resTransactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);

					transactionDetail = await getTransactionDetail({
						id: resTransactionData?.xid,
						token: temp?.token,
					});
				}

				currToken = tempToken ?? transactionDetail?.data?.transaction_token;

				historyData = await debouncedFetchHistory({
					token: tempToken ?? transactionDetail?.data?.transaction_token,
					status: status,
					page: page,
					limit: limit,
				});

				if (!historyData?.meta?.acknowledge) {
					throw new Error('Failed to history list');
				}
			} else {
				historyData = await getCheckoutHistory({
					token: tempToken ? tempToken?.toString() : '',
					status: status,
					page: page,
					limit: limit,
				});
			}

			global.metaAt = historyData?.meta?.at;

			dispatch(
				setTransactionHistory({
					result:
						page <= 1 ? historyData?.data : [...previousData, ...(historyData.data ?? [])],
					actualResults: historyData?.data ?? [],
					token: currToken,
					type: type,
					loading: false,
					error: false,
				}),
			);
		} catch (error) {
			dispatch(
				setTransactionHistory({
					result: null,
					type: type,
					loading: false,
					error: false,
				}),
			);
			console.log('error on get data history transaction : ', error);
		}
	};
};

export const setShipping: any = (payload?: any, callback?: () => void) => {
	return async (dispatch: any, getState: any) => {
		const { transaction } = getState();
		const { seamless } = getState();
		const shippingData = seamless?.shippingList;
		try {
			await dispatch(setShippingListAction({ ...shippingData, submittingId: payload?.id }));

			const bodyReq = {
				prescription_id: transaction?.cart?.result?.id,
				...payload,
			};

			const res = await postCheckoutShipment(bodyReq);
			if (res?.meta?.acknowledge) {
				callback();
			} else {
				showToast(res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
				throw res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG;
			}
		} catch (error) {
			console.log('err set shipping', error);
		} finally {
			dispatch(setShippingListAction({ ...shippingData, submittingId: null }));
		}
	};
};

export const checkValidateVoucher: any = (
	transaction_xid: string,
	token_transaction: string,
	isFromPay?: boolean,
) => {
	return async (dispatch: any) => {
		try {
			const body = { transactionXid: transaction_xid };
			const { data, meta } = await postValidateVoucher({ body, token: token_transaction });
			if (!meta?.acknowledge && !isFromPay) {
				showToast(data?.reason, { marginBottom: 70 }, 'error');
				await setLocalStorage(VOUCHER_CONST.VOUCHER_INVALID_FLAG, true);
			}
			dispatch(setVoucherValidator(data));
		} catch (error) {
			console.error('error: ', error);
		}
	};
};
