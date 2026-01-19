import React from 'react';
import { CardTransactionInfo, PopupBottomsheetConfirmComplain, Wrapper } from '@organisms';
import { BUTTON_CONST, STATUS_CONST, numberToIDR, postProductComplain } from 'helper';
import { InputRadioBox } from '@molecules';
import { ButtonHighlight } from '@atoms';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';

const ProductComplainTemplate = () => {
	const router = useRouter();
	const { token, transaction_id } = router.query;

	const store = useSelector(({ general }: any) => general);
	const reason = store?.dashboardReason?.result;
	const loading = store?.dashboardReason?.loading;
	const contactUrl = store?.contactUrl;

	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);
	const shippingStatus = productTransactionDetail?.result?.shipping_status;

	const [reasonSelected, setReasonSelected] = React.useState(null);
	const [processing, setProcessing] = React.useState(false);
	const [isShowComplain, setIsShowComplain] = React.useState<boolean>(false);

	const toggleComplainPopup = () => setIsShowComplain(!isShowComplain);

	const callbackComplain = (results?: any) => {
		const message = `Halo, Saya hendak mengajukan komplain karena pesanan saya mengalami masalah ${
			reasonSelected?.reason || reasonSelected?.name
		}. Nomor invoice saya adalah ${productTransactionDetail?.result?.invoice_number || '-'}`;

		if (results?.meta?.acknowledge) {
			setProcessing(false);
			window.location.href = contactUrl + `?text=${message}`;
		} else {
			toast.error(results?.meta?.message, {
				className: 'tw-bg-error-def tw-text-tpy-50',
			});
			setProcessing(false);
		}
	};

	const handleSubmitComplain = async () => {
		setProcessing(true);
		const params = {
			reason_id: reasonSelected?.id,
			reason: reasonSelected?.name,
			token: token,
			transaction_id: transaction_id,
		};
		const res = await postProductComplain(params);
		callbackComplain(res);
	};

	return (
		<Wrapper
			title={BUTTON_CONST.COMPLAIN_REQUEST}
			metaTitle={BUTTON_CONST.COMPLAIN_REQUEST}
			additionalClassNameContent="tw-p-4"
			footerComponent={
				<div className="tw-p-4">
					<ButtonHighlight
						isLoading={processing}
						onClick={toggleComplainPopup}
						isDisabled={shippingStatus === STATUS_CONST.COMPLAIN ? true : !reasonSelected}
					>
						{BUTTON_CONST.COMPLAIN_REQUEST.toUpperCase()}
					</ButtonHighlight>
				</div>
			}
			footer
		>
			<CardTransactionInfo
				data={{
					top_label: 'Total Transaksi',
					total: numberToIDR(productTransactionDetail?.result?.total_price || 0),
					invoice_number: productTransactionDetail?.result?.invoice_number || '-',
					message: 'Anda akan diarahkan ke Whatsapp Customer Service untuk melanjutkan',
				}}
			/>

			<p className="title-16-medium tw-mb-0 tw-mt-6">Apa alasan Anda mengajukan komplain?</p>

			{loading ? (
				<>
					<Skeleton className="tw-w-full tw-h-[50px] tw-rounded-lg tw-mt-3" />
					<Skeleton className="tw-w-full tw-h-[50px] tw-rounded-lg tw-mt-4" />
					<Skeleton className="tw-w-full tw-h-[50px] tw-rounded-lg tw-mt-4" />
				</>
			) : (
				''
			)}

			{reason &&
				reason?.map((v: any) => {
					return (
						<InputRadioBox
							onChange={(e) => setReasonSelected(JSON.parse(e.target.value))}
							value={JSON.stringify(v)}
							key={v?.id}
							className="tw-mt-4"
							label={v?.name}
						/>
					);
				})}

			<PopupBottomsheetConfirmComplain
				show={isShowComplain}
				onShow={toggleComplainPopup}
				onSubmit={handleSubmitComplain}
				reason={reasonSelected?.name}
			/>
		</Wrapper>
	);
};

export default ProductComplainTemplate;
