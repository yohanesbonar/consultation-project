//untuk payment method detail
// methodid -> id tiap method
import { useRouter } from 'next/router';
import { ButtonHighlight } from '@atoms';
import PaymentMethodDetailTemplate from 'components/templates/PaymentMethodDetailTemplate';
import {
	BUTTON_CONST,
	BUTTON_ID,
	checkIsEmpty,
	getCheckoutPayments,
	getParsedLocalStorage,
	getPaymentMethod,
	getStorageParseDecrypt,
	getTransactionDetail,
	LOCALSTORAGE,
	MESSAGE_CONST,
	postCheckoutPay,
	PAYMENT_STATUS,
	setStringifyLocalStorage,
	showToast,
	STATUS_CONST,
	storePathValues,
	transactionPay,
	VOUCHER_CONST,
	removeLocalStorage,
	setLocalStorage,
	navigateWithQueryParams,
	postRollbackCheckoutVoucher,
	getProductTransactionDetail,
	fetchCachedTheme,
} from 'helper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import TagManager from 'react-gtm-module';
import { checkValidateVoucher, fetchCart } from 'redux/actions';
import { CustomPopup } from '@molecules';
import { IconWarning } from '@icons';
import usePartnerInfo from 'hooks/usePartnerInfo';

function PaymentMethodDetail(props) {
	const router = useRouter();
	const dispatch = useDispatch();
	const { transaction_xid, token, methodId, backto, token_order }: any = router.query;

	const [isLoading, setIsLoading] = useState(false);
	const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
	const [paymentData, setPaymentData] = useState<any>({});
	const [email, setEmail] = useState<string>('');
	const [transactionData, setTransactionData] = useState<any>({});
	const [isVa, setIsVa] = useState(false);
	const [isQris, setIsQris] = useState(false);
	const [currToken, setCurrToken] = useState('');
	const [isShowErrorPayment, setIsShowErrorPayment] = useState(false);

	const isGettingDataRef = useRef(false);

	// will ajust with api
	const isFreePaid = methodId === PAYMENT_STATUS.FREE_PAID;

	usePartnerInfo({ ...props, token: (token_order ?? token) as string });

	useEffect(() => {
		const tagManagerArgs = {
			dataLayer: {
				transactionId: transactionData?.transaction_id,
			},
			dataLayerName: 'PageDataLayer',
		};

		TagManager.dataLayer(tagManagerArgs);
	}, [transactionData]);

	useEffect(() => {
		storePathValues();
		if (!router.query?.presc) dispatch(checkValidateVoucher(transaction_xid, token, true));
	}, [router.query?.presc]);

	const getData = async () => {
		try {
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const tempToken = checkIsEmpty(router.query?.token) ? temp?.token : router.query?.token;
			setCurrToken(tempToken);
			const transactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);
			const trxXidTemp = checkIsEmpty(router.query?.transaction_xid)
				? transactionData?.xid
				: router.query?.transaction_xid;

			getPaymentMethods(tempToken);

			const transactionDetail = await getTransactionDetail({
				id: trxXidTemp,
				token: tempToken,
			});

			if (!transactionDetail?.meta?.acknowledge) {
				throw new Error('Failed to fetch transaction detail');
			} else {
				if (transactionDetail?.data?.payment_status != STATUS_CONST.CREATED) {
					const transactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);

					const trxXidTemp = checkIsEmpty(router.query?.transaction_xid)
						? transactionData?.xid
						: router.query?.transaction_xid;
					const prescQueryParam = router?.query?.presc ? '&presc=' + router?.query?.presc : '';

					document.removeEventListener('visibilitychange', () => {
						console.log('remove visibilitychange listener');
					});
					const destUrl =
						'/payment/status/result?token=' +
						(tempToken ?? '') +
						'&transaction_xid=' +
						(trxXidTemp ?? '') +
						'&methodId=' +
						(methodId ?? '') +
						(prescQueryParam ?? '');

					return (window.location.href = destUrl);
				}
			}

			setTransactionData(transactionDetail?.data);
			setEmail(transactionDetail.data?.patient?.email ?? transactionDetail.data?.patient_email);
		} catch (error) {
			console.log('error on get data payment : ', error);
		} finally {
			isGettingDataRef.current = false;
		}
	};

	const getCheckoutPaymentDetail = async () => {
		try {
			let pymnt = null;
			const cart = await getParsedLocalStorage(LOCALSTORAGE.CART);
			pymnt = cart?.data?.payment_method;
			setTransactionData(cart);

			if (
				(router?.query?.transaction_xid || router?.query?.transaction_id) &&
				router?.query?.token_order
			) {
				const resCheckout = await getProductTransactionDetail({
					id: (router?.query?.transaction_xid || router?.query?.transaction_id) as string,
					token: router?.query?.token_order as string,
				});
				if (resCheckout?.meta?.acknowledge) {
					setEmail(resCheckout?.data?.patient_email);
				}
			}

			if (!pymnt) {
				const res: any = await getCheckoutPayments(methodId);
				if (res?.error) {
					showToast(res?.error ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
				} else {
					pymnt = res?.data;
				}
			}
			if (pymnt?.group_title === 'Virtual Account') setIsVa(true);
			if (pymnt?.payment_code?.toLowerCase() == 'qris') setIsQris(true);

			setPaymentData(pymnt);
		} catch (error) {
			console.log('err', error);
			showToast(MESSAGE_CONST.SOMETHING_WENT_WRONG);
		} finally {
			isGettingDataRef.current = false;
		}
	};

	useEffect(() => {
		if (router?.query?.presc) {
			getCheckoutPaymentDetail();
		} else {
			getData();
		}

		document.addEventListener('visibilitychange', () => {
			if (
				!isGettingDataRef.current &&
				document.visibilityState === 'visible' &&
				document.documentURI.includes('/payment/method')
			) {
				isGettingDataRef.current = true;
				if (router?.query?.presc) {
					getCheckoutPaymentDetail();
				} else {
					getData();
				}
			}
		});
		return () => {
			document.removeEventListener('visibilitychange', () => {
				console.log('remove visibilitychange listener');
			});
		};
	}, [router]);

	const getPaymentMethods = async (tempToken?: string) => {
		try {
			const res = await getPaymentMethod({ token: tempToken });

			if (!res?.meta?.acknowledge) {
				throw new Error('Failed to fetch payment method');
			}

			const resData = res?.data?.payment_methods.find((data) => {
				const child = data?.payment_methods.find((val) => val?.payment_method_id === methodId);
				return (data.payment_methods = child);
			});
			setPaymentData(resData);

			if (resData?.payment_group_name == 'Virtual Account') setIsVa(true);
			if (resData?.payment_code?.toLowerCase() == 'qris') setIsQris(true);
		} catch (error) {
			console.log('error on get payment methods : ', error);
		}
	};

	const infoContent = (
		<div>
			<ul className="tw-flex tw-flex-col tw-gap-2 font-12">
				{isFreePaid ? (
					<>
						<li>
							Notifikasi dan kuota telekonsultasi akan dikirim ke email{' '}
							<span className="tw-font-bold tw-inline">{email}</span>
						</li>
					</>
				) : isQris ? (
					<>
						<li>
							Anda akan mendapatkan <span className="tw-font-bold tw-inline">kode QR</span>{' '}
							setelah klik “Bayar”
						</li>
						<li>
							Notifikasi bukti pembayaran dan pelacakan pesanan akan dikirim ke email{' '}
							<span className="tw-font-bold tw-inline">{email}</span>
						</li>
					</>
				) : (
					<>
						{isVa ? (
							<li>
								Anda akan mendapatkan{' '}
								<span className="tw-font-bold tw-inline">nomor virtual account</span>{' '}
								setelah klik “Bayar”
							</li>
						) : (
							<li>
								Anda akan langsung diarahkan ke{' '}
								<span className="tw-font-bold tw-inline">aplikasi terkait</span>
							</li>
						)}

						<li>
							Notifikasi bukti pembayaran dan kuota konsultasi akan dikirim ke email{' '}
							<span className="tw-font-bold tw-inline">{email}</span>
						</li>

						<li>
							untuk transaksi dengan bank transfer,{' '}
							<span className="tw-font-bold tw-inline">kode unik</span> akan ditambahkan ke
							nominal pembayaran{' '}
							<span className="tw-font-bold tw-inline">sebagai identifikasi pembayaran</span>
						</li>
					</>
				)}
			</ul>
		</div>
	);

	const submitPay = useCallback(async () => {
		setIsLoading(true);

		try {
			if (router.query?.presc) {
				submitCheckoutPay();
				return;
			}
			if (transactionData?.deeplink_url || transactionData?.invoice_url) {
				document.removeEventListener('visibilitychange', () => {
					console.log('remove visibilitychange listener');
				});
				return (window.location.href =
					transactionData?.deeplink_url || transactionData?.invoice_url);
			}

			const trxXidTemp = checkIsEmpty(router.query?.transaction_xid)
				? transactionData?.xid
				: router.query?.transaction_xid;

			const body = {
				transaction_xid: trxXidTemp,
				payment_method_id: isFreePaid ? 'free-paid' : methodId,
			};

			const payResut = await transactionPay({ body, token: currToken });
			if (payResut?.meta?.acknowledge) {
				await removeLocalStorage(VOUCHER_CONST.VOUCHER_INVALID_FLAG);
				document.removeEventListener('visibilitychange', () => {
					console.log('remove visibilitychange listener');
				});
				if (isVa || isFreePaid) {
					await setStringifyLocalStorage(LOCALSTORAGE.PAYMENT, {
						xid: trxXidTemp,
						...payResut?.data,
					});
					router.push({
						pathname: '/payment/waiting-payment',
						query: {
							methodId: isFreePaid ? PAYMENT_STATUS.FREE_PAID : methodId,
							token,
							transaction_xid,
							...(router?.query?.presc ? { presc: router?.query?.presc } : {}),
							...(router?.query?.token_order
								? { token_order: router?.query?.token_order }
								: {}),
							...(backto ? { backto } : {}),
						},
					});
				} else {
					window.location.href = payResut?.data?.deeplink_url || transactionData?.invoice_url;
				}
			} else {
				getData();
				dispatch(checkValidateVoucher(transaction_xid, token, true));
				if (payResut?.data?.data?.is_voucher_changed && payResut?.data?.data?.valid) {
					showToast(payResut?.data?.data?.reason, { marginBottom: 70 }, 'success');
				} else {
					if (!payResut?.data?.data?.valid) {
						await setLocalStorage(VOUCHER_CONST.VOUCHER_INVALID_FLAG, true);
					}
					showToast(
						payResut?.meta?.message ??
							payResut?.data?.data?.reason ??
							MESSAGE_CONST.SOMETHING_WENT_WRONG,
						{ marginBottom: 70 },
						'error',
					);
				}
				if (!payResut?.data?.data?.is_voucher_changed) {
					throw new Error(payResut?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
				}
			}
		} catch (error) {
			console.log('error on submit pay : ', error);
		} finally {
			if (!router.query?.presc) {
				setIsLoading(false);
			}
		}
	}, [transactionData, currToken, isVa, methodId, router]);

	const submitCheckoutPay = async () => {
		setIsLoading(true);
		try {
			const cart = await getParsedLocalStorage(LOCALSTORAGE.CART);
			const shippingLocalData = await getStorageParseDecrypt(LOCALSTORAGE.SHIPMENT);
			let shippingId = null;
			if (
				shippingLocalData != null &&
				shippingLocalData?.transaction_xid &&
				cart?.data?.transaction_xid &&
				cart?.data?.transaction_xid == shippingLocalData?.transaction_xid
			) {
				shippingId = shippingLocalData?.shipment?.id;
			}
			const params = {
				prescription_id: cart?.data?.id,
				payment_method: cart?.data?.payment_method,
			};
			const res: any = await postCheckoutPay(params);
			if (res?.meta?.acknowledge) {
				document.removeEventListener('visibilitychange', () => {
					console.log('remove visibilitychange listener');
				});
				await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
				router.replace({
					pathname: '/payment/waiting-payment',
					query: {
						methodId: methodId,
						token,
						transaction_xid,
						...(router?.query?.presc ? { presc: router?.query?.presc } : {}),
						...(router?.query?.token_order
							? { token_order: router?.query?.token_order }
							: {}),
					},
				});
			} else {
				showToast(res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
				setIsLoading(false);
				setIsShowErrorPayment(true);
			}
		} catch (error) {
			console.log('error on submit pay : ', error);
			setIsLoading(false);
			setIsShowErrorPayment(true);
		} finally {
			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		}
	};

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<div className="tw-flex tw-mt-4">
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_PAY}
						onClick={submitPay}
						text={
							transactionData?.payment_method?.id ? BUTTON_CONST.PAY_NOW : BUTTON_CONST.PAY
						}
						isDisabled={isDisabledSubmit || isLoading}
						isLoading={isLoading}
						circularContainerClassName="tw-h-4"
						circularClassName="circular-inner-16"
					/>
				</div>
			</div>
		);
	};

	const handleReloadPage = async () => {
		const voucherProductApplied =
			transactionData?.data?.voucher && Object.keys(transactionData?.data?.voucher)?.length;

		const resRollbackVoucher: any = voucherProductApplied
			? await postRollbackCheckoutVoucher({
					body: { prescription_id: router.query?.presc_id },
					token: router.query?.token_order,
			  })
			: { meta: { acknowledge: true } };

		if (resRollbackVoucher?.meta?.acknowledge) {
			setIsShowErrorPayment(false);
			dispatch(fetchCart({ id: router?.query?.id }));
			await setLocalStorage(VOUCHER_CONST.VOUCHER_TOAST, VOUCHER_CONST.SUCCESS_DELETED_VOUCHER);
			await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
			setTimeout(() => {
				const query = {
					token: router.query?.token,
					transaction_xid: transactionData?.data?.result?.transaction_xid,
					presc: 1,
					presc_id: transactionData?.data?.result?.id ?? '',
					...router.query,
					shipping_selected: 0,
				};
				navigateWithQueryParams('/voucher', query, 'href');
			}, 500);
		}

		removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
		navigateWithQueryParams('/transaction/summary', router.query, 'href');
	};

	return (
		<>
			<PaymentMethodDetailTemplate
				footerComponent={renderFooterButton}
				loading={isLoading}
				cardTitle={paymentData?.payment_group_name ?? paymentData?.group_title}
				cardIcon={paymentData?.payment_methods?.logo_url ?? paymentData?.logo_url}
				iconLabel={paymentData?.payment_methods?.payment_method_name ?? paymentData?.title}
				infoContent={infoContent}
				transactionData={transactionData}
				isFreePaid={isFreePaid}
			/>
			<CustomPopup
				icon={<IconWarning />}
				show={isShowErrorPayment}
				title="Maaf Terjadi Kesalahan"
				desc="Silakan muat ulang"
				primaryButtonLabel="MUAT ULANG"
				primaryButtonAction={handleReloadPage}
			/>
		</>
	);
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export const getServerSideProps = async ({ req, res, query }) => {
	const token = query?.token_order ?? query?.token;
	const responseTheme = await fetchCachedTheme(token as string, { req, res });
	try {
		if (responseTheme?.meta?.acknowledge) {
			return {
				props: {
					theme: responseTheme?.data,
				},
			};
		}
	} catch (error) {
		console.log('error on server side props order detail : ', error);
	}
	if (query?.result) {
		let queryString = '';
		for (const key in query) {
			queryString += (queryString != '' ? '&' : '?') + key + '=' + query[key];
		}
		return {
			redirect: {
				destination: '/payment/status/result' + queryString,
				permanent: false,
			},
		};
	} else {
		return { props: {} };
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodDetail);
