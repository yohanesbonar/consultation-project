import React from 'react';
import { RejectOrderTemplate } from '@templates';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { fetchProductDetailTransaction } from 'redux/actions';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { fetchCachedTheme } from 'helper';

const ProductRefund = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { token, transaction_id, token_order }: any = router.query;
	usePartnerInfo({ ...props, token: (token_order ?? token) as string });

	React.useEffect(() => {
		const params = { id: transaction_id, token: token };
		const payload = { params };
		dispatch(fetchProductDetailTransaction(payload));
	}, [router.query]);

	return <RejectOrderTemplate />;
};

export const getServerSideProps = async ({ query }) => {
	const response = await fetchCachedTheme(query?.token_order ?? query?.token);

	return {
		props: { theme: response?.data },
	};
};

export default ProductRefund;
