import React from 'react';
import SuccessRejectOrder from 'components/templates/RejectOrderTemplate/SuccessRejectOrder';
import { ButtonHighlight } from '@atoms';
import { Wrapper } from '@organisms';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetailTransaction } from 'redux/actions';
import { fetchCachedTheme, navigateWithQueryParams, openMailApp } from 'helper';
import usePartnerInfo from 'hooks/usePartnerInfo';

const ProductRefundSuccess = (props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { token, xid, token_order }: any = router.query;
	usePartnerInfo({ ...props, token: (token_order ?? token) as string });
	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);

	const goToDetailTransaction = () => {
		navigateWithQueryParams(
			`/transaction/product/${router.query?.xid}`,
			{ token: router.query?.token, presc: router.query?.presc },
			'href',
		);
	};

	const handleMailBtn = () => {
		openMailApp(productTransactionDetail?.result?.patient_email);
	};

	const renderFooter = () => {
		return (
			<div className="tw-p-4">
				<ButtonHighlight onClick={handleMailBtn}>OKE</ButtonHighlight>
				<ButtonHighlight
					onClick={goToDetailTransaction}
					classNameBtn="!tw-bg-monochrome-150 !tw-text-secondary-def tw-border-none tw-mt-2"
				>
					DETAIL TRANSAKSI
				</ButtonHighlight>
			</div>
		);
	};

	React.useEffect(() => {
		const params = { id: xid, token: token };
		const payload = { params };
		dispatch(fetchProductDetailTransaction(payload));
	}, [router.query]);

	return (
		<Wrapper
			footer
			isCloseIcon
			title=""
			metaTitle="Form Refund"
			additionalClassNameContent="tw-p-4"
			footerComponent={renderFooter()}
			onClickBack={handleMailBtn}
		>
			<SuccessRejectOrder />
		</Wrapper>
	);
};

export const getServerSideProps = async ({ query }) => {
	const response = await fetchCachedTheme(query?.token_order ?? query?.token);

	return {
		props: { theme: response?.data },
	};
};

export default ProductRefundSuccess;
