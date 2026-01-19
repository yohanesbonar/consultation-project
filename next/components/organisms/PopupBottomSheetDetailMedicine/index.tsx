/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { IconCloseGray, IconNotes } from '@icons';
import { ImgMedPlaceholder } from '@images';
import style from './index.module.css';
import { checkIsEmpty } from 'helper';

type Props = {
	show: boolean;
	onShow: (val: boolean) => void;
	data?: any;
};

const PopupBottomSheetDetailMedicine = ({ show, onShow, data }: Props) => {
	const desc = data?.description || data?.short_description || data?.indication;
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
					<p className="title-18-medium tw-ml-4 tw-mb-0">Detail obat</p>
				</div>
			}
		>
			<div className="tw-px-4 tw-max-h-[70vh] tw-overflow-y-scroll">
				<div className={style.medicineWrapper}>
					<img
						src={data?.productImage ?? ImgMedPlaceholder.src}
						alt="med"
						className="tw-w-10 tw-h-10 tw-rounded-4"
					/>
					<p className="title-14-medium tw-mb-0 tw-ml-3">{data?.name ?? '-'}</p>
				</div>

				{checkIsEmpty(desc) ? (
					<div className="tw-flex tw-flex-col tw-items-center tw-my-10">
						<IconNotes />

						<p className="label-14-medium tw-mt-3 tw-mb-0">
							Maaf, Detail Deskripsi Obat Tidak Tersedia
						</p>
					</div>
				) : (
					<p>{desc}</p>
				)}
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomSheetDetailMedicine;
