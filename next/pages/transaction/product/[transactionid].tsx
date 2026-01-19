import { useCallback, useEffect, useState } from 'react';

import { TransactionDetailTemplate } from '@templates';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetailTransaction } from 'redux/actions';
import { setIsPageLoading } from 'redux/trigger';
import {
	LOCALSTORAGE,
	ORDER_TYPE,
	getParsedLocalStorage,
	fetchCachedTheme,
	navigateFromTrxCondition,
	storePathValues,
} from '../../../helper';
import useTheme from 'hooks/useTheme';
import { PartnerTheme } from '@types';

interface Props {
	transactionid: string;
}

const ProductDetailTransaction = (props: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();

	// global state
	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);
	const [themeData, setThemeData] = useState<PartnerTheme>();
	useTheme({ router, setThemeData });
	usePartnerInfo({
		...(router.query.token_order || router.query.order_token
			? {
					token: (router.query.token_order || router.query.order_token) as string,
					theme: themeData,
			  }
			: { isByLocal: true }),
	});

	const [currToken, setCurrToken] = useState('');

	const handleOrderConsul = useCallback(async () => {
		navigateFromTrxCondition(
			{
				...productTransactionDetail?.result,
				xid: productTransactionDetail?.result?.xid ?? props?.transactionid,
			},
			currToken,
			ORDER_TYPE.PRODUCT,
		);
	}, [currToken, router.query, productTransactionDetail?.result, props?.transactionid]);

	const goToShippingStatus = useCallback(async () => {
		const q = {
			token: currToken,
			transaction_xid: productTransactionDetail?.result?.xid ?? props?.transactionid,
			transaction_id: props?.transactionid,
		};
		router.push({
			pathname: '/order/track',
			query: q,
		});
	}, [currToken, router.query, productTransactionDetail?.result, props?.transactionid]);

	const handleHowToPay = useCallback(() => {
		if (
			productTransactionDetail?.result?.deeplink_url ||
			productTransactionDetail?.result?.invoice_url
		) {
			window.location.href =
				productTransactionDetail?.result?.deeplink_url ||
				productTransactionDetail?.result?.invoice_url;
		} else {
			router.push({
				pathname: '/payment/waiting-payment',
				query: {
					token: currToken,
					transaction_xid: props?.transactionid ?? productTransactionDetail?.result?.xid,
					methodId:
						productTransactionDetail?.result?.payment_method?.id ?? router.query?.methodId,
					presc: 1,
					token_order: currToken,
				},
			});
		}
	}, [
		currToken,
		router.query,
		productTransactionDetail?.payment_method,
		productTransactionDetail?.result,
	]);

	useEffect(() => {
		storePathValues();
		if (router?.query && props?.transactionid) {
			const params = { id: props?.transactionid, token: router?.query?.token };
			const payload = { params, props };
			dispatch(fetchProductDetailTransaction(payload));
			checkToken();
		}
	}, [props?.transactionid, router?.query]);

	useEffect(() => {
		if (!productTransactionDetail?.result) {
			setIsPageLoading(true);
		}
	}, []);

	const checkToken = async () => {
		const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		const token = router?.query?.token_order
			? router?.query?.token_order
			: router?.query?.token
			? router?.query?.token
			: order?.partnerToken;
		setCurrToken(token);
	};

	return (
		<TransactionDetailTemplate
			data={{
				...productTransactionDetail?.result,
				xid: productTransactionDetail?.result?.xid ?? props?.transactionid,
				token_order: currToken,
				type: ORDER_TYPE.PRODUCT,
			}}
			type="product"
			handleOrderConsul={handleOrderConsul}
			goToStatusShipping={goToShippingStatus}
			handleHowToPay={handleHowToPay}
			transaction_id={props.transactionid}
		/>
	);
};

export const getServerSideProps = async ({ query, params }) => {
	const response = await fetchCachedTheme(query?.token_order ?? query?.token);

	let result: any = { props: {} };

	if (response?.meta?.acknowledge) {
		result = {
			...result,
			props: {
				theme: response?.data,
				transactionid: params?.transactionid,
			},
		};
	}

	return result;
};

export default ProductDetailTransaction;
