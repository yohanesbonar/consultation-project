/* eslint-disable no-unsafe-finally */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Router, { useRouter } from 'next/router';
import moment from 'moment';

import {
	checkCookieSession,
	checkSimilarity,
	CONFIRMATION_CONST,
	CONFIRMATION_KEY_CONST,
	CONSULTATION_TYPE,
	excludeDetailedAddress,
	fetchCachedTheme,
	findFieldIndexBySlug,
	getLocalStorage,
	getParsedLocalStorage,
	getStorageDecrypt,
	getStorageParseDecrypt,
	initialFormsTemp,
	INPUTFORM_CONST,
	LOCALSTORAGE,
	MESSAGE_CONST,
	PAGE_ID,
	PARAMS_CONST,
	removeLocalStorage,
	SEAMLESS_CONST,
	setStringifyLocalStorage,
	updateFormLocalStorage,
	validateInput,
} from '../helper';
import { professionList, submitConsultation } from '../redux/actions';
import { CALLBACK_CONST_POPUPBOTTOMSHEET } from '../components/organisms/PopupBottomsheetConfirmation';

import { setErrorAlertRedux } from '../redux/trigger';
import FormConsulTemplate from '../components/templates/FormConsulTemplate';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { PartnerTheme } from '@types';

type Props = {
	patientData: object;
	sendConsultation: (orderId: object, body: object) => object;
	onSubmitted?: any;
	bottomSheet?: boolean;
};

const FormConsultation = (props: Props) => {
	const router = useRouter();
	const { fromPage, token, ct, crt, backto } = router.query;
	const [forms, setForms] = useState([]);
	const [activeForm, setActiveForm] = useState<any>(router.query?.page ?? 0);
	const [isDisabledNext, setIsDisabledNext] = useState(false);
	const [confirmationButtonData, setConfirmationButtonData] = useState<boolean | string>(false);
	const [checked, setChecked] = useState(true);
	const [initialForms, setInitialForms] = useState(initialFormsTemp);
	const [initialFormLocal, setInitialFormLocal] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const orderidRef = useRef(null);
	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');

	usePartnerInfo({ theme: themeData, token: partnerToken });

	const fetchTheme = async () => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const responseTheme = await fetchCachedTheme(orders?.partnerToken);
		setPartnerToken(orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	useEffect(() => {
		fetchTheme();
		getStorage();
	}, []);

	useEffect(() => {
		const tempDisabledNext = forms[activeForm]?.some((e) => {
			return (
				e?.isRequired &&
				(e?.value == null ||
					validateInput(e.name, e.value) ||
					((e?.type != INPUTFORM_CONST.dropdown || e?.type != INPUTFORM_CONST.link) &&
						e?.value == ''))
			);
		});
		setIsDisabledNext(tempDisabledNext);
		if (initialFormLocal != null && initialFormLocal.length) {
			const sameAsProfile = checkSimilarity(forms, initialFormLocal, activeForm);
			setChecked(sameAsProfile);
		}
	}, [forms, activeForm]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const inputs = document.querySelectorAll('input');
			inputs.forEach((input) => input.blur());
		}, 500); // Timeout after 5 seconds

		return () => clearTimeout(timeoutId); // Cleanup on unmount
	}, []);

	// const getProfession = async () => {
	// 	const professionData = await props.getProfessionList('profession');
	// 	let formsTemp = Object.assign([], initialForms);
	// 	formsTemp[1][5].options = professionData.data;
	// 	setInitialForms(formsTemp);
	// };

	const autoFillFormAddress = async (temp?: any) => {
		try {
			const address: any = await getLocalStorage(LOCALSTORAGE.ADDRESS);
			const checkAddress = address && address !== SEAMLESS_CONST.ADDRESS_NOT_SET;

			const full_address_name = checkAddress ? JSON.parse(address)?.name : null;
			const postalCode = checkAddress ? JSON.parse(address)?.postalCode : null;

			const fromPageQuery = router?.query?.fromPage;

			if (address && temp && fromPageQuery === PARAMS_CONST.ADDRESS) {
				const autofillForm: any = Object.assign([], temp);
				autofillForm[0][3].value =
					address === SEAMLESS_CONST.ADDRESS_NOT_SET ? null : full_address_name;
				autofillForm[0][4].value = postalCode;
				autofillForm[0][4].hidden = false;
				setForms(autofillForm);

				onChangeForm({
					name: autofillForm[0][3]?.name,
					type: autofillForm[0][3]?.type,
					value: autofillForm[0][3]?.value,
					formId: 'birthdate',
				});
				onChangeForm({
					name: autofillForm[0][4]?.name,
					type: autofillForm[0][4]?.type,
					value: autofillForm[0][4]?.value,
					formId: 'email',
				});
			}
		} catch (error) {
			console.log('err', error);
		}
	};

	const onClickAddressLink = async (link: string) => {
		const tempToken =
			token ??
			(await getStorageParseDecrypt(LOCALSTORAGE.ORDER))?.token ??
			(await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION))?.token;
		let tempLink = link?.includes('token=') || !tempToken ? link : `${link}?token=${tempToken}`;
		if (ct) {
			tempLink += (tempLink.includes('?') ? '&' : '?') + 'ct=' + ct;
			if (crt) {
				tempLink += `&crt=${crt}`;
			}
			if (backto) {
				tempLink += `&backto=${backto}`;
			}
		}
		tempLink += '&from=form-consultation';
		router.replace(tempLink);
	};

	const getStorage = async () => {
		const sessionData = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
		orderidRef.current = sessionData.orderNumber;

		checkFormsFromLocalStorage(sessionData);
	};

	const checkFormsFromLocalStorage = async (sessionData = null) => {
		const trackProgressForm = (await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION)) ?? {
			orderId: orderidRef.current,
			forms: [],
			isSubmitted: false,
			partnerXid: await getStorageDecrypt(LOCALSTORAGE.XID),
		};
		if (!trackProgressForm?.partnerXid) {
			trackProgressForm.partnerXid = await getStorageDecrypt(LOCALSTORAGE.XID);
		}

		const initFormLocal = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const setInitFormNew = initFormLocal ? initFormLocal?.forms : trackProgressForm?.forms;
		setInitialFormLocal(setInitFormNew || null);

		const formsTemp: any = Object.assign([], initialForms);
		try {
			if (sessionData?.consultationType == CONSULTATION_TYPE.APPROVAL) {
				formsTemp[0] = excludeDetailedAddress(formsTemp[0]);
			}
		} catch (error) {
			console.log('err', error);
		}

		if (trackProgressForm.orderId != null && trackProgressForm.orderId != orderidRef.current) {
			await removeLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			await removeLocalStorage(LOCALSTORAGE.INITIAL_FORM);
			setForms(initialForms);
		} else {
			if (!trackProgressForm.orderId) {
				trackProgressForm.orderId = global.orderNumber;
				await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);
			}
			if (trackProgressForm.forms.length) {
				// console.log("------------");
				// console.log("trackProgressForm.forms", trackProgressForm.forms);
				trackProgressForm.forms.forEach((element) => {
					['patient information', 'medical data'].forEach((elementTypes, i) => {
						const idx = formsTemp[i]?.findIndex((e) => e.name == element.name);
						if (idx > -1) {
							if (formsTemp[i][idx].type == INPUTFORM_CONST.dropdown) {
								if (!element?.value?.id) {
									const valueObj = formsTemp[i][idx].options.find(
										(e) => e.id == element?.value,
									);
									formsTemp[i][idx].value = element?.value;
									formsTemp[i][idx].valueText = valueObj?.name ?? '';
								} else {
									formsTemp[i][idx].value = element?.value?.id ?? element?.value;
									formsTemp[i][idx].valueText = element?.value?.valueText ?? '';
								}
							} else {
								formsTemp[i][idx].value = element?.value;
							}
							if (typeof element?.disabled === 'boolean') {
								formsTemp[i][idx].disabled = element?.disabled;
							}
						}
					});
				});
			}
			setForms(formsTemp);

			//note uncomment this before simplified
			// if (sessionData?.consultationType == CONSULTATION_TYPE.APPROVAL) {
			autoFillFormAddress(formsTemp);
			// }
		}
	};

	const onItemClick = (item) => {
		Router.push({
			pathname: '/chat-detail',
			query: item,
		});
	};

	const onChangeForm = ({ name, type, formId, value, disabled = false }) => {
		// console.log('res change ', name, type, formId, value);
		const formsTemp = Object.assign([], forms);
		const indexForm = findFieldIndexBySlug(formId, formsTemp[activeForm]);

		updateFormLocalStorage(
			orderidRef.current,
			name,
			type,
			value,
			formsTemp[activeForm][indexForm].isRequired,
		);
		if (type == INPUTFORM_CONST.dropdown) {
			formsTemp[activeForm][indexForm].value = value?.id;
			formsTemp[activeForm][indexForm].valueText = value?.valueText;
		} else {
			formsTemp[activeForm][indexForm].value = value;
		}

		formsTemp[activeForm][indexForm].disabled = disabled;

		if (formsTemp[activeForm][indexForm].isRequired) {
			const err = validateInput(name, value);
			formsTemp[activeForm][indexForm].errorMessage = err;
		}

		setForms(formsTemp);
	};

	const checkIfValidOrder = () => {
		let isValid = true;
		try {
			const formsTemp = Object.assign([], forms);
			forms[0].forEach((el, idx) => {
				if (el?.isRequired) {
					const err = validateInput(el.name, el.value);
					if (err) {
						isValid = false;
						formsTemp[0][idx] = {
							...formsTemp[0][idx],
							errorMessage: err,
						};
					}
				}
			});
			if (!isValid) {
				setIsDisabledNext(true);
			}
			setForms(formsTemp);
		} catch (error) {
			console.log('error on validation : ', error);
		} finally {
			return isValid;
		}
	};

	const goToChatDetail = () => {
		const query: any = {};
		if (Router.query?.token) {
			query.token = Router.query?.token;
		}
		Router.push({
			pathname: '/chat-detail',
			query: query,
		});
	};

	const submitForm = async () => {
		try {
			setIsLoading(true);
			const gender = {
				1: 'MALE',
				2: 'FEMALE',
			};
			const body = {
				[FORM_CONSULTATION.NAME]: forms[0][0]?.value,
				[FORM_CONSULTATION.GENDER]: gender[forms[0][1]?.value],
				[FORM_CONSULTATION.BIRTHDATE]: moment(forms[0][2]?.value).format('YYYY-MM-DD'),
				[FORM_CONSULTATION.ADDRESS]: forms[0][3]?.value,
				[FORM_CONSULTATION.ALLERGIC]: forms[0][4]?.value,
				// commented because pivot flow will not see this page
				// [FORM_CONSULTATION.SYMPTOMS]: forms[1][0].value ?? 'Belum diisi',
				// [FORM_CONSULTATION.MEDICINE_USED]: forms[1][2].value ?? 'Belum diisi',
				// [FORM_CONSULTATION.HEIGHT]: forms[1][3].value ? forms[1][3].value : null,
				// [FORM_CONSULTATION.WEIGHT]: forms[1][4].value ? forms[1][4].value : null,
				// occupation: forms[1][5].valueText,
			};
			const result: { meta?: { message?: string; status: number } } =
				await props.sendConsultation(orderidRef.current, body);
			setIsLoading(false);
			if (result?.meta?.status == 200) {
				const trackProgressForm = (await getParsedLocalStorage(
					LOCALSTORAGE.FORM_CONSULTATION,
				)) ?? { orderId: orderidRef.current, forms: [], isSubmitted: false };
				trackProgressForm.isSubmitted = true;
				if (!trackProgressForm?.partnerXid) {
					trackProgressForm.partnerXid = await getStorageDecrypt(LOCALSTORAGE.XID);
				}
				await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);

				if (props.bottomSheet) {
					props.onSubmitted();
				} else {
					goToChatDetail();
				}
			} else {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: result?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
			}
		} catch (error) {
			setIsLoading(false);
			console.log('error,', error);
		}
	};

	const callbackBottomSheet = (res) => {
		if (res && res == CALLBACK_CONST_POPUPBOTTOMSHEET.CALLBACK_OK) {
			if (confirmationButtonData == CONFIRMATION_KEY_CONST.BACK_CONFIRMATION) {
				if (activeForm == 1) {
					window.history.go(-2);
				} else {
					goToChatDetail();
				}
			} else if (confirmationButtonData == CONFIRMATION_KEY_CONST.FORM_CONFIRMATION) {
				submitForm();
			}
		}
		setConfirmationButtonData(null);
	};

	return (
		<FormConsulTemplate
			additionalId={PAGE_ID.FORM_CONSULTATION}
			title="Form Konsultasi"
			metaTitle="Form Konsultasi"
			header={props.bottomSheet ? false : true}
			footer={true}
			forms={forms}
			activeForm={activeForm}
			onChangeForm={onChangeForm}
			checked={checked}
			isDisabledNext={false}
			checkIfValidOrder={checkIfValidOrder}
			setActiveForm={setActiveForm}
			setConfirmationButtonData={setConfirmationButtonData}
			onClickBack={() => setConfirmationButtonData(CONFIRMATION_KEY_CONST.BACK_CONFIRMATION)}
			bottomsheetData={
				confirmationButtonData ? CONFIRMATION_CONST[confirmationButtonData] : null
			}
			bottomsheetCallback={(res) => callbackBottomSheet(res)}
			isLoading={isLoading}
			handleClickLink={onClickAddressLink}
		/>
	);
};

const mapStateToProps = (state) => ({
	verifyData: state.verifyData.verifyData,
	patientData: state.consultation.patient.result,
});

const mapDispatchToProps = (dispatch) => ({
	sendConsultation: (orderNumber, body) => dispatch(submitConsultation(orderNumber, body)),
	getProfessionList: (type) => dispatch(professionList(type)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
	...stateProps,
	...dispatchProps,
	...ownProps,
});

export const getServerSideProps = async ({ req, res, query }) => {
	const consulTime = await checkCookieSession(req, res);
	if (
		(consulTime?.status != null && consulTime?.status != 'STARTED') ||
		consulTime?.timeLeft < 1 ||
		!consulTime
	) {
		return {
			notFound: true,
		};
	}
	return { props: {} };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FormConsultation);

export const FORM_CONSULTATION = {
	NAME: 'name',
	EMAIL: 'email',
	PHONE: 'phone',
	BIRTHDATE: 'bornDate',
	AGE: 'age',
	GENDER: 'gender',
	ADDRESS: 'address',
	DETAIL_ADDRESS: 'detail_address',
	LONGITUDE: 'longitude',
	LATITUDE: 'latitude',
	POSTAL_CODE: 'postal_code',
	HEIGHT: 'bodyHeight',
	WEIGHT: 'bodyWeight',
	JOB: 'occupation',
	ALLERGIC: 'preexistingAllergy',
	PREEXISTING_ALLERGY: 'preexisting_allergy',
	MEDICINE_USED: 'oftenUsedMedication',
	SYMPTOMS: 'medicalComplaint',
	SPECIALIST: 'specialistId',
};
