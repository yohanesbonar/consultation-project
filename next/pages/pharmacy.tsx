import React from 'react';
import { PharmacyPageTemplate } from '@templates';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchMerchentList } from 'redux/actions';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { fetchCachedTheme } from 'helper';
import { PartnerTheme } from '@types';

const Pharmacy = (props?: { theme?: PartnerTheme }) => {
	const router = useRouter();
	const dispatch = useDispatch();

	usePartnerInfo({
		...props,
		token: (router?.query?.token_order as string) ?? (router?.query?.token as string),
	});

	React.useEffect(() => {
		const params = { presc_id: router.query?.presc_id, token: router.query?.token_order };
		dispatch(fetchMerchentList(params));
	}, [dispatch]);

	return <PharmacyPageTemplate />;
};

export const getServerSideProps = async ({ req, res, query }) => {
	try {
		const token = query?.token_order;
		const response = await fetchCachedTheme(token ?? (query?.token as string), { req, res });

		if (response?.meta?.acknowledge) {
			return {
				props: {
					theme: response?.data,
				},
			};
		}
		return {
			props: {},
		};
	} catch (error) {
		console.error('error on getdata  : ', error, query?.token);
		return {
			props: {},
		};
	}
};

export default Pharmacy;
