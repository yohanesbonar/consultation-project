import {
	ButtonHighlight,
	CustomPopup,
	PaymentStatusSummary,
	PopupBottomsheetBackConfirm,
	Wrapper,
} from '../../index.js';
import {
	BUTTON_CONST,
	BUTTON_ID,
	LABEL_CONST,
	LOCALSTORAGE,
	ORDER_TYPE,
	PAGE_ID,
	STATUS_CONST,
	backHandling,
	getButtonTrxTextByCondition,
	getParsedLocalStorage,
	navigateBackTo,
	navigateFromTrxCondition,
	navigateWithQueryParams,
} from '../../../helper';

import Router, { useRouter } from 'next/router.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getSessionStorage } from 'helper/SessionStorage';
import useBrowserNavigation from 'hooks/useBrowserNavigation';
import moment from 'moment';
import { IconWarning } from '@icons';

type Props = {
	data?: any;
	meta?: any;
	type: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING';
	isLoading: boolean;
	fetchingData: () => void;
};

const StatusResultTemplate = ({ data, meta, type, isLoading, fetchingData }: Props) => {
	const router = useRouter();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [showBackPopup, setShowBackPopup] = useState(false);
	const dataRef = useRef(data);

	// will ajust with api in a future
	const isFreePaid = data?.paid_amount === 0;

	const isPendingButExpired = useMemo(
		() =>
			(data?.payment_status == STATUS_CONST.PENDING ||
				data?.payment_status == STATUS_CONST.CREATED) &&
			moment(meta?.at).isAfter(moment(data?.payment_expired_at)),
		[data, meta],
	);

	const toggleBack = async () => {
		const prevPath = await getSessionStorage('prevPath');
		const checkPath = prevPath.search('/transaction/');

		// payment status product transaction
		const isWaitingPaymentProduct =
			dataRef.current?.payment_status == STATUS_CONST.PENDING &&
			dataRef.current?.shipping_status == STATUS_CONST.CREATED &&
			!isPendingButExpired;
		const isSuccessPaymentProduct =
			dataRef.current?.payment_status == STATUS_CONST.SUCCESS &&
			dataRef.current?.shipment_tracking?.length > 0;

		const checkPathFromWaitingPayment = prevPath.search('/payment/waiting-payment');
		const checkPathFromPaymentMethod = prevPath.search('/payment/method');
		if (
			(checkPathFromWaitingPayment == 0 || checkPathFromPaymentMethod == 0) &&
			router?.query?.presc
		) {
			window.location.href = `/prescription-detail?token=${dataRef.current?.token}`;
		} else if (
			(checkPathFromWaitingPayment == 0 || checkPathFromPaymentMethod == 0) &&
			dataRef.current?.back_url
		) {
			window.location.href = dataRef.current?.back_url;
		} else if (
			checkPath != -1 ||
			(router?.query?.presc && (!isWaitingPaymentProduct || !isSuccessPaymentProduct))
		) {
			Router.back();
		} else {
			if (dataRef.current?.back_url) {
				window.location.href = dataRef.current?.back_url;
			} else if (dataRef.current?.token) {
				window.location.href = `/prescription-detail?token=${dataRef.current?.token}`;
			} else {
				setShowDetail(!showDetail);
			}
		}
	};

	useEffect(() => {
		if (data) {
			dataRef.current = data;
			if (data?.back_url) {
				setTimeout(() => {
					localStorage.setItem(LOCALSTORAGE.BACK_URL, data?.back_url);
				}, 500);
			}
		}
	}, [data]);

	useBrowserNavigation(() => {
		if (document.documentURI.includes('payment/status/result')) {
			toggleBack();
		} else {
			return;
		}
	});

	const submitBack = () => {
		const url = `/order?token=${router.query?.token}`;
		window.location.replace(url);
	};

	const redirectToOrderTrack = () => {
		try {
			const q = {
				token: router?.query?.token_order ?? router.query.token,
				transaction_xid: router.query?.transaction_xid,
				transaction_id: router.query?.transaction_xid,
			};
			router.push({
				pathname: '/order/track',
				query: q,
			});
		} catch (error) {
			console.log('error on redirect order track : ', error);
		}
	};

	const renderFooterButton = () => {
		if (isLoading) {
			return null;
		}
		return (
			<div className="tw-p-4 box-shadow-m tw-bg-white">
				<div className="tw-flex tw-flex-col tw-flex-1 tw-gap-[16px]">
					<ButtonHighlight
						onClick={() => {
							type != null
								? router?.query?.presc && type == STATUS_CONST.SUCCESS
									? setShowBackPopup(true)
									: (type == STATUS_CONST.PENDING || type === STATUS_CONST.CREATED) &&
									  !isPendingButExpired
									? fetchingData()
									: navigateFromTrxCondition(
											data,
											router.query.token,
											router?.query?.presc ? ORDER_TYPE.PRODUCT : ORDER_TYPE.ORDER,
											meta,
									  )
								: null;
						}}
						text={
							type != null && router?.query?.presc && type == STATUS_CONST.SUCCESS
								? BUTTON_CONST.CLOSE
								: getButtonTrxTextByCondition(
										data,
										router?.query?.presc ? ORDER_TYPE.PRODUCT : ORDER_TYPE.ORDER,
								  )
						}
						isLoading={isLoading}
						childrenClassName="tw-font-roboto tw-font-medium"
						circularContainerClassName="tw-h-[16px]"
						circularClassName="circular-inner-16"
					/>
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_START_CONSULTATION}
						color="grey"
						className="!tw-w-auto tw-text-secondary-def"
						classNameBtn="tw-text-secondary-def"
						childrenClassName="tw-font-roboto tw-font-medium"
						text={
							type == STATUS_CONST.PENDING && !isPendingButExpired
								? BUTTON_CONST.HOW_TO_PAY
								: BUTTON_CONST.TRANSACTION_DETAIL
						}
						onClick={
							type === STATUS_CONST.PENDING && !isPendingButExpired
								? () => handleNavigateHowToPay()
								: () => handleNavigateTransactionDetail()
						}
					/>
				</div>
			</div>
		);
	};

	const handleNavigateHowToPay = async () => {
		if (data?.deeplink_url || data?.invoice_url) {
			Router.push(data?.deeplink_url || data?.invoice_url);
		} else {
			const query = {
				...Router.query,
				checked: 0,
			};
			navigateWithQueryParams('/payment/waiting-payment', query, 'href');
		}
	};

	const handleNavigateTransactionDetail = async () => {
		const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		const isHaveBackUrl = data?.back_url ? 1 : 0;
		let token = router?.query?.token;
		if (router?.query?.presc) {
			token = router?.query?.token_order ?? order?.partnerToken ?? token;
			navigateWithQueryParams(
				'/transaction/product/' + router.query?.transaction_xid,
				{
					token,
					methodId: router.query?.methodId,
					presc: 1,
					token_order: router?.query?.token_order ?? token,
					backurl: isHaveBackUrl,
				},
				'replace',
			);
		} else {
			navigateWithQueryParams(
				'/transaction/' + router.query?.transaction_xid,
				{
					token: router.query?.token,
					methodId: router.query?.methodId,
					backurl: isHaveBackUrl,
				},
				'replace',
			);
		}
	};

	return (
		<>
			<CustomPopup
				icon={<IconWarning />}
				show={showBackPopup}
				title="Yakin Ingin Kembali?"
				desc={
					<>
						Tagihan sudah dikirim ke email{' '}
						{data?.patient_email ? (
							<span className="label-14-medium"> {' ' + data?.patient_email} </span>
						) : null}
						. Jika tekan kembali, Anda akan diarahkan ke ringkasan telekonsultasi
					</>
				}
				primaryButtonLabel="YA KEMBALI"
				primaryButtonAction={() =>
					backHandling({
						transactionData: data,
						router,
						onMethodCalled: () => setShowBackPopup(false),
						callback: () => navigateBackTo(toggleBack),
					})
				}
				secondaryButtonLabel="BATAL"
				secondaryButtonAction={() => setShowBackPopup(false)}
			/>
			<Wrapper
				additionalId={PAGE_ID.PAYMENT_STATUS}
				title={'Status Pembayaran'}
				header={true}
				footer={true}
				footerComponent={renderFooterButton()}
				additionalStyleContent={{
					overflow: 'auto',
				}}
				headClass={'tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2]'}
				onClickBack={() => {
					if (router?.query?.presc) {
						setShowBackPopup(true);
					} else {
						navigateBackTo(toggleBack);
					}
				}}
			>
				<div className="tw-absolute tw-w-full tw-aspect-[8/5] tw-rounded-br-ellipsebg tw-rounded-bl-ellipsebg tw-bg-primary-def tw-max-w-[500px] tw-z-0" />

				<div className="tw-w-full">
					<PaymentStatusSummary
						isFreePaid={isFreePaid}
						data={data}
						meta={meta}
						type={type}
						isLoading={isLoading}
					/>
				</div>
				<PopupBottomsheetBackConfirm
					show={showDetail}
					toggle={toggleBack}
					submit={submitBack}
					body={LABEL_CONST.QUOTA_HAS_BEEN_SENT_TO_EMAIL}
				/>
			</Wrapper>
		</>
	);
};

export default StatusResultTemplate;
