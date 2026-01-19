import * as React from 'react';
import { ImgPharmacyThumb } from '@images';
import { IconLocationGraySM, IconSpinner } from '@icons';
import style from './index.module.css';
import cx from 'classnames';
import { BUTTON_CONST } from 'helper';

export interface ICardPharmacyProps {
	item: any;
	onClickDetail: () => void;
	onChoose: (id: number) => void;
	isSelected: boolean;
	loading: boolean | number;
}

export default function CardPharmacy(props: ICardPharmacyProps) {
	const { item, onClickDetail, isSelected, onChoose, loading } = props;

	return (
		<div className={cx(style.cardBox, isSelected && style.active)}>
			<div className={style.apotekWrapper} onClick={onClickDetail}>
				<div>
					<p className="label-14-medium tw-mb-1">{item?.merchant?.merchant_name}</p>

					<div className="tw-flex tw-text-tpy-700">
						<IconLocationGraySM />
						<p className="label-12-medium tw-mb-0">{item?.distance_label}</p>
					</div>
				</div>
				<img className="tw-w-10 tw-h-10" src={ImgPharmacyThumb.src} alt="thumb" />
			</div>
			<div className="tw-flex tw-justify-between">
				<div>
					<p className="label-12-medium tw-mb-0 tw-text-tpy-def">Subtotal Barang</p>
					<p className="title-16-medium tw-mb-0">{item?.total_price_label}</p>
				</div>

				<button
					className={cx(isSelected ? style.btnActive : style.btnInActive)}
					onClick={() => {
						if (!isSelected) onChoose(item?.merchant?.id);
					}}
				>
					{loading && loading === item?.merchant?.id ? (
						<div className="tw-animate-spin">
							<IconSpinner />
						</div>
					) : !isSelected ? (
						BUTTON_CONST.PILIH
					) : (
						BUTTON_CONST.TERPILIH
					)}
				</button>
			</div>
		</div>
	);
}
