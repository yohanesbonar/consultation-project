import React from 'react';
import VoucherTemplate from 'components/templates/VoucherTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoucher } from 'redux/actions';
import { useRouter } from 'next/router';
import { fetchCachedTheme, getLocalStorage, removeLocalStorage, VOUCHER_CONST } from 'helper';
import toast from 'react-hot-toast';
import usePartnerInfo from 'hooks/usePartnerInfo';

const Voucher = (props) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const { transaction_xid, token, presc_id, token_order }: any = router.query;
	const { transaction }: any = useSelector((state) => state);

	const voucherByKeyword: string = transaction.keyword;
	const params = {
		token: presc_id ? token_order : token,
		transaction_xid: transaction_xid,
		code: voucherByKeyword,
		presc_id: presc_id ?? '',
	};

	usePartnerInfo({ ...props, token: presc_id ? token_order : (token as string) });

	const toastVoucherHandler = async () => {
		const voucherToast = await getLocalStorage(VOUCHER_CONST.VOUCHER_TOAST);
		if (voucherToast) {
			toast.success(voucherToast, {
				style: { marginBottom: 65 },
			});
			setTimeout(async () => {
				await removeLocalStorage(VOUCHER_CONST.VOUCHER_TOAST);
			}, 1000);
		}
	};

	React.useEffect(() => {
		dispatch(fetchVoucher(params));
		toastVoucherHandler();
	}, [dispatch]);

	return (
		<VoucherTemplate transaction={transaction} transaction_xid={transaction_xid} token={token} />
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

export default Voucher;
