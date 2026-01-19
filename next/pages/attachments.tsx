import React, { useEffect, useState } from 'react';
import { AttachmentsTemplate } from '../components/index.js';
import {
	LOCALSTORAGE,
	fetchCachedTheme,
	getParsedLocalStorage,
	getStorageParseDecrypt,
} from 'helper/index.js';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { PartnerTheme } from '@types';

const Attachments = () => {
	const [data, setData] = useState<any>();
	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');

	usePartnerInfo({ theme: themeData, token: partnerToken });

	const fetchTheme = async () => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const responseTheme = await fetchCachedTheme(orders?.partnerToken);
		setPartnerToken(orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	useEffect(() => {
		fetchTheme();
		getData();
	}, []);

	const getData = async () => {
		const attachmentData = await getStorageParseDecrypt(LOCALSTORAGE.ATTACHMENT);
		if (attachmentData) {
			setData(attachmentData);
		}
	};

	return <AttachmentsTemplate data={data} />;
};

export default Attachments;
