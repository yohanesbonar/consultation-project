import React, { useEffect, useState } from 'react';
import EmailPageTemplate from 'components/templates/EmailPageTemplate';
import { useRouter } from 'next/router';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { PartnerTheme } from '@types';
import { fetchCachedTheme, getParsedLocalStorage, LOCALSTORAGE } from 'helper';

const EmailPage = () => {
	const router = useRouter();
	const { email } = router.query;

	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');

	usePartnerInfo({ theme: themeData, token: partnerToken });

	const fetchTheme = async () => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const responseTheme = await fetchCachedTheme(router?.query?.token || orders?.partnerToken);
		setPartnerToken(router?.query?.token || orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	useEffect(() => {
		fetchTheme();
	}, []);

	return <EmailPageTemplate email={email} />;
};

export default EmailPage;
