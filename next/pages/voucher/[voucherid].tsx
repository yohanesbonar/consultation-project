import { VoucherDetailType } from '@types';
import VoucherDetailTemplate from 'components/templates/VoucherDetailTemplate';
import {
	LOCALSTORAGE,
	MESSAGE_CONST,
	VOUCHER_CONST,
	fetchCachedTheme,
	getCheckoutVoucherDetail,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	getVoucherDetail,
	postApplyVoucher,
	removeLocalStorage,
	storePathValues,
} from 'helper';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type TrxDataType = {
	token?: string;
	xid?: string;
	voucher?: any;
};

const VoucherDetail = (props) => {
	const router = useRouter();
	const [data, setData] = useState<VoucherDetailType>();
	const [trxData, setTrxData] = useState<TrxDataType>();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const { token, token_order } = router.query;

	usePartnerInfo({ ...props, token: (token_order ?? token) as string });

	useEffect(() => {
		storePathValues();
		if (router?.query && !data) {
			getData();
		}
	}, [router?.query, data]);

	const getData = async () => {
		try {
			setLoading(true);
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const transactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);
			const tempToken = router.query?.token ?? temp?.token;
			const tempXid = router.query?.transaction_xid ?? transactionData?.xid;
			setTrxData({ xid: tempXid, token: tempToken, voucher: transactionData?.voucher });

			const res = router?.query?.presc
				? await getCheckoutVoucherDetail({
						code: router.query?.voucherid as string,
						token: tempToken,
				  })
				: await getVoucherDetail({
						code: router.query?.voucherid as string,
						token: tempToken,
				  });
			if (res?.meta?.acknowledge) {
				setData(res?.data);
			}
		} catch (error) {
			console.log('error on get data trx : ', error);
		} finally {
			setLoading(false);
		}
	};

	const applyVoucher = async (discardVoucher = false) => {
		try {
			setIsSubmitting(true);
			// apply voucher
			const body = {
				transactionXid: trxData?.xid,
				voucherCode: discardVoucher ? '' : router.query?.voucherid,
			};
			const res = await postApplyVoucher({ body, token: trxData?.token });
			if ((res?.meta?.acknowledge && res?.data?.valid) || router?.query?.presc) {
				await removeLocalStorage(VOUCHER_CONST.VOUCHER_INVALID_FLAG);
				if (!router?.query?.presc) {
					localStorage.setItem(VOUCHER_CONST.VOUCHER_TOAST, res?.data?.reason);
				}
				window.history.go(-2);
				return res.data;
			} else {
				toast.dismiss();
				toast.error(res?.data?.reason ?? MESSAGE_CONST.SOMETHING_WENT_WRONG, {
					className: 'tw-bg-error-def',
					style: { color: 'white' },
				});
				return false;
			}
		} catch (error) {
			console.log('error on apply voucher : ', error);
			toast.dismiss();
			toast.error(MESSAGE_CONST.SOMETHING_WENT_WRONG, {
				className: 'tw-bg-error-def tw-text-tpy-50',
				style: { color: 'white' },
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<VoucherDetailTemplate
			data={data}
			trxData={trxData}
			onClickApply={applyVoucher}
			isSubmitting={isSubmitting}
			isLoading={loading}
		/>
	);
};

export const getServerSideProps = async ({ req, res, query }) => {
	const token = query?.token_order ?? query?.token;
	const responseTheme = await fetchCachedTheme(token as string, { req, res });
	try {
		if (responseTheme?.meta?.acknowledge) {
			return {
				props: {
					theme: responseTheme?.data,
				},
			};
		}
	} catch (error) {
		console.log('error on server side props order detail : ', error);
	}

	return { props: {} };
};

export default VoucherDetail;
