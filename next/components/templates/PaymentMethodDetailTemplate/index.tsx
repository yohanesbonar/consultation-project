import { IconVoucher } from '@icons';
import { Wrapper } from '@organisms';
import CardPayment from 'components/organisms/CardPayment';
import PopupBottomSheetPaymentDetail from 'components/organisms/PopupBottomSheetPaymentDetail';
import { PAGE_ID, numberToIDR, toAmmount } from 'helper';
import useBrowserNavigation from 'hooks/useBrowserNavigation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface PaymentMethodDetailTemplateProps {
	footerComponent: () => React.ReactNode;
	loading: boolean;
	cardTitle: string;
	cardIcon?: any;
	iconLabel: string;
	infoContent?: React.ReactNode;
	transactionData?: any;
	isFreePaid?: boolean;
}

const PaymentMethodDetailTemplate: React.FC<PaymentMethodDetailTemplateProps> = ({
	footerComponent,
	loading,
	cardTitle,
	cardIcon,
	iconLabel,
	infoContent,
	transactionData,
	isFreePaid,
}) => {
	const router = useRouter();

	const [showDetail, setShowDetail] = useState(false);
	const titlePayment =
		cardTitle === 'Mobile Payment'
			? 'Dompet Digital'
			: cardTitle?.toLowerCase() == 'pembayaran instan' ||
			  cardTitle?.toLowerCase() == 'pembayaran instant'
			? cardTitle
			: 'Transfer ' + (cardTitle == 'Bank Transfer' ? 'Bank' : 'Virtual Account');

	const voucher = transactionData?.data?.voucher;
	const discount = (voucher?.amount || voucher?.shipping_amount) ?? 0;
	const isUseVoucher = voucher != null && discount > 0;
	const transaction = useSelector(({ transaction }) => transaction);
	const voucherValidator = !router.query?.presc ? transaction?.voucherValidator : { valid: true };

	const renderVoucher = () => {
		return (
			<div className="tw-flex tw-items-center tw-bg-secondary-50 tw-py-2 tw-px-3 tw-mt-3 tw-rounded-lg">
				<div className="voucher-01-ic voucher-02-ic voucher-03-ic">
					<IconVoucher />
				</div>
				<p className="label-12-medium tw-mb-0 tw-ml-2">Anda dapat diskon</p>
				<p className="label-14-medium tw-mb-0 tw-ml-2 tw-text-primary-def">
					{numberToIDR(discount)}
				</p>
			</div>
		);
	};

	useBrowserNavigation(() => {
		onClickBack();
	});

	const onClickBack = () => {
		if (isFreePaid) {
			if (router?.query?.presc) {
				router.back();
			} else {
				router.replace({
					pathname: '/order/detail',
					query: router.query,
				});
			}
		} else {
			router.replace({
				pathname: '/payment/method',
				query: router.query,
			});
		}
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.PAYMENT}
			title="Pembayaran"
			metaTitle="Pembayaran"
			header={true}
			footer={true}
			footerComponent={footerComponent()}
			additionalStyleContent={{
				overflowY: loading ? 'hidden' : 'scroll',
			}}
			onClickBack={onClickBack}
		>
			<div className="tw-flex tw-flex-col tw-p-4">
				<div className="tw-flex tw-justify-between">
					<div className="tw-flex tw-flex-col">
						<div className="font-14 tw-font-normal">Total Pembayaran</div>
						<div className="tw-text-2xl tw-font-bold tw-font-['Inter']">
							Rp
							{toAmmount(
								isFreePaid
									? 0
									: transactionData?.paid_amount ??
											transactionData?.data?.grand_total ??
											transactionData?.data?.total_price,
							)}
						</div>
					</div>
					<div
						onClick={() => setShowDetail(true)}
						className="label-14-medium tw-text-secondary-def tw-flex tw-items-center tw-cursor-pointer"
					>
						Lihat Rincian
					</div>
				</div>
				{isUseVoucher && voucherValidator?.valid && renderVoucher()}
				<CardPayment
					classContainer={'tw-mt-5'}
					title={titlePayment}
					Icon={cardIcon}
					iconLabel={iconLabel}
					infoContent={infoContent}
					isFreePaid={isFreePaid}
				/>
			</div>
			<PopupBottomSheetPaymentDetail
				show={showDetail}
				onShow={setShowDetail}
				title={titlePayment}
				Icon={cardIcon}
				iconLabel={iconLabel}
				data={transactionData}
				isFreePaid={isFreePaid}
			/>
		</Wrapper>
	);
};

export default PaymentMethodDetailTemplate;
