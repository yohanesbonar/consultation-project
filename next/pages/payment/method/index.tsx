import React, { useState, useEffect } from 'react';
import PaymentListTemplate from 'components/templates/PaymentListTemplate';
import {
	getTransactionDetail,
	transactionPay,
	LOCALSTORAGE,
	MESSAGE_CONST,
	getCheckoutPayments,
	getParsedLocalStorage,
	getPaymentMethod,
	setStringifyLocalStorage,
	showToast,
	storePathValues,
	TRANSACTION_CONST,
	numberToIDR,
	BUTTON_CONST,
	fetchCachedTheme,
} from 'helper';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailTransaction } from 'redux/actions';
import PopupBottomSheetPaymentDetail from 'components/organisms/PopupBottomSheetPaymentDetail';
import { setCartData } from 'redux/actions';
import { ImgNoPaymentMethod } from '@images';
import { ButtonHighlight } from '@atoms';
import usePartnerInfo from 'hooks/usePartnerInfo';
import useTheme from 'hooks/useTheme';

const PaymentMethod = (props: any) => {
	const router = useRouter();

	const dispatch = useDispatch();
	const { token, transaction_xid, backto, total_amount, token_order }: any = router.query;
	const results = useSelector(({ transaction }) => transaction.transactionDetail.result);

	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const [paymentList, setPaymentList] = useState([]);
	const [showDetail, setShowDetail] = useState(false);
	const [id, setId] = useState('');
	const [isXenditSubmitting, setIsXenditSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [statusCode, setStatusCode] = useState(0);
	const [theme, setTheme] = useState(null);

	const isEmptyRequiredMinimum = statusCode == 200 && paymentList?.length == 0;

	if (!props.theme) {
		useTheme({
			token: token_order ?? token,
			setThemeData: setTheme,
		});
	}

	usePartnerInfo({ theme: props?.theme || theme, token: (token_order ?? token) as string });

	const getCheckoutPaymentList = async () => {
		try {
			setIsLoading(true);
			const res: any = await getCheckoutPayments();
			if (res?.error) {
				showToast(res?.error ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
			} else {
				setPaymentList(res?.data);
				setStatusCode(res?.status);
			}
		} catch (error) {
			console.log('err', error);
		} finally {
			setIsLoading(false);
		}
	};

	const getPaymentList = async () => {
		const response = await getPaymentMethod({ token: token });
		if (response.meta?.acknowledge) {
			const data = [...response.data.payment_methods];
			data.forEach((item: any) => {
				if (item.payment_group_name === 'Mobile Payment') {
					item.label = 'Dompet Digital';
				} else if (item.payment_group_name === 'Virtual Account') {
					item.label = 'Transfer Virtual Account';
				} else if (item.payment_group_name === 'Multi Payment') {
					item.label = 'Metode Lain';
				} else {
					item.label =
						'Transfer ' + (item?.group_title == 'Bank Transfer' ? 'Bank' : 'Virtual Account');
				}
				item.payment_methods.forEach((list: any) => {
					list.icon = list.logo_url;
				});
			});
			setPaymentList(data);
		} else {
			router.push('/not-found');
		}
	};

	const choosePayment = async (id: any, method?: any) => {
		if (router.query?.presc) {
			let pymnt = null;
			if (paymentList?.length) {
				for (let index = 0; index < paymentList.length; index++) {
					if (pymnt) {
						break;
					} else {
						pymnt = paymentList[index]?.find((eI: any) => eI?.id == id);
					}
				}
			}

			const cart = await getParsedLocalStorage(LOCALSTORAGE.CART);
			const result = cartData?.result ?? cart?.data;

			dispatch(
				setCartData({
					...cartData,
					result: {
						...result,
						payment_method: pymnt,
					},
					sync: false,
				}),
			);
		}
		if (method?.payment_code === TRANSACTION_CONST.XENINV) {
			setId(id);
			setShowDetail(true);
		} else {
			const query = router.query;
			router.replace({
				pathname: `/payment/method/${id}`,
				query: {
					token,
					transaction_xid,
					...(query.presc ? { ...router.query } : {}),
					...(query?.token_order ? { token_order: query?.token_order } : {}),
					...(query?.total_amount ? { total_amount: query?.total_amount } : {}),
					...(backto ? { backto } : {}),
				},
			});
		}
	};

	const handleXenditSubmit = async () => {
		setIsXenditSubmitting(true);
		const body = {
			transaction_xid: transaction_xid,
			payment_method_id: id,
		};

		const res = await transactionPay({ body, token: token });
		if (res?.meta?.acknowledge) {
			setIsXenditSubmitting(false);
			window.location.href = res?.data?.invoice_url;
		} else {
			setIsXenditSubmitting(false);
		}
	};

	const onClickBack = () => {
		if (router.query?.fromPresc || router.query?.presc) {
			router.replace({
				pathname: '/transaction/summary',
				query: router.query,
			});
		} else {
			router.replace({
				pathname: '/order/detail',
				query: router.query,
			});
		}
	};

	useEffect(() => {
		storePathValues();
		if (Router?.query?.presc) {
			getCheckoutPaymentList();
		} else {
			getPaymentList();

			const params = { id: transaction_xid, token: token };
			const payload = { params };
			dispatch(fetchDetailTransaction(payload));
		}
	}, []);

	useEffect(() => {
		if (cartData?.result) updateCartLocalStorage();
	}, [cartData?.result]);

	const updateCartLocalStorage = () => {
		const d = new Date();
		setStringifyLocalStorage(LOCALSTORAGE.CART, {
			orderNumber: router?.query?.id,
			token: router?.query?.token,
			data: { ...cartData?.result },
			updatedAt: d,
		});
	};

	const renderEmptyCheckoutPayment = () => {
		return (
			<div className="tw-px-4 tw-text-center tw-mt-20">
				<img className="tw-w-[220.361px]" src={ImgNoPaymentMethod.src} alt="img" />
				<p className="title-18-medium tw-mb-2 tw-mt-10">
					Maaf, Metode Bayar Tidak Tersedia untuk Jumlah Pembayaran Anda
				</p>

				<p className="body-14-regular tw-mb-5">
					Maaf, tidak ada metode untuk pembayaran nominal sebesar
					<span className="label-14-medium">
						{' '}
						{numberToIDR(parseInt(total_amount ?? 0))}.{' '}
					</span>
					Silakan atur{' '}
					<span className="label-14-medium">
						voucher, jumlah barang, atau pengiriman Anda{' '}
					</span>
					untuk mencapai nominal pembayaran minimal.
				</p>

				<ButtonHighlight
					onClick={onClickBack}
					classNameBtn="tw-rounded-lg"
					text={BUTTON_CONST.BACK_TO_SUMMARY}
				/>
			</div>
		);
	};

	return (
		<>
			<PaymentListTemplate
				choosePayment={(id, method) => choosePayment(id, method)}
				paymentList={paymentList}
				isCheckout={router.query?.presc != null}
				isLoading={isLoading}
				totalAmount={total_amount}
				emptyState={isEmptyRequiredMinimum ? renderEmptyCheckoutPayment : null}
				onClickBack={onClickBack}
			/>
			<PopupBottomSheetPaymentDetail
				show={showDetail}
				onShow={setShowDetail}
				data={results}
				title={null}
				iconLabel={null}
				isXendit
				isXenditSubmitPayment={isXenditSubmitting}
				handleXenditSubmitPayment={handleXenditSubmit}
			/>
		</>
	);
};

export const getServerSideProps = async ({ req, res, query }) => {
	const params = { id: query?.transaction_xid, token: query?.token };
	const response = await getTransactionDetail(params);

	const token = query?.token_order ?? query?.token;
	const responseTheme = await fetchCachedTheme(query?.token as string, { req, res });
	try {
		if (response?.meta?.acknowledge) {
			return {
				props: {
					theme: responseTheme?.data,
				},
			};
		}
		if (
			response?.meta?.acknowledge &&
			response?.data?.payment_method?.name?.toUpperCase() == TRANSACTION_CONST.XEN_INVOICE
		) {
			return {
				redirect: {
					destination:
						'/payment/status/result?transaction_xid=' +
						query?.transaction_xid +
						'&token=' +
						query?.token,
					permanent: false,
				},
			};
		} else if (response?.meta?.acknowledge && response?.data?.invoice_url) {
			return {
				redirect: {
					destination: response?.data?.invoice_url,
					permanent: false,
				},
			};
		}
	} catch (error) {
		console.log('error on server side props order detail : ', error);
	}

	return { props: {} };
};

export default PaymentMethod;
