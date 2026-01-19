// TODO: fix these lints
/* eslint-disable @typescript-eslint/no-empty-function */
import { isBlockedUser, isClientErrorCode, isServerErrorCode } from 'helper/Network/requestHelper';
import useCheckPartner from 'hooks/useCheckPartner';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconSearchDoctorNotFound } from '../../assets/index.js';
import { ButtonHighlight, OnboardingTemplate } from '../../components';
import {
	BUTTON_CONST,
	BUTTON_ID,
	getLocalStorage,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	getTimeGap,
	getTimeLeft,
	LOCALSTORAGE,
	MESSAGE_CONST,
	navigateWithQueryParams,
	PAGE_ID,
	removeLocalStorage,
	setLocalStorage,
	setStorageEncrypt,
	setStringifyLocalStorage,
	STATUS_CONST,
} from '../../helper';
import { getRoomStatus, submitSelfOrderConsultation } from '../../helper/Network/consultation';
import { setErrorAlertRedux } from '../../redux/trigger';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { getShieldStateFromStorage, SHIELD_ERROR_ID } from 'helper/Shield';

const Onboarding = (props: any) => {
	const router = useRouter();
	const [duration, setDuration] = useState(null);
	const [timeLeft, setTimeLeft] = useState(null);
	const [data, setData] = useState(null);
	const [token, setToken] = useState(null);
	const [params, setParams] = useState(null);
	const [isCanceled, setIsCanceled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isEndedRef = useRef(false);
	const waitingDataRef = useRef(null);
	const tokenRef = useRef(null);
	const isCancelRef = useRef(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState(false);
	const [logoUrl, setLogoUrl] = useState('');
	const [isLoadingLogo, setIsLoadingLogo] = useState(true);
	const [transactionDetail, setTransactionDetail] = useState<any>({});
	const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);
	const [isHaveDharmaDexa, setIsHaveDharmaDexa] = useState(false);
	const timeGapRef = useRef<any>(null);

	usePartnerInfo({
		...props,
		token: props?.initialData?.token,
		isByLocal: props?.initialData?.token ? false : true,
	});

	useEffect(() => {
		if (props?.detailTransaction?.xid) {
			const tagManagerArgs = {
				dataLayer: {
					transactionId: props?.detailTransaction?.transaction_id,
				},
				dataLayerName: 'PageDataLayer',
			};

			TagManager.dataLayer(tagManagerArgs);
		}
	}, []);

	useEffect(() => {
		if (router?.isReady) {
			if (props) {
				getData();
			}
			window.addEventListener('focus', () => {
				getCheckDataTimeleft();
			});
			window.addEventListener('blur', () => {});
			return () => {
				window.removeEventListener('focus', () => {});
				window.removeEventListener('blur', () => {});
				resetData();
			};
		}
	}, [router?.isReady]);

	const resetData = () => {
		setError(false);
		setDuration(null);
		setTimeLeft(null);
		setData(null);
		setIsCanceled(false);
		setIsLoading(false);
		isEndedRef.current = false;
	};

	const getCheckDataTimeleft = async () => {
		try {
			if (!isEndedRef.current) {
				const dataTemp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
				setParams(dataTemp?.params);
				setToken(dataTemp?.token);
				if (dataTemp?.waitingData != null) {
					setData({
						roomId: dataTemp?.waitingData?.waitingRoom,
						roomToken: dataTemp?.waitingData?.tokenRoom,
					});
					if (dataTemp != null) {
						const timeLeftTemp = getTimeLeft(
							dataTemp?.waitingData?.expiredAt,
							moment().add(global.timeGap ?? timeGapRef?.current ?? 0, 'seconds'),
						);
						console.log(
							'timeleft',
							moment(dataTemp.expiredAt).format('YYYY-MM-DD HH:mm:ss'),
							timeLeftTemp,
						);
						setDuration(timeLeftTemp);
					}
				}
			}
		} catch (error) {
			console.log('error on get data : ', error);
		}
	};

	const getData = async () => {
		try {
			if (!isEndedRef.current) {
				setIsLoadingLogo(true);

				if (props?.initialData?.timeGap != null) {
					global.timeGap = props?.initialData?.timeGap;
					timeGapRef.current = props?.initialData?.timeGap;
				}

				const urlLogoFrom = props?.initialData
					? props?.initialData?.partnerDetail?.logo
					: await getLocalStorage(LOCALSTORAGE.LOGO);
				setLogoUrl(urlLogoFrom || '');
				if (urlLogoFrom) {
					setLocalStorage(LOCALSTORAGE.LOGO, urlLogoFrom);
				} else {
					removeLocalStorage(LOCALSTORAGE.LOGO);
				}
				setIsLoadingLogo(false);
				const dataTemp =
					props?.initialData && !submitted
						? props.initialData
						: await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
				waitingDataRef.current = dataTemp?.waitingData;
				tokenRef.current = dataTemp?.token;
				await setStorageEncrypt(LOCALSTORAGE.ORDER, dataTemp);
				setParams(dataTemp?.params);
				setToken(dataTemp?.token);
				setTransactionDetail(props?.detailTransaction);
				if (dataTemp?.waitingData != null) {
					udpateConsultation(true);
				} else {
					setDuration(5);
					setTimeout(() => {
						if (!isCancelRef.current) {
							submitOrder(dataTemp?.params, dataTemp?.token);
						}
					}, 5000);
				}
			}
		} catch (error) {
			console.log('error on get data : ', error);
		}
	};

	const submitOrder = async (paramsTemp, tokenTemp) => {
		try {
			setIsLoading(true);
			// block user flag
			const shield = await getShieldStateFromStorage();
			const device = shield?.result ?? SHIELD_ERROR_ID;
			const res = await submitSelfOrderConsultation(
				{ ...(paramsTemp ? paramsTemp : params), ...(device ? { device } : null) },
				tokenTemp ?? token,
			);

			if (
				res?.data?.meta?.status &&
				res?.data?.meta?.message &&
				isBlockedUser(res?.data?.meta?.status, res?.data?.meta?.message)
			) {
				return Router.push('/blocked');
			}

			if (res.status && isClientErrorCode(res.status)) {
				if (res?.data?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
					const payload = {
						from: '/onboarding',
						query: { ...(router?.query || {}), token: tokenTemp ?? token },
						data: res?.data?.data,
					};
					await setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
					return Router.push({
						pathname: '/partner-closed',
						query: { from: PAGE_ID.OUT_SCHEDULE, token: tokenTemp || token },
					});
				}
				return Router.push('/invalid-link');
			} else if (res.status && isServerErrorCode(res.status)) return Router.push('/503'); // TODO: when the other api call need this handler, move to api call func

			if (res?.meta?.acknowledge) {
				resetData();
				setData({
					roomId: res?.data?.waitingRoom,
					roomToken: res?.data?.tokenRoom,
				});
				if (res?.data != null) {
					const gap = getTimeGap(new Date(), res?.meta?.at);
					global.timeGap = gap;
					timeGapRef.current = gap;

					const timeLeftTemp = getTimeLeft(
						res?.data.expiredAt,
						moment().add(gap ?? 0, 'seconds'),
					);
					console.log(
						'timeleft',
						moment(res?.data.expiredAt).format('YYYY-MM-DD HH:mm:ss'),
						timeLeftTemp,
					);
					setDuration(timeLeftTemp);
				}

				await setStorageEncrypt(LOCALSTORAGE.ORDER, {
					waitingData: {
						...res?.data,
					},
					token: tokenTemp ?? token,
					params: paramsTemp ?? params,
				});
				setSubmitted(true);
				waitingDataRef.current = {
					...res?.data,
				};
			} else {
				console.log('error redux', res?.meta);
				setErrorAlertRedux({
					danger: true,
					data: {
						message: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
				setError(true);
			}
		} catch (error) {
			console.log('error on submit order : ', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onReceiveSocket = async (res: any) => {
		if (res.orderNumber && res.token) {
			await setStorageEncrypt(LOCALSTORAGE.ORDER, {
				token: res?.token,
				orderNumber: res?.orderNumber,
			});

			const progressForm = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);

			const formConsultation = { ...progressForm };
			formConsultation.orderId = res?.orderNumber;
			await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, formConsultation);

			navigateWithQueryParams('/chat-detail', {}, 'href');
		}
	};

	const tryAgainFooter = () =>
		transactionDetail ? tryagainPaidFooter() : tryagainComponentFooter();

	const TryAgainButton = () => (
		<ButtonHighlight
			isLoading={isLoading}
			text={BUTTON_CONST.TRY_AGAIN}
			onClick={() => {
				resetData();
				isCancelRef.current = false;
				setData(null);
				if (transactionDetail) {
					submitOrder(params, token);
				} else {
					setDuration(5);
					setTimeout(() => {
						if (!isCancelRef.current) {
							submitOrder(params, token);
						}
					}, 5000);
				}
			}}
			childrenClassName="tw-font-roboto tw-font-medium"
			circularContainerClassName="tw-h-[16px]"
			circularClassName="circular-inner-16"
		/>
	);

	const tryagainPaidFooter = () => {
		return (
			<div className="tw-p-4 tw-bg-white">
				<div className="tw-flex tw-flex-col tw-flex-1 tw-gap-[16px]">
					<TryAgainButton />
					<ButtonHighlight
						color="grey"
						className="!tw-w-auto tw-text-secondary-def"
						classNameBtn="tw-text-secondary-def"
						childrenClassName="tw-font-roboto tw-font-medium"
						onClick={() => setIsOpenBottomsheet(true)}
						text={BUTTON_CONST.OTHER}
					/>
				</div>
			</div>
		);
	};

	const tryagainComponentFooter = () => {
		return (
			<div className="absolute-bottom-16 tw-flex tw-gap-4">
				<ButtonHighlight
					idBtn={BUTTON_ID.BUTTON_CANCEL_ORDER}
					color="grey"
					onClick={() =>
						Router.replace({
							pathname: '/order',
							query: { token: token },
						})
					}
					text={BUTTON_CONST.CANCEL}
					className="tw-flex-1"
				/>
				<TryAgainButton />
			</div>
		);
	};

	const tryagainComponent = () => (
		<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
			<IconSearchDoctorNotFound />
			<div className="tw-mx-[43px] tw-mt-[24px]">
				<p className="tw-font-roboto tw-mb-0 font-20 tw-text-center">
					Maaf Dokter Belum Tersedia Saat Ini
				</p>
				<p className="tw-mt-4 tw-mb-0 font-16 tw-text-center">
					Anda mungkin menghubungi dokter di luar jam kerja atau semua dokter sedang sibuk.
				</p>
			</div>
		</div>
	);

	const footerComponent = () => (
		<div className="tw-m-4">
			{error
				? tryAgainFooter()
				: timeLeft != null &&
				  (data == null
						? transactionDetail
							? null
							: timeLeft > 0 && (
									<ButtonHighlight
										idBtn={BUTTON_ID.BUTTON_CANCEL_ORDER}
										color="grey"
										onClick={() => {
											isCancelRef.current = true;
											setIsCanceled(true);
											setTimeLeft(0);
											isEndedRef.current = true;
											Router.replace({
												pathname: '/order',
												query: { token: token },
											});
										}}
										text={`${BUTTON_CONST.CANCEL} (${timeLeft} DETIK)`}
									/>
							  )
						: timeLeft <= 0 || isCanceled
						? tryAgainFooter()
						: null)}
		</div>
	);

	const handlePhoenixReceive = (res) => {
		onReceiveSocket(res);
		console.log('res onReceiveMessage index', res);
	};

	const handleTimeLeft = (time) => setDuration(time);
	const handleUpdateTime = (time) => {
		if (!isCanceled) {
			setTimeLeft(time);
		}
		if (time <= 0) {
			isEndedRef.current = true;
		} else {
			if (time < 115 && time > 10 && time % 25 === 0) {
				// if mod 25 = 0, then check consultation
				udpateConsultation();
			}
		}
	};

	const udpateConsultation = async (checkTimeLeft = false) => {
		try {
			const resCheck = await getRoomStatus(
				waitingDataRef.current?.waitingRoom,
				tokenRef.current,
			);

			if (resCheck?.meta?.acknowledge) {
				if (resCheck?.data?.snapUrl) {
					window.location.href = resCheck?.data?.snapUrl;
				}

				// for updating timegap
				const gap = getTimeGap(new Date(), resCheck?.meta?.at);
				global.timeGap = gap;
				timeGapRef.current = gap;
				if (checkTimeLeft) {
					getCheckDataTimeleft();
				}
			}
		} catch (error) {
			console.log('error on update consultation : ', error);
		}
	};

	const { partnerDetail, isFetch } = useCheckPartner({
		token,
		from: '/onboarding',
		query: router.query,
	});

	useEffect(() => {
		if (!isFetch) setIsHaveDharmaDexa(partnerDetail?.findingDoctor ? true : false);
	}, [partnerDetail, isFetch]);

	return (
		<OnboardingTemplate
			footerComponent={footerComponent}
			tryagainComponent={tryagainComponent}
			error={error}
			timeLeft={timeLeft}
			data={data}
			handlePhoenixReceive={handlePhoenixReceive}
			duration={duration}
			handleTimeLeft={handleTimeLeft}
			handleUpdateTime={handleUpdateTime}
			logoUrl={logoUrl}
			isLoadingLogo={isLoadingLogo}
			transactionDetail={transactionDetail}
			isOpenBottomsheet={isOpenBottomsheet}
			setIsOpenBottomsheet={setIsOpenBottomsheet}
			initialData={props?.initialData}
			partnerDetail={partnerDetail}
			isHaveFindingDoctor={isHaveDharmaDexa}
		/>
	);
};
export default Onboarding;
