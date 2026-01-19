/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { BUTTON_CONST } from 'helper';
import { ButtonHighlight } from '../../atoms';
import { IconCloseGray, IconLocationGraySM } from '@icons';
import { ImgPharmacyThumb } from '@images';
import style from './index.module.css';

type Props = {
	show: boolean;
	onShow: (val: boolean) => void;
	data?: any;
	onNavigate?: () => void;
};

const PopupBottomSheetChoosePharmacy = ({ show, onShow, data, onNavigate }: Props) => {
	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<ButtonHighlight
					onClick={onNavigate}
					text={BUTTON_CONST.SEE_OTHER_MERCHENT}
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
					<p className="title-18-medium tw-ml-4 tw-mb-0">Apotek Partner</p>
				</div>
			}
			footerComponent={renderFooterButton()}
		>
			<div className="tw-px-4">
				<div className={style.wrapper}>
					<img className="tw-w-10 tw-h-10" src={ImgPharmacyThumb.src} alt="thumb" />
					<div className="tw-ml-3">
						<p className="label-14-medium tw-mb-1">
							{data?.merchant ? data?.merchant?.name : '-'}
						</p>

						<div className="tw-flex tw-mt-1 tw-text-tpy-700">
							<IconLocationGraySM />
							<p className={style.locationLabel}>{data?.merchant?.distance_label}</p>
						</div>
					</div>
				</div>
				<div className={style.detailLabel}>
					Obat akan dikirimkan ke lokasi kirim Anda dari apotek yang dipilih. Apotek merupakan
					partner dkonsul yang direkomendasikan untuk Anda.
				</div>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomSheetChoosePharmacy;
