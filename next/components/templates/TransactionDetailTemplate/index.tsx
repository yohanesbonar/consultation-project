import React, { useEffect } from 'react';
import {
	ButtonHighlight,
	InfoCardTop,
	PopupBottomsheetArrivedConfirmation,
	PopupBottomsheetInfo,
	PopupModalInfo,
	ShippingInfo,
	TransactionDetailSummary,
	TransactionPaymentDetail,
	TransactionProductDetail,
	TransactionRefundDetail,
	VoucherInfo,
	Wrapper,
} from '../../index.js';
import {
	BUTTON_CONST,
	BUTTON_ID,
	COMPONENT_CONST,
	LABEL_CONST,
	LOCALSTORAGE,
	MESSAGE_CONST,
	PAGE_ID,
	STATUS_CONST,
	STATUS_LABEL,
	PAYMENT_STATUS,
	TOAST_CONST,
	TOAST_MESSAGE,
	capitalizeEachWords,
	getButtonTrxTextByCondition,
	getStorageParseDecrypt,
	postCancelTransaction,
	postCheckoutArriveConfirm,
	setStringifyLocalStorage,
	showToast,
	getSessionStorage,
	handleOpenContactUrl,
} from '../../../helper';
import {
	IconCancelPayment,
	IconContact,
	IconInfoRed,
	IconMoreBlue,
	IconRefund,
	IconRight,
	IconSadGray,
} from '@icons';
import { useState } from 'react';
import { useRouter } from 'next/router.js';
import { connect, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import styles from './index.module.css';

type Props = {
	type?: 'product' | 'order';
	data?: any;
	handleOrderConsul?: () => void;
	goToStatusShipping?: () => void;
	handleHowToPay?: () => void;
	isPageLoading?: boolean;
	transaction_id?: string;
};

const TransactionDetailTemplate = ({
	type = 'order',
	data,
	handleOrderConsul,
	goToStatusShipping,
	handleHowToPay,
	isPageLoading = false,
	transaction_id,
}: Props) => {
	const router = useRouter();

	const [isOpenInfoBottomsheet, setIsOpenInfoBottomsheet] = useState<boolean>(false);
	const [isShowingModal, setIsShowingModal] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isShowArrivedConfirm, setIsShowArrivedConfirm] = useState(false);

	const productTransactionDetail: any = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);
	const contactUrl = useSelector(({ general }: any) => general.contactUrl);

	const shippingStatus = productTransactionDetail?.result?.shipping_status;
	const isPaymentRejected =
		productTransactionDetail?.result?.payment_status === STATUS_CONST.REJECTED;

	const showComplainCondition =
		type === 'product' &&
		data?.payment_status === STATUS_CONST.SUCCESS &&
		shippingStatus !== STATUS_CONST.COMPLETED &&
		shippingStatus !== STATUS_CONST.COMPLAIN &&
		shippingStatus !== STATUS_CONST.SENT &&
		shippingStatus !== STATUS_CONST.PENDING &&
		shippingStatus !== STATUS_CONST.CREATED;

	const statusActionLabel =
		data?.payment_status === STATUS_CONST.PENDING
			? STATUS_LABEL.HOW_TO_PAY
			: STATUS_LABEL.VIEW_STATUS;

	const renderStatusLabel = () => {
		let text = '';
		if (isPaymentRejected) {
			text = STATUS_LABEL.ORDER_CANCELED;
		} else if (data?.payment_status === STATUS_CONST.PENDING) {
			text = STATUS_LABEL.PENDING_PAYMENT;
		} else if (
			data?.payment_status === STATUS_CONST.SUCCESS &&
			shippingStatus == STATUS_CONST.CREATED
		) {
			text = STATUS_LABEL.WAITING_CONFIRMATION;
		} else if (shippingStatus === STATUS_CONST.SENT) {
			text = STATUS_LABEL.ON_SEND;
		} else if (shippingStatus === STATUS_CONST.ARRIVED) {
			text = STATUS_LABEL.ARRIVED_DESTINATION;
		} else if (shippingStatus === STATUS_CONST.COMPLETED) {
			text = STATUS_LABEL.COMPLETED;
		} else if (shippingStatus === STATUS_CONST.COMPLAIN) {
			text = STATUS_LABEL.COMPLAIN;
		} else if (shippingStatus === STATUS_CONST.ON_PROCESS) {
			text = STATUS_LABEL.ON_PROCESS;
		} else if (shippingStatus === STATUS_CONST.REJECTED) {
			text = STATUS_LABEL.ORDER_CANCELED;
		} else if (type == 'product' && data?.payment_status === STATUS_CONST.EXPIRED) {
			text = STATUS_LABEL.PAYMENT_FAILED;
		}
		return text;
	};

	const toggleArrivedConfirm = () => setIsShowArrivedConfirm(!isShowArrivedConfirm);

	// condition for guepay rp.0 (free-paid)
	const isFreePaid = data?.paid_amount === 0 || router.query?.methodId == PAYMENT_STATUS.FREE_PAID;

	const cancelTransaction = async () => {
		try {
			if (isSubmitting) {
				return;
			}
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const tempToken = router.query?.token ?? temp?.token;
			const res = await postCancelTransaction({
				xid: data?.xid,
				token: tempToken,
			});
			if (res?.meta?.acknowledge) {
				await setStringifyLocalStorage(TOAST_CONST.TRANSACTION_DETAIL_TOAST, {
					type: TOAST_CONST.success,
					msg: TOAST_MESSAGE.SUCCESS_CANCEL_TRANSACTION,
				});
				router.reload();
			} else {
				showToast(res?.data?.reason ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
			}
		} catch (error) {
			console.log('error on cancel transaction : ', error);
		} finally {
			setIsShowingModal(false);
			setIsSubmitting(false);
		}
	};

	const handleOnConfirm = async () => {
		try {
			setIsSubmitting(true);
			const res = await postCheckoutArriveConfirm({
				xid: data?.xid,
				token: data?.token_order
					? data?.token_order
					: router?.query?.token_order
					? router?.query?.token_order
					: router?.query?.token,
			});
			if (res?.meta?.acknowledge) {
				router.reload();
			} else {
				showToast(res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
			}
		} catch (error) {
			console.log('error on handle on confirm : ', error);
			showToast(MESSAGE_CONST.SOMETHING_WENT_WRONG);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderFooterButton = () => {
		const isOrderOnlyFromPartner =
			data?.order_only_from_partner && data?.payment_status == STATUS_CONST.REFUNDED;
		return (
			<>
				<VoucherInfo data={data} />
				<div className="tw-p-4 tw-bg-white">
					{isOrderOnlyFromPartner || data?.shipping_status == STATUS_CONST.REJECTED ? (
						<div className="tw-flex tw-flex-1">
							{isPageLoading ? (
								<div className="tw-flex-1">
									<Skeleton height={60} className="tw-flex-1" />
								</div>
							) : (
								<ButtonHighlight
									onClick={() => {
										handleOpenContactUrl(data?.contact_url ?? contactUrl);
									}}
									text={BUTTON_CONST.CONTACT_US}
									isLoading={false}
									circularContainerClassName="tw-h-[16px]"
									circularClassName="circular-inner-16"
									color="grey"
									classNameBtn="tw-text-secondary-def"
								/>
							)}
						</div>
					) : (
						<div className="tw-flex tw-flex-1 tw-gap-[16px]">
							{isPageLoading || (type == 'product' && productTransactionDetail?.loading) ? (
								<Skeleton width={60} height={60} />
							) : (
								<ButtonHighlight
									id={BUTTON_ID.BUTTON_OTHER}
									color="grey"
									className="!tw-flex-none w-auto"
									// eslint-disable-next-line react/no-children-prop
									children={
										<div className="tw-text-secondary-def">
											<IconMoreBlue />
										</div>
									}
									onClick={() => {
										setIsOpenInfoBottomsheet(true);
									}}
								/>
							)}
							{isPageLoading || (type == 'product' && productTransactionDetail?.loading) ? (
								<div className="tw-flex-1">
									<Skeleton height={60} className="tw-flex-1" />
								</div>
							) : (
								<ButtonHighlight
									onClick={async () => {
										if (shippingStatus === STATUS_CONST.ARRIVED) {
											toggleArrivedConfirm();
										} else {
											handleOrderConsul();
										}
									}}
									text={getButtonTrxTextByCondition(data, type)}
									isLoading={false}
									circularContainerClassName="tw-h-[16px]"
									circularClassName="circular-inner-16"
								/>
							)}
						</div>
					)}
				</div>
			</>
		);
	};

	const goToComplainPage = () => {
		router.push({
			pathname: '/transaction/product/complain',
			query: {
				...router.query,
				transaction_id: transaction_id,
			},
		});
	};

	const goToRefundFormPage = () => {
		router.push({
			pathname: '/transaction/product/refund',
			query: {
				...router.query,
				transaction_id: transaction_id,
			},
		});
	};

	useEffect(() => {
		if (data?.back_url) {
			setTimeout(() => {
				localStorage.setItem(LOCALSTORAGE.BACK_URL, data?.back_url);
			}, 500);
		}
	}, [data?.back_url]);

	const onClickBack = async () => {
		const prevPath = await getSessionStorage('prevPath');
		const checkPath = prevPath.search('/transaction/history');
		if (checkPath != -1) {
			router.back();
		} else if (
			(router.query?.backurl == '1' || router.query?.source == 'partner') &&
			data?.back_url
		) {
			window.location.href = data?.back_url;
		} else if (data?.token && router?.query?.presc) {
			window.location.href = `/prescription-detail?token=${data?.token}`;
		} else {
			router.back();
		}
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.TRANSACTION_DETAIL}
			title={'Detail Transaksi'}
			staticTitle
			header={true}
			footer={true}
			footerComponent={renderFooterButton()}
			additionalStyleContent={{}}
			headClass={styles.wrapperHead}
			additionalHeaderComponent={null}
			onClickBack={onClickBack}
		>
			<div className="tw-w-full">
				{type === 'product' ? (
					<div className={styles.productWrapper}>
						<p className="title-16-medium tw-mb-0">
							{isPageLoading || (type == 'product' && productTransactionDetail?.loading) ? (
								<Skeleton className="tw-w-40 tw-h-6" />
							) : (
								renderStatusLabel()
							)}
						</p>
						<p
							onClick={
								data?.payment_status === STATUS_CONST.PENDING
									? () => handleHowToPay()
									: () => goToStatusShipping()
							}
							className={styles.statusLabel}
						>
							{isPageLoading || (type == 'product' && productTransactionDetail?.loading) ? (
								<Skeleton className="tw-w-20 tw-h-6" />
							) : (
								statusActionLabel
							)}
						</p>
					</div>
				) : null}
				{type === 'product' && data?.shipping_status === STATUS_CONST.REJECTED && (
					<div className="tw-px-4 tw-pb-4">
						<div className={styles.refundFormWrapper}>
							<div className="tw-flex tw-items-center">
								<span className="tw-mr-2">
									<IconInfoRed />
								</span>
								<p className="body-12-regular tw-mb-0 tw-mr-2">
									{data?.refund_data
										? `Refund diajukan pada ${data?.refund_request_at}. Waktu proses max. 14 hari`
										: 'Anda perlu isi form refund untuk pengembalian dana Anda'}
								</p>
							</div>
							{!data?.refund_data && !data?.refund_request_at && (
								<p onClick={goToRefundFormPage} className={styles.fillForm}>
									Isi Form
								</p>
							)}
						</div>
					</div>
				)}
				<div className={styles.divider1} />
				{data?.payment_status === 'PENDING' && (
					<InfoCardTop
						dateTime={data?.payment_expired_at}
						loading={
							isPageLoading || (type == 'product' && productTransactionDetail?.loading)
						}
					/>
				)}
				<TransactionDetailSummary data={data} handleHowToPay={handleHowToPay} type={type} />
				{type === 'product' ? (
					<>
						<div className={styles.divider2} />
						<p className={styles.shippingInfoLabel}>{LABEL_CONST.SHIPPING_INFO}</p>
						<ShippingInfo
							loading={
								isPageLoading || (type == 'product' && productTransactionDetail?.loading)
							}
							expedition={data?.shipping_method?.method_title}
							resi={data?.shipping_method?.resi || data?.shipping_method?.airway_bill || '-'}
							address={{
								name: data?.shipping_method?.receiver_name ?? data?.patient_name,
								phone: data?.shipping_method?.receiver_phone ?? data?.phone_number,
								address: data?.shipping_method?.address ?? data?.address,
								address_detail:
									data?.shipping_method?.address_detail ?? data?.address_detail,
							}}
						/>
					</>
				) : null}
				<div className={styles.divider2} />
				<TransactionProductDetail data={data} type={type} />
				<div className={styles.divider2} />
				<TransactionPaymentDetail data={data} />
				{data?.payment_status === 'REFUNDED' && <TransactionRefundDetail data={data} />}
			</div>
			<PopupBottomsheetArrivedConfirmation
				onConfirm={handleOnConfirm}
				onDecline={() => toggleArrivedConfirm()}
				isOpenBottomsheet={isShowArrivedConfirm}
				setIsOpenBottomsheet={setIsShowArrivedConfirm}
			/>
			<PopupBottomsheetInfo
				data={{
					title: LABEL_CONST.OTHER,
					body: (
						<div>
							{showComplainCondition && (
								<ButtonHighlight
									classNameBtn={styles.highlightBtnClass}
									childrenClassName={styles.highlightChildrenClass}
									text={capitalizeEachWords(BUTTON_CONST.COMPLAIN_REQUEST)}
									prefixIcon={<IconSadGray />}
									suffixIcon={<IconRight />}
									color={null}
									onClick={goToComplainPage}
								/>
							)}

							<ButtonHighlight
								classNameBtn={styles.highlightBtnClass}
								childrenClassName={styles.highlightChildrenClass}
								text={capitalizeEachWords(BUTTON_CONST.CONTACT_US)}
								prefixIcon={<IconContact />}
								suffixIcon={<IconRight />}
								color={null}
								btnStyle={{ background: 'transparent' }}
								onClick={() => {
									handleOpenContactUrl(data?.contact_url ?? contactUrl);
								}}
							/>
							{type === 'order' &&
								data?.payment_status == 'SUCCESS' &&
								data?.consultation_status == 'READY' &&
								!isFreePaid && (
									<ButtonHighlight
										classNameBtn={styles.highlightBtnClass}
										childrenClassName={styles.highlightChildrenClass}
										text={capitalizeEachWords(BUTTON_CONST.SUBMIT_A_REFUND)}
										prefixIcon={<IconRefund />}
										suffixIcon={<IconRight />}
										color={null}
										onClick={() =>
											router.push({
												pathname: '/transaction/refund',
												query: {
													...router.query,
													transaction_xid: data?.xid,
												},
											})
										}
									/>
								)}
							{data?.payment_status == 'PENDING' && type != 'product' ? (
								<ButtonHighlight
									classNameBtn={styles.highlightBtnClass}
									childrenClassName={styles.highlightChildrenClass}
									text={capitalizeEachWords(BUTTON_CONST.CANCEL_TRANSACTION)}
									prefixIcon={<IconCancelPayment />}
									suffixIcon={<IconRight />}
									color={null}
									onClick={() => {
										setIsOpenInfoBottomsheet(false);
										setIsShowingModal(true);
									}}
								/>
							) : null}
						</div>
					),
				}}
				isOpenBottomsheet={isOpenInfoBottomsheet}
				setIsOpenBottomsheet={(isOpen) => setIsOpenInfoBottomsheet(isOpen)}
			/>
			<PopupModalInfo
				isShowing={isShowingModal}
				setIsShowing={(isShow) => setIsShowingModal(isShow)}
				body={<div>{COMPONENT_CONST.MODAL_CANCEL_TRANSACTION_COMPONENT}</div>}
				footer={
					<div className="tw-flex tw-flex-col tw-flex-1 tw-gap-3">
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_CONFIRM}
							text={LABEL_CONST.YES_CANCEL_TRANSACTION}
							isLoading={isSubmitting}
							onClick={cancelTransaction}
						/>
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_NO}
							color="grey"
							text={LABEL_CONST.NO}
							isDisabled={isSubmitting}
							onClick={() => {
								setIsShowingModal(false);
							}}
						/>
					</div>
				}
			/>
		</Wrapper>
	);
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetailTemplate);
