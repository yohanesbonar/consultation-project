import { IconDkonsul40 } from '@icons';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ImageLoading from '../ImageLoading';
import { ImgDkonsul40 } from '@images';
import classNames from 'classnames';

interface Props {
	isLoading?: boolean;
	className?: string;
	classNameImgParent?: string;
	logoUrl?: string;
}

const PartnerLogo = ({
	isLoading = false,
	className = '',
	classNameImgParent = '',
	logoUrl,
}: Props) => {
	return (
		<div className={`${className}`}>
			{!isLoading ? (
				logoUrl ? (
					<div className={classNames('tw-w-full tw-h-[90px] tw-relative', classNameImgParent)}>
						<ImageLoading
							alt="partner-logo"
							data={{ url: logoUrl || ImgDkonsul40.src }}
							className={'!tw-object-contain'}
							fallbackImg={ImgDkonsul40.src}
						/>
						{/* <Image src={logoUrl} alt="logo-partner" layout="fill" objectFit="contain" err /> */}
					</div>
				) : (
					<div className="tw-mt-[10px] tw-mb-[20px]">
						<IconDkonsul40 />
					</div>
				)
			) : (
				<Skeleton className="!tw-w-[300px] tw-h-[80px] tw-z-[1] tw-flex-1 tw-flex" />
			)}
		</div>
	);
};
export default PartnerLogo;
