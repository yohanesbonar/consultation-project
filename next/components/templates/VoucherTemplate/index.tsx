import React from 'react';
import { Wrapper } from '@organisms';
import { InputVoucher } from '@molecules';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonHighlight, Text } from '@atoms';
import { IconEmptyVoucher } from '@icons';
import { useRouter } from 'next/router';
import { VoucherType } from '@types';
import {
	fetchCart,
	setCart,
	setVoucherAction,
	setVoucherCode,
	setVoucherKeyword,
	setVoucherList,
} from 'redux/actions';

import {
	BUTTON_CONST,
	BUTTON_ID,
	LOCALSTORAGE,
	MESSAGE_CONST,
	PAGE_ID,
	VOUCHER_CONST,
	checkIsEmpty,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	navigateWithQueryParams,
	numberToIDR,
	postApplyCheckoutVoucher,
	postApplyVoucher,
	postRollbackCheckoutVoucher,
	removeLocalStorage,
	setLocalStorage,
	setStorageEncrypt,
	setStringifyLocalStorage,
	showToast,
} from 'helper';

import CardVoucher from 'components/organisms/CardVoucher';
import Skeleton from 'react-loading-skeleton';
import styles from './index.module.css';
import toast from 'react-hot-toast';
import cx from 'classnames';
import debounce from 'debounce-promise';
const debouncedApplyVoucher = debounce(postApplyVoucher, 1500);

type Props = {
	transaction: any;
	transaction_xid: string;
	token: string;
};

const VoucherTemplate = (props: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const cartData = useSelector(({ transaction }) => transaction?.cart);

	const { transaction, transaction_xid, token } = props;

	// global state
	const voucherCanUse: VoucherType[] = transaction.voucherList.result.canUse;
	const voucherCanotUse: VoucherType[] = transaction.voucherList.result.canotUse;
	const voucherByKeyword: string = transaction.keyword;
	const isLoading = transaction.voucherList.loading;
	const voucher = transaction.voucher;

	const shippingAmounts = voucher?.shipping_amount ?? voucher?.discount_shipping_amount ?? 0;

	const discountAmounts = voucher?.amount ?? voucher?.discount_amount ?? 0;

	const discountAmountSum = shippingAmounts + discountAmounts;
	const grandTotalDiscount = voucher?.grand_total_discount_amount;
	const voucherDiscountProduct =
		voucher?.type == VOUCHER_CONST.GRAND_TOTAL ? grandTotalDiscount : discountAmountSum;

	const productDetail = transaction.voucherList.result?.productDetail;

	// local state
	const [isVoucherValid, setIsVoucherValid] = React.useState<boolean>(true);
	const [isShowFooter, setIsShowFooter] = React.useState<boolean>(false);
	const [errorMessage, setErrorMessage] = React.useState<string>('');
	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
	const [isSubmittingByKeyword, setIsSubmittingByKeyword] = React.useState<boolean>(false);

	const isPrescription = router.query?.presc;

	React.useEffect(() => {
		const getLocalVoucher = async () => {
			const v = await getStorageParseDecrypt(VOUCHER_CONST.SEAMLESS_VOUCHER);
			if (v) {
				dispatch(setVoucherAction(v?.body));
			} else {
				dispatch(setVoucherAction({}));
			}
		};
		getLocalVoucher();
	}, [router.isReady]);

	// apply voucher handler
	const applyVoucher = async (voucher: any, checked: boolean) => {
		const body = {
			transactionXid: transaction_xid,
			voucherCode: checked ? voucher?.code : '',
		};
		// for seamless voucher
		if (isPrescription) {
			if (!checked) dispatch(setVoucherAction({}));
			return { valid: true, discount: voucher?.grand_total_discount_amount };
		}

		// for guepay voucher
		const res = await postApplyVoucher({ body, token });
		if (res?.data?.valid) {
			if (checked) {
				const temp = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);
				if (temp) {
					temp.voucher = voucher;
					await setStringifyLocalStorage(LOCALSTORAGE.TRANSACTION, temp);
				}
			}
			localStorage.setItem(VOUCHER_CONST.VOUCHER_TOAST, res?.data?.reason);
			return res?.data;
		} else {
			toast.dismiss();
			const message_toast =
				res?.data?.reason ??
				res?.meta?.acknowledge?.message ??
				res?.meta?.message ??
				MESSAGE_CONST.SOMETHING_WENT_WRONG;
			showToast(message_toast, { marginBottom: 60 }, 'error');
			return false;
		}
	};

	const onSelectVoucher = async (e: any, voucher: VoucherType) => {
		const { checked } = e.target;
		const apply = await applyVoucher(voucher, checked);

		// selected voucher handler
		const voucherTemp = [...voucherCanUse];
		voucherTemp.forEach((item) => {
			if (apply?.valid && item.code === voucher.code) {
				item.isSelected = checked;
				setIsVoucherValid(true);
				dispatch(setVoucherKeyword(''));
			} else {
				item.isSelected = false;
			}
		});
		const result = { canUse: voucherTemp, canotUse: voucherCanotUse, productDetail };
		dispatch(setVoucherList({ ...transaction.voucherList, result }));

		if ((apply?.valid && apply.discount !== 0) || isPrescription) {
			const vouchers = { ...voucher, discount: apply.discount };
			if (isPrescription) delete vouchers?.discount;
			if (!checked && router.query?.presc) {
				dispatch(setVoucherAction({}));
			} else {
				dispatch(setVoucherAction(vouchers));
			}
			setIsShowFooter(true);
		} else {
			dispatch(setVoucherAction({}));
			setIsShowFooter(true);
		}
	};

	const clearSubmit = async (payload?: any) => {
		await removeLocalStorage(VOUCHER_CONST.VOUCHER_INVALID_FLAG);
		setIsSubmitting(false);
		setIsSubmittingByKeyword(false);
		dispatch(setVoucherCode(''));
		toast.dismiss();
		if (isPrescription) {
			const q: any = { ...router.query };

			// if have any logic for query, put here
			if (payload?.isVoucherCode) {
				q.voucher_code = '1';
			} else {
				q.voucher_code = '0';
			}
			// sync cart
			const cart = await getParsedLocalStorage(LOCALSTORAGE.CART);
			const result = cart?.data;
			if (!(router.query?.shipping_selected && router.query?.shipping_selected == '1')) {
				if (!checkIsEmpty(result)) {
					dispatch(
						setCart(
							{
								...cartData,
								result,
								sync: true,
							},
							true,
						),
					);
				}
			}

			navigateWithQueryParams('/transaction/summary', q, 'href');
		} else {
			router.back();
		}
	};

	const onSelectVoucherByInput = async () => {
		try {
			setIsSubmittingByKeyword(true);
			let voucherTemp = [...voucherCanUse];
			if (voucherByKeyword?.length === 0) {
				voucherTemp.map((v: VoucherType) => (v.isSelected = false));
				setErrorMessage(VOUCHER_CONST.REQUIRED);
				setIsVoucherValid(false);
				setIsShowFooter(false);
				setIsSubmittingByKeyword(false);
				setIsSubmitting(false);
			} else {
				const body = {
					transactionXid: transaction_xid,
					voucherCode: voucherByKeyword,
				};
				// logic for seamless and guepay
				const applyVoucher = !isPrescription
					? await debouncedApplyVoucher({ body, token })
					: null;
				const isApplyVoucherReady = !isPrescription ? applyVoucher?.meta?.acknowledge : true;

				if (isApplyVoucherReady) {
					if (isPrescription) {
						const isValid = voucherTemp?.find(
							(item: VoucherType) => item?.code == voucherByKeyword,
						);

						if (!isValid) {
							onSubmitVoucher(true, { code: voucherByKeyword });
							// temporary comment this to apply hidden voucher
							// voucherTemp = voucherTemp?.map((item: VoucherType) => ({
							// 	...item,
							// 	isSelected: false,
							// }));
							// setErrorMessage(VOUCHER_CONST.VOUCHER_INVALID);
							// setIsVoucherValid(false);
							// dispatch(setVoucherAction({}));
						} else {
							setIsVoucherValid(true);
							dispatch(setVoucherCode(voucherByKeyword));
							dispatch(setVoucherKeyword(''));
							voucherTemp = voucherTemp
								.map((item: VoucherType) => {
									if (item.code == voucherByKeyword) {
										dispatch(setVoucherAction({ ...item, isSelected: true }));
									}
									return { ...item, isSelected: item.code == voucherByKeyword };
								})
								.sort((a: any, b: any) => b.isSelected - a.isSelected);
							setIsSubmittingByKeyword(false);
						}
						setIsShowFooter(true);
					} else {
						localStorage.setItem(VOUCHER_CONST.VOUCHER_TOAST, applyVoucher?.data?.reason);
						setIsVoucherValid(true);
						dispatch(setVoucherCode(voucherByKeyword));
						dispatch(setVoucherKeyword(''));
						clearSubmit();
					}
				} else {
					voucherTemp.map((v: VoucherType) => (v.isSelected = false));
					setErrorMessage(VOUCHER_CONST.INVALID);
					setIsVoucherValid(false);
					setIsShowFooter(false);
					setIsSubmitting(false);
				}
			}

			const result = { canUse: voucherTemp, canotUse: voucherCanotUse, productDetail };
			dispatch(setVoucherList({ ...transaction.voucherList, result }));
		} catch (error) {
			console.log('error on select by input : ', error);
		} finally {
			setIsSubmittingByKeyword(false);
		}
	};

	const handleSetLocalVoucherToStorage = async (voucher: any) => {
		await setStorageEncrypt(VOUCHER_CONST.SEAMLESS_VOUCHER, voucher);
		await setLocalStorage(VOUCHER_CONST.VOUCHER_TOAST, VOUCHER_CONST.SUCCESS_APPLY);
	};

	const onSubmitVoucher = async (isFromCode?: boolean, voucherFromCode?: any) => {
		setIsSubmitting(true);
		const vouchers = isFromCode == true ? voucherFromCode : voucher;
		if (isPrescription) {
			if (Object.keys(vouchers).length) {
				const localVoucher = {
					body: vouchers,
					token: router.query?.token_order,
					presc_id: router.query?.presc_id,
				};
				if (router.query?.shipping_selected && router.query?.shipping_selected == '1') {
					const resCheckoutVoucher: any = await postApplyCheckoutVoucher(localVoucher);
					if (resCheckoutVoucher?.meta?.acknowledge) {
						dispatch(fetchCart({ id: router?.query?.id }));
						handleSetLocalVoucherToStorage(localVoucher);
						setTimeout(() => {
							clearSubmit(isFromCode == true ? { isVoucherCode: true } : null);
						}, 500);
					} else {
						setIsSubmitting(false);
						setIsSubmittingByKeyword(false);
						toast.dismiss();
						const message_toast =
							resCheckoutVoucher?.data?.reason ??
							resCheckoutVoucher?.meta?.message ??
							MESSAGE_CONST.SOMETHING_WENT_WRONG;
						showToast(message_toast, { marginBottom: 60 }, 'error');
						return { valid: false, discount: 0 };
					}
				} else {
					handleSetLocalVoucherToStorage(localVoucher);
					setTimeout(() => {
						clearSubmit(isFromCode ? { isVoucherCode: true } : null);
					}, 500);
				}
			} else {
				const voucherProductApplied =
					productDetail?.voucher && Object.keys(productDetail?.voucher)?.length;

				const resRollbackVoucher: any = voucherProductApplied
					? await postRollbackCheckoutVoucher({
							body: { prescription_id: router.query?.presc_id },
							token: router.query?.token_order,
					  })
					: { meta: { acknowledge: true } };

				if (resRollbackVoucher?.meta?.acknowledge) {
					dispatch(fetchCart({ id: router?.query?.id }));
					await setLocalStorage(
						VOUCHER_CONST.VOUCHER_TOAST,
						isPrescription
							? VOUCHER_CONST.SUCCESS_DELETED_VOUCHER
							: VOUCHER_CONST.SUCCESS_UNAPPLY,
					);
					await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);
					setTimeout(() => {
						clearSubmit(isFromCode ? { isVoucherCode: true } : null);
					}, 500);
				}
			}
		} else {
			clearSubmit(isFromCode ? { isVoucherCode: true } : null);
		}
	};

	const onChangeKeyword = (e: any) => {
		dispatch(setVoucherKeyword(e.target.value));
		setIsVoucherValid(true);
	};

	const renderData = () => {
		return (
			<>
				{voucherCanUse?.length ? (
					<Text
						textClass={cx(styles.voucherGroupLabel, 'tw-font-roboto tw-font-medium')}
						skeletonClass="tw-w-32"
						isLoading={isLoading}
					>
						Pilih Voucher
					</Text>
				) : null}
				{isLoading ? (
					<>
						<Skeleton className="w-full tw-h-24" />
						<Skeleton className="w-full tw-h-24 tw-mt-3" />
					</>
				) : (
					<>
						{voucherCanUse?.map((item: VoucherType, index: number) => {
							return (
								<CardVoucher
									key={index}
									name={
										item?.name ??
										(item?.shipping_amount > 0
											? 'Diskon Ongkir ' + numberToIDR(item?.shipping_amount)
											: null) ??
										(item?.amount > 0 ? 'Diskon ' + numberToIDR(item?.amount) : null) ??
										(item?.voucher_type == VOUCHER_CONST.CART_PERCENT
											? 'Diskon ' +
											  (!checkIsEmpty(item?.grand_total_percentage) &&
											  item?.grand_total_percentage > 0
													? 'Total ' + item?.grand_total_percentage
													: !checkIsEmpty(item?.discount_amount) &&
													  item?.discount_amount > 0
													? 'Barang ' + item?.discount_amount
													: !checkIsEmpty(item?.discount_shipping_amount) &&
													  item?.discount_shipping_amount > 0
													? 'Ongkir ' + item?.discount_shipping_amount
													: 0) +
											  '%'
											: null)
									}
									enabled={item?.enabled && !isSubmitting}
									end_date={item?.end_date ?? item?.expired_date}
									containerClass="tw-mb-4"
									isSelected={item?.isSelected}
									min_transaction={item?.min_transaction}
									onSelectVoucher={(e: any) => onSelectVoucher(e, item)}
									code={item?.code}
								/>
							);
						})}
						{voucherCanotUse?.length ? (
							<Text
								textClass={cx(styles.voucherGroupLabel, 'tw-font-roboto tw-font-medium')}
								skeletonClass="tw-w-32"
								isLoading={isLoading}
							>
								Voucher Belum Bisa Digunakan
							</Text>
						) : (
							''
						)}
						{voucherCanotUse?.length
							? voucherCanotUse.map((item: VoucherType, index: number) => (
									<CardVoucher
										key={index}
										name={item?.name}
										enabled={false}
										end_date={item?.end_date ?? item?.expired_date}
										containerClass="tw-mb-4"
										isSelected={item?.isSelected}
										min_transaction={item?.min_transaction}
										code={item?.code}
									/>
							  ))
							: ''}
					</>
				)}
			</>
		);
	};

	const renderEmptyVoucher = () => {
		return (
			<div className={cx(styles.emptyStateContainer, 'float-width')}>
				<div className={styles.emptyStateWrapper}>
					<IconEmptyVoucher />
					<p className={cx(styles.emptyStateTitle, 'tw-font-roboto tw-font-medium')}>
						Belum Ada Voucher Tersedia
					</p>
					<p className={cx(styles.emptyStateSubtitle, 'tw-font-roboto tw-font-normal')}>
						Anda dapat mecoba memasukkan kode voucher
					</p>
				</div>
			</div>
		);
	};

	const renderFooter = (onSubmitVoucher: () => void, discounts: number) => {
		return (
			<div className={styles.footerContainer}>
				<div className={styles.paySection}>
					{discounts ? (
						<div className="tw-mr-4">
							<label className={styles.footerTotalLabel}>Potongan Harga</label>
							<p className={styles.footerTotalValue}>{numberToIDR(discounts)}</p>
						</div>
					) : (
						''
					)}

					<ButtonHighlight
						id={BUTTON_ID.BUTTON_APPLY_VOUCHER}
						text={discounts ? BUTTON_CONST.USE_VOUCHER : BUTTON_CONST.DONT_USE_VOUCHER}
						classNameBtn="tw-rounded-lg"
						onClick={onSubmitVoucher}
						isLoading={isSubmitting}
					/>
				</div>
			</div>
		);
	};

	return (
		<Wrapper
			footer={isShowFooter || Object.keys(voucher)?.length > 0}
			title="Gunakan Voucher"
			metaTitle="Gunakan Voucher"
			additionalId={PAGE_ID.VOUCHER}
			additionalClassNameContent="tw-px-3 tw-pt-3 tw-pb-20"
			addParentHeaderClassname="tw-relative tw-z-10"
			footerComponent={
				!isLoading &&
				renderFooter(
					() => onSubmitVoucher(false, false),
					!router.query?.presc ? voucher?.discount : voucherDiscountProduct,
				)
			}
		>
			<InputVoucher
				onChange={onChangeKeyword}
				isVoucherValid={isVoucherValid}
				onUseVoucher={onSelectVoucherByInput}
				errorMessage={errorMessage}
				value={voucherByKeyword}
				isSubmittingByKeyword={isSubmittingByKeyword}
			/>
			{(voucherCanUse?.length === 0 && voucherCanotUse?.length === 0 && !isLoading) ||
			!isVoucherValid
				? renderEmptyVoucher()
				: renderData()}
		</Wrapper>
	);
};

export default VoucherTemplate;
