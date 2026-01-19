import React, { useEffect } from 'react';
import FLatlistTab from 'components/organisms/FlatlistTab';
import TransactionCard from 'components/organisms/TransactionCard';
import styles from './index.module.css';
import cx from 'classnames';
import { ButtonGroup, Wrapper } from '@organisms';
import { LABEL_CONST, ORDER_TYPE, PAGE_ID } from 'helper';
import { filterTab } from 'helper';
import { EmptyTransaction } from '@images';
import { ImageLoading } from '@atoms';
import { IconConsultation, IconPrescription } from '@icons';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

interface TransactionHistoryTemplateProps {
	setHistoryStatus: any;
	onRefresh?: () => void;
	activeTab: number;
	setActiveTab: (val: number) => void;
	onLoadMore?: () => void;
	historyStatus?: string;
}

const TransactionHistoryTemplate: React.FC<TransactionHistoryTemplateProps> = ({
	setHistoryStatus,
	onRefresh = () => {
		console.log('onrefresh');
	},
	activeTab,
	setActiveTab,
	onLoadMore,
	historyStatus = 'all',
}) => {
	const router = useRouter();
	const historyData = useSelector(({ transaction }) => transaction?.history);
	const isLoadMore = historyData?.loading;

	const [filter, setFilter] = React.useState([]);
	const [isProduct, setIsProduct] = React.useState(false);

	useEffect(() => {
		if (router != null) {
			if (
				(activeTab > -1 && activeTab === 1) ||
				(activeTab == -1 && router?.query.type == ORDER_TYPE.PRODUCT)
			) {
				setIsProduct(true);
				setFilter(filterTab(true));
			} else {
				setFilter(filterTab(false));
			}
		}
	}, [router, activeTab]);

	const renderBtnGroupTab = () => {
		const items = [
			{
				prefixIcon: <IconConsultation />,
				classNameBtn: cx(
					styles.buttonFilter,
					activeTab === 1 ? styles.nonActiveTab : styles.activeTab,
				),
				label: LABEL_CONST.DOCTOR_CONSULTATION,
				onClick: () => {
					setActiveTab(0);
					setFilter(filterTab(isProduct));
				},
			},
			{
				prefixIcon: <IconPrescription />,
				classNameBtn: cx(
					styles.buttonFilter,
					activeTab === 1 ? styles.activeTab : styles.nonActiveTab,
				),
				label: LABEL_CONST.PRESCRIPTION,
				onClick: () => {
					setActiveTab(1);
					setFilter(filterTab(isProduct));
				},
			},
		];
		return (
			<div className="tw-px-4 tw-pb-3">
				<ButtonGroup items={items} />
			</div>
		);
	};

	const handleLoadMore = (e: any) => {
		const isAtBottom = e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight;

		if (isAtBottom && !isLoadMore) onLoadMore();
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.PAYMENT_HISTORY}
			title="Riwayat Transaksi"
			metaTitle="Riwayat Transaksi"
			header={true}
			isHandleOnScroll
			onScroll={onRefresh}
			disableBackButton={true}
			additionalInnerHeaderComponent={renderBtnGroupTab()}
			handleOnScroll={handleLoadMore}
		>
			<div className="tw-flex tw-flex-col tw-p-4">
				<FLatlistTab
					data={filter}
					setHistoryStatus={setHistoryStatus}
					selected={historyStatus}
				/>
				{historyData?.loading && !historyData?.result ? (
					<div className="tw-w-full">
						{Array.apply(0, Array(2)).map((x, i) => (
							<TransactionCard
								key={i}
								classContainer="tw-mt-4"
								isLoading={historyData?.loading}
							/>
						))}
					</div>
				) : historyData?.result && historyData?.result?.length > 0 ? (
					historyData?.result?.map((val, index) => (
						<TransactionCard
							key={index}
							classContainer="tw-mt-4"
							data={val}
							token={
								(activeTab > -1 && activeTab === 1) ||
								(activeTab == -1 && router?.query.type == ORDER_TYPE.PRODUCT)
									? router?.query?.token
									: historyData?.token
							}
							isPrescription={activeTab === 1}
							activeTab={activeTab}
						/>
					))
				) : (
					<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col tw-mt-14">
						<div className="tw-relative tw-w-[240px] tw-h-[240px]">
							<ImageLoading data={{ url: EmptyTransaction?.src }} />
						</div>
						<div className="tw-mt-[20px]">
							<p className="title-18-medium tw-mb-0 tw-text-center">Belum Ada Transaksi</p>
							<p className="body-14-regular tw-mt-2 tw-mb-0 tw-text-center">
								Belum ada riwayat transaksi untuk status transaksi yang terpilih. Silakan
								coba status lainnya
							</p>
						</div>
					</div>
				)}
				{isLoadMore && historyData?.result?.length > 0 && (
					<TransactionCard classContainer="tw-mt-4" isLoading />
				)}
			</div>
		</Wrapper>
	);
};

export default TransactionHistoryTemplate;
