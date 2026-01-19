// TODO: fix these lints
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useRef, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { ButtonHighlight } from '../components/index.js';
import { IconSearchDoctorNotFound } from '../assets/index.js';
import {
	BUTTON_CONST,
	getLocalStorage,
	getStorageParseDecrypt,
	getTimeLeft,
	LOCALSTORAGE,
	MESSAGE_CONST,
	setStorageEncrypt,
	submitSelfOrderConsultation,
	decryptData,
	BUTTON_ID,
	checkConsultationByStatus,
	addLog,
	checkParamsForSubmit,
	ShieldClient,
	getTimeGap,
	getServerTime,
	STATUS_CONST,
	navigateWithQueryParams,
	checkIsEmpty,
	getConsultationDetailPartner,
	fetchCachedTheme,
} from '../helper/index.js';
import moment from 'moment';
import 'react-loading-skeleton/dist/skeleton.css';
import { setErrorAlertRedux } from '../redux/trigger';
import { OnboardingTemplate } from '../components';
import { isBlockedUser, isClientErrorCode, isServerErrorCode } from 'helper/Network/requestHelper';
import useCheckPartner from 'hooks/useCheckPartner';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { getShieldStateFromStorage, SHIELD_ERROR_ID } from 'helper/Shield';

const Finding = (props: any) => {
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
	const isCancelRef = useRef(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState(false);
	const [logoUrl, setLogoUrl] = useState('');
	const [isLoadingLogo, setIsLoadingLogo] = useState(true);
	const timeGapRef = useRef<any>(null);

	useEffect(() => {
		if (router?.isReady) {
			if (props) {
				setTimeout(() => {
					getData();
				}, 2000); // 2s is timeout for shield
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

	usePartnerInfo({
		...(!checkIsEmpty(props?.theme) && !checkIsEmpty(props?.partnerToken)
			? { theme: props.theme, token: props?.partnerToken }
			: { isByLocal: true }),
	});

	const { partnerDetail } = useCheckPartner({ token, from: '/finding', query: router.query });

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
						contactUrl: dataTemp?.contactUrl,
					});
					if (dataTemp != null) {
						//timegap
						const resTime = await getServerTime();
						const gap = getTimeGap(new Date(), resTime?.meta?.at ?? new Date());
						global.timeGap = gap;
						timeGapRef.current = gap;

						const timeLeftTemp = getTimeLeft(
							dataTemp?.waitingData.expiredAt,
							moment().add(gap ?? 0, 'seconds'),
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
				const urlLogoFrom = await getLocalStorage(LOCALSTORAGE.LOGO);
				setLogoUrl(urlLogoFrom ?? '');
				setIsLoadingLogo(false);
				const dataTemp =
					props?.initialData && !submitted
						? props.initialData
						: await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
				dataTemp.token = router.query?.token;
				const params = await checkParamsForSubmit(dataTemp?.params);

				if (!dataTemp?.contactUrl) {
					if (dataTemp?.waitingData?.contactUrl) {
						dataTemp.contactUrl = dataTemp?.waitingData?.contactUrl;
					} else {
						const tempLocal = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
						if (tempLocal?.contactUrl) {
							dataTemp.contactUrl = tempLocal?.contactUrl;
						}
					}
				}

				addLog({ dtgetdata: JSON.stringify(dataTemp) });
				const paramsData = await checkParamsForSubmit(params);
				await setStorageEncrypt(LOCALSTORAGE.ORDER, { ...dataTemp, params: paramsData });

				setParams(params);
				setToken(dataTemp?.token);
				if (dataTemp?.waitingData != null) {
					getCheckDataTimeleft();
				} else {
					setDuration(1);
					setTimeout(() => {
						if (!isCancelRef.current) {
							submitOrder(params);
						}
					}, 1000);
				}
			}
		} catch (error) {
			console.log('error on get data : ', error);
		}
	};

	const submitOrder = async (paramsTemp?: any) => {
		try {
			setIsLoading(true);

			const bodyReq = paramsTemp ?? params;

			if (bodyReq?.birthdate) {
				bodyReq.age = bodyReq?.birthdate;
			}

			// block user flag
			const shield = await getShieldStateFromStorage();
			const device = shield?.result ?? SHIELD_ERROR_ID;
			const res = await submitSelfOrderConsultation(
				{ ...bodyReq, ...(device ? { device } : null) },
				null,
				router.query?.token as string,
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
						from: '/finding',
						query: { ...(router?.query || {}), token: token ?? router.query?.token },
						data: { ...res?.data?.data, body: bodyReq },
					};
					await setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
					return navigateWithQueryParams(
						'/partner-closed',
						{ from: 'finding', token: token ?? router.query?.token },
						'href',
					);
				}
				return window.location.replace('/invalid-link');
			} else if (res.status && isServerErrorCode(res.status)) return Router.push('/503'); // TODO: when the other api call need this handler, move to api call func

			if (res?.meta?.acknowledge) {
				resetData();
				setData({
					roomId: res?.data?.waitingRoom,
					roomToken: res?.data?.tokenRoom,
					contactUrl: res?.data?.contactUrl,
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
				addLog({ dtsubmit: JSON.stringify(res?.data) });

				const paramsData = await checkParamsForSubmit(paramsTemp ?? params);

				await setStorageEncrypt(LOCALSTORAGE.ORDER, {
					waitingData: {
						...res?.data,
					},
					contactUrl: res?.data?.contactUrl,
					params: paramsData,
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

	const onReceiveSocket = async (res) => {
		console.log('onreceive', res);
		if (res.orderNumber && res.token) {
			await setStorageEncrypt(LOCALSTORAGE.ORDER, {
				token: res?.token,
				orderNumber: res?.orderNumber,
			});

			navigateWithQueryParams('/chat-detail', {}, 'replace');
		}
	};

	const tryagainComponentFooter = () => {
		return (
			<div className="absolute-bottom-16 tw-flex tw-flex-col ">
				<ButtonHighlight
					isLoading={isLoading}
					text={BUTTON_CONST.TRY_AGAIN}
					onClick={() => {
						resetData();
						setDuration(1);
						isCancelRef.current = false;
						setData(null);
						setTimeout(() => {
							if (!isCancelRef.current) {
								submitOrder(params);
							}
						}, 5000);
					}}
					className="tw-flex-1"
				/>
				<p className="tw-mt-4 tw-text-center">
					Butuh Bantuan? Silakan{' '}
					<a
						href={props?.initialData?.waitingData?.contactUrl ?? data?.contactUrl}
						className="tw-no-underline"
						id={BUTTON_ID.BUTTON_CONTACT_US}
					>
						Hubungi kami
					</a>
				</p>
			</div>
		);
	};

	const tryagainComponent = () => (
		<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
			<IconSearchDoctorNotFound />
			<div className="tw-mx-[43px] tw-mt-[24px]">
				<p className="title-20-medium tw-mb-0 tw-text-center">
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
				? tryagainComponentFooter()
				: timeLeft != null &&
				  (data == null
						? null
						: timeLeft <= 0 || isCanceled
						? tryagainComponentFooter()
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

	const udpateConsultation = async () => {
		const resCheck = await checkConsultationByStatus(router.query?.token as string);
		if (!resCheck?.error) {
			if (resCheck?.redirect?.destination) {
				window.location.href = resCheck?.redirect?.destination;
			}
		}
	};

	return (
		<>
			{router?.isReady ? <ShieldClient enabled={true} /> : null}
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
				partnerDetail={partnerDetail}
				isHaveFindingDoctor={partnerDetail?.findingDoctor ? true : false}
				themeDataProps={props?.theme}
			/>
		</>
	);
};

export const getServerSideProps = async ({ req, res, query }) => {
	try {
		const { token } = query;
		//todo : verity data, get detail order, & listen to socket.
		if (token) {
			const action = query.action && (await decryptData(query?.action));
			if (action === 'orderConsul') {
				// order
				let objPatient: any = decodeURIComponent(query?.patient);
				objPatient = JSON.parse(objPatient);
				let resTheme: any = null;
				let resDetail: any = null;

				try {
					resDetail = await getConsultationDetailPartner(token);
					if (resDetail?.meta?.acknowledge && resDetail?.data) {
						resTheme = await fetchCachedTheme(
							resDetail?.data?.partner?.token ?? resDetail?.data?.token ?? '',
							{
								req,
								res,
							},
						);
					}
				} catch (error) {
					console.log('error on getconsultation detail partner : ', error);
				}

				return {
					props: {
						initialData: {
							token: token,
							params: objPatient,
						},
						...(!checkIsEmpty(resTheme) && resTheme?.meta?.acknowledge
							? {
									theme: resTheme,
									partnerToken: resDetail?.data?.partner?.token ?? '',
							  }
							: {}),
					},
				};
			} else {
				//verify data
				const resCheck = await checkConsultationByStatus(token, true);
				if (resCheck?.error) {
					throw resCheck?.msg ?? MESSAGE_CONST.SOMETHING_WENT_WRONG;
				} else {
					return resCheck;
				}
			}
		} else {
			throw 'token not available.';
		}
	} catch (error) {
		console.error('error on getdata by token : ', error, query?.token);
		return {
			redirect: {
				destination: '/invalid-link',
				permanent: false,
			},
		};
	}
};

export default Finding;
