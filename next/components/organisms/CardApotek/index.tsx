/* eslint-disable @next/next/no-img-element */
import { ImageLoading } from '@atoms';
import { IconArrowRightBlue, IconLocationGraySM, IconPharmacySM } from '@icons';
import { ImgPharmacyThumb } from '@images';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import style from './index.module.css';

export interface ICardApotekProps {
	data: any;
	loading: boolean;
	onNavigate: () => void;
	onDetail: () => void;
	isCartpage: boolean;
}

export default function CardApotek(props: ICardApotekProps) {
	const { loading, data, onNavigate, onDetail, isCartpage } = props;

	return (
		<div className="tw-flex tw-flex-col">
			<div
				className="tw-flex tw-justify-between tw-items-center tw-cursor-pointer"
				onClick={isCartpage ? onDetail : null}
			>
				<div>
					<p className="tw-mb-1 label-14-medium">
						{loading ? <Skeleton /> : data?.merchant?.name}
					</p>
					{isCartpage ? (
						<div className="tw-flex tw-text-tpy-700">
							<IconLocationGraySM />
							<p className={style.locationLabel}>{data?.merchant?.distance_label}</p>
						</div>
					) : (
						''
					)}
				</div>

				<div className={style.imgMerchentWrapper}>
					{loading ? (
						<Skeleton className="tw-w-full tw-h-full" />
					) : (
						<div>
							<ImageLoading
								className="tw-rounded"
								data={{
									url: data?.merchant?.img ?? ImgPharmacyThumb.src,
								}}
							/>
						</div>
					)}
				</div>
			</div>
			{isCartpage ? (
				<div className="tw-flex tw-flex-row">
					<div onClick={onNavigate} className={style.merchentWrapper}>
						<IconPharmacySM />
						<p className={style.seeOtherLabel}>Lihat opsi apotek lainnya</p>
						<IconArrowRightBlue />
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}
