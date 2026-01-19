'use client';
import React, { useState, useEffect } from 'react';
import { Wrapper } from '@organisms';
import { checkIsEmpty, fetchAnimation, getBrightness, PAGE_ID, resetStorageAndCache } from 'helper';
import { SplashDevice } from '@images';
import { IconDkonsulWhite } from '@icons';

import styles from './index.module.css';
import Lottie from 'lottie-react';
import InfoPageTemplate from '../InfoPageTemplate';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { syncImageByBrightness } from '@guetechteam/whitelabel/index';
import classNames from 'classnames';

interface Props {
	preview?: any;
	isDharmaDexa?: boolean;
	partner?: any;
}

export default function SplashScreenTemplate({
	preview,
	isDharmaDexa = !preview,
	partner = null,
}: Props) {
	const general = useSelector(({ general }: any) => general);
	const theme = general?.theme;
	const toneColor = general?.colorTonal;
	const splashData = partner?.splashAsset;

	const [seconds, setSeconds] = useState(3);
	const [animationData, setAnimationData] = useState(null);
	const [isErrorLoadAssets, setIsErrorLoadAssets] = useState({
		logo: false,
		device: false,
	});
	const [useWhiteLogo, seTuseWhiteLogo] = useState(false);

	const generalLogo = theme?.result?.general?.logo;
	const whiteLogo = theme?.result?.general?.logoWhite;

	const getAnimation = async () => {
		const fileName = splashData?.subtitle.split('/').pop();
		const res = await fetchAnimation(`${fileName ?? ''}`);
		setAnimationData(res);
	};

	useEffect(() => {
		if (splashData) getAnimation();
	}, [splashData]);

	useEffect(() => {
		checkBrightnessBackground();
		console.info('---', preview, theme);
	}, [preview, toneColor, theme]);

	const checkBrightnessBackground = () => {
		if (!checkIsEmpty(preview?.bgColor)) {
			try {
				const res = getBrightness(preview?.bgColor);
				seTuseWhiteLogo(res <= 128);
			} catch (error) {
				console.log('error on  : ', error);
			}
		} else {
			let brightness: any;
			try {
				const rootElement = document.documentElement;
				const computedStyles = getComputedStyle(rootElement);
				const hexColor = computedStyles.getPropertyValue('--primary-def');
				if (!hexColor) throw 'use syncimage';
				brightness = getBrightness(hexColor);
			} catch (error) {
				console.log('error on  : gethex', error);
				brightness = syncImageByBrightness(
					preview?.bgColor ? `tw-bg-[${preview?.bgColor}]` : 'tw-bg-primary-def',
					toneColor,
				);
			}

			seTuseWhiteLogo(brightness <= 128);
		}
	};

	useEffect(() => {
		resetStorageAndCache();
		if (partner) {
			const countdown = setInterval(() => {
				setSeconds((prevSeconds) => {
					if (prevSeconds > 0) {
						return prevSeconds - 1;
					} else {
						return prevSeconds;
					}
				});
			}, 1000);
			return () => clearInterval(countdown);
		}
	}, [partner]);

	const loadSplashAsset = () => {
		if (animationData)
			return (
				<div className="tw-relative tw-h-full">
					<div className="tw-ml-8 tw-h-full tw-content-center">
						<div>
							<img src={splashData?.icon} />
							<div className="tw-mt-8">
								<img src={splashData?.title} />
							</div>
							<Lottie style={{ width: 340 }} animationData={animationData} loop autoPlay />
						</div>
						<div className="tw-bottom-[30px] tw-absolute">
							<img src={splashData?.controlledBy} />
						</div>
					</div>
				</div>
			);
	};

	const loadParrentClass = () => {
		let classes =
			styles?.container +
			(preview?.bgColor ? ` !tw-bg-[${preview?.bgColor}]` : ' !tw-bg-primary-def');
		if (isDharmaDexa) classes = styles.containerWithExternalSplash;
		return classes;
	};

	if (!partner && !preview) {
		return (
			<InfoPageTemplate
				hideDkonsulLogo
				isSpinner
				title="Tunggu sebentar ya,"
				description="Telekonsultasimu sedang disiapkan."
			/>
		);
	}

	const imageLogoSrc = useWhiteLogo
		? preview?.whiteLogo || theme?.result?.general?.logoWhite || preview?.logo || whiteLogo
		: preview?.logo || theme?.result?.general?.logo || generalLogo;

	const isHaveLogo = (!isErrorLoadAssets?.logo && preview?.logo) || generalLogo || whiteLogo;

	return (
		<Wrapper
			additionalId={PAGE_ID.SPLASH}
			header={false}
			additionalClassNameContent={loadParrentClass()}
			additionalStyleContent={{
				...(isDharmaDexa &&
					animationData && {
						backgroundImage: `url(${splashData?.bgImage})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}),
				...(preview?.bgColor && { backgroundColor: preview?.bgColor }),
			}}
			isPreview
		>
			{!checkIsEmpty(preview?.imageBackground) ||
			(!theme?.result?.splashscreen?.perComponent &&
				!checkIsEmpty(theme?.result?.splashscreen?.image)) ? (
				<div className="tw-relative tw-h-full">
					<img
						id="image-background"
						src={preview?.imageBackground ?? theme?.result?.splashscreen?.image}
						className="tw-w-full tw-h-full tw-object-cover"
					/>
				</div>
			) : isDharmaDexa ? (
				loadSplashAsset()
			) : (
				<>
					<div className={styles.section}>
						<div className="tw-min-h-[90px] tw-w-[160px] tw-relative tw-mb-2">
							{isHaveLogo ? (
								<Image
									className="tw-w-full tw-h-full"
									src={imageLogoSrc}
									alt="logo-partner"
									layout="fill"
									objectFit="contain"
									onError={() =>
										setIsErrorLoadAssets({ ...isErrorLoadAssets, logo: true })
									}
								/>
							) : (
								<div className={styles.logoContainer}>
									<IconDkonsulWhite />
								</div>
							)}
						</div>

						<div className="tw-relative tw-flex-1">
							<Image
								src={
									(isErrorLoadAssets?.device ? SplashDevice.src : null) ||
									preview?.device ||
									theme?.result?.splashscreen?.device
								}
								alt="device"
								onError={() => setIsErrorLoadAssets({ ...isErrorLoadAssets, device: true })}
								className={styles.device}
							/>
						</div>
						<p
							className={classNames(
								'headline-24-bold tw-mb-0 tw-text-center',
								!useWhiteLogo ? 'tw-text-tpy-900' : 'tw-text-tpy-50',
							)}
						>
							{preview?.text ||
								theme?.result?.splashscreen?.text ||
								'Konsultasikan Kesehatan Anda dengan Cepat dan Terjangkau.'}
						</p>
						{preview?.showRedirect ||
						(!preview && theme?.result?.splashscreen?.showRedirect) ? (
							<p
								className={classNames(
									'body-14-regular tw-mb-0 tw-text-center',
									!useWhiteLogo ? 'tw-text-tpy-900' : 'tw-text-tpy-50',
								)}
							>
								Anda akan diarahkan ke formulir dalam {seconds}..
							</p>
						) : null}
					</div>
					<div
						style={{
							overflow: 'hidden',
							width: '100%',
							height: '100%',
							zIndex: 0,
							position: 'fixed',
							background: 'transparent',
							top: 0,
							maxWidth: '500px',
						}}
					>
						<div
							className="splashscreenOverlay"
							style={{
								...(preview?.bgColor
									? {
											background: `linear-gradient(180deg, ${preview?.bgColor} -27.46%, rgba(0, 0, 0, 0.40) 87.07%)`,
									  }
									: {}),
							}}
						/>
					</div>
				</>
			)}
		</Wrapper>
	);
}
