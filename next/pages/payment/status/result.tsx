import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import {
	LOCALSTORAGE,
	MESSAGE_CONST,
	STATUS_CONST,
	fetchCachedTheme,
	getParsedLocalStorage,
	getProductTransactionDetail,
	getStorageParseDecrypt,
	getTransactionDetail,
	navigateWithQueryParams,
	setCRPartner,
	setStringifyLocalStorage,
	storePathValues,
} from '../../../helper';
import { StatusResultTemplate } from '@templates';
import { toast } from 'react-hot-toast';
import usePartnerInfo from 'hooks/usePartnerInfo';

const StatusResult = (props) => {
	const router = useRouter();
	const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
	const [data, setData] = useState<any>();
	const [meta, setMeta] = useState<any>();
	const reFetchingDataRef = useRef<boolean>(true);

	usePartnerInfo({
		...props,
		token: (router.query?.token_order ?? router.query?.token) as string,
	});

	useEffect(() => {
		storePathValues();
	}, []);

	useEffect(() => {
		if (router?.query) {
			getData();
			checkCRToken();
		}
	}, [router]);

	const checkCRToken = async () => {
		try {
			if (router?.query?.ct && router.query?.transaction_xid) {
				setCRPartner(router.query?.ct as string, { xid: router.query?.transaction_xid });
			}
		} catch (error) {
			console.log('error on check cr token : ', error);
		}
	};

	const getData = async () => {
		try {
			setIsFetchingData(true);
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const resTransactionData = await getParsedLocalStorage(LOCALSTORAGE.TRANSACTION);
			const formValue = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			const orderToken = formValue?.partnerToken;

			const _token =
				router?.query?.token_order ??
				(!router?.query?.presc && router.query.token != null
					? router.query.token
					: orderToken ?? ((router.query.token ?? temp?.token) as string));

			const bodyReq = {
				id: (router.query?.transaction_xid ?? resTransactionData?.xid) as string,
				token: _token,
			};
			if (!(bodyReq?.id && bodyReq?.token)) {
				return;
			}
			const res = router?.query?.presc
				? await getProductTransactionDetail(bodyReq)
				: await getTransactionDetail(bodyReq);

			if (res?.meta?.acknowledge) {
				await setStringifyLocalStorage(LOCALSTORAGE.TRANSACTION, res?.data);

				// status refunded or success
				const isRefunded = res?.data?.payment_status === STATUS_CONST.REFUNDED;

				// shipping is rejected
				const isShippingRejected = res?.data?.shipping_status === STATUS_CONST.REJECTED;

				// status cancelled
				const isCancelled = res?.data?.payment_status === STATUS_CONST.CANCELLED;

				// status expired
				const isExpired =
					res?.data?.payment_status === STATUS_CONST.SUCCESS &&
					res?.data?.consultation_status === STATUS_CONST.EXPIRED;

				if (isRefunded || isCancelled || isExpired) {
					const path =
						router?.query?.presc || isShippingRejected
							? '/transaction/product/'
							: '/transaction/';

					navigateWithQueryParams(
						path + router.query?.transaction_xid,
						{
							token: _token,
							methodId: router.query?.methodId,
							source: 'partner',
							backurl: '1',
						},
						'href',
					);
					return;
				}
				if (res?.data?.payment_status === STATUS_CONST.PENDING && reFetchingDataRef.current) {
					reFetchingDataRef.current = false;
					setTimeout(() => {
						getData();
					}, 1000);
					return;
				} else {
					reFetchingDataRef.current = false;
					if (res?.data?.payment_status === STATUS_CONST.PENDING && data != null) {
						toast.dismiss();
						toast.error(MESSAGE_CONST.PAYMENT_NOT_COMPLETED_PLEASE_CHECK, {
							icon: null,
							className: '!tw-bg-error-def !tw-text-tpy-50 tw-mb-4',
						});
					}
					setData(res?.data);
					setMeta(res?.meta);
				}
			} else {
				// router.push('/not-found');
			}
			setIsFetchingData(false);
		} catch (error) {
			console.log('error on get data tnc : ', error);
			setIsFetchingData(false);
		}
	};

	return (
		<StatusResultTemplate
			data={data}
			type={data?.payment_status}
			isLoading={isFetchingData}
			fetchingData={() => {
				setIsFetchingData(true);
				setTimeout(() => {
					getData();
				}, 1000);
			}}
			meta={meta}
		/>
	);
};

export const getServerSideProps = async ({ req, res, query }) => {
	const responseTheme = await fetchCachedTheme((query?.token_order ?? query?.token) as string, {
		req,
		res,
	});
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

export default StatusResult;
