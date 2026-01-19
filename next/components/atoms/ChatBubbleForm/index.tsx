/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Router from 'next/router';

import { Progress } from 'reactstrap';
import ButtonHighlight from '../ButtonHighlight';
import {
	BUTTON_ID,
	CHAT_CONST,
	checkFormLocalData,
	CONFIRMATION_CONST,
	CONFIRMATION_KEY_CONST,
	CONSULTATION_TYPE,
	encryptData,
	getParsedLocalStorage,
	getStorageDecrypt,
	getStorageParseDecrypt,
	LOCALSTORAGE,
	MESSAGE_CONST,
	removeLocalStorage,
	setStringifyLocalStorage,
} from '../../../helper';
import { PopupBottomsheetConfirmation } from '../../organisms';
import { CALLBACK_CONST_POPUPBOTTOMSHEET } from '../../organisms/PopupBottomsheetConfirmation';
import { FORM_CONSULTATION } from '../../../pages/form-consultation';
import { connect } from 'react-redux';
import moment from 'moment';
import { submitConsultation } from '../../../redux/actions';
import {
	setErrorAlertRedux,
	setFormProgress as setFormProgressRedux,
	setIsOpenOfflineBottomsheet as setIsOpenOfflineBottomsheetRedux,
} from '../../../redux/trigger';

export interface IChatBubbleFormProps {
	data?: any;
	general?: any;
	orderid?: string;
	verifyData?: any;
	sendConsultation?: (verifyData: any, body: any) => void;
	onAlreadyFillForm?: () => void;
	onClick?: (value?: any, params?: any) => void;
	consulDetail?: any;
}

function Index(props: IChatBubbleFormProps) {
	const {
		data,
		general,
		orderid,
		sendConsultation,
		verifyData,
		onAlreadyFillForm,
		onClick,
		consulDetail,
	} = props;

	const [progressForm, setprogressForm] = useState(0);
	const [trackProgressForms, setTrackProgressForms] = useState([]);
	const [isSubmittedForm, setIsSubmittedForm] = useState(false);
	const [confirmationButtonData, setConfirmationButtonData] = useState<any>(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [consultationType, setConsultationType] = useState(CONSULTATION_TYPE.RECOMMENDATION);

	useEffect(() => {
		if (data?.type == CHAT_CONST.FILL_FORM && general?.formProgress) {
			chcekTypeConsultation();
		}
	}, [data, general]);

	useEffect(() => {
		if (!isSubmittedForm && general.timeLeft < 1) {
			setIsDisabled(true);
		}
	}, [general.timeLeft]);

	const chcekTypeConsultation = async () => {
		const sessionData = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
		checkProgressForm(sessionData?.consultationType);
		setConsultationType(sessionData?.consultationType ?? CONSULTATION_TYPE.RECOMMENDATION);
	};

	const checkProgressForm = async (consultationType = CONSULTATION_TYPE.RECOMMENDATION) => {
		const trackProgressMandatory = await checkFormLocalData();
		if (trackProgressMandatory.orderId != orderid) {
			await removeLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			await removeLocalStorage(LOCALSTORAGE.INITIAL_FORM);
		} else {
			// console.log('trackprogress chatbubbleform', trackProgressMandatory);
			setIsSubmittedForm(trackProgressMandatory?.isSubmitted);
			setTrackProgressForms(trackProgressMandatory?.forms);
			const progressFormTemp = trackProgressMandatory.forms.filter(
				(e) =>
					e.isRequired &&
					e.value != null &&
					e.name != FORM_CONSULTATION.EMAIL &&
					e.name != FORM_CONSULTATION.PHONE &&
					e.name != FORM_CONSULTATION.SPECIALIST &&
					(consultationType != CONSULTATION_TYPE.APPROVAL ||
						(consultationType == CONSULTATION_TYPE.APPROVAL &&
							e?.name != FORM_CONSULTATION.DETAIL_ADDRESS &&
							e?.name != FORM_CONSULTATION.LATITUDE &&
							e?.name != FORM_CONSULTATION.LONGITUDE &&
							e?.name != FORM_CONSULTATION.POSTAL_CODE)),
			);
			setprogressForm(progressFormTemp.length);
		}

		if (consulDetail?.data?.patientData?.formFill) {
			setIsSubmittedForm(true);
		}
	};

	const getProgressPercent = () => {
		if (consulDetail?.data?.patientData?.formFill) {
			return 100;
		}
		const percentage = Math.round(
			(progressForm / (consultationType == CONSULTATION_TYPE.APPROVAl ? 4 : 6)) * 100,
		);
		return percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
	};

	const renderDescComponent = (data) => {
		return (
			<div className="tw-m-4">
				<p className="body-16-regular tw-mb-5">{data?.desc}</p>
				{data?.descComponent}
			</div>
		);
	};

	const getSubmitFormBody = () => {
		const gender = {
			1: 'MALE',
			2: 'FEMALE',
		};
		const bodyTemp = {};
		trackProgressForms.forEach((element) => {
			if (element.name == FORM_CONSULTATION.AGE) {
				bodyTemp['bornDate'] = moment(element.value).format('YYYY-MM-DD');
			} else if (element.name == FORM_CONSULTATION.GENDER) {
				bodyTemp[element.name] = gender[element.value];
			} else if (element.name == FORM_CONSULTATION.JOB) {
				bodyTemp[element.name] = element.value?.valueText;
			} else {
				bodyTemp[element.name] = element.value;
			}
		});

		return bodyTemp;
	};

	const submitForm = async () => {
		const body = getSubmitFormBody();
		// console.log('body', body);
		const result: any = await sendConsultation(verifyData?.orderNumber, body);
		if (result?.meta?.status == 200) {
			// await submitSocket();
			const trackProgressForm = (await getParsedLocalStorage(
				LOCALSTORAGE.FORM_CONSULTATION,
			)) ?? {
				orderId: orderid,
				forms: [],
				isSubmitted: false,
				partnerXid: await getStorageDecrypt(LOCALSTORAGE.XID),
			};
			if (!trackProgressForm?.partnerXid) {
				trackProgressForm.partnerXid = await getStorageDecrypt(LOCALSTORAGE.XID);
			}
			trackProgressForm.isSubmitted = true;
			await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);
			onAlreadyFillForm();
			setFormProgressRedux(trackProgressForm);
		} else {
			setErrorAlertRedux({
				danger: true,
				data: {
					message: result?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			});
		}
	};
	return (
		<div>
			<p className="tx-chat body-14-regular tw-mb-0">
				{getProgressPercent() < 100 ? data.message : 'Anda sudah mengisi formulir konsultasi.'}
			</p>
			<div>
				<ButtonHighlight
					id={
						getProgressPercent() < 100
							? BUTTON_ID.BUTTON_FORM_FILL
							: !isSubmittedForm
							? BUTTON_ID.BUTTON_FORM_SUBMIT
							: BUTTON_ID.BUTTON_FORM_VIEW
					}
					color="grey"
					className="tw-mt-3"
					classNameBtn="body-12-regular tw-my-2.5 tw-text-link"
					isDisabled={isDisabled || !onClick}
					text={
						getProgressPercent() < 100
							? 'LENGKAPI FORMULIR KONSULTASI'
							: !isSubmittedForm
							? 'SIMPAN FORMULIR KONSULTASI'
							: 'LIHAT FORMULIR KONSULTASI'
					}
					onClick={() =>
						general?.networkState?.isOnline != null && !general?.networkState?.isOnline
							? setIsOpenOfflineBottomsheetRedux(true)
							: getProgressPercent() >= 100 && !isSubmittedForm
							? setConfirmationButtonData(
									CONFIRMATION_KEY_CONST.FORM_CONFIRMATION_BOTTOMSHEET,
							  )
							: onClick
							? onClick(data?.type, {
									progress: getProgressPercent(),
									isSubmitted: isSubmittedForm,
							  })
							: {}
					}
				/>

				<div className="tw-flex tw-mt-3 tw-items-center" id="progressform">
					<Progress
						className="tw-flex-1 tw-mr-3"
						barAriaLabelledBy="progressform"
						value={getProgressPercent()}
						color={
							getProgressPercent() < 100 ? 'red-2' : isSubmittedForm ? 'green-2' : 'yellow-2'
						}
					/>
					<p className="body-12-regular tw-mb-0 tw-text-tpy-700">
						{getProgressPercent() + '%'}
					</p>
				</div>
			</div>
			<PopupBottomsheetConfirmation
				data={
					confirmationButtonData
						? {
								...(confirmationButtonData
									? CONFIRMATION_CONST[confirmationButtonData]
									: null),
								descComponent: renderDescComponent(
									CONFIRMATION_CONST[confirmationButtonData],
								),
						  }
						: null
				}
				callback={async (res) => {
					console.log('res', res);
					if (res && res == CALLBACK_CONST_POPUPBOTTOMSHEET.CALLBACK_OK) {
						submitForm();
					} else if (res && res == CALLBACK_CONST_POPUPBOTTOMSHEET.CALLBACK_CANCEL) {
						Router.push({
							pathname: '/form-consultation',
							query: {
								id: await encryptData(global?.orderNumber),
							},
						});
					}
					setConfirmationButtonData(null);
				}}
			/>
		</div>
	);
}

const mapStateToProps = (state) => ({
	verifyData: state.verifyData.verifyData,
	general: state.general,
});

const mapDispatchToProps = (dispatch) => ({
	sendConsultation: (orderNumber, body) => dispatch(submitConsultation(orderNumber, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
