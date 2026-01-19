import React from 'react';
import { ButtonHighlight } from '@atoms';
import { InputForm } from '@molecules';
import { CardTransactionInfo, Wrapper, PopupBottomsheetConfirmRefund } from '@organisms';
import { checkIsEmpty, initalRefundRefund, numberToIDR, postRefundForm } from 'helper';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const RejectOrderTemplate = () => {
	const router = useRouter();
	const { token, transaction_id }: any = router.query;

	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);

	const invoiceNumber = productTransactionDetail?.result?.invoice_number;
	const totalPrice = productTransactionDetail?.result?.total_price;

	const [isShowConfirmBottomsheets, setIsShowConfirmBottomsheets] = React.useState<boolean>(false);
	const [form, setForm] = React.useState(initalRefundRefund);
	const [disabledSubmit, setDisabledSubmit] = React.useState(false);
	const [processing, setProcessing] = React.useState(false);

	const toggleConfirm = () => setIsShowConfirmBottomsheets(!isShowConfirmBottomsheets);

	const onChangeField = (v: any, i: number) => {
		const _temp: any = [...form];
		_temp[i].value = v.value;
		setForm(_temp);
	};

	const handleSubmit = async () => {
		setProcessing(true);
		const payload = form.reduce((a: any, v: any) => ({ ...a, [v.name]: v.value }), {});
		const params = { payload, token: router?.query?.token, xid: router.query.transaction_id };
		const res: any = await postRefundForm(params);
		if (res?.meta?.acknowledge) {
			setProcessing(false);
			router.push({
				pathname: '/transaction/product/refund-success',
				query: { token: router?.query?.token, presc: 1, xid: router.query.transaction_id },
			});
		} else {
			setProcessing(false);
			toast.error(res?.meta?.message, {
				className: 'tw-bg-error-def tw-text-tpy-50',
			});
		}
	};

	React.useEffect(() => {
		let disabled = false;
		form.map((v: any) => {
			disabled = checkIsEmpty(v?.value);
		});
		setDisabledSubmit(disabled);
	}, [form]);

	React.useEffect(() => {
		const { refund_data, refund_request_at } = productTransactionDetail.result;

		if (refund_data && refund_request_at) {
			router.push({
				pathname: `/transaction/product/refund-success`,
				query: { token: token, presc: 1, xid: transaction_id },
			});
		}
	}, [productTransactionDetail]);

	return (
		<Wrapper
			footer
			title="Form Refund"
			metaTitle="Form Refund"
			additionalClassNameContent="tw-p-4"
			footerComponent={
				<div className="tw-p-4">
					<ButtonHighlight
						isLoading={processing}
						isDisabled={disabledSubmit}
						onClick={toggleConfirm}
					>
						SIMPAN
					</ButtonHighlight>
				</div>
			}
		>
			<CardTransactionInfo
				data={{
					top_label: 'Total Refund',
					total: numberToIDR(totalPrice),
					invoice_number: invoiceNumber,
					message: 'Proses pengembalian dana max. 14 hari',
				}}
			/>
			<div className="tw-mt-6">
				{form?.map((element, i) => {
					return (
						<InputForm
							key={i}
							data={element}
							className={element?.className}
							formId={element.name}
							onChange={(v) => onChangeField(v, i)}
						/>
					);
				})}
			</div>

			<PopupBottomsheetConfirmRefund
				show={isShowConfirmBottomsheets}
				onShow={toggleConfirm}
				onSubmit={handleSubmit}
			/>
		</Wrapper>
	);
};

export default RejectOrderTemplate;
