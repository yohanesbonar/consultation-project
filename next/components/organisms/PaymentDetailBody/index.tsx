import React from 'react';
import {
	LABEL_CONST,
	ORDER_TYPE,
	PAYMENT_STATUS,
	TRANSACTION_LABEL,
	countTotals,
	numberToIDR,
} from '../../../helper';
import { TextLabelSide } from '@molecules';
import { IconDkonsulSmall, IconInfo } from '@icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import PaymentLabelSide from 'components/molecules/PaymentLabelSide';
import useDiscount from 'hooks/useDiscount';

interface Props {
	data?: any;
	type?: string;
	setIsOpenInfoBottomsheet?: (val: boolean) => void;
	isPageLoading?: boolean;
}

const PaymentDetailBody = ({
	data,
	type,
	setIsOpenInfoBottomsheet,
	isPageLoading = false,
}: Props) => {
	const router = useRouter();

	// condition for promo price
	const isPromoPrice = data?.promo_price != null;

	// condition for guepay rp.0 (free-paid)
	const isFreePaid = data?.paid_amount === 0 && router.query?.methodId == PAYMENT_STATUS.FREE_PAID;

	// voucher & discount initial
	const discount = useDiscount(data);
	const isDiscountGrandTotal = data?.voucher && data?.voucher?.amount > 0;
	const isDiscountShipping = data?.voucher && data?.voucher?.shipping_amount > 0;
	const voucherShippingAmount =
		data?.shipping_fee - ((isDiscountShipping ? data?.voucher?.shipping_amount : 0) ?? 0);

	const renderBody = () => {
		if (type === TRANSACTION_LABEL.OTHER_FEE) {
			return (
				<div>
					<p>
						Merupakan biaya lain di luar konsultasi agar kami bisa memberikan pelayanan yang
						lebih baik untuk Anda.
					</p>
					<div className="tw-flex tw-flex-col tw-gap-3">
						{data?.other_amount?.map((e: any, idx: number) => (
							<TextLabelSide
								key={'tx-pricing-other-' + idx}
								data={{
									label: e?.label,
									value: numberToIDR(e?.value),
								}}
							/>
						))}

						<div className="tw-h-[1px] tw-w-full tw-border-0 tw-border-dashed tw-border-t-[1px] tw-border-monochrome-50" />
						<TextLabelSide
							data={{
								label: TRANSACTION_LABEL.GRAND_TOTAL_OTHER,
								value:
									data?.other_amount && data?.other_amount?.length
										? numberToIDR(
												data?.other_amount?.reduce(
													(sum: any, e: any) => sum + e?.value,
													0,
												),
										  )
										: 'Rp0',
							}}
							classNameValue="tw-text-primary-def"
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					{data?.payment_status != 'REFUNDED' && !isPageLoading && !isFreePaid ? (
						<>
							<PaymentLabelSide
								title={data?.payment_method?.type ?? data?.payment_method?.group_title}
								iconUrl={data?.payment_method?.logo_url}
								iconLabel={data?.payment_method?.name ?? data?.payment_method?.title}
								classNameParent="tw-mt-1"
								loading={isPageLoading}
							/>
							<div className="tw-h-[1px] tw-w-full tw-bg-monochrome-300 tw-my-3" />
						</>
					) : null}
					<div className="tw-flex tw-flex-col tw-gap-3">
						{isFreePaid && (
							<>
								<div className="tw-flex tw-items-center">
									<IconDkonsulSmall />
									<p className="label-14-medium tw-mb-0 tw-ml-2">
										{LABEL_CONST.FREE_PAID_CONSULTATION}
									</p>
								</div>
								<hr className="my-0 tw-border-monochrome-50" />
							</>
						)}
						<TextLabelSide
							data={{
								label: `${TRANSACTION_LABEL.TOTAL_PRICE} ${
									data?.type == ORDER_TYPE.PRODUCT && data?.products?.length
										? `(${countTotals(data?.products)} barang)`
										: ''
								}`,
								value: numberToIDR(
									isPromoPrice ? data?.promo_price : data?.pricing_amount ?? data?.price,
								),
							}}
							isLoading={isPageLoading}
						/>
						{data?.shipping_fee != null ? (
							<TextLabelSide
								data={{
									label: TRANSACTION_LABEL.SEND_FEE,
									value: numberToIDR(
										voucherShippingAmount > 0 ? voucherShippingAmount : 0,
									),
									valueSecondary: isDiscountShipping && numberToIDR(data?.shipping_fee),
									valueSecondaryPrefixClassName: isDiscountShipping && 'tw-line-through',
								}}
								isLoading={isPageLoading}
							/>
						) : null}
						{data?.other_amount != null ? (
							<TextLabelSide
								data={{
									label: TRANSACTION_LABEL.OTHER_FEE,
									value:
										data?.other_amount && data?.other_amount?.length
											? numberToIDR(
													data?.other_amount?.reduce(
														(sum: any, e: any) => sum + e?.value,
														0,
													),
											  )
											: 'Rp0',
									labelSuffixIcon: (
										<IconInfo onClick={() => setIsOpenInfoBottomsheet(true)} />
									),
								}}
							/>
						) : null}
						{/* Gue Pay Discount */}
						{discount > 0 && !data?.products?.length ? (
							<TextLabelSide
								data={{
									label: TRANSACTION_LABEL.DISCOUNT,
									value: '-' + numberToIDR(Math.abs(discount)),
								}}
							/>
						) : null}

						{/* Seamless Discount */}
						{isDiscountGrandTotal && data?.products?.length > 0 ? (
							<TextLabelSide
								data={{
									label: TRANSACTION_LABEL.DISCOUNT,
									value: '-' + numberToIDR(Math.abs(discount)),
								}}
							/>
						) : null}

						<div className="tw-h-[1px] tw-w-full tw-border-0 tw-border-dashed tw-border-t-[1px] tw-border-monochrome-50" />
						<TextLabelSide
							data={{
								label: TRANSACTION_LABEL.GRAND_TOTAL,
								value: numberToIDR(data?.paid_amount ?? data?.total_price),
							}}
							classNameLabel="tw-text-base"
							classNameValue="tw-text-base"
							isLoading={isPageLoading}
						/>
					</div>
				</div>
			);
		}
	};

	return <view className=" tw-flex-1 tw-flex tw-flex-col">{renderBody()}</view>;
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetailBody);
