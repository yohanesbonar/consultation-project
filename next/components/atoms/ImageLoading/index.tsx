import React, { useEffect, useState } from 'react';
import 'moment/locale/id';
import Image, { StaticImageData } from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrokenImg } from '../../../assets';

type UrlType = string | StaticImageData;

type DataType = {
	url?: UrlType;
	noImg?: boolean;
};

type Props = {
	data?: DataType;
	classNameContainer?: string;
	className?: string;
	style?: React.CSSProperties;
	fallbackImg?: string;
	alt?: string;
	idImage?: any;
	layout?: any;
};

const ImageLoading = ({
	data,
	classNameContainer = '',
	className = '',
	style = {},
	fallbackImg,
	alt,
	idImage,
	layout = 'fill',
}: Props) => {
	const [isLoading, setisLoading] = useState(true);
	const [imageSrc, setImageSrc] = useState<UrlType>(fallbackImg);

	const onErrorImage = () => {
		setImageSrc(fallbackImg ?? BrokenImg.src);
	};

	useEffect(() => {
		if (data?.url) {
			setImageSrc(data?.url);
		}
		if (data?.noImg) {
			setisLoading(false);
		}
	}, [data]);

	return (
		<div className={'tw-w-full tw-h-full ' + classNameContainer}>
			{isLoading && (
				<Skeleton className="tw-w-full !tw-absolute tw-h-full tw-z-[1] tw-flex-1 tw-flex" />
			)}
			{imageSrc && (
				<Image
					id={idImage}
					layout={layout}
					alt={alt ?? 'img-loading'}
					onLoadingComplete={(res) => {
						setisLoading(false);
						console.log('on complete', res);
					}}
					src={imageSrc}
					className={`tw-object-cover tw-w-full tw-max-h-full tw-aspect-square ${className} `}
					style={style}
					onError={onErrorImage}
					onErrorCapture={onErrorImage}
				/>
			)}
		</div>
	);
};
export default ImageLoading;
