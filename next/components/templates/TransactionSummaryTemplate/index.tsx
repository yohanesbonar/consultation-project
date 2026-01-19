import React, { useRef } from 'react';
import {
	ApplyVoucherButton,
	ButtonHighlight,
	CustomPopup,
	ShippingMethod,
	TextLabelSide,
	TransactionCart,
	TransactionUserInfo,
	Wrapper,
} from '../../index.js';
import {
	BUTTON_CONST,
	BUTTON_ID,
	LABEL_CONST,
	MESSAGE_CONST,
	PAGE_ID,
	SEAMLESS_CONST,
	TOAST_MESSAGE,
	TRANSACTION_LABEL,
	VOUCHER_CONST,
	capitalizeEachWords,
	checkIsEmpty,
	getStorageParseDecrypt,
	navigateWithQueryParams,
	numberToIDR,
	stringifyQueryParams,
	postApplyCheckoutVoucher,
	postRollbackCheckoutVoucher,
	removeLocalStorage,
	setLocalStorage,
	setStorageEncrypt,
	showToast,
	addLog,
} from '../../../helper';
import { useState } from 'react';
import { useRouter } from 'next/router.js';
import { connect, useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import { IconPerson, IconWarning, IconWarningOrange } from '@icons';
import Skeleton from 'react-loading-skeleton';
import { fetchCart, fetchProductDetailTransaction, setCart } from 'redux/actions';
import useBrowserNavigation from 'hooks/useBrowserNavigation';
import toast from 'react-hot-toast';

type Props = {
	isPageLoading?: boolean;
	goToPaymentMethod: () => void;
};

const TransactionSummaryTemplate = ({ isPageLoading = false, goToPaymentMethod }: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const userInfo = useSelector(({ general }) => general?.userInfo);
	const globalShipping = cartData?.result?.shipping_method;

	const [selectedShipping, setSelectedShipping] = useState<any>(null);
	const [isErrorShippingValidate, setIsErrorShippingValidate] = React.useState(false);
	const [voucher, setVoucher] = React.useState<any>();
	const [isShowAlertVoucher, setIsShowAlertVoucher] = React.useState(false);

	const [isShowForcePostCode, setIsShowForcePostCode] = React.useState(false);
	const [isForcedPostCode, setIsForcedPostCode] = React.useState(null);

	const tokenOrder = useRef(router.query?.token_order);
	const trxId = useRef(cartData?.result?.transaction_xid);

	const shippingPrice =
		globalShipping?.price ?? cartData?.result?.shipping_fee ?? selectedShipping?.price;
	const shippingAmount = cartData?.result?.voucher?.shipping_amount ?? 0;
	const voucherShippingAmount = shippingPrice - shippingAmount;
	const isVoucherFromCode = router.query?.voucher_code == '1';

	const voucherType = voucher?.body?.type;
	const voucherLength = voucher && Object.keys(voucher)?.length;
	const discountShipping =
		cartData?.result?.voucher?.shipping_amount ??
		voucher?.body?.discount_shipping_amount ??
		voucher?.body?.shipping_amount ??
		0;
	const discountAmount = voucher?.body?.discount_amount ?? voucher?.body?.amount ?? 0;
	const grandTotalDiscountAmount = voucher?.body?.grand_total_discount_amount ?? 0;
	const isShowVoucherShipping =
		voucher &&
		Object.keys(voucher)?.length &&
		(voucherType == null || voucherType == VOUCHER_CONST.NON_GRAND_TOTAL) &&
		discountShipping != 0;

	const isShippingSelected = !checkIsEmpty(selectedShipping || globalShipping);

	React.useEffect(() => {
		const getLocalVoucher = async () => {
			const v = await getStorageParseDecrypt(VOUCHER_CONST.SEAMLESS_VOUCHER);
			if (!checkIsEmpty(cartData?.result?.voucher)) {
				const dataVoucher = {
					body: cartData?.result?.voucher,
					token: router.query?.token_order,
					presc_id: router.query?.presc_id,
				};
				setStorageEncrypt(VOUCHER_CONST.SEAMLESS_VOUCHER, dataVoucher);
				setVoucher(dataVoucher);
			} else if (v) {
				setVoucher(v);
			}
		};

		if (router?.isReady) {
			getLocalVoucher();
			tokenOrder.current = router?.query?.token_order ?? router?.query?.token;
		}
		if (cartData?.result != null) {
			trxId.current = cartData?.result?.transaction_xid;
		}
	}, [router.isReady, cartData?.result?.voucher]);

	// React.useEffect(() => {
	// 	console.info('---cartdata', cartData?.result?.voucher);
	// 	if (!checkIsEmpty(cartData?.result?.voucher)) {
	// 		const dataVoucher = {
	// 			body: cartData?.result?.voucher,
	// 			token: router.query?.token_order,
	// 			presc_id: router.query?.presc_id,
	// 		};
	// 		setStorageEncrypt(VOUCHER_CONST.SEAMLESS_VOUCHER, dataVoucher);
	// 		setVoucher(dataVoucher);
	// 	}
	// }, [cartData?.result?.voucher]);

	useBrowserNavigation(() => {
		onClickBackHeader();
	});

	const onClickBackHeader = () => {
		try {
			const goBackToCart = `/transaction/cart?${stringifyQueryParams(router.query)}`;
			router.push(goBackToCart);
		} catch (error) {
			console.log('Error onClickBackHeader:', error);
			addLog({ errorNavigateCart: error });
			router.back();
		}
	};

	const applyVoucher = async () => {
		try {
			const res: any = await postApplyCheckoutVoucher(voucher);
			if (!res?.meta?.acknowledge) {
				await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
				setVoucher(null);
				const message_toast =
					res?.data?.reason ?? res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG;
				showToast(message_toast, { marginBottom: 60 }, 'error');
				return { valid: false, discount: 0 };
			}
		} catch (error) {
			console.log('error on apply voucher : ', error);
		}
	};

	const rollbackVoucher = async () => {
		try {
			const res: any = await postRollbackCheckoutVoucher({
				body: { prescription_id: voucher?.presc_id },
				token: voucher?.token,
			});
			if (res?.meta?.acknowledge) {
				await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
				setVoucher(null);
			} else {
				return { valid: false, discount: 0 };
			}
		} catch (error) {
			console.log('error on rollback voucher : ', error);
		}
	};

	const rollbackVoucherByCode = async () => {
		const voucherProductApplied =
			cartData?.result?.voucher && Object.keys(cartData?.result?.voucher)?.length;

		const resRollbackVoucher: any = voucherProductApplied
			? await postRollbackCheckoutVoucher({
					body: { prescription_id: router.query?.presc_id },
					token: router.query?.token_order,
			  })
			: { meta: { acknowledge: true } };

		if (resRollbackVoucher?.meta?.acknowledge) {
			if (voucherProductApplied) {
				await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
			}
			setIsShowAlertVoucher(false);
			dispatch(fetchCart({ id: router?.query?.id }));
			await setLocalStorage(VOUCHER_CONST.VOUCHER_TOAST, VOUCHER_CONST.SUCCESS_DELETED_VOUCHER);
			await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
			setTimeout(() => {
				const query = {
					token: router.query?.token,
					transaction_xid: cartData?.result?.transaction_xid,
					presc: 1,
					presc_id: cartData?.result?.id ?? '',
					...router.query,
					shipping_selected: isShippingSelected != null ? 1 : 0,
				};
				navigateWithQueryParams('/voucher', query, 'href');
			}, 500);
		}
	};

	const onClickShipment = async (val?: any) => {
		try {
			setSelectedShipping(val);
			setIsErrorShippingValidate(false);
			toast.dismiss();

			// if shipping selected & voucher applied, then rollback the voucher
			if (voucherLength && isShippingSelected) {
				await rollbackVoucher();
			}

			// if voucher not applied when shipping want to selected, then apply voucher to api
			else if (voucherLength && !isShippingSelected) await applyVoucher();
		} catch (error) {
			console.log('error on shipment : ', error);
		} finally {
			const payload = {
				params: {
					id: trxId.current,
					token: tokenOrder.current,
				},
				callback: ({ result }) => {
					const _shipping = { ...result?.shipping_method };
					_shipping.price = result?.shipping_fee;
					dispatch(
						setCart({
							...cartData,
							result: {
								...cartData?.result,
								shipping_method: _shipping,
								shipping_status: result?.shipping_status,
								total_price: result?.total_price,
								subtotal: result?.price,
								voucher: result?.voucher,
							},
							sync: false,
						}),
					);
				},
			};
			dispatch(fetchProductDetailTransaction(payload));
		}
	};

	const handleContinuePayment = () => {
		if (!isShippingSelected) {
			showToast(TOAST_MESSAGE.PLEASE_SELECT_SHIPPING, { marginBottom: 65 });
			setIsErrorShippingValidate(true);
		} else {
			toast.dismiss();
			goToPaymentMethod();
		}
	};

	const clearLocalStateShipping = () => setSelectedShipping(null);

	const renderFooterButton = () => {
		return (
			<div className={styles.footerContainer}>
				{!selectedShipping && !globalShipping ? (
					<div className="tw-p-2 tw-bg-info-50 tw-rounded-lg tw-flex tw-items-center tw-gap-2">
						<div className="tw-text-info-def">
							<IconWarningOrange />
						</div>
						<p className="body-12-regular tw-mb-0 tw-flex-1">
							Pilih pengiriman dahulu untuk lihat total pembayaran
						</p>
					</div>
				) : null}
				<div className={styles.footerSecondContainer}>
					<ApplyVoucherButton
						onClickBtnVoucher={goToUseVoucher}
						discount={
							voucherType == VOUCHER_CONST.GRAND_TOTAL
								? grandTotalDiscountAmount
								: (discountAmount ?? 0) + (discountShipping ?? 0)
						}
						isVoucherUsed={voucherLength ? true : false}
						isShippingSelected={isShippingSelected}
					/>
					<div className={styles.paySection}>
						<div className="tw-mr-4">
							<label className={styles.footerTotalLabel}>{SEAMLESS_CONST.GRAND_TOTAL}</label>
							<p className={styles.footerTotalValue}>
								{isPageLoading ? (
									<Skeleton />
								) : isShippingSelected ? (
									numberToIDR(cartData?.result?.total_price ?? 0)
								) : (
									'-'
								)}
							</p>
						</div>
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_CONTINUE}
							onClick={handleContinuePayment}
							text={BUTTON_CONST.SELECT_PAYMENT}
							classNameBtn="tw-rounded-lg"
						/>
					</div>
				</div>
			</div>
		);
	};

	const renderCartItem = () => {
		const resTemp = cartData?.result;
		return (
			<TransactionCart
				disableEdit
				data={resTemp}
				idx={0}
				onChangeData={(val: any) => {
					dispatch(
						setCart({
							...cartData,
							result: {
								...cartData?.result,
								updatedProducts: Object.assign([], val?.updatedProducts),
								isUpdated: true,
							},
							sync: true,
						}),
					);
				}}
			/>
		);
	};

	const goToUseVoucher = () => {
		if (isVoucherFromCode && voucherLength) {
			setIsShowAlertVoucher(true);
		} else {
			const query = {
				token: router.query?.token,
				transaction_xid: cartData?.result?.transaction_xid,
				presc: 1,
				presc_id: cartData?.result?.id ?? '',
				...router.query,
				shipping_selected: isShippingSelected != null ? 1 : 0,
			};
			navigateWithQueryParams('/voucher', query, 'href');
		}
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.TRANSACTION_SUMMARY}
			title={'Ringkasan Pembayaran'}
			staticTitle
			header={true}
			footer={true}
			footerComponent={renderFooterButton()}
			additionalStyleContent={{}}
			headClass={'tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2]'}
			addParentHeaderClassname="tw-z-0"
			additionalClassNameContent="tw-relative"
			additionalHeaderComponent={null}
			disableHeaderHeight
			onClickBack={() => router.back()}
			customPopupComponent={
				<CustomPopup
					icon={<IconWarning />}
					show={isShowForcePostCode}
					title="Yakin untuk Ubah Kode POS?"
					desc="Kode POS tersebut terisi otomatis sesuai lokasi kirim. Mengubahnya berisiko pesanan tidak terkirim dengan tepat."
					primaryButtonLabel="TIDAK JADI"
					secondaryButtonLabel="YA, UBAH"
					primaryButtonAction={() => setIsShowForcePostCode(false)}
					secondaryButtonAction={() => {
						setIsShowForcePostCode(false);
						setIsForcedPostCode(Math.random());
					}}
				/>
			}
		>
			<div className="tw-w-full">
				<TransactionUserInfo
					editablePhone
					page="summary"
					clearShippingLocal={clearLocalStateShipping}
					isForcedPostCodeTrigger={isForcedPostCode}
					setForceChangePostCode={(isShow) => setIsShowForcePostCode(isShow)}
				/>
				<div className="tw-bg-monochrome-100 tw-w-full tw-h-1" />
				<div className="tw-my-5 tw-rounded-[8px] tw-py-2 tw-px-4 tw-mx-4 tw-border tw-border-solid tw-border-gray-300 tw-flex tw-flex-row tw-items-center">
					<IconPerson />
					<div className="tw-flex tw-flex-col tw-flex-1 tw-ml-3">
						<div className="tw-flex tw-flex-1 font-14 tw-font-roboto tw-font-medium tw-text-tpy-900">
							{userInfo?.result?.patient_name}
						</div>
						<div className="font-12 tw-font-roboto tw-font-medium tw-text-tpy-700">{`${capitalizeEachWords(
							userInfo?.result?.patient_gender,
						)} • ${userInfo?.result?.patient_age}`}</div>
					</div>
				</div>
				<div className="tw-bg-monochrome-100 tw-w-full tw-h-1" />
				{renderCartItem()}
			</div>
			<div className="tw-bg-monochrome-100 tw-w-full tw-h-1" />
			<ShippingMethod
				onChangeData={onClickShipment}
				selected={selectedShipping ?? globalShipping}
				isErrorShippingValidation={isErrorShippingValidate}
			/>
			<div className="tw-bg-monochrome-100 tw-w-full tw-h-1" />
			<div className="tw-flex tw-flex-col tw-gap-3 tw-m-4 tw-pb-8">
				<p className="title-16-medium tw-text-tpy-700 tw-mb-0">{LABEL_CONST.PAYMENT_DETAIL}</p>
				<TextLabelSide
					classNameLabel="tw-w-[120px] tw-text-tpy-700"
					isLoading={isPageLoading}
					data={{
						label: `Total Harga (${cartData?.result?.totalQty ?? 0})`,
						value: numberToIDR(cartData?.result?.subtotal ?? 0),
					}}
				/>
				{isShippingSelected ? (
					<div>
						<TextLabelSide
							classNameLabel="tw-w-[120px] tw-text-tpy-700"
							classNameValue="tw-font-normal"
							isLoading={isPageLoading}
							data={{
								label: TRANSACTION_LABEL.SEND_FEE,
								value: numberToIDR(voucherShippingAmount > 0 ? voucherShippingAmount : 0),
								valueSecondary:
									isShowVoucherShipping && shippingPrice > 0
										? numberToIDR(shippingPrice)
										: null,
								valueSecondaryPrefixClassName: 'tw-line-through',
							}}
						/>
						{voucherLength && (grandTotalDiscountAmount != 0 || discountAmount != 0) ? (
							<TextLabelSide
								classNameLabel="tw-w-[120px] tw-text-tpy-700 tw-mt-6 tw-pb-2"
								classNameValue="tw-font-normal tw-mt-6 tw-pb-2"
								isLoading={isPageLoading}
								data={{
									label: `Potongan Harga`,
									value:
										'- ' +
										numberToIDR(
											voucherType == VOUCHER_CONST.GRAND_TOTAL
												? grandTotalDiscountAmount
												: discountAmount,
										),
								}}
							/>
						) : null}

						<div className="tw-h-[1px] tw-my-3 tw-w-full tw-border-0 tw-border-dashed tw-border-t-[1px] tw-border-monochrome-50" />
						<TextLabelSide
							isLoading={isPageLoading}
							data={{
								label: TRANSACTION_LABEL.GRAND_TOTAL,
								value: numberToIDR(cartData?.result?.total_price ?? 0),
							}}
							classNameValue="tw-text-primary-def"
						/>
					</div>
				) : null}
			</div>
			<CustomPopup
				icon={<IconWarning />}
				show={isShowAlertVoucher}
				title="Ingin Mengubah Voucher?"
				desc="Voucher yang Anda masukkan melalui kode akan terhapus jika Anda mengubah voucher."
				primaryButtonLabel="UBAH"
				secondaryButtonLabel="TIDAK JADI"
				primaryButtonAction={rollbackVoucherByCode}
				secondaryButtonAction={() => setIsShowAlertVoucher(false)}
			/>
		</Wrapper>
	);
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSummaryTemplate);
