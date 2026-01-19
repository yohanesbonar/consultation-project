import React, { useEffect, useState } from 'react';

import {
	BUTTON_CONST,
	BUTTON_ID,
	COMPONENT_CONST,
	navigateWithQueryParams,
	SEAMLESS_CONST,
	getComponentConst,
} from '../../../helper';
import { CartItem } from '@molecules';
import { useSelector } from 'react-redux';
import { ButtonHighlight } from '@atoms';
import PopupModalInfo from '../PopupModalInfo';
import classNames from 'classnames';
import CardApotek from '../CardApotek';
import { useRouter } from 'next/router';
import PopupBottomSheetChoosePharmacy from '../PopupBottomSheetChoosePharmacy';
import PopupBottomSheetDetailMedicine from '../PopupBottomSheetDetailMedicine';

interface Props {
	forPage?: 'cart' | 'summary' | 'detail_transaction';
	type?: 'product' | 'order';
	data?: any;
	idx: number;
	onChangeData?: (val: any) => void;
	disableEdit?: boolean;
}

const TransactionCart = ({
	type = 'order',
	data,
	idx,
	onChangeData,
	disableEdit,
	forPage,
}: Props) => {
	const router = useRouter();
	const isPageLoading: boolean = useSelector(({ general }: any) => general?.isPageLoading);
	const [dataTemp, setDataTemp] = useState<any>(data);
	const [detailTemp, setDetailTemp] = useState<any>({});
	const [isShowingModal, setIsShowingModal] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState<any>();
	const [isShowDetailMerchent, setIsShowDetailMerchent] = React.useState<boolean>(false);
	const [isShowDetailMedicine, setIsShowDetailMedicine] = React.useState<boolean>(false);
	const noMerchentDetected = !data?.merchant || !data?.merchant?.name;

	useEffect(() => {
		if (data) setDataTemp(data);
	}, [data, type]);

	const toggleMerchent = () => setIsShowDetailMerchent(!isShowDetailMerchent);
	const toggleMedicine = () => setIsShowDetailMedicine(!isShowDetailMedicine);

	const onDetailMerchent = () => {
		toggleMerchent();
	};

	const navigateToChooseApotek = () => {
		navigateWithQueryParams(
			'/pharmacy',
			{ ...router.query, presc_id: data?.id, selectedMerchent: dataTemp?.merchant?.id },
			'href',
		);
	};

	return (
		<div
			className={classNames(
				type === 'product' ? '' : 'tw-px-4 tw-mt-4.5',
				'  tw-mb-4 tw-flex-1 tw-flex tw-flex-col tw-gap-3',
			)}
			id={'transactioncart-' + idx}
		>
			{type === 'product' ? null : (
				<div className="tw-mb-3">
					<p className="title-16-medium tw-text-tpy-700 tw-mb-0">{SEAMLESS_CONST.ITEM}</p>
					<p className="body-12-regular tw-mb-0">{SEAMLESS_CONST.SUB_ITEM}</p>
				</div>
			)}
			{!noMerchentDetected && !isPageLoading ? (
				<CardApotek
					data={data}
					loading={isPageLoading}
					onNavigate={navigateToChooseApotek}
					onDetail={onDetailMerchent}
					isCartpage={forPage === 'cart'}
				/>
			) : (
				''
			)}
			{!data?.merchant && !isPageLoading ? null : (
				<div className="tw-h-[1px] tw-w-full tw-bg-monochrome-300 tw-my-1" />
			)}

			{(isPageLoading
				? [1, 2]
				: dataTemp?.updatedProducts && dataTemp?.updatedProducts?.length
				? dataTemp?.updatedProducts
				: []
			)?.map((e: any, idxProduct: number) => (
				<CartItem
					isLoading={isPageLoading}
					disableEdit={disableEdit}
					productLength={dataTemp?.updatedProducts?.length}
					dataTemp={e}
					idx={idxProduct}
					key={'cartitem-' + idxProduct}
					onChangeData={(val: any) => {
						const temp = Object.assign({}, dataTemp);
						temp.updatedProducts[idxProduct] = val;
						setDataTemp(temp);
						onChangeData(temp);
					}}
					onClickDelete={() => {
						setItemToDelete(e);
						setIsShowingModal(true);
					}}
					onClickImage={() => {
						toggleMedicine();
						setDetailTemp(e);
					}}
				/>
			))}
			<PopupModalInfo
				isShowing={isShowingModal}
				setIsShowing={(isShow) => setIsShowingModal(isShow)}
				body={getComponentConst(COMPONENT_CONST.MODAL_DELETE_CART_ITEM, {
					title: itemToDelete?.name,
				})}
				footer={
					<div className="tw-flex tw-flex-col tw-flex-1 tw-gap-3">
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_CONFIRM}
							text={BUTTON_CONST.DELETE}
							// isLoading={isSubmitting}
							onClick={() => {
								const temp = Object.assign({}, dataTemp);
								if (temp?.updatedProducts) {
									temp.updatedProducts = temp.updatedProducts?.filter(
										(f: any) => f?.productId !== itemToDelete?.productId,
									);
								}
								setDataTemp(temp);
								onChangeData(temp);
								setIsShowingModal(false);
							}}
						/>
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_NO}
							color="grey"
							text={BUTTON_CONST.CANCEL_ACTION}
							onClick={() => {
								setItemToDelete(null);
								setIsShowingModal(false);
							}}
						/>
					</div>
				}
			/>
			<PopupBottomSheetChoosePharmacy
				onShow={toggleMerchent}
				show={isShowDetailMerchent}
				data={data}
				onNavigate={navigateToChooseApotek}
			/>

			<PopupBottomSheetDetailMedicine
				onShow={toggleMedicine}
				show={isShowDetailMedicine}
				data={detailTemp}
			/>
		</div>
	);
};

export default TransactionCart;
