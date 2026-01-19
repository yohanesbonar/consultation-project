import { PartnerTheme } from '@types';
import TransactionHistoryTemplate from 'components/templates/TransactionHistoryTemplate';
import { checkIsEmpty, ORDER_TYPE, storePathValues } from 'helper';
import usePartnerInfo from 'hooks/usePartnerInfo';
import useTheme from 'hooks/useTheme';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory, setTransactionHistory } from 'redux/actions';

const TransactionHistory = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const historyData = useSelector(({ transaction }) => transaction?.history);
	const [activeTabAndStatus, setActiveTabAndStatus] = useState({
		tab: -1,
		status: 'all',
	});

	const [pagination, setPagination] = useState({
		page: -1,
		limit: 10,
	});
	const initActiveTab = useRef(false);

	const [themeData, setThemeData] = useState<PartnerTheme>();
	useTheme({ router, setThemeData });
	usePartnerInfo({ theme: themeData, token: router?.query?.token as string });

	useEffect(() => {
		storePathValues();
	}, []);

	useEffect(() => {
		if (router?.isReady && !initActiveTab.current) {
			initActiveTab.current = true;
			setActiveTabAndStatus({
				tab: !checkIsEmpty(router?.query) && router?.query?.type == ORDER_TYPE.PRODUCT ? 1 : 0,
				status: 'all',
			});
		}
	}, [router?.query]);

	useEffect(() => {
		if (activeTabAndStatus.tab != -1) {
			resetState();
		}
	}, [activeTabAndStatus]);

	useEffect(() => {
		if (pagination?.page > -1) {
			getHistory();
		}
	}, [pagination]);

	const getHistory = async () => {
		try {
			dispatch(
				fetchHistory({
					type:
						(activeTabAndStatus?.tab > -1 && activeTabAndStatus?.tab === 1) ||
						(activeTabAndStatus?.tab == -1 && router?.query.type == ORDER_TYPE.PRODUCT)
							? ORDER_TYPE.PRODUCT
							: ORDER_TYPE.CONSULTATION,
					status: activeTabAndStatus?.status,
					page: pagination.page,
					limit: pagination.limit,
				}),
			);
		} catch (error) {
			console.log('error on get data history transaction : ', error);
			router.push('/not-found');
		}
	};

	const handleLoadMore = () => {
		if (historyData?.actualResults?.length !== 0)
			setPagination({ ...pagination, page: pagination.page + 1 });
	};

	const resetState = () => {
		dispatch(
			setTransactionHistory({
				...historyData,
				loading: true,
				result: null,
				error: false,
				actualResults: null,
				type:
					(activeTabAndStatus?.tab > -1 && activeTabAndStatus?.tab === 1) ||
					(activeTabAndStatus?.tab == -1 && router?.query.type == ORDER_TYPE.PRODUCT)
						? ORDER_TYPE.PRODUCT
						: ORDER_TYPE.CONSULTATION,
			}),
		);
		setPagination({
			page: 1,
			limit: 10,
		});
	};

	return (
		<TransactionHistoryTemplate
			setHistoryStatus={(status: string) => {
				setActiveTabAndStatus((prev) => ({
					tab: prev?.tab,
					status,
				}));
			}}
			historyStatus={activeTabAndStatus?.status ?? 'all'}
			onRefresh={resetState}
			activeTab={
				(activeTabAndStatus?.tab > -1 && activeTabAndStatus?.tab === 1) ||
				(activeTabAndStatus?.tab == -1 && router?.query.type == ORDER_TYPE.PRODUCT)
					? 1
					: 0
			}
			setActiveTab={(val: number) => {
				setActiveTabAndStatus({
					tab: val,
					status: 'all',
				});
			}}
			onLoadMore={handleLoadMore}
		/>
	);
};

export default TransactionHistory;
