import React from 'react';
import { ProductComplainTemplate } from '@templates';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { fetchDashboardReason, fetchProductDetailTransaction } from 'redux/actions';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { fetchCachedTheme } from 'helper';

const ProductComplain = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	usePartnerInfo({ ...props, token: router.query.token_order ?? router.query.token });

	React.useEffect(() => {
		const { token, transaction_id } = router.query;
		dispatch(fetchDashboardReason(token));

		const params = { id: transaction_id, token: token };
		const payload = { params };
		dispatch(fetchProductDetailTransaction(payload));
	}, [router.query]);

	return <ProductComplainTemplate />;
};

export const getServerSideProps = async ({ query }) => {
	const response = await fetchCachedTheme(query?.token_order ?? query?.token);

	return {
		props: { theme: response?.data },
	};
};

export default ProductComplain;
