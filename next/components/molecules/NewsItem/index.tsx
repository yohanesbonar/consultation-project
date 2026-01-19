import React from 'react';
import { ImageLoading } from '@atoms';
import { BannerFallback } from '@images';
import { PatientRecommendationType } from '@types';
import { handleClickUrl } from 'helper';
import Router from 'next/router';
import styles from './index.module.css';

type Props = {
	data?: PatientRecommendationType;
	total?: number;
	isLoading?: boolean;
};

const NewsItem = ({ data, total = 1, isLoading = false }: Props) => {
	return (
		<div
			style={
				total > 1
					? {
							minWidth: `calc(100% - 64px)`,
							maxWidth: `calc(100% - 64px)`,
					  }
					: { minWidth: '100%', maxWidth: '100%' }
			}
			className={`tw-flex tw-flex-col tw-rounded-[8px] tw-bg-white tw-shadow-custom-shadow-1 tw-cursor-pointer hover:tw-bg-gray-50`}
			onClick={() => {
				handleClickUrl(Router, data?.link);
			}}
		>
			<div className="tw-w-full tw-rounded-t-[8px] tw-aspect-video">
				<ImageLoading
					alt="info sehat"
					data={{ url: data?.banner_url ?? BannerFallback.src }}
					classNameContainer={styles.imgLoadContainer}
					className={styles.imgLoadClass}
					fallbackImg={BannerFallback.src}
				/>
			</div>
			<div className="tw-flex tw-flex-1 tw-flex-col tw-p-4">
				<div className="tw-flex tw-flex-1 tw-text-black label-14-medium">{data?.title}</div>
				<div className="tw-flex tw-flex-1 tw-text-tpy-700 body-12-regular">
					{data?.description}
				</div>
			</div>
		</div>
	);
};
export default NewsItem;
