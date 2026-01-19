import React, { useState } from 'react';
import {
	LABEL_CONST,
	LOCALSTORAGE,
	addLog,
	getParsedLocalStorage,
	numberToIDR,
} from '../../../helper';
import { connect, useDispatch } from 'react-redux';
import { IconCheckGreen, IconDelivery, IconRightBlue } from '@icons';
import { useSelector } from 'react-redux';
import { Text } from '@atoms';
import { fetchShippingMethod, setShipping } from 'redux/actions';
import classNames from 'classnames';
import PopupBottomsheet from '../PopupBottomsheet';
import Skeleton from 'react-loading-skeleton';
import Router, { useRouter } from 'next/router';
import { Spinner } from 'reactstrap';

interface Props {
	isPageLoading?: boolean;
	onChangeData: (val: any) => void;
	editablePhone?: boolean;
	selected?: any;
	isErrorShippingValidation?: boolean;
}

const ShippingMethod = (props: Props) => {
	const { isPageLoading = false, onChangeData, selected, isErrorShippingValidation } = props;
	const dispatch = useDispatch();
	const router = useRouter();
	const shippingData = useSelector(({ seamless }) => seamless.shippingList);
	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const dataMapping = shippingData?.data ? shippingData?.data : new Array(4).fill('');
	const [isShowModal, setIsShowModal] = useState(false);

	const closeBottomSheet = () => setIsShowModal(false);

	const onClickShipping = (item: any) => {
		if (!shippingData?.loading) {
			dispatch(
				setShipping(item, async () => {
					onChangeData(item);
					closeBottomSheet();
				}),
			);
		}
	};

	const onGetShipping = async () => {
		try {
			setIsShowModal(true);
			const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			const partnerToken = Router?.query?.token_order ?? order?.partnerToken;
			const presc_id = cartData?.result.id;
			const params = { id: presc_id, token: partnerToken };
			dispatch(fetchShippingMethod(params, closeBottomSheet));
		} catch (error) {
			console.log('error on getshipping', error);
			addLog({ error_get_shipping: error });
		}
	};

	const listShipping = (item?: any, index?: number) => (
		<div className="tw-mx-4 tw-flex-col" onClick={() => onClickShipping(item)} key={index}>
			{index !== 0 && <div className="tw-bg-monochrome-100 tw-w-full tw-h-[1px] tw-mt-2" />}
			<div className="tw-flex tw-mt-3 tw-gap-4">
				<div
					className={classNames(
						'tw-flex tw-flex-col tw-flex-1',
						shippingData?.submittingId != null
							? shippingData?.submittingId === item?.id
								? ''
								: 'tw-opacity-40'
							: '',
					)}
				>
					<Text
						skeletonClass="tw-h-4 tw-w-24"
						isLoading={shippingData?.loading}
						textClass="tw-mb-1 tw-font-roboto tw-font-medium"
					>
						{item?.carrier_title}
					</Text>
					<Text
						skeletonClass="tw-h-4 tw-w-40"
						isLoading={shippingData?.loading}
						textClass="tw-mb-0 tw-text-xs"
					>
						{item?.method_description}
					</Text>
				</div>
				<Text
					skeletonClass="tw-h-4 tw-w-20"
					isLoading={shippingData?.loading}
					textClass={classNames(
						'tw-mb-0 tw-font-roboto tw-font-medium tw-text-right',
						shippingData?.submittingId != null
							? shippingData?.submittingId === item?.id
								? ''
								: 'tw-opacity-40'
							: '',
					)}
				>
					{numberToIDR(item?.price)}
				</Text>
				{shippingData?.submittingId != null && shippingData?.submittingId === item?.id ? (
					<div className="tw-relative tw-self-center tw-h-5 tw-w-5">
						<div className="tw-absolute tw-h-5 tw-w-5 tw-rounded-full tw-border-solid tw-border-gray-200 tw-border-2" />
						<Spinner color="secondary" className="tw-h-5 tw-w-5 tw-border-2" />
					</div>
				) : null}
			</div>
		</div>
	);

	const renderItem = () => {
		if (shippingData?.loading) {
			return (
				<div className="tw-h-96">
					{new Array(6).fill('').map((item, index) => listShipping(item, index))}
				</div>
			);
		}
		return dataMapping.map((item: any, index: number) => listShipping(item, index));
	};

	return (
		<div className="tw-w-full">
			{isPageLoading ? (
				<div className="tw-p-4">
					<Skeleton className="tw-w-full tw-h-[42px]" />
				</div>
			) : (
				<div
					className={classNames(
						'tw-p-3 tw-m-4 tw-flex tw-items-center tw-gap-3',
						'tw-cursor-pointer',
						'tw-rounded-lg',
						'tw-border-solid tw-border-1',
						isErrorShippingValidation ? 'tw-border-error-def' : 'tw-border-gray-200',
					)}
					onClick={onGetShipping}
				>
					<div className="delivery-01-ic delivery-02-ic delivery-03-ic delivery-04-ic ">
						<IconDelivery />
					</div>
					{selected ? (
						<div className="tw-text-blue-30 tw-flex-1">
							<p className="tw-font-medium tw-mb-0">
								{`${selected?.carrier_title} (${numberToIDR(selected?.price)})`}
								<span className="tw-ml-1">
									<IconCheckGreen />
								</span>
							</p>
							<p className="tw-mb-0 tw-mt-0.5 tw-text-xs two-line-elipsis">
								{selected?.method_description ?? selected?.method_title}
							</p>
						</div>
					) : (
						<p
							className={classNames(
								'tw-mb-0 tw-flex tw-flex-1 tw-items-center',
								isErrorShippingValidation ? 'tw-text-error-def' : 'tw-text-secondary-def',
							)}
						>
							{LABEL_CONST.CHOOSE_SHIPPING}
						</p>
					)}
					<div className="tw-text-secondary-def">
						<IconRightBlue />
					</div>
				</div>
			)}

			<PopupBottomsheet
				expandOnContentDrag={false}
				isSwipeableOpen={isShowModal}
				setIsSwipeableOpen={(isOpen) => {
					if (!isOpen) closeBottomSheet();
				}}
				headerComponent={
					<div className="tw-mt-[36px] tw-mx-4">
						<p className="title-18-medium tw-text-left">{LABEL_CONST.CHOOSE_SHIPPING}</p>
					</div>
				}
			>
				<div className="tw-pb-4 tw-h-[70vh] tw-overflow-y-scroll">{renderItem()}</div>
			</PopupBottomsheet>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ShippingMethod);
