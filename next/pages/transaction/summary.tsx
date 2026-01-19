import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	LOCALSTORAGE,
	VOUCHER_CONST,
	fetchCachedTheme,
	getLocalStorage,
	getStorageParseDecrypt,
	removeLocalStorage,
	setStringifyLocalStorage,
	showToast,
	storePathValues,
} from '../../helper';
import { TransactionSummaryTemplate } from '@templates';
import { connect, useDispatch, useSelector } from 'react-redux';
import { setIsPageLoading as setIsPageLoadingRedux } from '../../redux/trigger';
import { fetchCart, getConsulVerifyData } from 'redux/actions';
import toast from 'react-hot-toast';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { PartnerTheme } from '@types';
import useTheme from 'hooks/useTheme';

interface Props {
	transactionid: string;
	general?: any;
	theme?: PartnerTheme;
}

const TransactionSummary = (props: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const verifyData = useSelector(({ verifyData }) => verifyData?.verifyData);
	const userInfoData = useSelector(({ general }) => general?.userInfo);
	const total_amount = cartData?.result?.total_price;

	const [theme, setTheme] = useState(null);

	useTheme({
		token: router.query?.token_order ?? cartData?.result?.order_token,
		setThemeData: setTheme,
	});

	usePartnerInfo({
		theme,
		token: router.query?.token_order ?? cartData?.result?.order_token,
	});

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
		if (cartData?.result) updateCartLocalStorage();
	}, [cartData?.result]);

	useEffect(() => {
		if (router) storePathValues();
	}, [router]);

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

	useEffect(() => {
		toastVoucherHandler();
		setIsPageLoadingRedux(true);
		dispatch(getConsulVerifyData());
		return () => {
			setIsPageLoadingRedux(false);
		};
	}, []);

	const getData = async () => {
		removeLocalStorage(LOCALSTORAGE.CART);
		dispatch(fetchCart({ id: router?.query?.id }));
	};

	const updateCartLocalStorage = () => {
		const d = new Date();

		setStringifyLocalStorage(LOCALSTORAGE.CART, {
			orderNumber: router?.query?.id,
			token: router?.query?.token,
			data: { ...cartData?.result, userInfo: userInfoData?.result },
			updatedAt: d,
		});
	};

	const goToPaymentMethod = async () => {
		const order = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
		const tempToken = router.query?.token || order?.token;
		const tempTrxXid = router.query?.transaction_xid ?? cartData?.result?.transaction_xid;
		const token_order =
			router?.query?.token_order ??
			(order?.orderId == (global?.orderNumber ?? router?.query?.id)
				? order?.partnerToken
				: null);
		router.push({
			pathname: '/payment/method',
			query: {
				...router.query,
				token: tempToken,
				transaction_xid: tempTrxXid,
				presc: 1,
				token_order,
				total_amount,
			},
		});
	};

	return <TransactionSummaryTemplate goToPaymentMethod={goToPaymentMethod} />;
};

const mapStateToProps = (state: any) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSummary);
