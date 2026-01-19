import React, { useMemo, useRef } from 'react';
import {
	ButtonHighlight,
	CustomPopup,
	TransactionCart,
	TransactionUserInfo,
	Wrapper,
} from '../../index.js';
import {
	BUTTON_CONST,
	BUTTON_ID,
	PAGE_ID,
	SEAMLESS_CONST,
	VOUCHER_CONST,
	checkIsEmpty,
	getStorageParseDecrypt,
	navigateWithQueryParams,
	numberToIDR,
} from '../../../helper';
import { useRouter } from 'next/router.js';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import { IconInfoYellow, IconWarning } from '@icons';
import { setCart } from 'redux/actions';
import Skeleton from 'react-loading-skeleton';
import useBrowserNavigation from 'hooks/useBrowserNavigation';
import { ApplyVoucherButton } from 'components/organisms';

const CartTemplate = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isPageLoading = useSelector(({ general }) => general?.isPageLoading);
	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const [voucher, setVoucher] = React.useState<any>();
	const [isShowForcePostCode, setIsShowForcePostCode] = React.useState(false);
	const [isForcedPostCode, setIsForcedPostCode] = React.useState(null);

	const voucherType = voucher?.body?.type;
	const voucherLength = voucher && Object.keys(voucher)?.length;
	const discountShipping = voucher?.body?.discount_shipping_amount ?? 0;
	const discountAmount = voucher?.body?.discount_amount;
	const grandTotalDiscountAmount = voucher?.body?.grand_total_discount_amount ?? 0;

	const scrollRef = useRef<HTMLDivElement>(null);

	const isUpdated = useMemo(() => {
		let res = cartData?.result?.isUpdated;
		if (!res && !!cartData?.result?.updatedProducts) {
			res = cartData?.result?.updatedProducts?.some((e: any) => e?.originalQty != e?.qty);
		}
		return res;
	}, [cartData]);

	React.useEffect(() => {
		if (isUpdated && scrollRef.current) {
			setTimeout(() => {
				scrollRef.current.scrollIntoView({ behavior: 'smooth' });
			}, 500);
		}
	}, [isUpdated]);

	React.useEffect(() => {
		const getLocalVoucher = async () => {
			const v = await getStorageParseDecrypt(VOUCHER_CONST.SEAMLESS_VOUCHER);
			setVoucher(v);
		};
		getLocalVoucher();
	}, [router.isReady]);

	useBrowserNavigation(() => {
		onClickBackHeader();
	});

	const onClickBackHeader = () => {
		if (router.query?.fromPresc) {
			router.push({
				pathname: '/prescription-detail',
				query: {
					token: router.query?.token,
					token_order: router.query?.token_order,
				},
			});
		} else {
			if (!router?.query?.token?.length) {
				router.push('/prescription-detail');
			} else {
				router.back();
			}
		}
	};

	const goToUseVoucher = () => {
		const query = {
			...(checkIsEmpty(router.query?.token) ? null : { token: router.query?.token }),
			transaction_xid: cartData?.result?.transaction_xid,
			presc: 1,
			presc_id: cartData?.result?.id ?? '',
			...router.query,
		};

		navigateWithQueryParams('/voucher', query, 'href');
	};

	const renderFooterButton = () => {
		return (
			<div className={styles.footerContainer}>
				{isUpdated ? (
					<div className="tw-py-3 tw-pl-2 tw-pr-4 tw-bg-info-50 tw-rounded-lg tw-flex tw-gap-2 tw-mb-3">
						<IconInfoYellow />
						<p className="tw-mb-0 tw-flex-1">
							Anda melakukan perubahan jumlah item di keranjang Anda
						</p>
						<p
							className="tw-text-secondary-def hover:tw-text-secondary-800 tw-cursor-pointer title-14-medium tw-mb-0 tw-self-center "
							onClick={() => {
								dispatch(
									setCart({
										...cartData,
										result: {
											...cartData?.result,
											updatedProducts: Object.assign([], cartData?.result?.products),
											isUpdated: false,
										},
										sync: true,
									}),
								);
							}}
						>
							Reset
						</p>
					</div>
				) : (
					''
				)}
				<ApplyVoucherButton
					onClickBtnVoucher={goToUseVoucher}
					discount={
						voucherType == VOUCHER_CONST.GRAND_TOTAL
							? grandTotalDiscountAmount
							: discountAmount + discountShipping
					}
					isVoucherUsed={voucherLength ? true : false}
				/>
				<div className={styles.paySection}>
					<div className="tw-mr-4">
						<label className={styles.footerTotalLabel}>{SEAMLESS_CONST.SUBTOTAL}</label>
						<p className={styles.footerTotalValue}>
							{isPageLoading ? <Skeleton /> : numberToIDR(cartData?.result?.subtotal ?? 0)}
						</p>
					</div>
					<ButtonHighlight
						isDisabled={isPageLoading || cartData?.loading}
						isLoading={cartData?.loading}
						id={BUTTON_ID.BUTTON_CONTINUE}
						onClick={() => {
							dispatch(
								setCart(
									{
										...cartData,
										result: {
											...cartData?.result,
											updatedProducts: Object.assign(
												[],
												cartData?.result?.updatedProducts,
											),
											isUpdated: cartData?.result?.updatedProducts?.find(
												(upd: any) => upd?.updatedQty,
											)
												? true
												: false,
										},
										sync: true,
									},
									true,
								),
							);
						}}
						text={BUTTON_CONST.CONTINUE}
						classNameBtn="tw-rounded-lg"
					/>
				</div>
			</div>
		);
	};

	const renderCartItem = () => {
		const resTemp = cartData?.result;
		return (
			<TransactionCart
				forPage="cart"
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

	return (
		<Wrapper
			additionalId={PAGE_ID.TRANSACTION_CART}
			title={'Keranjang'}
			footer={true}
			footerComponent={renderFooterButton()}
			headClass={'tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2]'}
			onClickBack={onClickBackHeader}
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
			<div className="tw-w-full" ref={scrollRef}>
				<TransactionUserInfo
					isForcedPostCodeTrigger={isForcedPostCode}
					setForceChangePostCode={(isShow) => setIsShowForcePostCode(isShow)}
				/>
				<div className="tw-bg-monochrome-100 tw-w-full tw-h-1" />
				{renderCartItem()}
			</div>
		</Wrapper>
	);
};

export default CartTemplate;
