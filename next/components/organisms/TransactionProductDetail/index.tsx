import React, { useRef } from 'react';

import {
	COMPONENT_TYPE,
	LABEL_CONST,
	TRANSACTION_LABEL,
	numberToIDR,
	STATUS_CONST,
} from '../../../helper';
import { TextLabelSide } from '@molecules';
import { CardBox } from '@atoms';
import moment from 'moment';
import BadgeStatusConsul from 'components/atoms/BadgeStatusConsul';
import { connect } from 'react-redux';
import classNames from 'classnames';
import TransactionCart from '../TransactionCart';

interface Props {
	type?: 'product' | 'order';
	data?: any;
	isPageLoading?: boolean;
}

const TransactionProductDetail = ({ type = 'order', data, isPageLoading = false }: Props) => {
	const containerRef = useRef<any>(null);
	const badgeStatus = () => {
		if (data?.consultation_status) {
			return <BadgeStatusConsul type={data?.consultation_status} />;
		}
	};

	const renderBody = () => {
		return (
			<div>
				<div className="tw-flex tw-justify-between tw-items-center">
					<p className="tw-mb-0 tw-font-roboto tw-font-medium">
						{LABEL_CONST.DOCTOR_CONSULTATION}
					</p>
					{data?.payment_status !== STATUS_CONST.REFUNDED &&
						data?.payment_status !== STATUS_CONST.EXPIRED &&
						badgeStatus()}
				</div>
				<div className="tw-h-[1px] tw-w-full tw-bg-monochrome-300 tw-my-3" />
				<div className="tw-flex tw-flex-col tw-gap-3">
					<TextLabelSide
						data={{
							label: LABEL_CONST.DOCTOR,
							value: data?.specialist?.name,
							type: COMPONENT_TYPE.TEXT_START,
						}}
						classNameLabel="tw-w-[120px]"
						isLoading={isPageLoading}
					/>
					<TextLabelSide
						data={{
							label: LABEL_CONST.PATIENT_NAME,
							value: data?.patient?.name,
							type: COMPONENT_TYPE.TEXT_START,
						}}
						classNameLabel="tw-w-[120px]"
						isLoading={isPageLoading}
					/>
					<div className="tw-h-[1px] tw-w-full tw-border-0 tw-border-dashed tw-border-t-[1px] tw-border-monochrome-50" />
					<TextLabelSide
						data={{
							label: TRANSACTION_LABEL.PRICE,
							value: numberToIDR(data?.pricing_amount),
							type: COMPONENT_TYPE.TEXT_START,
						}}
						classNameLabel="tw-w-[120px]"
						isLoading={isPageLoading}
					/>
				</div>
			</div>
		);
	};

	const titleInfo = (
		<p className="tw-mb-0 tw-font-roboto font-12 tw-text-center">
			{data?.consultation_status === 'EXPIRED'
				? 'expired pada'
				: data?.consultation_status === STATUS_CONST.STARTED
				? 'berakhir'
				: 'gunakan sebelum'}{' '}
			<span className="tw-font-roboto tw-font-medium">
				{data?.consultation_status === STATUS_CONST.STARTED
					? data?.consultation_active_until
						? moment(data?.consultation_active_until).format('D MMM YYYY [jam] HH:mm')
						: '-'
					: data?.consultation_expired_at
					? moment(data?.consultation_expired_at).format('D MMM YYYY [jam] HH:mm')
					: '-'}
			</span>
		</p>
	);

	const renderBodyProductPrescription = () => (
		<TransactionCart
			type="product"
			disableEdit
			data={{
				...(data?.products?.length
					? {
							merchant: {
								name: data?.products[0]?.merchant_name ?? '-',
								img: data?.products[0]?.merchant_logo,
								location: data?.products[0]?.merchant_address,
							},
					  }
					: {}),
				updatedProducts: data?.products,
			}}
			idx={0}
			key={'transcationcart-' + 0}
		/>
	);

	return (
		<view className={classNames('tw-px-4', ' tw-my-5 tw-flex-1 tw-flex tw-flex-col tw-gap-4 ')}>
			<p className="tw-text-tpy-700 title-16-medium tw-mb-0">
				{data?.payment_status !== STATUS_CONST.REFUNDED
					? LABEL_CONST.PRODUCT_DETAIL
					: LABEL_CONST.PRODUCT_DETAIL_REFUND}
			</p>
			<CardBox
				classNameBody={type === 'product' ? '!tw-p-0' : ''}
				containerRef={containerRef}
				className={type === 'product' ? '' : 'card-border-16px tw-overflow-hidden '}
				title={
					type === 'product'
						? null
						: data?.consultation_expired_at && data?.payment_status !== STATUS_CONST.REFUNDED
						? titleInfo
						: ''
				}
				titleClass={
					type === 'product'
						? ''
						: classNames(
								data?.consultation_status === STATUS_CONST.STARTED
									? 'tw-bg-info-50 tw-text-info-700'
									: '',
								`tw-bg-primary-100 tw-text-error-600 tw-flex tw-flex-1 tw-justify-center`,
						  )
				}
				body={type === 'product' ? renderBodyProductPrescription() : renderBody()}
			/>
		</view>
	);
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionProductDetail);
