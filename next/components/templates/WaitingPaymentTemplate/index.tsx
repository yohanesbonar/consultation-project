import { PopupBottomsheetInfo, Wrapper } from '@organisms';
import AccordionList from 'components/molecules/AccordionList';
import CardPayment from 'components/organisms/CardPayment';
import PopupBottomsheetBackConfirm from 'components/organisms/PopupBottomsheetBackConfirm';
import {
	LOCALSTORAGE,
	PAGE_ID,
	QRIS_HOW_TO_PAY,
	backHandling,
	navigateBackTo,
	navigateWithQueryParams,
} from 'helper';
import React, { useEffect, useState } from 'react';
import { getSessionStorage } from 'helper/SessionStorage';
import Router, { useRouter } from 'next/router';
import parse from 'html-react-parser';
import { CustomPopup } from '@molecules';
import { IconWarning } from '@icons';

interface WaitingPaymentTemplateProps {
	footerComponent: () => React.ReactNode;
	loading: boolean;
	cardTitle: string;
	cardIcon?: any;
	iconLabel: string;
	infoContent?: React.ReactNode;
	bodyContent?: React.ReactNode;
	dataList: any[];
	submitBack: () => void;
	isOpenCheckingPayment: boolean;
	transactionData?: any;
	paymentData?: any;
	emailSent: string;
	paymentInstructionHtml?: string;
}

const WaitingPaymentTemplate: React.FC<WaitingPaymentTemplateProps> = ({
	footerComponent,
	loading,
	cardTitle,
	cardIcon,
	iconLabel,
	bodyContent,
	dataList,
	submitBack,
	isOpenCheckingPayment = false,
	transactionData,
	paymentData,
	emailSent,
	paymentInstructionHtml = null,
}) => {
	const router = useRouter();
	const isQris = transactionData?.qr_code != null;
	const [showDetail, setShowDetail] = useState(false);
	const [showBackPopup, setShowBackPopup] = useState(false);

	useEffect(() => {
		if (transactionData?.back_url) {
			setTimeout(() => {
				localStorage.setItem(LOCALSTORAGE.BACK_URL, transactionData?.back_url);
			}, 500);
		}
	}, [transactionData?.back_url]);

	const toggleBack = async () => {
		const prevPath = await getSessionStorage('prevPath');
		const checkPath = prevPath.search('/payment/method');
		const checkPathFromResult = prevPath.search('/payment/status/result');
		if (checkPathFromResult == 0) {
			navigateWithQueryParams('/payment/status/result', { ...Router.query }, 'href');
		} else if (checkPath != -1) {
			if (transactionData?.back_url) {
				window.location.href = transactionData?.back_url;
			} else if (transactionData?.token) {
				window.location.href = `/prescription-detail?token=${transactionData?.token}`;
			} else {
				setShowDetail(!showDetail);
			}
		} else {
			Router.back();
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
						{transactionData?.patient_email ? (
							<span className="label-14-medium">
								{' '}
								{' ' + transactionData?.patient_email}{' '}
							</span>
						) : null}
						. Jika tekan kembali, Anda akan diarahkan ke ringkasan telekonsultasi
					</>
				}
				primaryButtonLabel="YA KEMBALI"
				primaryButtonAction={() =>
					backHandling({
						transactionData,
						router,
						onMethodCalled: () => setShowBackPopup(false),
						callback: () => navigateBackTo(toggleBack),
					})
				}
				secondaryButtonLabel="BATAL"
				secondaryButtonAction={() => setShowBackPopup(false)}
			/>

			<Wrapper
				onClickBack={() => {
					setShowBackPopup(true);
				}}
				additionalId={PAGE_ID.WAITING_PAYMENT}
				title="Menunggu Pembayaran"
				metaTitle="Menunggu Pembayaran"
				header={true}
				footer={true}
				footerComponent={!loading && footerComponent()}
				additionalStyleContent={{
					overflowY: loading ? 'hidden' : 'scroll',
				}}
				additionalClassNameContent="tw-bg-monochrome-100"
			>
				<div className="tw-flex tw-flex-col tw-my-5 tw-bg-white tw-mx-4 tw-rounded-lg">
					<CardPayment
						classContainer={''}
						title={cardTitle}
						Icon={cardIcon}
						iconLabel={iconLabel}
						bodyContent={bodyContent}
						loading={loading}
						paymentData={paymentData}
						transactionData={transactionData}
						showCountdown={true}
					/>
				</div>
				{!loading && ((dataList && dataList.length) || paymentInstructionHtml != null) ? (
					<div className="tw-flex tw-flex-col tw-py-5 tw-mb-4 tw-bg-white tw-mx-4 tw-rounded-lg">
						<div className="title-16-medium tw-flex tw-justify-between tw-text-tpy-700 tw-px-4">
							Cara Pembayaran
						</div>
						{paymentInstructionHtml && !isQris ? (
							<div className="tw-m-4">{parse(paymentInstructionHtml)}</div>
						) : (dataList && dataList.length) || isQris ? (
							<AccordionList
								dataList={isQris ? QRIS_HOW_TO_PAY : dataList}
								loading={loading}
							/>
						) : null}
					</div>
				) : loading ? (
					<div className="tw-flex tw-flex-col tw-py-5 tw-mb-4 tw-bg-white tw-mx-4 tw-rounded-lg">
						<div className="title-16-medium tw-flex tw-justify-between tw-text-tpy-700 tw-px-4">
							Cara Pembayaran
						</div>
						<AccordionList dataList={[]} loading={loading} />
					</div>
				) : null}
				<PopupBottomsheetBackConfirm
					show={showDetail}
					toggle={() => setShowDetail(!showDetail)}
					submit={submitBack}
					emailSent={emailSent}
				/>

				<PopupBottomsheetInfo
					type="checking_payment"
					isOpenBottomsheet={isOpenCheckingPayment}
				/>
			</Wrapper>
		</>
	);
};

export default WaitingPaymentTemplate;
