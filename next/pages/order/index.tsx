import Router, { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { PivotParamsType } from '@types';
import { isClientErrorCode, isServerErrorCode } from 'helper/Network/requestHelper';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { ButtonHighlight, OrderTemplate } from '../../components';
import {
	BUTTON_CONST,
	BUTTON_ID,
	INPUTFORM_CONST,
	LOCALSTORAGE,
	MESSAGE_CONST,
	PAYMENT_STATUS,
	PARAMS_CONST,
	STATUS_CONSULTATION,
	checkCookieSession,
	encryptData,
	getConsultationDetailPartner,
	getLocalStorage,
	getPartnerDetail,
	initialOrdersTemp,
	removeLocalStorage,
	setLocalStorage,
	setStorageEncrypt,
	setStringifyLocalStorage,
	storePathValues,
	updateFormLocalStorage,
	validateInput,
	setCRPartner,
	navigateWithQueryParams,
	getParsedLocalStorage,
	checkIsEmpty,
	STATUS_CONST,
	requestTransaction,
	ShieldClient,
	fetchCachedTheme,
	CONSULTATION_TYPE,
	findFieldIndexBySlug,
	showLocalNotification,
} from '../../helper';
import { setErrorAlertRedux, setPivotParams as setPivotParamsRedux } from '../../redux/trigger';
import { FORM_CONSULTATION } from '../form-consultation';
import { TSpecialization } from 'components/templates/OrderTemplate';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { getShieldStateFromStorage, SHIELD_ERROR_ID } from 'helper/Shield';

export interface IOrderProps {
	pivotParams: PivotParamsType;
	initialData?: any;
	initialPartner?: any;
	theme?: any;
	backUrl?: string;
}

function Order(props: IOrderProps) {
	const router = useRouter();
	const { fromPage, token, mcu, ct, crt, backto } = router.query;

	const [forms, setForms] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isGetPartnerLoading, setIsGetPartnerLoading] = useState(true);
	const [showInformConsent, setShowInformConsent] = useState(false);
	const [showEmailConfirm, setShowEmailConfirm] = useState(false);
	const [partnerDetail, setPartnerDetail] = useState<any>();
	const initialSpecialistRef = useRef<any>(null);
	const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(false);
	const [showPopupDoctor, setShowPopupDoctor] = useState(false);
	const [isNotificationShown, setIsNotificationShown] = useState(false);
	const [showTncModal, setShowTncModal] = useState(false);
	const isMcu = mcu?.toString();

	useEffect(() => {
		if (
			!isGetPartnerLoading &&
			!isNotificationShown &&
			router?.query?.fromPage !== PARAMS_CONST.ADDRESS
		) {
			setIsNotificationShown(true);
			showLocalNotification({
				title: 'Click untuk membuka konsultasi kembali',
				body: 'Anda juga bisa membuka konsultasi kembali melalui link yang sudah dikirimkan ke email Anda.',
				token: token as string,
			});
		}
	}, [isGetPartnerLoading, isNotificationShown]);

	const formSlugs = props?.initialData?.partner?.forms ?? [];
	const withSpecialist = checkIsEmpty(formSlugs) || formSlugs?.includes('specialist');

	const orderFormFiltered = !ct
		? initialOrdersTemp
		: formSlugs?.length === 0
		? initialOrdersTemp
		: initialOrdersTemp.filter((item) => formSlugs.includes(item.slug));

	const isMcuForm = useMemo(() => {
		const patientInfo = partnerDetail?.patientInfo;
		return (
			patientInfo?.name &&
			patientInfo?.gender &&
			patientInfo?.born_date &&
			patientInfo.is_readonly
		);
	}, [partnerDetail]);

	const doctorSpecialization = useMemo(() => {
		return partnerDetail?.specialists?.find((item) => item.id === forms[0]?.value) || null;
	}, [forms, partnerDetail]);

	usePartnerInfo({
		theme: props?.theme,
		token: checkIsEmpty(props.initialData)
			? (token as string)
			: props.initialData?.partner?.token,
	});

	const autoFillForm = async () => {
		try {
			const form = await getLocalStorage(LOCALSTORAGE.INITIAL_FORM);
			const fromPageQuery = router?.query?.fromPage;

			if (form && fromPageQuery === PARAMS_CONST.ADDRESS) {
				const autofillForm = [...JSON.parse(form).forms];
				autofillForm.forEach((item) => {
					let value = item.value;
					if (item.type === INPUTFORM_CONST.dropdown) {
						value = {
							id: item.value,
							valueText: item.valueText,
						};
					}
					const _form = {
						disabled: item.disabled,
						err: item.errorMessage,
						formId: item.slug,
						hidden: item.hidden,
						name: item.name,
						options: item.options,
						type: item.type,
						value,
					};
					onChangeForm(_form);
				});
				getAddress();
			} else {
				removeLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
				removeLocalStorage(LOCALSTORAGE.ADDRESS);
				removeLocalStorage(LOCALSTORAGE.INITIAL_FORM);
				removeLocalStorage(LOCALSTORAGE.PARTNER);
				const formTemp: any = updateFromInitialData();
				setForms(formTemp);
			}
		} catch (error) {
			console.log('err', error);
		}
	};

	// condition for guepay rp.0 (free-paid)
	const isFreePaid = partnerDetail?.paymentType === PAYMENT_STATUS.PAID;

	useEffect(() => {
		if (router?.isReady) {
			updateFromInitialData();
			storePathValues();
			autoFillForm();
			if (sessionStorage.getItem('prevPath') == '/tnc') {
				setShowInformConsent(true);
				sessionStorage.removeItem('prevPath');
			}
			getPartner();
			// eslint-disable-next-line react-hooks/exhaustive-deps
			storeConsulationRequestPartner();
		}
	}, [router?.isReady]);

	const storeConsulationRequestPartner = async () => {
		try {
			setCRPartner(
				props?.initialData?.consultationRequestToken,
				props?.initialData?.transaction,
			);
		} catch (error) {
			console.log('error on store order partner : ', error);
		}
	};

	const updateFromInitialData = () => {
		try {
			if (props?.initialData?.patient) {
				const patientData = props?.initialData?.patient;
				const temp = orderFormFiltered;
				const hasAddressDetail =
					(patientData?.latitude != null || patientData?.lat != null) &&
					(patientData?.longitude != null || patientData?.lng != null) &&
					patientData?.postal_code != null;

				temp.forEach((e: any, i: number) => {
					if (e?.name == FORM_CONSULTATION.GENDER) {
						temp[i].value = patientData?.gender
							? (patientData[e?.name] ?? '').toUpperCase() === 'MALE'
								? 1
								: 2
							: null;
					} else if (e?.name == FORM_CONSULTATION.AGE && patientData?.birthdate) {
						temp[i].value = patientData?.birthdate;
					} else if (e?.name == FORM_CONSULTATION.ADDRESS) {
						if (hasAddressDetail) {
							temp[i].value = patientData?.address;
						}
					} else if (patientData[e?.name]) {
						temp[i].value = patientData[e?.name];
					}
				});

				if (hasAddressDetail) {
					syncAddress(patientData);
				}

				if (patientData?.specialist) {
					initialSpecialistRef.current = patientData?.specialist_id;
				}

				return temp;
			}
		} catch (error) {
			console.log('error on updateFromInitialData : ', error);
			return null;
		}
	};

	const getAddress = async () => {
		let fromStorageAddress: any = await getLocalStorage(LOCALSTORAGE.ADDRESS);
		fromStorageAddress = JSON.parse(fromStorageAddress);

		onChangeForm({
			formId: 'address',
			value: String(fromStorageAddress?.name)
				.substring(0, initialOrdersTemp[6]?.max_length)
				.trim(),
			disabled: undefined,
		});

		onChangeForm({
			formId: 'post_code',
			value: fromStorageAddress?.postalCode,
			disabled: undefined,
			hidden: false,
		});

		onChangeForm({
			formId: 'lat',
			value: fromStorageAddress?.lat,
			disabled: undefined,
		});

		onChangeForm({
			formId: 'long',
			value: fromStorageAddress?.lng,
			disabled: undefined,
		});
	};

	const onChangeForm = (params: {
		name?: string;
		type?: string;
		formId?: string;
		value?: { id: string; valueText?: string; name?: string } | any;
		err?: any;
		options?: any;
		disabled?: boolean;
		hidden?: boolean;
	}) => {
		const { name, type, formId, value, err = null, options, disabled, hidden } = params;
		const indexForm = findFieldIndexBySlug(formId, orderFormFiltered);

		const formsTemp = Object.assign([], forms && forms?.length ? forms : orderFormFiltered);

		updateFormLocalStorage(
			null,
			name ?? formsTemp[indexForm].name,
			type ?? formsTemp[indexForm].type,
			value ?? formsTemp[indexForm].value,
			formsTemp[indexForm].isRequired,
			err ?? formsTemp[indexForm].errorMessage,
			options ?? formsTemp[indexForm].options,
			partnerDetail?.partnerXid,
			token,
		);
		if (type == INPUTFORM_CONST.dropdown) {
			formsTemp[indexForm].value = value?.id;
			formsTemp[indexForm].valueText = value?.valueText ?? value?.name;
		} else {
			formsTemp[indexForm].value = value;
		}
		formsTemp[indexForm].errorMessage = err;
		formsTemp[indexForm].options = options ?? formsTemp[indexForm].options;

		if (typeof disabled === 'boolean') formsTemp[indexForm].disabled = disabled;
		if (typeof hidden === 'boolean') formsTemp[indexForm].hidden = hidden;

		setForms(formsTemp);
	};

	useEffect(() => {
		if (partnerDetail) {
			syncPatientData();
		}
	}, [partnerDetail]);

	const syncAddress = (patientInfo?: any) => {
		try {
			if (
				patientInfo.address &&
				patientInfo.latitude &&
				patientInfo.longitude &&
				patientInfo.postal_code
			) {
				const payload = {
					name: patientInfo.address,
					lat: patientInfo.latitude,
					lng: patientInfo.longitude,
					postalCode: patientInfo.postal_code,
				};

				setLocalStorage(
					Router?.query?.summary || Router?.query?.cart
						? LOCALSTORAGE.TEMP_ADDRESS
						: LOCALSTORAGE.ADDRESS,
					JSON.stringify(payload),
				);

				onChangeForm({
					formId: 'address',
					value: patientInfo.address,
					// disabled: isReadOnly,
				});

				onChangeForm({
					formId: 'post_code',
					value: patientInfo.postal_code,
					// disabled: isReadOnly,
					hidden: false,
				});

				onChangeForm({
					formId: 'lat',
					value: patientInfo.latitude,
					// disabled: isReadOnly,
				});

				onChangeForm({
					formId: 'long',
					value: patientInfo.longitude,
					// disabled: isReadOnly,
				});
			}
		} catch (error) {
			console.log('error on  : ', error);
		}
	};

	const syncPatientData = () => {
		const patientInfo = partnerDetail?.patientInfo;
		const specialization = partnerDetail?.specialization;
		if (patientInfo) {
			/**
			 * Entry point from cta email
			 * Patient data provided from Backend
			 * So user doesn't need to fill up the form
			 * And the input should be disabled
			 */

			const isReadOnly = patientInfo.is_readonly;
			const isHideIdentityForm =
				patientInfo.name && patientInfo.gender && patientInfo.born_date && isReadOnly;

			if (fromPage !== PARAMS_CONST.ADDRESS) {
				if (specialization) {
					onChangeForm({
						formId: 'specialist',
						value: {
							id: specialization.specialization_id,
							valueText: specialization.specialization_name,
						},
						type: INPUTFORM_CONST.dropdown,
						disabled: isReadOnly,
						hidden: true,
					});
				}

				if (patientInfo.name) {
					onChangeForm({
						formId: 'name',
						value: patientInfo.name,
						// disabled: isReadOnly,
						hidden: isHideIdentityForm,
					});
				}

				if (patientInfo.gender) {
					onChangeForm({
						formId: 'gender',
						value: (patientInfo.gender ?? '').toUpperCase() === 'MALE' ? 1 : 2,
						// disabled: isReadOnly,
						hidden: isHideIdentityForm,
					});
				}

				if (patientInfo.born_date) {
					onChangeForm({
						formId: 'birthdate',
						value: new Date(patientInfo.born_date),
						// disabled: isReadOnly,
						// hidden: isHideIdentityForm,
					});
				}

				if (patientInfo.email) {
					onChangeForm({
						formId: 'email',
						value: patientInfo.email,
						// disabled: isReadOnly,
					});
				}

				if (patientInfo.phonenumber) {
					onChangeForm({
						formId: 'phone',
						value: patientInfo.phonenumber,
						// disabled: isReadOnly,
					});
				}

				syncAddress(patientInfo);

				if (patientInfo.detail_address) {
					onChangeForm({
						formId: 'detail_address',
						value: patientInfo.detail_address,
						// disabled: isReadOnly,
					});
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};

	const getPartner = async () => {
		// console.time('getpartnerDuration');
		try {
			setIsGetPartnerLoading(true);
			if (props?.initialData?.partner) {
				const tempPartner = props?.initialData?.partner;
				if (props?.initialPartner) tempPartner.paymentType = props?.initialPartner?.paymentType;

				setLocalStorage(LOCALSTORAGE.LOGO, tempPartner?.logo ?? '');
				setPartnerDetail(tempPartner);
				// setXid(tempPartner?.xid);
				await setStorageEncrypt(LOCALSTORAGE.XID, tempPartner?.xid);

				const formLocal: any = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);
				const specialistList = tempPartner?.specialists ?? [];
				const selectedSpecialist = tempPartner?.specialists?.find(
					(e: any) =>
						e?.id ===
						(formLocal?.forms?.length &&
						formLocal?.forms[0]?.name === FORM_CONSULTATION.SPECIALIST &&
						formLocal?.forms[0]?.value != null
							? formLocal?.forms[0]?.value
							: props?.initialData?.patient?.specialist_id ?? specialistList[0]?.id),
				);

				onChangeForm({
					formId: 'specialist',
					options: specialistList,
					type: INPUTFORM_CONST.dropdown,
					value: selectedSpecialist ?? {},
					disabled:
						!checkIsEmpty(ct) && !checkIsEmpty(props?.initialData?.patient?.specialist_id),
					hidden: true,
				});
			} else {
				const res = await getPartnerDetail(token);
				if (res.status && isClientErrorCode(res.status)) {
					const dataRes = res?.data;
					setLocalStorage(LOCALSTORAGE.LOGO, dataRes?.data?.partnerLogo || '');
					if (res?.data?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
						const payload = {
							from: '/order',
							query: router.query,
							data: res?.data?.data,
						};
						setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
						setTimeout(() => {
							return Router.push({
								pathname: '/partner-closed',
								query: { token },
							});
						}, 300);
					} else {
						return window.location.replace('/invalid-link');
					}
				} else if (res.status && isServerErrorCode(res.status)) return Router.push('/503'); // TODO: when the other api call need this handler, move to api call func
				if (res?.meta?.acknowledge) {
					setLocalStorage(LOCALSTORAGE.LOGO, res?.data?.logo ?? '');
					await setStorageEncrypt(LOCALSTORAGE.XID, res?.data?.partnerXid);
					if (res?.data?.specialists && res?.data?.specialists?.length) {
						const specialists = res?.data?.specialists;
						const initialFormFromStorage = await getLocalStorage(LOCALSTORAGE.INITIAL_FORM);
						if (!initialFormFromStorage) {
							let availableSpecialist = null;
							for (let i = 0; i < specialists.length; i++) {
								const specialist = specialists[i];
								const schedules = specialist?.schedules ?? [];
								if (schedules.length) {
									const todayInNumber = momentTimezone.tz('Asia/Jakarta').isoWeekday();
									// console.debug('todayInNumber', todayInNumber);
									const todaySchedules = schedules.filter(
										(schedule) => schedule.day === todayInNumber,
									);
									// console.debug('todaySchedules', todaySchedules);
									const closestSchedule = todaySchedules.find((schedule) =>
										momentTimezone
											.tz('Asia/Jakarta')
											.isBetween(
												momentTimezone.tz(
													schedule.hour_from,
													'HH:mm:ss',
													'Asia/Jakarta',
												),
												momentTimezone.tz(schedule.hour_to, 'HH:mm:ss', 'Asia/Jakarta'),
											),
									);
									if (closestSchedule) {
										availableSpecialist = specialist;
										break;
									}
								}
							}

							if (availableSpecialist) {
								onChangeForm({
									formId: 'specialist',
									options: specialists,
									type: INPUTFORM_CONST.dropdown,
									value: {
										id: availableSpecialist?.id,
										valueText: availableSpecialist?.name,
									},
									hidden: true,
								});
							} else {
								onChangeForm({
									formId: 'specialist',
									options: specialists,
									type: INPUTFORM_CONST.dropdown,
									value: {
										id: specialists[0]?.id,
										valueText: specialists[0]?.name,
									},
									hidden: true,
								});
							}
						}
						setPartnerDetail(res?.data);
					} else {
						if (res?.data?.data?.status != STATUS_CONST.OUT_OFF_SCHEDULE) {
							setErrorAlertRedux({
								danger: true,
								data: {
									message: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
								},
							});
						}
					}
				}
			}
		} catch (error) {
			console.log('error on get parter detail : ', error);
		} finally {
			// console.timeEnd('getpartnerDuration');
			setTimeout(() => {
				setIsGetPartnerLoading(false);
			}, 3000);
		}
	};

	const checkIfValidOrder = () => {
		let isValid = true;
		try {
			forms?.forEach((el) => {
				const err = validateInput(el?.name, el?.value);
				if (err) {
					isValid = false;
					onChangeForm({
						name: el?.name,
						type: el?.type,
						formId: el?.slug,
						value: el?.value ?? '',
						err: err,
					});
				}
			});
		} catch (error) {
			console.error('error validation: ', error);
		}
		return isValid;
	};
	const handleConfirmEmail = () => {
		setShowEmailConfirm(false);
		if (isMcu || partnerDetail?.patientInfo) {
			submitInformConsent();
		} else {
			setShowInformConsent(true);
		}
	};

	const handleSelectDoctor = (specialization: TSpecialization) => {
		onChangeForm({
			formId: 'specialist',
			value: {
				id: specialization.specialization_id,
				valueText: specialization.specialization_name,
			},
			type: INPUTFORM_CONST.dropdown,
			disabled: false,
			hidden: true,
		});
	};

	const handleSubmitForm = async () => {
		try {
			if (checkIfValidOrder()) {
				const progressForm = {
					orderId: null,
					forms: forms,
					partnerXid: partnerDetail?.partnerXid,
					partnerToken: token,
				};
				await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, progressForm);
				await setStringifyLocalStorage(LOCALSTORAGE.INITIAL_FORM, progressForm);
				const address: any = await getLocalStorage(LOCALSTORAGE.ADDRESS);
				setIsLoading(true);
				const params: any = {};
				forms?.forEach((element) => {
					const name = element.name;
					if (element.name == FORM_CONSULTATION.GENDER) {
						if (element.value == 1) {
							params[name] = 'MALE';
						} else {
							params[name] = 'FEMALE';
						}
					} else if (element.name == FORM_CONSULTATION.AGE) {
						params[name] = moment().diff(element.value, 'years') + ' Tahun';
						params['birthdate'] = element?.value;
					} else {
						params[name] = element.value;
					}
				});
				params.latitude = JSON.parse(address)?.lat;
				params.longitude = JSON.parse(address)?.lng;
				if (JSON.parse(address)?.postalCode)
					params.postal_code = JSON.parse(address)?.postalCode;
				if (partnerDetail) {
					await setStorageEncrypt(
						LOCALSTORAGE.XID,
						partnerDetail?.partnerXid ?? partnerDetail?.xid,
					);
					setPivotParamsRedux(params);
					// if (
					// 	partnerDetail?.paymentType === PAYMENT_STATUS.NON_PAID &&
					// 	!partnerDetail?.patientInfo
					// ) {
					// 	setShowInformConsent(!showInformConsent);
					// } else {
					setShowEmailConfirm(!showEmailConfirm);
					// }
				} else {
					setErrorAlertRedux({
						danger: true,
						data: {
							message: MESSAGE_CONST.SOMETHING_WENT_WRONG,
						},
					});
				}
			} else {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: MESSAGE_CONST.INVALID_FORM,
					},
				});
			}
		} catch (error) {
			console.log('error on get submit : ', error);
		} finally {
			setTimeout(() => {
				setIsLoading(false);
			}, 2000);
		}
	};

	const submitInformConsent = async (additionalParams = {}) => {
		//additionalParams => allowPromotionalContent;
		const bodyRequest = {
			...props?.pivotParams,
			...additionalParams,
		};
		try {
			setIsDisableSubmit(true);
			const resPartner = !ct ? await getPartnerDetail(token) : null;
			if (resPartner?.data?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
				setIsDisableSubmit(false);
				const data = {
					from: '/order',
					query: router.query,
					data: resPartner?.data?.data,
				};
				setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, data);
				setTimeout(() => {
					return router.push({
						pathname: '/partner-closed',
						query: { token },
					});
				}, 300);
			} else {
				await setStorageEncrypt(LOCALSTORAGE.ORDER, {
					token: token,
					params: bodyRequest,
				});
				if (
					partnerDetail?.paymentType === PAYMENT_STATUS.NON_PAID &&
					!router?.query?.ct &&
					!isFreePaid
				) {
					setIsDisableSubmit(false);
					const params = { action: await encryptData('orderConsul') };
					return navigateWithQueryParams('/onboarding', params, 'replace');
				} else {
					const shield = await getShieldStateFromStorage();
					const device = shield?.result ?? SHIELD_ERROR_ID;

					if (router?.query?.ct) {
						try {
							if (partnerDetail?.paymentType === PAYMENT_STATUS.PAID) {
								requestTransaction({
									router,
									body: bodyRequest,
									token: router?.query?.ct as string,
									props,
									partnerDetail,
									isFreePaid,
									finallyCallback: () => {
										setTimeout(() => {
											setIsDisableSubmit(false);
										}, 1000);
									},
									errorCallback: () => setIsDisableSubmit(false),
									device,
								});
							} else {
								let urlParam: any = JSON.stringify(bodyRequest);
								urlParam = encodeURIComponent(urlParam);

								const findingParams = {
									token: router?.query?.ct,
									action: await encryptData('orderConsul'),
									patient: urlParam,
								};

								return navigateWithQueryParams('/finding', findingParams, 'replace');
							}
						} catch (error) {
							setIsDisableSubmit(false);
							console.log('error on submit to onboarding : ', error);
						}
					} else {
						requestTransaction({
							router,
							body: bodyRequest,
							token: token as string,
							props,
							partnerDetail,
							isFreePaid,
							finallyCallback: () => {
								setTimeout(() => {
									setIsDisableSubmit(false);
								}, 1000);
							},
							errorCallback: () => setIsDisableSubmit(false),
							device,
						});
					}
				}
			}
		} catch (error) {
			setIsDisableSubmit(false);
			setErrorAlertRedux({
				danger: true,
				data: {
					message: error?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			});
			console.log('error on submit inform consent : ', error);
		}
	};

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<div className="tw-flex tw-mt-4">
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_FORM_SAVE}
						onClick={handleSubmitForm}
						text={
							isMcu || partnerDetail?.patientInfo
								? BUTTON_CONST.SAVE_AND_SUBMIT
								: BUTTON_CONST.SAVE
						}
						isDisabled={
							isLoading || ((isMcu || partnerDetail?.patientInfo) && isDisableSubmit)
						}
						isLoading={
							isLoading || ((isMcu || partnerDetail?.patientInfo) && isDisableSubmit)
						}
						circularContainerClassName="tw-h-4"
						circularClassName="circular-inner-16"
						color={'primary'}
					/>
				</div>
			</div>
		);
	};

	const onChangeErrorMessage = ({ name, errorMessage = null, type, formId, value }) => {
		onChangeForm({
			name: name,
			type: type,
			formId: formId,
			value: value,
			err: errorMessage,
		});
	};

	const toggleInformConsent = () => {
		const showing = !showInformConsent;
		showing
			? (document.body.style.overflow = 'hidden')
			: (document.body.style.overflow = 'visible');

		setShowInformConsent(showing);
	};

	const toggleTncModal = () => {
		const showing = !showTncModal;
		showing
			? (document.body.style.overflow = 'hidden')
			: (document.body.style.overflow = 'visible');

		setShowTncModal(showing);
	};

	const openTncModal = (_type: string) => {
		setShowTncModal(true);
		document.body.style.overflow = 'hidden';
	};

	const onClickAddressLink = async (link: string) => {
		const progressForm = { orderId: null, forms: forms, partnerToken: token };
		await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, progressForm);
		await setStringifyLocalStorage(LOCALSTORAGE.INITIAL_FORM, progressForm);
		let tempLink = link?.includes('token=') || !token ? link : `${link}?token=${token}`;
		if (ct) {
			tempLink += (tempLink.includes('?') ? '&' : '?') + 'ct=' + ct;
			if (crt) {
				tempLink += `&crt=${crt}`;
			}
			if (backto) {
				tempLink += `&backto=${backto}`;
			}
		}
		router.push(tempLink);
	};

	return (
		<>
			{router?.isReady ? <ShieldClient enabled={true} /> : null}
			<OrderTemplate
				footerComponent={renderFooterButton}
				forms={forms}
				handleFormChange={onChangeForm}
				handleFormChangeError={onChangeErrorMessage}
				emailConfirmShow={showEmailConfirm}
				emailConfirmToggle={() => setShowEmailConfirm(!showEmailConfirm)}
				submitForm={handleConfirmEmail}
				informConsentShow={showInformConsent}
				informConsentToggle={toggleInformConsent}
				informConsentSubmit={submitInformConsent}
				logoUrl={partnerDetail?.logo}
				isLoading={isGetPartnerLoading}
				isNonPaid={partnerDetail?.paymentType === PAYMENT_STATUS.NON_PAID}
				partnerDetail={partnerDetail}
				isDisableSubmit={isDisableSubmit}
				handleClickLink={onClickAddressLink}
				fromPage={fromPage?.toString()}
				isMcuForm={isMcuForm}
				showPopupDoctor={showPopupDoctor}
				popupDoctorToggle={() => setShowPopupDoctor(!showPopupDoctor)}
				selectDoctor={handleSelectDoctor}
				doctorSpecialization={doctorSpecialization}
				backUrl={props?.backUrl}
				withSpecialist={withSpecialist}
				showTncModal={showTncModal}
				tncModalToggle={toggleTncModal}
				openTncModal={openTncModal}
			/>
		</>
	);
}

const mapStateToProps = (state) => ({
	verifyData: state.verifyData.verifyData,
	pivotParams: state.consultation.pivotParams,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapDispatchToProps = (dispatch) => ({});

export const getServerSideProps = async ({ req, res, query }) => {
	// todo: update ke clientside
	const consulTime = await checkCookieSession(req, res);

	let result: any = { props: {} };
	let resTheme: any = null;
	if (query?.token) {
		resTheme = await fetchCachedTheme(query?.token as string, { req, res });
		if (resTheme != null) {
			result = {
				...result,
				props: {
					theme: resTheme?.data ?? null,
				},
			};
		}
	}

	if (consulTime?.timeLeft > 0 && consulTime?.status == 'STARTED') {
		result = {
			redirect: {
				destination: '/chat-detail',
				permanent: false,
			},
		};
	} else if (!query?.token && !query?.ct) {
		result = {
			notFound: true,
		};
	}

	const { ct, backto } = query;
	//todo : verity data, get detail order, & listen to socket.
	if (ct) {
		const resDetail = await getConsultationDetailPartner(ct);
		const resPartner = await getPartnerDetail(ct, 'PARTNER');
		if (resDetail?.meta?.acknowledge && resDetail?.data) {
			const partnerConsultation = resDetail?.data;
			resTheme = await fetchCachedTheme(partnerConsultation?.partner?.token as string, {
				req,
				res,
			});
			const partnerDetail = resPartner?.data;

			// back button shopee
			// consultationType & back_url sekarang sudah ada di api 3 September 2025
			const isApproval = partnerConsultation?.consultationType === CONSULTATION_TYPE.APPROVAL;

			let backUrl = null; // if ct && back_url is string && isApproval

			if (
				typeof partnerConsultation?.partner?.back_url === 'string' &&
				partnerConsultation?.partner?.back_url.length &&
				isApproval
			) {
				backUrl = partnerConsultation?.partner?.back_url;
			}

			if (partnerConsultation?.status === STATUS_CONSULTATION.UNVERIFIED) {
				result = {
					props: {
						...result?.props,
						initialData: partnerConsultation,
						initialPartner: partnerDetail,
						theme: resTheme?.data ?? null,
						backUrl,
					},
				};
			} else if (partnerConsultation?.status === STATUS_CONSULTATION.ON_TRANSACTION) {
				result = {
					props: {
						...result?.props,
						initialData: partnerConsultation,
						initialPartner: partnerDetail,
						theme: resTheme?.data ?? null,
						backUrl,
					},
				};
			} else if (partnerConsultation?.status === STATUS_CONSULTATION.VERIFIED) {
				result = {
					redirect: {
						destination: `/finding?token=${query?.ct}${
							backto != null ? '&backto=' + backto : ''
						}`,
						permanent: false,
					},
				};
			} else {
				result = {
					notFound: true,
					props: {
						initialData: partnerConsultation,
						theme: resTheme?.data ?? null,
						backUrl,
					},
				};
			}
		}
	}
	return result;
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
