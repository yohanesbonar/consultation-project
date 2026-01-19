'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import Lottie from 'lottie-react';
import {
	IconContact,
	IconDkonsul40,
	IconRefund,
	IconRight,
	LottieSearchDoctorV2,
} from '../../../assets';
import {
	BUTTON_CONST,
	capitalizeEachWords,
	handleOpenContactUrl,
	fetchAnimation,
	LABEL_CONST,
	PhoenixClient,
	fetchLottieJson,
	checkIsEmpty,
} from '../../../helper';
import { ButtonHighlight } from '../../atoms';
import { CountdownTimer } from '../../molecules';
import { PopupBottomsheetInfo, Wrapper } from '../../organisms';
import { useRouter } from 'next/router';
import cx from 'classnames';
import usePartnerInfo from 'hooks/usePartnerInfo';
import useTheme from 'hooks/useTheme';
import { PartnerTheme } from '@types';

type Props = {
	footerComponent: () => React.ReactNode;
	tryagainComponent: () => React.ReactNode;
	error: boolean;
	timeLeft: number | null;
	data: object | null;
	handlePhoenixReceive: (val: object) => void;
	duration: number | null;
	handleTimeLeft: (val: number) => void;
	handleUpdateTime: (val: number) => void;
	logoUrl: string;
	isLoadingLogo: boolean;
	transactionDetail?: any;
	isOpenBottomsheet?: boolean;
	setIsOpenBottomsheet?: (val: boolean) => void;
	initialData?: any;
	partnerDetail?: any;
	preview?: any;
	isHaveFindingDoctor?: boolean;
	backgroundColor?: string;
	textColor?: string;
	themeDataProps?: any;
};

const OnboardingTemplate = ({
	footerComponent,
	tryagainComponent,
	error,
	timeLeft,
	data,
	handlePhoenixReceive,
	duration,
	handleTimeLeft,
	handleUpdateTime,
	logoUrl,
	isLoadingLogo,
	transactionDetail,
	isOpenBottomsheet = false,
	setIsOpenBottomsheet,
	initialData = null,
	partnerDetail,
	preview,
	isHaveFindingDoctor = true,
	backgroundColor,
	textColor,
	themeDataProps,
}: Props) => {
	const router = useRouter();

	const findingData = partnerDetail?.findingDoctor;

	const [animationData, setAnimationData] = React.useState(null);
	const [isLoadAnimation, setIsLoadAnimation] = React.useState(true);
	const [themeData, setThemeData] = React.useState<PartnerTheme>(themeDataProps?.data ?? null);
	const [partnerToken, setPartnerToken] = React.useState('');
	const [isLoadingLottie, setIsLoadingLottie] = React.useState(true);
	const [lottieJson, setLottieJson] = React.useState(null);
	const [lottieError, setLottieError] = React.useState(true);
	const [isErrorLoadAssets, setIsErrorLoadAssets] = React.useState({
		logo: false,
		animation: false,
	});

	if (checkIsEmpty(themeDataProps)) {
		useTheme({ router, setThemeData, setPartnerToken });
		usePartnerInfo({ theme: themeData, token: partnerToken });
	}
	const getAnimation = async () => {
		const baseAnimation = findingData?.baseAnimation?.split('/').pop();
		const routingAnimation =
			themeData?.onboarding?.animation ?? findingData?.routing?.split('/').pop();

		const bg_animation = await fetchAnimation(`${baseAnimation ?? ''}`);
		const routing = await fetchAnimation(`${routingAnimation ?? ''}`);

		setAnimationData({ bg_animation, routing });
		setIsLoadAnimation(false);
	};

	const loadLottieAnimation = async (url: string) => {
		try {
			setIsLoadingLottie(true);
			const animationData = await fetchLottieJson(url);
			if (animationData?.meta?.acknowledge) {
				setLottieJson(animationData?.data);
				setLottieError(false);
				setIsErrorLoadAssets({ ...isErrorLoadAssets, animation: false });
			}
		} catch (error) {
			console.error('Gagal memuat animasi Lottie:', error);
		} finally {
			setIsLoadingLottie(false);
		}
	};

	React.useEffect(() => {
		getAnimation();
	}, [findingData]);

	React.useEffect(() => {
		if (preview?.animation?.endsWith('.json')) {
			loadLottieAnimation(preview.animation);
		}
	}, [preview?.animation]);

	React.useEffect(() => {
		if (themeData?.onboarding?.animation?.endsWith('.json') && !preview?.animation) {
			loadLottieAnimation(themeData.onboarding.animation);
		}
	}, [themeData]);

	useEffect(() => {
		if (isHaveFindingDoctor && isLoadingLottie) {
			setIsLoadingLottie(false);
		}
	}, [isHaveFindingDoctor]);

	React.useEffect(() => {
		if (!checkIsEmpty(themeDataProps?.data)) {
			setThemeData(themeDataProps?.data);
		}
	}, [themeDataProps?.data]);

	const displayLogo = () => {
		if (!isLoadingLogo) {
			if (preview?.logo) {
				logoUrl = preview?.logo;
			}

			if (themeData?.general?.logo) {
				logoUrl = themeData?.general?.logo;
			}

			if (!isErrorLoadAssets?.logo && logoUrl) {
				return (
					<div className="tw-w-[160px] tw-h-[90px] tw-relative">
						<Image
							className="tw-w-full tw-h-full"
							src={logoUrl}
							alt="logo-partner"
							layout="fill"
							objectFit="contain"
							onError={() => setIsErrorLoadAssets({ ...isErrorLoadAssets, logo: true })}
						/>
					</div>
				);
			} else {
				return <IconDkonsul40 />;
			}
		} else {
			return <Skeleton className="!tw-w-[300px] tw-h-[80px] tw-z-[1] tw-flex tw-flex-1" />;
		}
	};

	const onClickBack = () => {
		if (router?.query?.returnUrl) {
			window.location.href = `${router?.query?.returnUrl}`;
		} else {
			router.back;
		}
	};

	const renderDharmaDexaAnimation = () => {
		return (
			<div style={{ width: 240 }} className="tw-relative">
				<Lottie loop={true} autoPlay={true} animationData={animationData?.bg_animation} />
				<div className="tw-absolute tw-text-center -tw-top-12 tw-w-full tw-z-4">
					<img src={findingData?.icon} alt="ic" />
				</div>
				<div className="tw-absolute tw-top-3 tw-w-full tw-place-items-center tw-z-4">
					<Lottie
						loop={true}
						autoPlay={true}
						animationData={animationData?.routing}
						style={{ width: 200, height: 200, marginLeft: 'auto', marginRight: 'auto' }}
					/>
				</div>
			</div>
		);
	};

	const loadAnimation = () => {
		return (
			<div
				className={cx(
					isLoadAnimation ? 'tw-opacity-0' : 'tw-opacity-1',
					isHaveFindingDoctor ? 'tw-mt-8 tw-h-[200px]' : '',
					'tw-transition-all tw-duration-1000 tw-ease-in-out tw-w-[240px] tw-h-[240px]',
					preview?.animation ? 'tw-mb-4' : '',
				)}
			>
				{preview?.animation?.endsWith('.json') ? (
					isLoadingLottie || lottieError ? (
						<div className="tw-w-[240px] tw-h-[240px] tw-flex tw-items-center tw-justify-center" />
					) : (
						<Lottie
							loop={true}
							autoPlay={true}
							animationData={lottieJson}
							style={{ width: 240, height: 240 }}
						/>
					)
				) : !isErrorLoadAssets?.animation && preview?.animation ? (
					<div className="tw-w-[240px] tw-h-[240px] tw-relative">
						<Image
							src={preview?.animation}
							alt="logo-partner"
							layout="fill"
							objectFit="contain"
							onError={() => setIsErrorLoadAssets({ ...isErrorLoadAssets, animation: true })}
						/>
					</div>
				) : !lottieError &&
				  !isErrorLoadAssets?.animation &&
				  themeData?.onboarding?.animation?.endsWith('.json') ? (
					isLoadingLottie ? (
						<div className="tw-w-[240px] tw-h-[240px] tw-flex tw-items-center tw-justify-center" />
					) : (
						<Lottie
							loop={true}
							autoPlay={true}
							animationData={lottieJson}
							style={{ width: 240, height: 240 }}
						/>
					)
				) : !isErrorLoadAssets?.animation && themeData?.onboarding?.animation ? (
					<div className="tw-w-[240px] tw-h-[240px] tw-relative">
						<Image
							src={themeData?.onboarding?.animation}
							alt="logo-partner"
							layout="fill"
							objectFit="contain"
							onError={() => setIsErrorLoadAssets({ ...isErrorLoadAssets, animation: true })}
						/>
					</div>
				) : !preview?.animation && isHaveFindingDoctor ? (
					renderDharmaDexaAnimation()
				) : (
					<Lottie
						loop={true}
						autoPlay={true}
						animationData={LottieSearchDoctorV2}
						style={{ width: 240, height: 240 }}
					/>
				)}
			</div>
		);
	};

	return (
		<>
			<Wrapper
				title="Menunggu Dokter"
				header={initialData && initialData?.token}
				footer={true}
				footerComponent={footerComponent()}
				additionalStyleContent={{
					overflowY: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				}}
				onClickBack={onClickBack}
				backgroundColor={backgroundColor}
				isPreview={!!preview}
				preview={preview}
			>
				<div className="tw-items-center tw-justify-center tw-mt-[95px] tw-w-full tw-flex">
					{displayLogo()}
				</div>
				<div className="tw-flex-1" style={{ marginBottom: 82 }}>
					{error ? (
						tryagainComponent()
					) : timeLeft != null ? (
						timeLeft > 0 || data == null ? (
							<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
								{loadAnimation()}
								<div className="tw-mx-[43px] tw-mt-[32px]">
									<p
										className="title-20-medium tw-mb-0 tw-text-center"
										style={{
											...(textColor
												? {
														color: textColor,
												  }
												: {}),
										}}
									>
										Mohon Menunggu
									</p>
									<p
										className="body-16-regular tw-mt-4 tw-mb-0 tw-text-center"
										style={{
											...(textColor
												? {
														color: textColor,
												  }
												: {}),
										}}
									>
										Kami sedang menghubungkan dengan dokter yang tersedia.
									</p>
									{data != null && timeLeft > 0 ? (
										<p
											className="tw-text-tpy-700 tw-mt-9 tw-mb-4 tw-text-center"
											style={{
												...(textColor
													? {
															color: textColor,
													  }
													: {}),
											}}
										>
											Menghubungkan dengan dokter dalam{' '}
											<span className="tw-text-primary-def">{timeLeft}...</span>
										</p>
									) : null}
								</div>
							</div>
						) : (
							tryagainComponent()
						)
					) : (
						<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
							{loadAnimation()}

							<div className="tw-mx-[43px] tw-mt-[32px]">
								<p
									className="title-20-medium tw-mb-0 tw-text-center"
									style={{
										...(textColor
											? {
													color: textColor,
											  }
											: {}),
									}}
								>
									Mohon Menunggu
								</p>
								<p
									className="body-16-regular tw-mt-4 tw-mb-0 tw-text-center"
									style={{
										...(textColor
											? {
													color: textColor,
											  }
											: {}),
									}}
								>
									Kami sedang menghubungkan dengan dokter yang tersedia.
								</p>
							</div>
						</div>
					)}
				</div>
				<PhoenixClient data={data} onReceiveMessage={(res) => handlePhoenixReceive(res)} />
				<CountdownTimer
					duration={duration}
					setTimeLeft={(time) => handleTimeLeft(time)}
					updateTime={(time) => handleUpdateTime(time)}
				/>
				<PopupBottomsheetInfo
					data={{
						title: LABEL_CONST.OTHER,
						body: (
							<div>
								<ButtonHighlight
									classNameBtn="tw-flex tw-items-center tw-flex-1 tw-gap-4 tw-px-2 tw-mx-2 hover:tw-bg-monochrome-50"
									childrenClassName="tw-font-roboto tw-font-medium tw-text-black tw-flex-1 tw-text-start"
									text={capitalizeEachWords(BUTTON_CONST.CONTACT_US)}
									prefixIcon={<IconContact />}
									suffixIcon={<IconRight />}
									color={null}
									onClick={() => handleOpenContactUrl(transactionDetail?.contact_url)}
								/>
								{router?.query?.rf === '1' && transactionDetail?.paid_amount != 0 ? (
									<ButtonHighlight
										classNameBtn="tw-flex tw-items-center tw-flex-1 tw-gap-4 tw-px-2 tw-mx-2 hover:tw-bg-monochrome-50"
										childrenClassName="tw-font-roboto tw-font-medium tw-text-black tw-flex-1 tw-text-start"
										text={capitalizeEachWords(BUTTON_CONST.SUBMIT_A_REFUND)}
										prefixIcon={<IconRefund />}
										suffixIcon={<IconRight />}
										color={null}
										onClick={() =>
											router.replace({
												pathname: '/transaction/refund',
												query: router?.query,
											})
										}
									/>
								) : null}
							</div>
						),
					}}
					isOpenBottomsheet={isOpenBottomsheet}
					setIsOpenBottomsheet={
						setIsOpenBottomsheet != null ? (isOpen) => setIsOpenBottomsheet(isOpen) : null
					}
				/>
			</Wrapper>
		</>
	);
};

export default OnboardingTemplate;
