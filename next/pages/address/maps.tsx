import React from 'react';
import { AddressMapPageTemplate } from 'components/templates';
import { useRouter } from 'next/router';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { PartnerTheme } from '@types';
import { checkIsEmpty, fetchCachedTheme, getConsultationDetailPartner } from 'helper';

const AddressMaps = (props?: { theme?: PartnerTheme; partnerToken?: string }) => {
	const router = useRouter();
	const { token, ct, backto, token_order } = router.query;

	usePartnerInfo({
		...(!checkIsEmpty(props?.theme)
			? { theme: props.theme, token: props?.partnerToken || ((token_order || token) as string) }
			: { isByLocal: true }),
	});

	return <AddressMapPageTemplate token={token} ct={ct} backto={backto} />;
};

export const getServerSideProps = async ({ req, res, query }) => {
	try {
		// get consultation partner ---> getting order token
		let resPartner: any;
		if (query?.ct || query?.crt) {
			resPartner = await getConsultationDetailPartner(query?.ct || query?.crt);
		}

		const token = resPartner?.data?.partner?.token || query?.token_order || query?.token;
		const response = await fetchCachedTheme(token, { req, res });

		if (response?.meta?.acknowledge) {
			return {
				props: {
					...(checkIsEmpty(resPartner?.data?.partner?.token)
						? {}
						: { partnerToken: resPartner?.data?.partner?.token }),
					theme: response?.data,
				},
			};
		}
	} catch (error) {
		console.error('error on getdata  : ', error, query?.token);
		return {
			props: {},
		};
	}
};

export default AddressMaps;
