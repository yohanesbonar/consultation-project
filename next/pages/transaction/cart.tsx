import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import {
	LOCALSTORAGE,
	TOAST_MESSAGE,
	VOUCHER_CONST,
	fetchCachedTheme,
	getLocalStorage,
	removeLocalStorage,
	setStringifyLocalStorage,
	showToast,
	storePathValues,
} from '../../helper';
import { CartTemplate } from '@templates';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPageLoading as setIsPageLoadingRedux } from '../../redux/trigger';
import { fetchCart, getConsulVerifyData } from 'redux/actions';
import toast from 'react-hot-toast';
import useToastFromLocalStorage from 'hooks/useToastFromLocalStorage';
import usePartnerInfo from 'hooks/usePartnerInfo';
import useTheme from 'hooks/useTheme';

const Cart = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const verifyData = useSelector(({ verifyData }) => verifyData?.verifyData);

	const [theme, setTheme] = useState(null);

	useTheme({
		token: router.query?.token_order ?? cartData?.result?.order_token,
		setThemeData: setTheme,
	});

	usePartnerInfo({
		theme,
		token: router.query?.token_order ?? cartData?.result?.order_token,
	});

	useToastFromLocalStorage(LOCALSTORAGE.CONSULTATION_ENDED_PRESC);

	useEffect(() => {
		if (verifyData) {
			if (verifyData?.error) {
				showToast(verifyData?.error);
				setIsPageLoadingRedux(false);
			} else if (verifyData?.token && !cartData?.loading) {
				getData();
			} else {
				setIsPageLoadingRedux(false);
			}
		}
	}, [verifyData]);

	useEffect(() => {
		if (cartData?.result) {
			updateCartLocalStorage();
		}
	}, [cartData?.result]);

	useEffect(() => {
		if (router) {
			storePathValues();
		}
	}, [router]);

	useEffect(() => {
		toastMerchentHandler();
		toastVoucherHandler();
		setIsPageLoadingRedux(true);
		dispatch(getConsulVerifyData());
		return () => {
			setIsPageLoadingRedux(false);
		};
	}, []);

	const toastMerchentHandler = async () => {
		const cart_toast = await getLocalStorage(LOCALSTORAGE.CART_TOAST);
		if (cart_toast) {
			toast.success(TOAST_MESSAGE.MERCHENT_AJUSTED, {
				style: { marginBottom: 65 },
			});
			removeLocalStorage(LOCALSTORAGE.CART_TOAST);
		}
	};

	const toastVoucherHandler = async () => {
		const voucherToast = await getLocalStorage(VOUCHER_CONST.VOUCHER_TOAST);
		if (voucherToast) {
			toast.success(voucherToast, {
				style: { marginBottom: 65 },
			});
			setTimeout(async () => {
				await removeLocalStorage(VOUCHER_CONST.VOUCHER_TOAST);
			}, 1000);
		}
	};

	const getData = async () => {
		removeLocalStorage(LOCALSTORAGE.CART);
		dispatch(fetchCart({ id: router?.query?.id }));
	};

	const updateCartLocalStorage = () => {
		const d = new Date();

		setStringifyLocalStorage(LOCALSTORAGE.CART, {
			orderNumber: router?.query?.id,
			token: router?.query?.token,
			data: cartData?.result,
			updatedAt: d,
		});
	};

	return <CartTemplate />;
};

export const getServerSideProps = async ({ req, res, query }) => {
	try {
		const token = query?.token_order;
		const response = await fetchCachedTheme(token as string, { req, res });

		if (response?.meta?.acknowledge) {
			return {
				props: {
					theme: response?.data,
				},
			};
		}
		return {
			props: {},
		};
	} catch (error) {
		console.error('error on getdata  : ', error, query?.token);
		return {
			props: {},
		};
	}
};

export default Cart;
