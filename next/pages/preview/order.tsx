import { ButtonHighlight, PreviewOverlay } from '@atoms';
import { OrderTemplate } from '@templates';
import { BUTTON_CONST, BUTTON_ID, INPUTFORM_CONST, PLACEHOLDER_CONST } from 'helper';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';
import { FORM_CONSULTATION } from 'pages/form-consultation';
import { useState } from 'react';

const PreviewOrder = () => {
	const [showPopupDoctor, setShowPopupDoctor] = useState(false);
	const router = useRouter();
	const preview = JSON.parse(decodeURIComponent(String(router?.query?.preview)));

	usePartnerInfo({ isByLocal: true });

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m">
				<div className="tw-flex tw-mt-4">
					<ButtonHighlight
						text={BUTTON_CONST.SAVE_AND_SUBMIT}
						circularContainerClassName="tw-h-4"
						circularClassName="circular-inner-16"
						color={'primary'}
					/>
				</div>
			</div>
		);
	};
	const initialOrdersTemp = [
		{
			name: FORM_CONSULTATION.SPECIALIST,
			className: 'pos-relative',
			title: 'Mau konsultasi dengan dokter apa?',
			isRequired: true,
			placeholder: PLACEHOLDER_CONST.CHOOSE_SPECIALIST,
			type: INPUTFORM_CONST.dropdown,
			options: [],
			options_title: 'Mau konsultasi dengan dokter apa? ',
		},
		{
			name: FORM_CONSULTATION.NAME,
			title: 'Nama Pasien',
			className: 'tw-mt-5',
			isRequired: true,
			placeholder: PLACEHOLDER_CONST.FULLNAME,
			max_length: 50,
			type: INPUTFORM_CONST.text,
			inputmode: 'alphabet',
			idComponent: BUTTON_ID.INPUT_FORM_NAME,
		},
		{
			name: FORM_CONSULTATION.GENDER,
			title: 'Gender Pasien',
			className: 'tw-mt-5',
			isRequired: true,
			value: 1,
			options: [
				{
					id: 1,
					name: 'LAKI-LAKI',
					idComponent: BUTTON_ID.BUTTON_FORM_INPUT_GENDER_MALE,
				},
				{
					id: 2,
					name: 'PEREMPUAN',
					idComponent: BUTTON_ID.BUTTON_FORM_INPUT_GENDER_FEMALE,
				},
			],
			type: INPUTFORM_CONST.options_radio,
		},
		{
			name: FORM_CONSULTATION.AGE,
			inputmode: 'numeric',
			max_length: 3,
			className: 'pos-relative',
			title: 'Tanggal Lahir pasien',
			isRequired: true,
			placeholder: 'Pilih Tanggal Lahir',
			type: '',
		},
		{
			name: FORM_CONSULTATION.EMAIL,
			title: 'Email',
			isRequired: true,
			placeholder: PLACEHOLDER_CONST.EMAIL,
			max_length: 120,
			className: 'tw-mt-5',
			type: INPUTFORM_CONST.text,
			inputmode: 'email',
			idComponent: BUTTON_ID.INPUT_FORM_EMAIL,
		},
		{
			name: FORM_CONSULTATION.PHONE,
			title: 'Nomor Handphone',
			className: 'tw-mt-5',
			isRequired: true,
			placeholder: PLACEHOLDER_CONST.PHONE,
			max_length: 13,
			type: INPUTFORM_CONST.text,
			inputmode: 'numeric',
			idComponent: BUTTON_ID.INPUT_FORM_PHONE,
		},
		{
			name: FORM_CONSULTATION.ADDRESS,
			title: 'Alamat Pasien',
			className: 'tw-mt-5',
			isRequired: true,
			type: INPUTFORM_CONST.link,
			placeholder: PLACEHOLDER_CONST.ADDRESS,
			max_length: 500,
			idComponent: BUTTON_ID.INPUT_FORM_ADDRESS,
			link: '/address',
		},
		{
			name: FORM_CONSULTATION.DETAIL_ADDRESS,
			title: 'Detail Alamat',
			className: 'tw-mt-5',
			isRequired: false,
			type: INPUTFORM_CONST.text,
			placeholder: PLACEHOLDER_CONST.DETAIL_ADDRESS,
			idComponent: BUTTON_ID.INPUT_FORM_DETAIL_ADDRESS,
		},
		{
			name: FORM_CONSULTATION.LATITUDE,
			title: 'Latitude',
			isRequired: false,
			type: INPUTFORM_CONST.text,
			placeholder: '-',
			max_length: 500,
			idComponent: 'lat',
			hidden: true,
		},
		{
			name: FORM_CONSULTATION.LONGITUDE,
			title: 'longitude',
			isRequired: false,
			type: INPUTFORM_CONST.text,
			placeholder: '-',
			max_length: 500,
			idComponent: 'long',
			hidden: true,
		},
		{
			name: FORM_CONSULTATION.ALLERGIC,
			title: 'Riwayat Alergi',
			isRequired: true,
			type: INPUTFORM_CONST.alergic,
			placeholder: PLACEHOLDER_CONST.ALERGIC,
			className: 'tw-mt-5',
			max_length: 500,
			idComponent: BUTTON_ID.INPUT_FORM_ALLERGIC,
		},
	];
	return (
		<>
			<PreviewOverlay />
			<OrderTemplate
				footerComponent={renderFooterButton}
				forms={initialOrdersTemp}
				handleFormChange={() => {
					//
				}}
				handleFormChangeError={() => {
					//
				}}
				handleClickLink={() => {
					//
				}}
				informConsentShow={false}
				emailConfirmShow={false}
				emailConfirmToggle={() => {
					//
				}}
				informConsentToggle={() => {
					//
				}}
				informConsentSubmit={() => {
					//
				}}
				submitForm={() => {
					//
				}}
				logoUrl={''}
				isLoading={false}
				preview={router?.query?.preview ? preview : null}
				doctorSpecialization={{
					id: 0,
					name: 'Dokter Umum',
					duration: 360,
					price: null,
					promoPrice: null,
				}}
			/>
		</>
	);
};

export default PreviewOrder;
