import React from 'react';
import TagManager from 'react-gtm-module';
import OrderDetailTemplate from 'components/templates/OrderDetailTemplate';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { checkValidateVoucher, fetchDetailTransaction } from 'redux/actions';
import {
	checkIsEmpty,
	fetchCachedTheme,
	getTransactionDetail,
	setCRPartner,
	showToast,
	STATUS_CONST,
	storePathValues,
	VOUCHER_CONST,
} from 'helper';
import useCheckPartner from 'hooks/useCheckPartner';
import usePartnerInfo from 'hooks/usePartnerInfo';

const OrderDetail = (props: any) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { transaction_xid, token, backto, ct }: any = router.query;

	usePartnerInfo({ ...props, token: token as string });
	useCheckPartner({ token, query: router.query, from: '/order/detail' });

	React.useEffect(() => {
		storePathValues();
		const params = { id: transaction_xid, token: token };
		const payload = { params, props };

		const tagManagerArgs = {
			dataLayer: {
				transactionId: props?.initialData?.transaction_id,
			},
			dataLayerName: 'PageDataLayer',
		};

		TagManager.dataLayer(tagManagerArgs);

		dispatch(fetchDetailTransaction(payload));
	}, []);

	React.useEffect(() => {
		try {
			const voucherToast = localStorage.getItem(VOUCHER_CONST.VOUCHER_TOAST);
			if (!checkIsEmpty(voucherToast)) {
				setTimeout(() => {
					showToast(voucherToast, { marginBottom: 70 }, 'success');
					localStorage.removeItem(VOUCHER_CONST.VOUCHER_TOAST);
				}, 500);
			}
		} catch (error) {
			console.log('error on toast : ', error);
		}
		dispatch(checkValidateVoucher(transaction_xid, token));
		checkCRToken();
	}, [router]);

	const checkCRToken = async () => {
		try {
			if (ct && transaction_xid) {
				setCRPartner(ct, { xid: transaction_xid });
			}
		} catch (error) {
			console.log('error on check cr token : ', error);
		}
	};

	return <OrderDetailTemplate transaction_xid={transaction_xid} token={token} />;
};

export const getServerSideProps = async ({ req, res, query }) => {
	const params = { id: query?.transaction_xid, token: query?.token };
	const response = await getTransactionDetail(params);
	const responseTheme = await fetchCachedTheme(query?.token as string, { req, res });
	try {
		if (response?.meta?.acknowledge) {
			if (response?.data?.payment_status == STATUS_CONST.CREATED) {
				return {
					props: {
						initialData: response?.data,
						theme: responseTheme?.data,
					},
				};
			}
			// need to groom, what was expected? if payment still pending / done?
			// else if (
			// 	response?.data?.payment_status == STATUS_CONST.SUCCESS ||
			// 	response?.data?.payment_status == STATUS_CONST.FAILED ||
			// 	response?.data?.payment_status == STATUS_CONST.CANCELLED ||
			// 	response?.data?.payment_status == STATUS_CONST.EXPIRED ||
			// 	response?.data?.payment_status == STATUS_CONST.PENDING
			// ) {
			// 	return {
			// 		redirect: {
			// 			destination:
			// 				'/payment/waiting-payment?token=' +
			// 				query?.token +
			// 				'&transaction_xid=' +
			// 				query?.transaction_xid +
			// 				'&checked=1' +
			// 				(query?.ct ? '&ct=' + query?.ct : ''),

			// 			permanent: false,
			// 		},
			// 	};
			// }
			else {
				return {
					redirect: {
						destination:
							'/payment/waiting-payment?token=' +
							query?.token +
							'&transaction_xid=' +
							query?.transaction_xid +
							'&checked=1' +
							(query?.ct ? '&ct=' + query?.ct : ''),
						permanent: false,
					},
				};
			}
		}
	} catch (error) {
		console.log('error on server side props order detail : ', error);
	}

	return { props: {} };
};

export default OrderDetail;
