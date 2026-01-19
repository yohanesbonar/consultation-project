import { ImageLoading } from '@atoms';
import { IconDkonsul40, IconSpinner } from '@icons';
import Image from 'next/image';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

type Props = {
	image?: string;
	secondaryImage?: string;
	title: string;
	description: any;
	isLoading?: boolean;
	isSpinner?: boolean;
	hideDkonsulLogo?: boolean;
};

const InfoPageTemplate = ({
	image,
	title,
	description,
	isLoading = false,
	isSpinner,
	secondaryImage,
	hideDkonsulLogo = false,
}: Props) => (
	<div className="tw-overflow-y-hidden tw-flex tw-flex-col tw-h-full tw-p-5">
		<div className="tw-m-auto tw-text-center">
			<div className="tw-w-[150px] tw-relative tw-mx-auto">
				{isLoading ? (
					<Skeleton className="tw-h-[90px] tw-z-[1] tw-flex tw-flex-1" />
				) : image ? (
					<div className="tw-h-[90px]">
						<Image src={image} alt="logo-partner" layout="fill" objectFit="contain" />
					</div>
				) : (
					!hideDkonsulLogo && <IconDkonsul40 className="tw-mb-4" />
				)}
			</div>
			{secondaryImage && (
				<div className="tw-relative tw-w-[240px] tw-h-[240px] tw-mx-auto">
					<ImageLoading data={{ url: secondaryImage }} />
				</div>
			)}
			{isSpinner ? (
				<div className="tw-animate-spin">
					<IconSpinner />
				</div>
			) : (
				<div className="tw-mt-4">
					<div className="title-20-medium">{title}</div>
					<div className="body-16-regular tw-mt-4">{description}</div>
				</div>
			)}
		</div>
	</div>
);

export default InfoPageTemplate;
