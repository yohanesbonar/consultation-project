import React, { useEffect, useState } from 'react';
import {
	IconMinusBlue,
	IconMinusGray,
	IconPlusBlue,
	IconPlusGray,
	IconTrash,
	IconTrashDisable,
	ImgDefaultProduct,
} from '../../../assets';
import { ImageLoading } from '../../atoms';
import { numberToIDR } from 'helper';
import InputForm from '../InputForm';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';

interface Props {
	isLoading?: boolean;
	dataTemp: any;
	className?: string;
	idx: number;
	onChangeData: (val: any) => void;
	onClickDelete: () => void;
	onClickImage?: () => void;
	disableEdit?: boolean;
	productLength?: number;
}

const CartItem = ({
	isLoading = false,
	dataTemp,
	className,
	idx,
	onChangeData,
	onClickDelete,
	onClickImage,
	disableEdit,
	productLength = 0,
}: Props) => {
	const [tempQty, setTempQty] = useState('');

	useEffect(() => {
		if (dataTemp) {
			setTempQty((dataTemp?.updatedQty ?? dataTemp?.qty ?? 1)?.toString());
		}
	}, [dataTemp]);

	return (
		<div id={'cartproduct-' + idx} className={className}>
			<div
				className={classNames(
					idx === 0 || disableEdit ? 'tw-hidden' : '',
					'tw-mt-1 tw-mb-4',
					'tw-h-[1px] tw-w-full tw-border-0 tw-border-dashed tw-border-t-[1px] tw-border-monochrome-50 ',
				)}
			/>
			<div className={classNames('tw-flex tw-gap-4', disableEdit ? 'tw-mt-1' : '')}>
				<div className="tw-relative tw-h-10 tw-w-10 ">
					{isLoading ? (
						<Skeleton className="tw-w-full tw-h-full" />
					) : (
						<div onClick={onClickImage}>
							<ImageLoading
								className="tw-rounded"
								data={{
									url: dataTemp?.image ?? dataTemp?.productImage,
								}}
								fallbackImg={ImgDefaultProduct.src}
							/>
						</div>
					)}
				</div>
				<div
					className={classNames(
						'tw-flex tw-flex-1 tw-gap-4',
						disableEdit ? 'tw-flex-col !tw-gap-1' : '',
					)}
				>
					<p className="title-14-medium tw-flex-1 tw-mb-0">
						{isLoading ? <Skeleton /> : dataTemp?.name}
					</p>
					{disableEdit ? (
						<p className="body-12-regular tw-text-tpy-700 tw-flex-1 tw-mb-0">
							{isLoading ? (
								<Skeleton width={120} />
							) : (
								(dataTemp?.updatedQty ?? dataTemp?.qty) + ' barang'
							)}
						</p>
					) : null}
					<p className="title-14-medium tw-mb-0">
						{isLoading ? <Skeleton width={100} /> : numberToIDR(dataTemp?.price)}
					</p>
				</div>
			</div>
			<div
				className={classNames(
					'tw-flex tw-mt-2 tw-gap-3 tw-items-center tw-justify-end ',
					disableEdit ? 'tw-hidden' : '',
				)}
			>
				<div
					className="tw-cursor-pointer"
					onClick={
						!isLoading && productLength > 1
							? () => {
									onClickDelete();
							  }
							: () => console.log('unable to delete last product')
					}
				>
					{!isLoading && productLength > 1 ? (
						<IconTrash className="tw-mr-1" />
					) : (
						<IconTrashDisable className="tw-mr-1" />
					)}
				</div>
				<div
					className="tw-cursor-pointer"
					onClick={() => {
						if (
							((dataTemp?.updatedQty && dataTemp?.updatedQty > 1) ||
								(!dataTemp?.updatedQty && dataTemp?.qty && dataTemp?.qty > 1)) &&
							!isLoading
						) {
							const valTemp = {
								...dataTemp,
								updatedQty:
									dataTemp?.updatedQty != null
										? dataTemp?.updatedQty > 1
											? dataTemp?.updatedQty - 1
											: dataTemp?.updatedQty
										: dataTemp?.qty != null && dataTemp?.qty > 1
										? dataTemp?.qty - 1
										: dataTemp?.qty,
							};
							onChangeData(valTemp);
						}
					}}
				>
					{((dataTemp?.updatedQty && dataTemp?.updatedQty > 1) ||
						(!dataTemp?.updatedQty && dataTemp?.qty && dataTemp?.qty > 1)) &&
					!isLoading ? (
						<IconMinusBlue />
					) : (
						<IconMinusGray />
					)}
				</div>
				{isLoading ? (
					<Skeleton className="tw-w-14 tw-h-[38px]" />
				) : (
					<InputForm
						className="!tw-mb-0 tw-w-14"
						inputClassName="tw-py-2 tw-text-center"
						data={{
							placeholder: '1',
							value: (tempQty ?? dataTemp?.updatedQty ?? dataTemp?.qty ?? 1).toString(),
							disabled: (dataTemp?.originalQty ?? dataTemp?.qty) == 1,
						}}
						onChange={(val: any) => {
							if (dataTemp?.qty != null && dataTemp?.qty > 1) {
								setTempQty(val?.value);
							}
						}}
						onBlur={() => {
							let valNum = parseInt(tempQty ? tempQty : '1');
							if (valNum < 1) {
								valNum = 1;
							} else if (valNum > dataTemp?.qty) {
								valNum = dataTemp?.qty;
							}
							const valTemp = {
								...dataTemp,
								updatedQty: valNum,
							};
							onChangeData(valTemp);
						}}
					/>
				)}
				<div
					className="tw-cursor-pointer"
					onClick={() => {
						if (
							(dataTemp?.updatedQty ?? dataTemp?.qty) <
								(dataTemp?.originalQty ?? dataTemp?.qty) &&
							!isLoading
						) {
							const valTemp = {
								...dataTemp,
								updatedQty:
									dataTemp?.updatedQty != null
										? dataTemp?.updatedQty < (dataTemp?.originalQty ?? dataTemp?.qty)
											? dataTemp?.updatedQty + 1
											: dataTemp?.updatedQty
										: dataTemp?.qty + 1,
							};
							onChangeData(valTemp);
						}
					}}
				>
					{(dataTemp?.updatedQty ?? dataTemp?.qty) <
						(dataTemp?.originalQty ?? dataTemp?.qty) && !isLoading ? (
						<IconPlusBlue />
					) : (
						<IconPlusGray />
					)}
				</div>
			</div>
		</div>
	);
};
export default CartItem;
