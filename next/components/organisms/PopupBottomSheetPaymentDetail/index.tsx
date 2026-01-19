import { BUTTON_CONST, BUTTON_ID, LABEL_CONST, numberToIDR } from 'helper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ButtonHighlight, ImageLoading } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { IconWarningOrange } from '@icons';
import { IconDkonsulSmall } from '@icons';
import { useRouter } from 'next/router';

type Props = {
	openBottomsheetEndConsul?: boolean;
	setPopupFeedback?: (_val: boolean) => void;
	endConsultation?: (_orderNumber: string | number, body: any) => void;
	title: string;
	Icon?: any;
	iconLabel: string;
	show: boolean;
	onShow: (val: boolean) => void;
	data?: any;
	isXendit?: boolean;
	isXenditSubmitPayment?: boolean;
	handleXenditSubmitPayment?: () => void;
	isFreePaid?: boolean;
};

const PopupBottomsheetPaymentDetail = ({
	title,
	Icon,
	iconLabel,
	show,
	onShow,
	data,
	isXendit,
	isXenditSubmitPayment,
	handleXenditSubmitPayment,
	isFreePaid,
}: Props) => {
	const router = useRouter();
	const [totalOtherAmount, setTotalOtherAmount] = useState<number>(0);
	const voucher = data?.data?.voucher ?? data?.discount;
	const discount = (voucher?.amount || voucher?.shipping_amount) ?? data?.discount ?? 0;
	const isUseVoucher = voucher != null && discount > 0;

	// condition for promo price
	const isPromoPrice = data?.promo_price != null;

	useEffect(() => {
		let totalOtherAmount = 0;
		data?.other_amount?.forEach((val) => (totalOtherAmount += val.value));
		setTotalOtherAmount(totalOtherAmount);
	}, [data?.other_amount]);

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<ButtonHighlight
					id={BUTTON_ID.BUTTON_PAY}
					onClick={handleXenditSubmitPayment}
					text={BUTTON_CONST.PAY}
					isDisabled={isXenditSubmitPayment}
					isLoading={isXenditSubmitPayment}
					circularContainerClassName="tw-h-4"
					circularClassName="circular-inner-16"
				/>
			</div>
		);
	};

	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) onShow(false);
			}}
			headerComponent={
				<div className="tw-mt-[36px] tw-mx-4">
					<p className="title-18-medium tw-text-left">Rincian Pembayaran</p>
				</div>
			}
			footerComponent={isXendit && renderFooterButton()}
		>
			<div className="tw-m-4 tw-flex tw-flex-col tw-gap-3">
				{title && (
					<div className="tw-flex tw-justify-between tw-items-center">
						{isFreePaid ? (
							<div className="tw-flex tw-items-center">
								<IconDkonsulSmall />
								<p className="label-14-medium tw-mb-0 tw-ml-2">
									{LABEL_CONST.FREE_PAID_CONSULTATION}
								</p>
							</div>
						) : (
							<div>{title}</div>
						)}
						<div className="tw-flex tw-justify-between tw-items-center tw-gap-2">
							<div className={`tw-w-12 tw-h-7 tw-relative`}>
								<ImageLoading
									data={{
										url: Icon?.src ?? Icon,
										noImg: !((Icon?.src ?? Icon) && title != null && title != ''),
									}}
									alt="payment-icon"
									className="tw-object-scale-down tw-object-right"
								/>
							</div>
							<div className="font-14 tw-font-medium tw-font-roboto">{iconLabel}</div>
						</div>
					</div>
				)}

				<div className="line-break-solid"></div>
				<div className="tw-flex tw-flex-col tw-gap-3">
					<div className="tw-flex tw-justify-between font-14">
						<div>Total Harga</div>
						<div className="tw-font-roboto tw-font-medium">
							{numberToIDR(
								isFreePaid
									? 0
									: isPromoPrice
									? data?.promo_price
									: data?.pricing_amount ??
									  data?.data?.grand_total ??
									  data?.data?.subtotal,
							)}
						</div>
					</div>
					{!isFreePaid && (
						<>
							{router.query?.presc ? (
								<div className="tw-flex tw-justify-between font-14">
									<div>Biaya kirim</div>
									<div className="tw-font-roboto tw-font-medium">
										{numberToIDR(data?.data?.shipping_method?.price)}
									</div>
								</div>
							) : null}
							{data?.other_amount != null ? (
								<div className="tw-flex tw-justify-between font-14">
									<div>Biaya Lain-lain</div>
									<div className="tw-font-roboto tw-font-medium">
										{numberToIDR(totalOtherAmount)}
									</div>
								</div>
							) : null}
							{isUseVoucher ? (
								<div className="tw-flex tw-justify-between font-14">
									<div>Potongan Harga</div>
									<div className="tw-font-roboto tw-font-medium">
										{'-' + numberToIDR(data?.discount ?? discount)}
									</div>
								</div>
							) : null}
						</>
					)}
				</div>
				<div className="line-break-dashed"></div>
				<div className="tw-flex tw-justify-between body-16-regular">
					<div>Total Pembayaran</div>
					<div className="tw-font-roboto tw-font-medium">
						{numberToIDR(
							data?.paid_amount ??
								data?.total_amount ??
								data?.data?.grand_total ??
								data?.data?.total_price ??
								0,
						)}
					</div>
				</div>
				{isXendit && (
					<div className="tw-flex tw-justify-start tw-items-center tw-rounded-lg tw-pr-4 tw-pl-2 tw-py-2 tw-bg-info-50">
						<div className="tw-text-info-def">
							<IconWarningOrange />
						</div>
						<p className="body-12-regular tw-mb-0 tw-ml-2">
							Anda akan diarahkan ke halaman{' '}
							<span className="label-12-medium">pembayaran Xendit</span>
						</p>
					</div>
				)}
			</div>
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	// openBottomsheetEndConsul: state.general.openBottomsheetEndConsul,
});

const mapDispatchToProps = (dispatch) => ({
	// endConsultation: (orderNumber, body) =>
	// 	dispatch(setEndConsultation(orderNumber, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetPaymentDetail);
