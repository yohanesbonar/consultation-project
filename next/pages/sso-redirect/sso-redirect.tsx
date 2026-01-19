// TODO: fix these lints
/* eslint-disable no-unsafe-finally */
/* eslint-disable @typescript-eslint/no-empty-function */
import { isBlockedUser } from 'helper/Network/requestHelper';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { SSORedirectTemplate } from '../../components';
import {
	addLog,
	checkIsEmpty,
	getStorageParseDecrypt,
	getTimeGap,
	getTimeLeft,
	LOCALSTORAGE,
	MESSAGE_CONST,
	removeLocalStorage,
	setLocalStorage,
	setStorageEncrypt,
	STATUS_CONSULTATION,
} from '../../helper';
import {
	actionConsultation,
	getRoomStatus,
	submitPartnerOrderConsultation,
	updateConsulStatus,
} from '../../helper/Network/consultation';
import { setErrorAlertRedux } from '../../redux/trigger';
import usePartnerInfo from 'hooks/usePartnerInfo';

type QueryDataType = {
	status?: boolean;
	t?: string;
	source?: string;
	consultation_id_full?: string;
};

type OrderType = {
	data?: {
		status?: string;
		consultationUrl?: string;
		waitingRoom?: string;
		tokenRoom?: string;
		expiredAt?: string;
		endUrl?: string;
	};
	meta?: {
		acknowledge?: boolean;
		errCode?: string;
		message?: string;
	};
};

type Props = {
	auth?: string;
	res?: OrderType;
	device?: string;
};

const SSORedirect = (props: Props) => {
	const router = useRouter();
	const [error, setError] = useState(false);
	const [timeLeft, setTimeLeft] = useState(null);
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [checkInit, setCheckInit] = useState(false);
	const [queryData, setQueryData] = useState<QueryDataType>({ status: false });
	const [duration, setDuration] = useState(null);
	const isCancelRef = useRef(false);
	const [isCanceled, setIsCanceled] = useState(false);
	const isEndedRef = useRef(false);
	const [submitted, setSubmitted] = useState(false);
	const waitingDataRef = useRef(null);
	const tokenRef = useRef(null);
	const [params, setParams] = useState(null);
	const [token, setToken] = useState(null);
	const [backUrl, setBackUrl] = useState(null);
	const [genError, setGenError] = useState(false);
	const [localData, setLocalData] = useState(null);
	// DK-86 : disable device on sso redirect
	// const device = props.device;

	// only on tokopedia, disabled whitelabel color scheme
	usePartnerInfo({ isByLocal: true });

	useEffect(() => {
		if (router?.isReady) {
			getStorageData();
			if (props?.auth && !checkIsEmpty(props.auth)) {
				global.tokenAuthorization = props.auth;
			}

			const redirectUrlQuery =
				router.query?.redirect_tokopedia || router.query?.redirect_url || '';

			// add log to the server
			addLog({
				queryUrl: JSON.stringify(router?.query ?? {}),
			});
			setLocalStorage(LOCALSTORAGE.REDIRECT_URL, redirectUrlQuery);

			setTimeout(async () => {
				setCheckInit(true);
				if (router?.query?.source && router?.query?.t) {
					setQueryData({ status: true, ...router.query });
				} else {
					setGenError(true);
				}
			}, 1000);
		}
	}, [router?.isReady]);

	useEffect(() => {
		if (queryData.status == true) {
			if (props?.res?.data?.status && props?.res?.data?.status == STATUS_CONSULTATION.FINDING) {
				handleSubmitResponse(props?.res);
			} else {
				orderConsul();
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
	}, [queryData]);

	const getStorageData = async () => {
		const actionData = await actionConsultation();

		if (actionData?.data?.back_url) {
			setTimeout(() => {
				localStorage.setItem(LOCALSTORAGE.BACK_URL, actionData?.data?.back_url);
			}, 500);
		}

		setBackUrl(actionData?.data?.back_url);
		const storageData = await getStorageParseDecrypt(LOCALSTORAGE.PARTNER_CONSUL);
		if (storageData != null) {
			const timeGapServer = getTimeGap(new Date(), actionData?.meta?.at);
			const timeLeftTemp = getTimeLeft(
				storageData.idleTime,
				moment().add(timeGapServer ?? 0, 'seconds'),
			);
			if (timeLeftTemp < 1) {
				setLocalData(null);
				removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
			} else {
				setLocalData(storageData);
			}
		}
	};

	const getCheckDataTimeleft = async () => {
		try {
			if (!isEndedRef.current) {
				const dataTemp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
				tokenRef.current = global.tokenAuthorization ?? props.auth;
				setParams(dataTemp?.params);
				setToken(dataTemp?.token);
				if (dataTemp?.waitingData != null) {
					setData({
						roomId: dataTemp?.waitingData?.waitingRoom,
						roomToken: dataTemp?.waitingData?.tokenRoom,
					});
					if (dataTemp != null) {
						const timeLeftTemp = getTimeLeft(dataTemp?.waitingData.expiredAt);
						setDuration(timeLeftTemp);
					}
				}
			}
		} catch (error) {
			console.log('error on get data : ', error);
		}
	};

	const orderConsul = async () => {
		if (!isEndedRef.current) {
			setDuration(1);
			setTimeout(async () => {
				if (!isCancelRef.current) {
					await submitOrder({
						token: queryData.t,
						...(router?.query?.consultation_id_full
							? { consultation_id_full: router?.query?.consultation_id_full }
							: {}),
					});
				}
			}, 1000);
		}
	};

	const resetData = () => {
		setError(false);
		setDuration(null);
		setTimeLeft(null);
		setData(null);
		setIsCanceled(false);
		setIsLoading(false);
		isEndedRef.current = false;
	};

	const checkIdleTime = async () => {
		if (localData != null) {
			const actionData = await actionConsultation();
			const timeGapServer = getTimeGap(new Date(), actionData?.meta?.at);
			const timeLeftTemp = getTimeLeft(
				localData.idleTime,
				moment().add(timeGapServer ?? 0, 'seconds'),
			);
			return timeLeftTemp;
		} else {
			return 99;
		}
	};

	const handleSubmitResponse = async (res) => {
		try {
			if (
				res?.data?.consultationUrl &&
				!(res?.data?.status && res?.data?.status === STATUS_CONSULTATION.FINDING)
			) {
				return window.location.replace(res?.data?.consultationUrl);
			}

			if (res?.meta?.acknowledge) {
				resetData();
				setData({
					roomId: res?.data?.waitingRoom,
					roomToken: res?.data?.tokenRoom,
				});
				if (res?.data != null) {
					const timeGapServer = getTimeGap(new Date(), res?.meta?.at);
					const timeLeftTemp = getTimeLeft(
						res?.data.expiredAt,
						moment().add(timeGapServer ?? 0, 'seconds'),
					);
					setDuration(timeLeftTemp);
				}
				setSubmitted(true);
				waitingDataRef.current = {
					...res?.data,
				};

				setBackUrl(res?.data?.endUrl);

				const checkLocalData = await getStorageParseDecrypt(LOCALSTORAGE.PARTNER_CONSUL);

				if (checkLocalData == null) {
					await setStorageEncrypt(LOCALSTORAGE.PARTNER_CONSUL, res?.data);
				}
			} else {
				console.log('error redux', res?.meta);
				if (res?.meta?.errCode) {
					setGenError(true);
				} else {
					setErrorAlertRedux({
						danger: true,
						data: {
							message: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
						},
					});
					setError(true);
				}
			}
		} catch (error) {
			console.log('error on handle submit response : ', error);
		}
	};

	const submitOrder = async (body) => {
		try {
			setIsLoading(true);
			const idleTimeLeft = await checkIdleTime();
			if (idleTimeLeft < 1) {
				setBackUrl(localData?.endUrl);
				return setGenError(true);
			}
			// block user flag
			const res = await submitPartnerOrderConsultation({ ...body });
			console.log('submit order : ', res);

			if (
				res?.data?.meta?.status &&
				res?.data?.meta?.message &&
				isBlockedUser(res?.data?.meta?.status, res?.data?.meta?.message)
			) {
				return Router.push('/blocked');
			}

			return await handleSubmitResponse(res);
		} catch (error) {
			console.log('error on submit order : ', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onReceiveSocket = async (res) => {
		console.log('onreceive', res);
		if (res.orderNumber && res.token) {
			try {
				await setStorageEncrypt(LOCALSTORAGE.ORDER, {
					token: res?.token,
					orderNumber: res?.orderNumber,
				});
				// block user flag
				const orderRes = await submitPartnerOrderConsultation({
					token: queryData?.t,
					...(router?.query?.consultation_id_full
						? { consultation_id_full: router?.query?.consultation_id_full }
						: {}),
				});

				if (
					orderRes?.data?.meta?.status &&
					orderRes?.data?.meta?.message &&
					isBlockedUser(orderRes?.data?.meta?.status, orderRes?.data?.meta?.message)
				) {
					return Router.push('/blocked');
				}

				window.location.replace(orderRes?.data?.consultationUrl);
			} catch (error) {
				console.log('error on receive socket : ', error);
			}
		}
	};

	const udpateConsultation = async () => {
		try {
			const resCheck = await getRoomStatus(
				waitingDataRef.current?.waitingRoom,
				tokenRef.current ?? global.tokenAuthorization ?? props.auth,
			);

			if (resCheck?.meta?.acknowledge) {
				if (resCheck?.data?.snapUrl) {
					window.location.replace(resCheck?.data?.snapUrl);
				}
			}
		} catch (error) {
			console.log('error on update consultation : ', error);
		}
	};

	return (
		<>
			<SSORedirectTemplate
				updateConsulStatus={updateConsulStatus}
				backUrl={backUrl}
				data={data}
				isLoading={isLoading}
				resetData={resetData}
				setDuration={setDuration}
				isCancelRef={isCancelRef}
				submitOrder={submitOrder}
				queryData={queryData}
				error={error}
				timeLeft={timeLeft}
				onReceiveSocket={onReceiveSocket}
				duration={duration}
				isCanceled={isCanceled}
				setTimeLeft={setTimeLeft}
				isEndedRef={isEndedRef}
				checkInit={checkInit}
				genError={genError}
				udpateConsultation={udpateConsultation}
			/>
		</>
	);
};

export default SSORedirect;
