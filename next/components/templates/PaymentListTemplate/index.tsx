import React from 'react';
import { Wrapper } from '@organisms';
import CardListPayment from 'components/organisms/CardPayment/CardList';
import styles from './index.module.css';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import useBrowserNavigation from 'hooks/useBrowserNavigation';

type Props = {
	paymentList: any;
	choosePayment: (id: string, method?: any) => void;
	isCheckout?: boolean;
	isLoading?: boolean;
	totalAmount: number;
	emptyState?: any;
	onClickBack?: () => void;
};

const PaymentListTemplate = (props: Props) => {
	const {
		paymentList,
		choosePayment,
		isCheckout,
		isLoading = false,
		totalAmount,
		emptyState,
		onClickBack,
	} = props;
	const router = useRouter();

	useBrowserNavigation(() => {
		onClickBack();
	});

	const renderLoading = () =>
		[10].map((item: any, index: number) => (
			<div key={'loading-' + index} className={cx(styles.sectionList)}>
				<label className={styles.sectionLabel}>
					<Skeleton className="tw-w-40" />
				</label>
				{[1, 2, 3]?.map((method: any) => (
					<CardListPayment
						isLoading={true}
						key={'loading-card' + method}
						label={null}
						icon={null}
						payment_id={null}
					/>
				))}
			</div>
		));

	return (
		<Wrapper
			title="Pilih Metode Bayar"
			metaTitle="Pilih Metode Bayar"
			additionalStyleContent={{ overflow: 'auto' }}
			onClickBack={onClickBack}
		>
			{isCheckout && emptyState && emptyState()}
			{isLoading && !emptyState
				? renderLoading()
				: paymentList &&
				  paymentList?.map((item: any, index: number) =>
						isCheckout ? (
							<div
								key={index}
								className={cx(styles.sectionList, index === 0 && styles.rectangleShape)}
							>
								<label className={styles.sectionLabel}>{item[0].group_title}</label>
								{item?.map((method: any) => (
									<CardListPayment
										key={method?.id}
										label={method?.title}
										icon={method?.logo_url}
										payment_id={method?.id}
										choosePayment={(id) => choosePayment(id, method)}
									/>
								))}
							</div>
						) : (
							<div
								key={index}
								className={cx(styles.sectionList, index === 0 && styles.rectangleShape)}
							>
								<label className={styles.sectionLabel}>{item.label}</label>
								{item?.payment_methods?.map((method: any) => (
									<CardListPayment
										key={method.payment_method_id}
										label={method.payment_method_name}
										icon={method.icon}
										payment_id={method.payment_method_id}
										choosePayment={(id) => choosePayment(id, method)}
										minimumTotalInvoice={method.minimum_total_invoice}
										totalAmount={totalAmount}
									/>
								))}
							</div>
						),
				  )}
		</Wrapper>
	);
};

export default PaymentListTemplate;
