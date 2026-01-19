import { PartnerTheme } from '@types';
import { checkIsEmpty, fetchCachedTheme, getParsedLocalStorage, LOCALSTORAGE } from 'helper';
import { NextRouter } from 'next/router';
import { useEffect } from 'react';

const useTheme = (props?: {
	router?: NextRouter;
	token?: string;
	setPartnerToken?: (token: string) => void;
	setThemeData?: (theme: PartnerTheme) => void;
}): void => {
	const fetchTheme = async () => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const responseTheme = await fetchCachedTheme(
			props?.token || props.router?.query?.token || orders?.partnerToken,
		);
		if (!checkIsEmpty(props.setPartnerToken))
			props.setPartnerToken(props.router?.query?.token || orders?.partnerToken);
		if (!checkIsEmpty(props.setThemeData)) props.setThemeData(responseTheme?.data);
	};

	useEffect(() => {
		fetchTheme();
	}, []);
};

export default useTheme;
