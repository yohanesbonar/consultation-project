/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { BUTTON_CONST } from 'helper';
import { ButtonHighlight } from '../../atoms';
import { IconCloseGray, IconLocationGraySM } from '@icons';
import { ImgMedPlaceholder, ImgPharmacyThumb } from '@images';
import style from './index.module.css';

type Props = {
	data?: any;
	loading: boolean;
	disabled: boolean;
	show: boolean;
	onSubmit?: () => void;
	onShow: (val: boolean) => void;
};

const PopupBottomSheetDetailPharmacy = ({
	show,
	onShow,
	data,
	onSubmit,
	loading,
	disabled,
}: Props) => {
	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<ButtonHighlight
					// isDisabled={loading || disabled}
					isDisabled={loading}
					isLoading={loading}
					onClick={onSubmit}
					// text={loading || disabled ? BUTTON_CONST.TERPILIH : BUTTON_CONST.PILIH}
					text={BUTTON_CONST.PILIH}
					circularContainerClassName="tw-h-4"
					circularClassName="circular-inner-16"
				/>
			</div>
		);
	};

	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) onShow(false);
			}}
			headerComponent={
				<div className="tw-m-4 tw-flex">
					<span onClick={() => onShow(false)}>
						<IconCloseGray />
					</span>
					<p className="title-18-medium tw-ml-4 tw-mb-0">Detail Apotek</p>
				</div>
			}
			footerComponent={renderFooterButton()}
		>
			<div className="tw-px-4">
				<div className={style.merchentWrapper}>
					<div>
						<p className="label-14-medium tw-mb-1">{data?.merchant?.merchant_name}</p>

						<div className="tw-flex tw-text-tpy-700">
							<IconLocationGraySM />
							<p className={style.locationLabel}>{data?.distance_label}</p>
						</div>
					</div>
					<img className="tw-w-10 tw-h-10" src={ImgPharmacyThumb.src} alt="thumb" />
				</div>

				{data?.products &&
					data?.products?.map((item: any, i: number) => {
						return (
							<div key={i} className={style.medicineWrapper}>
								<img src={ImgMedPlaceholder.src} alt="med" />
								<div className="tw-ml-4">
									<p className="title-14-medium tw-mb-0">{item?.product_name}</p>
									<p className={style.qtyLabel}>{item?.qty} barang</p>
									<p className="title-14-medium tw-mb-0">{item?.total_price_label}</p>
								</div>
							</div>
						);
					})}
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomSheetDetailPharmacy;
