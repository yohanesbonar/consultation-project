import { TransactionRefundtemplate } from '@templates';
import { DetailTransactionData, PartnerTheme } from '@types';
import {
	LOCALSTORAGE,
	MESSAGE_CONST,
	checkIsEmpty,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	getTransactionDetail,
	storePathValues,
} from 'helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { setErrorAlertRedux } from 'redux/trigger';
import usePartnerInfo from 'hooks/usePartnerInfo';
import useTheme from 'hooks/useTheme';

const TransactionRefund = () => {
	const router = useRouter();
	const [data, setData] = useState<DetailTransactionData>();
	const [currToken, setCurrToken] = useState('');
	const [currXid, setCurrXid] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [themeData, setThemeData] = useState<PartnerTheme>();
	useTheme({ router, setThemeData });

	usePartnerInfo(
		checkIsEmpty(router?.query?.token)
			? { isByLocal: true }
			: { theme: themeData, token: router?.query?.token as string },
	);

	useEffect(() => {
		storePathValues();
		if (router?.query && !data) {
			getData();
		}
	}, [router?.query, data]);

	const getData = async () => {
		try {
			setIsLoading(true);
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const transactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);
			const tempToken = router.query?.token ?? temp?.token;
			setCurrToken(tempToken);

			const trxXidTemp = checkIsEmpty(router.query?.transaction_xid)
				? transactionData?.xid
				: router.query?.transaction_xid;
			setCurrXid(trxXidTemp);

			const res = await getTransactionDetail({
				id: trxXidTemp,
				token: tempToken,
			});
			if (res?.meta?.acknowledge) {
				setData(res?.data);

				const tagManagerArgs = {
					dataLayer: {
						transactionId: res.data?.transaction_id,
					},
					dataLayerName: 'PageDataLayer',
				};

				TagManager.dataLayer(tagManagerArgs);
			} else {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
			}
		} catch (error) {
			console.log('error on get data trx : ', error);
			setErrorAlertRedux({
				danger: true,
				data: {
					message: MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	const doSubmit = async (reason = '') => {
		try {
			setIsSubmitting(true);
			const contactUrl = data?.contact_url;
			const textToSend =
				contactUrl +
				'?text=' +
				encodeURIComponent(
					`Halo, saya ${
						data?.patient?.name ?? ''
					} hendak melakukan refund telekonsultasi karena saya ${reason?.toLowerCase()}. Nomor Invoice saya adalah ${
						data?.invoice_number
					}`,
				);

			window.open(textToSend);
		} catch (error) {
			console.log('error post refund : ', error);
			setErrorAlertRedux({
				danger: true,
				data: {
					message: MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<TransactionRefundtemplate
			data={data}
			doSubmit={doSubmit}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
		/>
	);
};
export default TransactionRefund;
