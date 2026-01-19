// untuk page waiting paynment
import { ButtonHighlight, ImageLoading } from '@atoms';
import {
	BUTTON_CONST,
	BUTTON_ID,
	getParsedLocalStorage,
	getPaymentMethod,
	getStorageParseDecrypt,
	getTransactionDetail,
	LOCALSTORAGE,
	numberToIDR,
	navigateFromTransactionStatus,
	getPaymentInstruction,
	checkIsEmpty,
	removeLocalStorage,
	storePathValues,
	STATUS_CONST,
	getProductTransactionDetail,
	getCheckoutPayments,
	navigateWithQueryParams,
	downloadHiddenElementAsJPG,
	getTimeGap,
	fetchCachedTheme,
} from 'helper';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import WaitingPaymentTemplate from 'components/templates/WaitingPaymentTemplate';
import LabelCopy from 'components/organisms/LabelCopy';
import { useRouter } from 'next/router';
import TagManager from 'react-gtm-module';
import moment from 'moment';
import usePartnerInfo from 'hooks/usePartnerInfo';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';

function WaitingPayment(props) {
	const router = useRouter();
	const { token, token_order } = router.query;
	const [paymentMethod, setPaymentMethod] = useState<string>(router.query.methodId as string);
	const [isLoading, setIsLoading] = useState(true);
	const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
	const [isOpenInfoBottomsheet, setIsOpenInfoBottomsheet] = useState<boolean>(false);
	const [paymentData, setPaymentData] = useState<any>({});
	const [paymentDetail, setPaymentDetail] = useState<any>({});
	const [email, setEmail] = useState<string>('');
	const [transactionData, setTransactionData] = useState<any>();
	const [currToken, setCurrToken] = useState('');
	const [paymentInstruction, setPaymentInstruction] = useState([]);
	const [paymentInstructionHtml, setPaymentInstructionHtml] = useState(null);
	const [transactionId, setTransactionId] = useState('');
	const [isDownloadProcess, setIsDownloadProcess] = useState(false);
	const printRef = useRef(null);
	const isGettingDataRef = useRef(false);

	usePartnerInfo({
		...props,
		token: router.query?.token_order ?? router.query?.token ?? currToken,
	});

	useEffect(() => {
		const tagManagerArgs = {
			dataLayer: {
				transactionId,
			},
			dataLayerName: 'PageDataLayer',
		};

		TagManager.dataLayer(tagManagerArgs);
	}, [transactionId]);

	useEffect(() => {
		toast.dismiss();
		storePathValues();
	}, []);

	const getData = async (redirect = false) => {
		try {
			isGettingDataRef.current = true;
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const tempToken = checkIsEmpty(router.query?.token) ? temp?.token : router.query?.token;
			setCurrToken(tempToken);

			const formValue = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			const transactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);
			const paymentTemp = await getParsedLocalStorage(LOCALSTORAGE.PAYMENT);

			const trxXidTemp = checkIsEmpty(router.query?.transaction_xid)
				? transactionData?.xid
				: router.query?.transaction_xid;

			const orderToken = formValue?.partnerToken;

			const transactionDetail = router?.query?.presc
				? await getProductTransactionDetail({
						id: trxXidTemp,
						token: router?.query?.token_order ?? tempToken ?? orderToken,
				  })
				: await getTransactionDetail({
						id: trxXidTemp,
						token: tempToken,
				  });

			if (!transactionDetail?.meta?.acknowledge) {
				throw new Error('Failed to fetch transaction detail');
			}

			const gap = getTimeGap(new Date(), transactionDetail?.meta?.at);
			global.timeGap = gap;

			setTransactionData(transactionDetail?.data);
			if (transactionDetail?.data?.deeplink_url || transactionDetail?.data?.invoice_url) {
				return (window.location.href =
					transactionDetail?.data?.deeplink_url || transactionDetail?.data?.invoice_url);
			}
			if (
				(transactionDetail?.data?.payment_status != STATUS_CONST.PENDING &&
					transactionDetail?.data?.payment_status != STATUS_CONST.CREATED) ||
				((transactionDetail?.data?.payment_status == STATUS_CONST.PENDING ||
					transactionDetail?.data?.payment_status == STATUS_CONST.CREATED) &&
					moment(transactionDetail?.meta?.at).isAfter(
						moment(transactionDetail?.data?.payment_expired_at),
					))
			) {
				const prescQueryParam = router?.query?.presc ? '&presc=' + router?.query?.presc : '';
				const xid = trxXidTemp ? '&transaction_xid=' + trxXidTemp : '';
				const payment_method = paymentMethod ? '&methodId=' + paymentMethod : '';
				const tokenOrder = router?.query?.token_order
					? '&token_order=' + router?.query?.token_order
					: '';

				const destUrl =
					'/payment/status/result?token=' +
					(tempToken ?? '') +
					(xid ?? '') +
					(payment_method ?? '') +
					(prescQueryParam ?? '') +
					(tokenOrder ?? '');

				return navigateWithQueryParams(destUrl, {}, 'replace');
			}
			setTransactionId(transactionDetail.data?.transaction_id);
			const pymntMthd = transactionDetail?.data?.payment_method?.id;
			if (paymentMethod == null && pymntMthd) {
				setPaymentMethod(pymntMthd);
			}

			const emailVal = formValue?.forms?.find((val) => val.name === 'email')?.value;

			setEmail(emailVal);

			const res = router?.query?.presc
				? await getCheckoutPayments(router?.query?.methodId)
				: await getPaymentMethod({
						token: router?.query?.presc
							? router?.query?.token_order ?? orderToken
							: tempToken,
				  });

			const findPayment = router?.query?.presc
				? router?.query?.methodId && res?.data
					? res?.data
					: transactionDetail?.data?.payment_method
				: res?.data?.payment_methods?.find((v: any) =>
						v?.payment_methods?.find(
							(method: any) => method?.payment_method_id === pymntMthd,
						),
				  );

			if (!router?.query?.presc) {
				const merchantId = findPayment?.payment_methods?.find(
					(payment: any) => payment?.payment_method_id === pymntMthd,
				)?.payment_method_merchant_id;
				if (!res?.meta?.acknowledge) {
					throw new Error('Failed to fetch payment method');
				}

				let paymentInstructionData = null;
				paymentInstructionData = await getPaymentInstruction({
					token: tempToken,
					merchantId: merchantId,
				});

				if (!paymentInstructionData?.meta?.acknowledge) {
					throw new Error('Failed to fetch payment instruction');
				}

				setPaymentInstruction(paymentInstructionData?.data?.payment_instructions);
			}

			const resData = router?.query?.presc
				? router?.query?.methodId && res?.data
					? res?.data
					: transactionDetail?.data?.payment_method
				: res?.data?.payment_methods?.find((data: any) => {
						const child = data?.payment_methods?.find(
							(val: any) => val?.payment_method_id === paymentMethod,
						);
						return (data.payment_methods = child);
				  });

			if (
				router?.query?.presc &&
				((router?.query?.methodId && resData?.instructions) ||
					transactionDetail?.data?.payment_method?.instructions)
			) {
				setPaymentInstructionHtml(
					resData?.instructions ?? transactionDetail?.data?.payment_method?.instructions,
				);
			}

			setPaymentData(
				transactionDetail?.data?.qris_code
					? transactionDetail?.data?.payment_method
					: resData ?? transactionDetail?.data?.payment_method,
			);

			if (paymentTemp?.xid === trxXidTemp) {
				setPaymentDetail(paymentTemp);
			} else {
				await removeLocalStorage(LOCALSTORAGE.PAYMENT);
			}

			if (
				transactionDetail?.meta?.acknowledge &&
				transactionDetail?.data?.payment_status &&
				redirect
			) {
				return setTimeout(() => {
					navigateFromTransactionStatus({
						transaction_xid: trxXidTemp,
						token: tempToken,
					});
					setIsOpenInfoBottomsheet(false);
				}, 500);
			} else {
				setIsOpenInfoBottomsheet(false);
			}
			setIsLoading(false);
		} catch (error) {
			setIsOpenInfoBottomsheet(false);
			console.log('err', error);
			router.push('/not-found');
			setIsLoading(false);
		} finally {
			isGettingDataRef.current = false;
		}
	};

	useEffect(() => {
		if (router?.query && !transactionData) {
			const triggerCheck =
				router?.query?.checked && parseInt(router?.query?.checked as string) === 1;
			if (triggerCheck) {
				setIsOpenInfoBottomsheet(true);
			}
			if (!isGettingDataRef.current) getData(triggerCheck);

			window.addEventListener('focus', () => {
				if (!isGettingDataRef.current) getData(triggerCheck);
			});
			return () => {
				window.removeEventListener('focus', null);
			};
		}
	}, [router, transactionData]);

	const submitBack = async () => {
		const url = `/order?token=${currToken}`;
		return router.push(url);
	};

	const onDownload = () => {
		setIsDownloadProcess(true);
		const inv = transactionData?.invoice_number;
		setTimeout(() => {
			downloadHiddenElementAsJPG(
				printRef,
				`QRCode-presc${checkIsEmpty(inv) ? '' : '-' + inv}${
					'-' + moment().format('YYYYMMDDHHmm')
				}.jpg`,
				() => setIsDownloadProcess(false),
			);
		}, 1000);
	};

	const bodyContent =
		isLoading ||
		checkIsEmpty(transactionData) ||
		transactionData?.payment_status == STATUS_CONST.SUCCESS ? (
			<>
				<p className="label-14-medium tw-my-1 tw-text-center">
					<Skeleton />
				</p>
				<LabelCopy
					id="payment-total"
					title="Total Pembayaran"
					value={null}
					classInput="tw-font-roboto tw-font-medium"
					isLoading={true}
				/>
			</>
		) : !checkIsEmpty(transactionData?.qr_code) ? (
			<>
				<p className="label-14-medium tw-my-1 tw-text-center">Scan Kode QR untuk membayar</p>
				<div ref={printRef} className="tw-h-[180px] tw-relative tw-mx-auto">
					<ImageLoading
						className="tw-aspect-square !tw-object-contain tw-h-full"
						data={{
							url: transactionData?.qr_code,
						}}
					/>
				</div>
				{!checkIsEmpty(transactionData?.qr_nmid) ? (
					<p className="body-12-regular tw-text-tpy-def tw-mt-1 tw-mb-4 tw-text-center">
						NMID:{transactionData?.qr_nmid}
					</p>
				) : null}
				<ButtonHighlight
					id={BUTTON_ID.BUTTON_DOWNLOAD_QR}
					color="grey"
					onClick={onDownload}
					text={BUTTON_CONST.DOWNLOAD_QR_CODE}
					isDisabled={isDisabledSubmit || isLoading}
					isLoading={isLoading}
					circularContainerClassName="tw-h-4"
					circularClassName="circular-inner-16"
				/>
				<p className="tw-mt-4 body-14-regular tw-text-center tw-text-tpy-def">
					Jika download gagal, Anda dapat <span className="label-14-medium">Screenshot</span>{' '}
					untuk simpan kode QR tersebut
				</p>
			</>
		) : (
			<>
				{paymentData?.group_title == 'Bank Transfer' ? null : (
					<LabelCopy
						id="va-number"
						title={
							'Nomor ' +
							(paymentData?.group_title == 'Bank Transfer' ? 'Rekening' : 'Virtual Account')
						}
						value={
							paymentDetail?.customer_number ??
							transactionData?.customer_number ??
							transactionData?.va_number ??
							''
						}
						placeholder={
							paymentData?.group_title == 'Virtual Account' ? 'VA Number' : 'Nomor Rekening'
						}
						classInput="tw-font-roboto tw-font-medium"
						isLoading={isLoading}
					/>
				)}
				<LabelCopy
					id="payment-total"
					title="Total Pembayaran"
					value={numberToIDR(transactionData?.paid_amount ?? transactionData?.total_price)}
					placeholder="Payment Total"
					classInput="tw-font-roboto tw-font-medium"
					isLoading={isLoading}
				/>
			</>
		);

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<div className="tw-flex">
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_CHECK_PAY}
						onClick={() => {
							setIsOpenInfoBottomsheet(true);
							getData(true);
						}}
						text={BUTTON_CONST.CHECK_PAYMENT}
						isDisabled={isDisabledSubmit || isLoading}
						isLoading={isLoading}
						circularContainerClassName="tw-h-4"
						circularClassName="circular-inner-16"
					/>
				</div>
			</div>
		);
	};

	return (
		<WaitingPaymentTemplate
			footerComponent={renderFooterButton}
			loading={isLoading || checkIsEmpty(transactionData)}
			cardTitle={
				paymentData?.group_title?.toLowerCase() == 'pembayaran instan' ||
				paymentData?.group_title?.toLowerCase() == 'pembayaran instant'
					? paymentData?.group_title
					: 'Transfer ' +
					  (paymentData?.group_title == 'Bank Transfer' ? 'Bank' : 'Virtual Account')
			}
			cardIcon={paymentData?.payment_methods?.logo_url ?? paymentData?.logo_url}
			iconLabel={
				paymentData?.payment_methods?.payment_method_name ??
				paymentData?.name ??
				paymentData?.title
			}
			bodyContent={bodyContent}
			dataList={paymentInstruction}
			paymentInstructionHtml={paymentInstructionHtml}
			submitBack={submitBack}
			isOpenCheckingPayment={isOpenInfoBottomsheet}
			transactionData={transactionData}
			paymentData={paymentData}
			emailSent={email}
		/>
	);
}

export const getServerSideProps = async ({ req, res, query }) => {
	const responseTheme = await fetchCachedTheme((query?.token_order ?? query?.token) as string, {
		req,
		res,
	});

	if (query?.checked === '1') {
		const prescQueryParam = query?.presc ? '&presc=' + query?.presc : '';
		const ct = query?.ct ? '&ct=' + query?.ct : '';
		const destUrl =
			'/payment/status/result?token=' +
			(query?.token ?? '') +
			'&transaction_xid=' +
			(query?.transaction_xid ?? '') +
			'&methodId=' +
			(query?.methodId ?? '') +
			(prescQueryParam ?? '') +
			(ct ?? '') +
			(query?.token_order ? '&token_order=' + query?.token_order : '');

		return {
			redirect: {
				destination: destUrl,
				permanent: false,
			},
			props: {
				theme: responseTheme?.data,
			},
		};
	} else {
		return {
			props: {
				theme: responseTheme?.data,
			},
		};
	}
};

const mapStateToProps = (state) => ({
	// verifyData: state.verifyData.verifyData,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingPayment);
