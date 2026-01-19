import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
	GENERAL_CONST,
	LOCALSTORAGE,
	MESSAGE_CONST,
	ORDER_TYPE,
	PRESCRIPTION_CONST,
	checkIsEmpty,
	fetchCachedTheme,
	getConsulVerify,
	getParsedLocalStorage,
	getStorageParseDecrypt,
	getTimeLeft,
	handleOpenContactUrl,
	navigateWithQueryParams,
	removeLocalStorage,
	setStringifyLocalStorage,
	storeOrderNumber,
	storePartnerXid,
} from '../../helper';
import { getPatientRecommendation, getPrescriptionDetail } from '../../helper/Network/prescription';
import { consulDetailData, patientDetail, setTokenOrder } from '../../redux/actions';
import {
	setErrorAlertRedux,
	setIsChatExpired as setIsChatExpiredRedux,
	setIsPageLoading as setIsPageLoadingRedux,
	setVerifyData as setVerifyDataRedux,
} from '../../redux/trigger';
import { ConfirmationConst } from '../../types/Common';
import { PrescriptionDetailData } from '../../types/Prescription';
import usePartnerInfo from 'hooks/usePartnerInfo';

interface Props {
	general: {
		consulDetail?: {
			result: any;
		};
		isPageLoading: boolean;
	};
	consulDetailData: any;
	verifyData: any;
	consulDetailRedux: (param: string) => void;
	getPatientDetail?: (orderNumber: string, type: string) => any;
}

const withPrescriptionDetail = (WrappedComponent) => {
	const PrescriptionDetail = ({
		general,
		consulDetailData,
		verifyData,
		consulDetailRedux,
		getPatientDetail,
	}: Props) => {
		const router = useRouter();
		const dispatch = useDispatch();
		const [token, setToken] = useState<string>('');
		const [orderId, setOrderId] = useState<string>('');
		const [timeLeft, setTimeLeft] = useState<number>(0);
		const [data, setData] = useState<PrescriptionDetailData>(null);
		const [consultationData, setConsultationData] = useState<any>(null);
		const [isExpired, setIsExpired] = useState<boolean>(false);
		const [isAlreadyTriggerOnExpired, seIsAlreadyTriggerOnExpired] = useState<boolean>();

		const [confirmationButtonData, setConfirmationButtonData] = useState<ConfirmationConst>(null);
		const [disableBackButton, setDisableBackButton] = useState<boolean>(false);
		const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
		const [isOpenInfoBottomsheet, setIsOpenInfoBottomsheet] = useState<boolean>(false);
		const [isRedeemType, setIsRedeemType] = useState<boolean>(false);
		const [theme, setTheme] = useState(null);
		const [orderToken, setOrdertoken] = useState<string>('');
		const [patientData, setPatientData] = useState<any>(null);

		const isCheckingExpiredRef: any = useRef(null);

		usePartnerInfo({
			theme,
			token: orderToken,
		});

		useEffect(() => {
			setIsPageLoadingRedux(true);
			return () => {
				setIsPageLoadingRedux(false);
			};
		}, []);

		useEffect(() => {
			if (router?.isReady) {
				const queryToken: string = (router.query?.token as string) ?? '';
				getDataWithToken(queryToken);
			}
		}, [router, confirmationButtonData, isSubmitted]);

		useEffect(() => {
			console.log('updated loading', general?.isPageLoading);
		}, [general?.isPageLoading]);

		useEffect(() => {
			if ((timeLeft == null || timeLeft == 0) && !isAlreadyTriggerOnExpired) {
				if (global.tokenAuthorization && global.orderNumber && token && orderId) {
					getData();
				}
				seIsAlreadyTriggerOnExpired(timeLeft == 0);
			}
			if (!isCheckingExpiredRef.current && data != null) {
				isCheckingExpiredRef.current = true;
				setIsExpired(data?.prescriptionStatus == 'INVALID' ? true : false);
				setTimeout(() => {
					isCheckingExpiredRef.current = false;
				}, 60000);
			}
		}, [timeLeft, data]);

		useEffect(() => {
			if (data) {
				checkEmailed();
			}
		}, [data]);

		useEffect(() => {
			if (consulDetailData?.consultationPartner == ORDER_TYPE.PIVOT) setIsRedeemType(true);
		}, [consulDetailData]);

		const checkEmailed = async () => {
			const isEmailed = await getParsedLocalStorage(LOCALSTORAGE.EMAILED_PRESCRIPTION);
			if (
				general?.consulDetail?.result?.status != GENERAL_CONST.STARTED &&
				(isEmailed?.orderId != orderId || isEmailed?.status == false)
			) {
				setStringifyLocalStorage(LOCALSTORAGE.EMAILED_PRESCRIPTION, {
					status: true,
					orderId,
				});
				setIsOpenInfoBottomsheet(true);
			}
		};

		const checkByConsultationData = async (sessionData?: any) => {
			try {
				const consulDetail: any = await consulDetailRedux(
					sessionData?.orderNumber || sessionData?.data?.orderNumber || global?.orderNumber,
				);
				if (consulDetail?.meta != null && !consulDetail?.meta?.acknowledge) {
					setErrorAlertRedux({
						danger: true,
						data: {
							message: consulDetail?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
						},
					});
				} else {
					setConsultationData(consulDetail?.data);
				}

				return consulDetail;
			} catch (error) {
				console.log('error on getConsultationdata : ', error);
				return consultationData;
			}
		};

		const getDataWithToken = async (tkn?: string) => {
			try {
				let sessionData = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
				if (
					sessionData?.orderNumber != null &&
					verifyData?.orderNumber != null &&
					verifyData?.orderNumber != sessionData?.orderNumber
				) {
					removeLocalStorage(LOCALSTORAGE.CONSULTATION);
					sessionData = null;
				}
				if (!checkIsEmpty(tkn)) {
					sessionData = await getConsulVerify(tkn);
					if (!sessionData?.meta?.acknowledge) {
						router.push('/404');
						return;
					} else {
						if (sessionData?.data?.partner) {
							await storePartnerXid(sessionData?.data?.partner);
						}
					}
					await setVerifyDataRedux(sessionData.data);
					global.tokenAuthorization = sessionData?.data?.token;
					global.orderNumber = sessionData?.data?.orderNumber;
					storeOrderNumber(sessionData?.data?.orderNumber);
					setOrderId(sessionData?.data?.orderNumber);
					setToken(sessionData?.data?.tokenAuthorization ?? sessionData?.data?.token);
					setDisableBackButton(!router?.query?.chat);
					await checkByConsultationData(sessionData);
				} else if (global.tokenAuthorization && global.orderNumber) {
					setOrderId(global.orderNumber);
					setToken(global.tokenAuthorization);
					await checkByConsultationData();
				} else if (sessionData) {
					setOrderId(sessionData.orderNumber);
					setToken(sessionData.tokenAuthorization);
					global.tokenAuthorization = sessionData?.tokenAuthorization;
					global.orderNumber = sessionData?.orderNumber;

					const consulDetail = await checkByConsultationData(sessionData);

					if (
						consulDetail?.data?.status == GENERAL_CONST.EXPIRED ||
						consulDetail?.data?.status == GENERAL_CONST.CLOSED
					) {
						setIsChatExpiredRedux(true);
					}
				} else if (verifyData?.orderNumber && verifyData?.token) {
					global.tokenAuthorization = verifyData?.token;
					global.orderNumber = verifyData?.orderNumber;
					await checkByConsultationData();
					storeOrderNumber(verifyData?.orderNumber);
					setOrderId(verifyData?.orderNumber);
					setToken(verifyData?.token);
					setDisableBackButton(!router?.query?.chat);
				}
				getData(
					global?.orderNumber || sessionData?.orderNumber || sessionData?.data?.orderNumber,
				);
			} catch (e) {
				console.log('error get data with token', e);
			}
		};

		const checkShipping = async (orderNumber: any) => {
			const cartLocal = await getParsedLocalStorage(LOCALSTORAGE.CART);

			if (
				(!checkIsEmpty(cartLocal?.data?.shipping_method) ||
					!checkIsEmpty(cartLocal?.data?.data?.shipping_method)) &&
				orderNumber.length > 0
			) {
				navigateWithQueryParams(
					'/transaction/summary',
					{ ...router.query, id: orderNumber },
					'href',
				);
			} else return;
		};

		const getData = async (orderNumber = '') => {
			try {
				setIsPageLoadingRedux(true);
				checkShipping(orderId !== '' ? orderId : orderNumber);
				const res = await getPrescriptionDetail(orderId !== '' ? orderId : orderNumber);
				if (res?.meta?.acknowledge) {
					setOrdertoken(res?.data?.order_token);
					const dataPresc: PrescriptionDetailData = res?.data;
					const themeData = await fetchCachedTheme(dataPresc?.order_token);
					if (themeData?.meta?.acknowledge) {
						setTheme(themeData?.data);
					}
					const resPatientRecommendation = await getPatientRecommendation(
						orderId !== '' ? orderId : orderNumber,
					);
					if (resPatientRecommendation?.meta?.acknowledge) {
						dataPresc.patient_recommendation = resPatientRecommendation?.data;
					}
					setData(dataPresc);
					dispatch(setTokenOrder(dataPresc?.order_token ?? null));
					if (res?.data?.expired_at && res?.data?.expired_at !== '-') {
						const timeLeftTemp = getTimeLeft(res?.data?.expired_at);
						setTimeLeft(timeLeftTemp);
					}

					const patientData = await getPatientDetail(
						orderId !== '' ? orderId : orderNumber,
						'patient',
					);
					if (patientData?.meta?.acknowledge) {
						setPatientData(patientData?.data);
					}
				} else {
					router.push('/404');
				}
			} catch (error) {
				console.log('error on get data prescription : ', error);
			} finally {
				setIsPageLoadingRedux(false);
			}
		};

		const sendResponse = async (status: string, redirectToContact = false) => {
			try {
				if (status === PRESCRIPTION_CONST.INTERESTED) {
					const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
					const sessionData = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);

					const token_order =
						data?.order_token ??
						router?.query?.token_order ??
						(order?.orderId ==
						(global?.orderNumber ??
							sessionData?.orderNumber ??
							sessionData?.data?.orderNumber)
							? order?.partnerToken
							: null);
					let token = router.query?.token;
					if (!token) {
						const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
						token = temp?.token;
					}
					const query = {
						...router.query,
						id: global.orderNumber ?? orderId,
						...(checkIsEmpty(token) ? null : { token }),
						token_order,
						fromPresc: 1,
					};
					navigateWithQueryParams('/transaction/cart', query, 'href');
				} else {
					await getDataWithToken();
					handleOpenContactUrl(data?.contact_url);
					setIsSubmitted(true);
				}
			} catch (error) {
				console.log('error on send response : ', error);
			}
		};

		return (
			<WrappedComponent
				data={data}
				token={token}
				isExpired={isExpired}
				timeLeft={timeLeft}
				isRedeemType={isRedeemType}
				disableBackButton={disableBackButton}
				setTimeLeft={setTimeLeft}
				isOpenInfoBottomsheet={isOpenInfoBottomsheet}
				setIsOpenInfoBottomsheet={setIsOpenInfoBottomsheet}
				confirmationButtonData={confirmationButtonData}
				setConfirmationButtonData={setConfirmationButtonData}
				sendResponse={sendResponse}
				consultationData={consultationData}
				orderNumber={orderId}
				patientData={patientData}
				refreshData={() => {
					const queryToken: string = (router.query?.token as string) ?? '';
					getDataWithToken(queryToken);
				}}
			/>
		);
	};

	const mapStateToProps = (state) => ({
		general: state.general,
		consulDetailData: state.general.consulDetail.result,
		verifyData: state.verifyData.verifyData,
	});

	const mapDispatchToProps = (dispatch) => ({
		consulDetailRedux: (orderNumber) => dispatch(consulDetailData(orderNumber)),
		getPatientDetail: (orderNumber, type) => dispatch(patientDetail(orderNumber, type)),
	});

	return connect(mapStateToProps, mapDispatchToProps)(PrescriptionDetail);
};

export default withPrescriptionDetail;
