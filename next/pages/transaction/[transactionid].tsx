import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import {
	LOCALSTORAGE,
	STATUS_CONST,
	TOAST_CONST,
	fetchCachedTheme,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	getTransactionDetail,
	navigateFromTrxCondition,
	removeLocalStorage,
	setStringifyLocalStorage,
	showToast,
	storePathValues,
} from '../../helper';
import { GetStaticPaths, GetStaticProps } from 'next';
import { TransactionDetailTemplate } from '@templates';
import { DetailTransactionData, PartnerTheme } from '@types';
import TagManager from 'react-gtm-module';
import { connect } from 'react-redux';
import { setIsPageLoading as setIsPageLoadingRedux } from '../../redux/trigger';
import usePartnerInfo from 'hooks/usePartnerInfo';

interface Props {
	transactionid: string;
	general?: any;
}

const TransactionDetail = (props: Props) => {
	const router = useRouter();
	const [data, setData] = useState<DetailTransactionData>();
	const [currToken, setCurrToken] = useState('');
	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');

	usePartnerInfo({ theme: themeData, token: partnerToken });

	const fetchTheme = async (token = null) => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const responseTheme = await fetchCachedTheme(token || orders?.partnerToken);
		setPartnerToken(token || orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	const handleOrderConsul = useCallback(() => {
		navigateFromTrxCondition(data, currToken);
	}, [currToken, router, data]);

	const handleHowToPay = useCallback(() => {
		if (data?.deeplink_url || data?.invoice_url) {
			window.location.href = data?.deeplink_url || data?.invoice_url;
		} else {
			router.push({
				pathname: '/payment/waiting-payment',
				query: {
					token: currToken,
					transaction_xid: data?.xid,
					...(router?.query?.presc ? { presc: router?.query?.presc } : {}),
				},
			});
		}
	}, [currToken, router, data?.payment_method?.id, data?.payment_method?.type, data?.xid]);

	useEffect(() => {
		storePathValues();
		if (router?.query && props?.transactionid && !data) {
			getData();
		}
	}, [props?.transactionid, router?.query, data]);

	useEffect(() => {
		setIsPageLoadingRedux(true);
		return () => {
			setIsPageLoadingRedux(false);
		};
	}, []);

	const getData = async () => {
		try {
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const tempToken = router.query?.token ?? temp?.token;
			setCurrToken(tempToken);

			const res = await getTransactionDetail({
				id: props.transactionid,
				token: tempToken,
			});
			if (res?.meta?.acknowledge) {
				if (res?.data?.payment_status == STATUS_CONST.CREATED) {
					router.replace({
						pathname: '/order/detail',
						query: {
							transaction_xid: props?.transactionid,
							token: tempToken,
						},
					});
				} else {
					setData(res?.data);
					fetchTheme(res?.data?.transaction_token);

					await setStringifyLocalStorage(LOCALSTORAGE.TRANSACTION, res?.data);

					const tagManagerArgs = {
						dataLayer: {
							transactionId: res.data?.transaction_id,
						},
						dataLayerName: 'PageDataLayer',
					};

					TagManager.dataLayer(tagManagerArgs);
				}
			}
		} catch (error) {
			console.log('error on get data trx : ', error);
		} finally {
			setIsPageLoadingRedux(false);
			checkToast();
		}
	};

	const checkToast = async () => {
		try {
			const temp = await getParsedLocalStorage(TOAST_CONST.TRANSACTION_DETAIL_TOAST);
			if (temp && temp?.msg) {
				showToast(temp?.msg, {}, temp?.type);
				removeLocalStorage(TOAST_CONST.TRANSACTION_DETAIL_TOAST);
			}
		} catch (error) {
			console.log('error on check toast : ', error);
		}
	};

	return (
		<TransactionDetailTemplate
			data={data}
			handleOrderConsul={handleOrderConsul}
			handleHowToPay={handleHowToPay}
		/>
	);
};

export const getStaticPaths: GetStaticPaths<{
	transactionid: string;
}> = () => {
	return {
		paths: [],
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	return {
		props: params,
	};
};

const mapStateToProps = (state: any) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetail);
