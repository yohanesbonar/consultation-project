import React, { useEffect, useState } from 'react';
import { Wrapper } from '@organisms';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Text, ButtonHighlight } from '@atoms';
import { IconVoucher, IconInfo, IconCheckGreen, IconWarning } from '@icons';
import {
	BUTTON_CONST,
	BUTTON_ID,
	PAGE_ID,
	navigateBackTo,
	numberToIDR,
	VOUCHER_CONST,
	getLocalStorage,
	navigateWithQueryParams,
	setLocalStorage,
	postApplyVoucher,
	LOCALSTORAGE,
} from 'helper';
import PopupBottomSheetOtherCost from 'components/organisms/PopupBottomsheetOtherCost';
import styles from './index.module.css';
import cx from 'classnames';
import { CustomPopup } from '@molecules';

/**
 * Render Field
 * @param {any} label:string
 * @param {any} value:string
 * @returns {React.Component}
 */
const renderField = (label: string, value: string, isLoading: boolean) => (
	<React.Fragment>
		<Text textClass={styles.fieldLabel} skeletonClass="tw-w-24" isLoading={isLoading}>
			{label}
		</Text>
		<Text textClass={styles.fieldValue} skeletonClass="tw-w-24" isLoading={isLoading}>
			{value}
		</Text>
	</React.Fragment>
);
interface Props {
	token: string;
	transaction_xid: string;
}

const OrderDetailTemplate = (props: Props) => {
	const router: any = useRouter();
	const { transaction_xid, token } = props;

	// global state
	const results = useSelector(({ transaction }) => transaction.transactionDetail.result);
	const transaction = useSelector(({ transaction }) => transaction);
	const genderPatient = results?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan';
	const isUseVoucher =
		transaction?.voucher && Object.keys(transaction?.voucher)?.length > 0 ? true : false;
	const isFetchLoading = transaction.transactionDetail.loading;

	// condition for promo price
	const isPromoPrice = results?.promo_price != null;

	// condition for guepay rp.0 (free-paid)
	const isFreePaid = router.query?.freepaid == 1;
	const voucherValidator = transaction?.voucherValidator;

	// local page state
	const [isShowBottomsheets, setIsShowBottomsheets] = useState(false);
	const [isVoucherInvalid, setIsVoucherInvalid] = useState(false);
	const [isShowAlertVoucher, setIsShowAlertVoucher] = React.useState(false);

	// action handling
	const handlePopup = () => setIsShowBottomsheets(!isShowBottomsheets);
	const goToPaymentMethod = () => {
		const path =
			!isFreePaid && results?.total_amount > 0 ? '/payment/method' : '/payment/method/free-paid';
		router.push({
			pathname: path,
			query: { token, transaction_xid, total_amount: results?.total_amount, ...router.query },
		});
	};
	const goToUseVoucher = () => {
		if (isUseVoucher) {
			setIsShowAlertVoucher(true);
		} else {
			const query = { token, transaction_xid: transaction_xid, ...router.query };
			navigateWithQueryParams('/voucher', query, 'href');
		}
	};

	useEffect(() => {
		if (results?.back_url) {
			setTimeout(() => {
				localStorage.setItem(LOCALSTORAGE.BACK_URL, results?.back_url);
			}, 500);
		}
	}, [results?.back_url]);

	const toggleBack = async () => {
		toast.dismiss();
		navigateBackTo(async () => {
			if (results?.back_url) {
				window.location.href = results?.back_url;
			} else if (router.query?.back) {
				router.back();
			} else {
				router.replace({
					pathname: '/order',
					query: { token: token },
				});
			}
		});
	};

	const checkVoucherFlag = async () => {
		const isInvalid = await getLocalStorage(VOUCHER_CONST.VOUCHER_INVALID_FLAG);
		setIsVoucherInvalid(Boolean(isInvalid));
	};

	const rollbackVoucherByCode = async () => {
		try {
			const body = {
				transactionXid: transaction_xid,
				voucherCode: '',
			};
			const res = await postApplyVoucher({ body, token });
			if (res?.meta?.acknowledge) {
				await setLocalStorage(VOUCHER_CONST.VOUCHER_TOAST, VOUCHER_CONST.SUCCESS_UNAPPLY);
				const query = { token, transaction_xid: transaction_xid, ...router.query };
				navigateWithQueryParams('/voucher', query, 'href');
			}
		} catch (error) {
			console.error(error);
		}
	};

	React.useEffect(() => {
		checkVoucherFlag();
	}, []);

	const renderFooter = (
		total_amount: number,
		goToPaymentMethod: () => void,
		goUseVoucher: () => void,
		isUseVoucher?: boolean,
		voucherValidator?: any,
	) => {
		const labelVoucher =
			!voucherValidator?.valid || isVoucherInvalid
				? VOUCHER_CONST.VOUCHER_INVALID
				: VOUCHER_CONST.VOUCHER_APPLIED;
		return (
			<div className={styles.footerContainer}>
				<div onClick={goUseVoucher} className={styles.inputVoucherBtn}>
					<div className="tw-flex tw-items-center">
						<div className="voucher-01-ic voucher-02-ic voucher-03-ic">
							<IconVoucher />
						</div>
						{isUseVoucher || isVoucherInvalid ? (
							<div className="tw-flex tw-items-center">
								<p
									className={cx(
										styles.inputVoucherLabel,
										voucherValidator?.valid ? styles.validVoucher : styles.invalidVoucher,
									)}
								>
									{labelVoucher}
								</p>
								{voucherValidator?.valid && !isVoucherInvalid && <IconCheckGreen />}
							</div>
						) : (
							<p className={styles.inputVoucherLabel}>Gunakan Voucher</p>
						)}
					</div>

					<i className={cx('fa fa-chevron-right', styles.icArrowVoucher)}></i>
				</div>
				<div className={styles.paySection}>
					<div className="tw-mr-4">
						<label className={styles.footerTotalLabel}>Total Pembayaran</label>
						<p className={styles.footerTotalValue}>{numberToIDR(total_amount)}</p>
					</div>
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_SELECT_PAYMENT_METHOD}
						onClick={goToPaymentMethod}
						text={BUTTON_CONST.SELECT_PAYMENT}
						classNameBtn="tw-rounded-lg"
					/>
				</div>
			</div>
		);
	};

	return (
		<Wrapper
			title="Order Telekonsultasi"
			metaTitle="Order Telekonsultasi"
			additionalId={PAGE_ID.ORDER_DETAIL}
			footerComponent={renderFooter(
				results?.total_amount,
				goToPaymentMethod,
				goToUseVoucher,
				isUseVoucher,
				voucherValidator,
			)}
			footer={!isFetchLoading}
			onClickBack={toggleBack}
			customPopupComponent={
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
			}
		>
			{/* Patient data section */}
			<div className={styles.sectionList}>
				<Text textClass={styles.sectionLabel} isLoading={isFetchLoading}>
					Data Pasien
				</Text>
				<div className={styles.fieldGrid}>
					{renderField('Nama pasien', results?.name, isFetchLoading)}
					{renderField('Usia', results?.age, isFetchLoading)}
					{renderField('Jenis Kelamin', genderPatient, isFetchLoading)}
				</div>
			</div>
			{/* Doctor section */}
			<div className={styles.sectionList}>
				<Text textClass={styles.sectionLabel} isLoading={isFetchLoading}>
					Dokter Konsultasi
				</Text>
				<div className={styles.fieldGrid}>
					{renderField('Dokter', results?.specialist, isFetchLoading)}
				</div>
			</div>
			{/* Payment summary */}
			<div className={styles.sectionList}>
				<Text textClass={styles.sectionLabel} isLoading={isFetchLoading}>
					Rincian Pembayaran
				</Text>
				<div className={styles.summarySection}>
					<Text
						textClass={styles.fieldSummaryLabel}
						skeletonClass="tw-w-24"
						isLoading={isFetchLoading}
					>
						Biaya Konsultasi
					</Text>
					<Text
						prefixComponent={
							isPromoPrice && (
								<span className="tw-mr-2 tw-line-through">
									{numberToIDR(results?.pricing_amount)}
								</span>
							)
						}
						textClass={cx(styles.fieldValue, isPromoPrice ? styles.textRed : '')}
						skeletonClass="tw-w-24"
						isCurrency
						isLoading={isFetchLoading}
					>
						{isFreePaid ? 0 : isPromoPrice ? results?.promo_price : results?.pricing_amount}
					</Text>
				</div>
				{results?.other_amount && !isFreePaid && (
					<div className={styles.summarySection}>
						<div className={styles.otherPayContainer}>
							<Text
								textClass={styles.fieldSummaryLabel}
								skeletonClass="tw-w-24"
								isLoading={isFetchLoading}
							>
								Biaya Lain-Lain
							</Text>

							<div onClick={handlePopup} className={styles.btnOtherPay}>
								{!isFetchLoading && <IconInfo />}
							</div>
						</div>
						<Text
							textClass={styles.fieldValue}
							skeletonClass="tw-w-24"
							isLoading={isFetchLoading}
							isCurrency
						>
							{results?.total_other_amount}
						</Text>
					</div>
				)}
				{isUseVoucher && voucherValidator?.valid && (
					<div className={styles.summarySection}>
						<Text
							textClass={styles.fieldSummaryLabel}
							skeletonClass="tw-w-24"
							isLoading={isFetchLoading}
						>
							Potongan Harga
						</Text>
						<Text
							textClass={styles.fieldValue}
							skeletonClass="tw-w-24"
							isLoading={isFetchLoading}
							isCurrency
							isMinus
						>
							{Math.abs(transaction.voucher?.discount ?? 0)}
						</Text>
					</div>
				)}
				<div className={styles.summaryTotalSection}>
					<Text
						textClass={styles.fieldLabel}
						skeletonClass="tw-w-24"
						isLoading={isFetchLoading}
					>
						Total Pembayaran
					</Text>
					<Text
						textClass={styles.fieldValueTotal}
						skeletonClass="tw-w-24"
						isLoading={isFetchLoading}
						isCurrency
					>
						{isFreePaid ? 0 : results?.total_amount}
					</Text>
				</div>
			</div>
			{results?.other_amount && (
				<PopupBottomSheetOtherCost
					data={results?.other_amount}
					total_amount={results?.total_other_amount}
					isShow={isShowBottomsheets}
					onOpen={handlePopup}
					styles={styles}
				/>
			)}
		</Wrapper>
	);
};

export default OrderDetailTemplate;
