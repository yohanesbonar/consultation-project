import React, { useState } from 'react';
import { ShippingTrackInfo, VerticalTracking, Wrapper } from '@organisms';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetailTransaction } from 'redux/actions';
import styles from './index.module.css';
import { checkIsEmpty, STATUS_CONST } from 'helper';
import useTheme from 'hooks/useTheme';
import { PartnerTheme } from '@types';
import usePartnerInfo from 'hooks/usePartnerInfo';

const OrderShippingTemplate = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { token, transaction_id, transaction_xid } = router.query;

	const [themeData, setThemeData] = useState<PartnerTheme>();
	useTheme({ router, setThemeData });

	usePartnerInfo(
		checkIsEmpty(token) ? { isByLocal: true } : { theme: themeData, token: token as string },
	);

	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);

	const shippingStatus = productTransactionDetail?.result?.shipping_status;

	const tracking =
		productTransactionDetail?.result?.shipment_tracking
			?.sort((a: any, b: any) => b?.sequence - a?.sequence)
			.map((v: any, i: number) => {
				return {
					id: i,
					title: v?.title,
					subtitle: v?.body,
					date: v?.datetime?.split('jam')[0],
					time: v?.datetime?.split('jam')[1],
					isLatest: i == 0,
				};
			}) || [];

	React.useEffect(() => {
		if (router?.query) {
			const params = { id: transaction_id, token: token };
			const payload = { params };
			dispatch(fetchProductDetailTransaction(payload));
		}
	}, [token, transaction_id, transaction_xid]);

	return (
		<Wrapper title="Lacak Pengiriman" metaTitle="Lacak Pengiriman">
			<ShippingTrackInfo
				expedition={productTransactionDetail?.result?.shipping_method?.method_title}
				resi={
					productTransactionDetail?.result?.shipping_method?.resi ||
					productTransactionDetail?.result?.shipping_method?.airway_bill ||
					'-'
				}
				send_date={productTransactionDetail?.result?.shipping_method?.shipped_at || '-'}
				estimation_date={
					productTransactionDetail?.result?.shipping_method?.estimated_arrive || '-'
				}
			/>

			<div className={styles.rectangle} />

			<div className="tw-px-4">
				<VerticalTracking
					data={tracking}
					isRejected={shippingStatus == STATUS_CONST.REJECTED}
				/>
			</div>
		</Wrapper>
	);
};

export default OrderShippingTemplate;
