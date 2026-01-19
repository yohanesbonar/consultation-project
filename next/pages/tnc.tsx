import React, { useEffect, useState } from 'react';

import { TNCTemplate } from '../components';
import { useRouter } from 'next/router';
import {
	checkCookieSession,
	getMasterTnc,
	getMasterTncPartner,
	getStorageDecrypt,
	LOCALSTORAGE,
	MESSAGE_CONST,
	storePathValues,
	TNC_CONST,
} from '../helper';
import { setErrorAlertRedux } from '../redux/trigger';
import usePartnerInfo from 'hooks/usePartnerInfo';

const TNC = () => {
	const router = useRouter();
	const [tnc, setTnc] = useState('');

	useEffect(() => {
		storePathValues();
	}, []);

	// from local storage
	usePartnerInfo({
		isByLocal: true,
	});

	useEffect(() => {
		getData();
	}, [router?.query]);

	const getData = async () => {
		try {
			const xidFromLocal = await getStorageDecrypt(LOCALSTORAGE.XID);
			const res =
				router?.query?.xid || xidFromLocal
					? await getMasterTncPartner(router?.query?.xid ?? xidFromLocal)
					: await getMasterTnc();
			if (res?.meta?.acknowledge) {
				if (router?.query?.type == TNC_CONST.PRIVACY_POLICY) {
					setTnc(res?.data?.privacyPolicyTnc);
				} else {
					setTnc(res?.data?.tnc);
				}
			} else {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
			}
		} catch (error) {
			console.log('error on get data tnc : ', error);
		}
	};

	return <TNCTemplate tnc={tnc} />;
};

export const getServerSideProps = async ({ req, res, query }) => {
	const consulTime = await checkCookieSession(req, res);
	if (query?.type) {
		return { props: {} };
	} else if (
		(consulTime?.status != null && consulTime?.status != 'STARTED') ||
		consulTime?.timeLeft < 1 ||
		!consulTime
	) {
		return {
			notFound: true,
		};
	}
	return { props: {} };
};
export default TNC;
