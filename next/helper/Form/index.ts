import Router from 'next/router';
import {
	getParsedLocalStorage,
	removeLocalStorage,
	setStringifyLocalStorage,
	LOCALSTORAGE,
	INPUTFORM_CONST,
	getConsulUser,
	BUTTON_ID,
	PLACEHOLDER_CONST,
	REGEX_CONST,
	getStorageDecrypt,
	PARAMS_CONST,
	setLocalStorage,
	getStorageParseDecrypt,
	VOUCHER_CONST,
} from '..';
import { FORM_CONSULTATION } from '../../pages/form-consultation';

export const FORM_ERROR_MESSAGE = {
	ERROR_INVALID_EMAIL: 'Email harus diisi dengan format yang benar (contoh : ini@email.com)',
	ERROR_INVALID_PHONE: 'Mohon isi sesuai format handphone. Contoh 081XXXXXXXXX.',
	ERROR_INVALID_POSTAL_CODE: 'Kode pos belum sesuai, kode pos min. 5 digit dan hanya angka.',
	ERROR_INVALID_ADDRESS: 'Pengisian alamat hanya boleh angka, huruf dan (‘.’) (‘,’) (‘/‘) (‘-‘).',
	ERROR_LENGTH_NAME: 'Nama Lengkap terlalu pendek minimal 3 karakter',
	ERROR_LENGTH_ADDRESS: 'Alamat terlalu pendek minimal 3 karakter',
	ERROR_LENGTH_EMAIL: 'Panjang email minimal 10 sampai 120 karakter.',
	ERROR_LENGTH_PHONE: 'Nomor Handphone minimal 10 digit.',
	ERROR_LENGTH_POSTAL_CODE: 'Kode pos belum sesuai, kode pos min. 5 digit dan hanya angka.',
	ERROR_EMPTY_POSTAL_CODE: 'Kode Pos wajib diisi.',
	ERROR_EMPTY: 'Wajib diisi',
	ERROR_EMPTY_NAME: 'Wajib diisi',
	ERROR_EMPTY_EMAIL: 'Wajib diisi',
	ERROR_EMPTY_PHONE: 'Wajib diisi',
	ERROR_EMPTY_ADDRESS: 'Alamat wajib diisi.',
	ERROR_EMPTY_ALLERGIC: 'Riwayat Alergi Obat wajib diisi.',
	ERROR_EMPTY_CHOOSE: 'Wajib dipilih',
};

interface ICheckFormLocalData {
	patientData?: { formFill: any };
	consultationType?: string;
}

interface ITrackProgressForm {
	orderId?: number | string;
	forms?: any;
	isSubmitted?: boolean;
	partnerXid?: string;
	partnerToken?: string;
}

export const checkFormLocalData = async (data?: ICheckFormLocalData) => {
	let trackProgressForm: ITrackProgressForm = {
		orderId: global.orderNumber,
		forms: [],
		isSubmitted: false,
	};
	try {
		trackProgressForm = (await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION)) ?? {
			orderId: global.orderNumber,
			forms: spreadInitialForms,
			isSubmitted: false,
		};
		trackProgressForm.partnerXid = await getStorageDecrypt(LOCALSTORAGE.XID);
		if (!trackProgressForm.orderId) {
			trackProgressForm.orderId = global.orderNumber;
			await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);
		}
		if (trackProgressForm.orderId != global.orderNumber) {
			await removeLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			await removeLocalStorage(LOCALSTORAGE.INITIAL_FORM);

			trackProgressForm = await checkFormDataFromAPI(trackProgressForm, data);
		} else {
			if (data?.patientData?.formFill && !trackProgressForm.isSubmitted) {
				trackProgressForm = await checkFormDataFromAPI(trackProgressForm, data);
			} else if (data?.consultationType == 'APPROVAL' && !global.initProgressForm) {
				trackProgressForm = await checkFormDataFromAPI(trackProgressForm, data);
				await setStringifyLocalStorage(LOCALSTORAGE.INITIAL_FORM, trackProgressForm);
				global.initProgressForm = true;
			}
		}
	} catch (error) {
		console.log('error on checkLocalData : ', error);
		return {
			orderId: global.orderNumber,
			forms: spreadInitialForms,
			isSubmitted: false,
		};
	} finally {
		// eslint-disable-next-line no-unsafe-finally
		return trackProgressForm;
	}
};

export const checkFormDataFromAPI = (localData: { forms?: any }, data: { patientData?: any }) =>
	// eslint-disable-next-line no-async-promise-executor
	new Promise(async (resolve, reject) => {
		try {
			const tempLocalForms = Object.assign(localData.forms, []);

			const res = await getConsulUser(global.orderNumber, 'patient');
			if (res?.data?.registeredAt) {
				const resData = res?.data;
				for (let index = 0; index < tempLocalForms.length; index++) {
					const element = tempLocalForms[index];
					if (element.name == FORM_CONSULTATION.AGE) {
						element.value = resData[FORM_CONSULTATION.BIRTHDATE];
					} else if (element.name == FORM_CONSULTATION.GENDER) {
						element.value = resData[FORM_CONSULTATION.GENDER]
							? resData[FORM_CONSULTATION.GENDER] == 'MALE'
								? 1
								: 2
							: null;
					} else {
						element.value = resData[element.name];
					}
					tempLocalForms[index] = element;
				}
				const tempLocal = {
					orderId: global.orderNumber,
					forms: tempLocalForms,
					isSubmitted: data?.patientData?.formFill,
					partnerXid: await getStorageDecrypt(LOCALSTORAGE.XID),
				};

				await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, tempLocal);
				resolve(tempLocal);
			} else {
				resolve(localData);
			}
		} catch (error) {
			console.log('error on check form data from api : ', error);
			reject(error);
		}
	});

export const storePartnerXid = async (xid?: string) => {
	try {
		const trackProgressForm = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
		trackProgressForm.partnerXid = xid ?? (await getStorageDecrypt(LOCALSTORAGE.XID));
		await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);
	} catch (error) {
		console.log('error on storeXId : ', error);
	}
};

export const initialOrdersTemp = [
	{
		name: FORM_CONSULTATION.SPECIALIST,
		className: 'pos-relative',
		title: 'Pilih Dokter',
		isRequired: true,
		placeholder: PLACEHOLDER_CONST.CHOOSE_SPECIALIST,
		type: INPUTFORM_CONST.dropdown,
		options: [],
		options_title: 'Mau konsultasi dengan dokter apa? ',
		hidden: true,
		slug: 'specialist',
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
		slug: 'name',
	},
	{
		name: FORM_CONSULTATION.GENDER,
		title: 'Gender Pasien',
		isRequired: true,
		value: null,
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
		className: 'tw-mt-5',
		slug: 'gender',
	},
	{
		name: FORM_CONSULTATION.AGE,
		inputmode: 'numeric',
		max_length: 3,
		className: 'pos-relative',
		title: 'Tanggal Lahir Pasien',
		isRequired: true,
		placeholder: 'Pilih Tanggal Lahir',
		type: '',
		slug: 'birthdate',
	},
	{
		name: FORM_CONSULTATION.EMAIL,
		title: 'Email Pasien',
		isRequired: true,
		placeholder: PLACEHOLDER_CONST.EMAIL,
		max_length: 120,
		type: INPUTFORM_CONST.text,
		inputmode: 'email',
		idComponent: BUTTON_ID.INPUT_FORM_EMAIL,
		className: 'tw-mt-5',
		slug: 'email',
	},
	{
		name: FORM_CONSULTATION.PHONE,
		title: 'Nomor Handphone Pasien',
		isRequired: true,
		placeholder: PLACEHOLDER_CONST.PHONE,
		max_length: 13,
		type: INPUTFORM_CONST.text,
		inputmode: 'numeric',
		idComponent: BUTTON_ID.INPUT_FORM_PHONE,
		className: 'tw-mt-5',
		slug: 'phone',
	},
	{
		name: FORM_CONSULTATION.ADDRESS,
		title: 'Alamat Pasien',
		className: 'tw-mt-5',
		isRequired: true,
		type: INPUTFORM_CONST.link,
		placeholder: PLACEHOLDER_CONST.ADDRESS,
		max_length: 205, // make sure the address is 205 characters and detail address is 50 characters follow the GOA requirement
		idComponent: BUTTON_ID.INPUT_FORM_ADDRESS,
		link: '/address',
		slug: 'address',
	},
	{
		name: FORM_CONSULTATION.DETAIL_ADDRESS,
		title: 'Detail Alamat',
		isRequired: false,
		type: INPUTFORM_CONST.textarea,
		placeholder: PLACEHOLDER_CONST.DETAIL_ADDRESS,
		max_length: 50, // make sure the address is 205 characters and detail address is 50 characters follow the GOA requirement
		idComponent: BUTTON_ID.INPUT_FORM_DETAIL_ADDRESS,
		className: 'tw-mt-5',
		slug: 'detail_address',
		counter_visible: true,
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
		slug: 'lat',
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
		slug: 'long',
	},
	{
		name: FORM_CONSULTATION.ALLERGIC,
		className: 'tw-mt-5',
		title: 'Riwayat Alergi Obat',
		isRequired: true,
		type: INPUTFORM_CONST.alergic,
		placeholder: PLACEHOLDER_CONST.ALERGIC,
		max_length: 500,
		idComponent: BUTTON_ID.INPUT_FORM_ALLERGIC,
		slug: 'allergy',
	},
];

export const initialFormsTemp = [
	[
		{
			name: FORM_CONSULTATION.NAME,
			title: 'Nama Pasien',
			isRequired: true,
			placeholder: 'Masukkan Nama',
			max_length: 50,
			type: INPUTFORM_CONST.text,
			inputmode: 'alphabet',
			idComponent: BUTTON_ID.INPUT_FORM_NAME,
			slug: 'name',
		},
		{
			name: FORM_CONSULTATION.GENDER,
			title: 'Gender Pasien',
			isRequired: true,
			value: null,
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
			className: 'tw-mt-5',
			slug: 'gender',
		},
		{
			name: FORM_CONSULTATION.AGE,
			inputmode: 'numeric',
			max_length: 3,
			title: 'Tanggal lahir pasien',
			isRequired: true,
			placeholder: 'Pilih Tanggal',
			type: '',
			slug: 'birthdate',
		},
		{
			name: FORM_CONSULTATION.ADDRESS,
			title: 'Alamat Pasien',
			className: 'tw-mt-5',
			isRequired: true,
			type: INPUTFORM_CONST.link,
			placeholder: 'Nama Jalan, No. Rumah / Gedung',
			max_length: 500,
			counter_visible: true,
			idComponent: BUTTON_ID.INPUT_FORM_ADDRESS,
			link: '/address',
			slug: 'address',
		},
		{
			name: FORM_CONSULTATION.DETAIL_ADDRESS,
			title: 'Detail Alamat',
			isRequired: false,
			type: INPUTFORM_CONST.textarea,
			placeholder: PLACEHOLDER_CONST.DETAIL_ADDRESS,
			max_length: 500,
			idComponent: BUTTON_ID.INPUT_FORM_DETAIL_ADDRESS,
			slug: 'detail_address',
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
			slug: 'lat',
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
			slug: 'long',
		},
		{
			name: FORM_CONSULTATION.ALLERGIC,
			title: 'Riwayat Alergi Obat',
			isRequired: true,
			type: INPUTFORM_CONST.alergic,
			placeholder: PLACEHOLDER_CONST.ALERGIC,
			className: 'tw-mt-5',
			max_length: 500,
			idComponent: BUTTON_ID.INPUT_FORM_ALLERGIC,
			slug: 'allergy',
		},
	],
	[
		{
			name: FORM_CONSULTATION.SYMPTOMS,
			title: 'Keluhan',
			placeholder: 'Masukkan Keluhan',
			isRequired: true,
			max_length: 500,
			type: '',
			idComponent: BUTTON_ID.INPUT_FORM_SYMPTOMS,
		},
		{
			name: FORM_CONSULTATION.ALLERGIC,
			title: 'Riwayat Alergi Obat',
			placeholder: 'Masukkan Riwayat Alergi Obat',
			isRequired: true,
			bottom_label: 'Ketik “Tidak Ada” jika tidak memiliki.',
			max_length: 500,
			type: '',
			idComponent: BUTTON_ID.INPUT_FORM_ALLERGIC,
		},
		{
			name: FORM_CONSULTATION.MEDICINE_USED,
			title: 'Obat yang biasa diminum',
			placeholder: 'Obat yang biasa diminum',
			isRequired: true,
			bottom_label: 'Ketik “Tidak Ada” jika tidak memiliki.',
			max_length: 500,
			type: '',
			idComponent: BUTTON_ID.INPUT_FORM_MEDICINE,
		},
		{
			name: FORM_CONSULTATION.HEIGHT,
			inputmode: 'numeric',
			max_length: 3,
			title: 'Tinggi Badan pasien (cm)',
			placeholder: 'Masukkan Tinggi Badan (cm)',
			type: '',
			idComponent: BUTTON_ID.INPUT_FORM_HEIGHT,
		},
		{
			name: FORM_CONSULTATION.WEIGHT,
			inputmode: 'numeric',
			max_length: 3,
			title: 'Berat Badan pasien (kg)',
			placeholder: 'Masukkan Berat Badan (kg)',
			type: '',
			idComponent: BUTTON_ID.INPUT_FORM_WEIGHT,
		},
	],
];

export const initalRefundRefund = [
	{
		name: 'payment_method',
		title: 'Bank / Dompet Tujuan Refund',
		isRequired: true,
		placeholder: 'Tulis nama bank tujuan refund',
		type: INPUTFORM_CONST.text,
		for: 'ALL',
	},
	{
		className: 'tw-mt-4',
		name: 'payment_number',
		title: 'Nomor Rekening / Akun Tujuan',
		isRequired: true,
		placeholder: 'Tulis nomor rekening / akun tujuan',
		type: INPUTFORM_CONST.text,
		inputmode: 'numeric',
		for: 'ALL',
	},
	{
		className: 'tw-mt-4',
		name: 'payment_customer_name',
		title: 'Nama Pemegang Kartu / Akun',
		isRequired: true,
		placeholder: 'Tulis nama pemegang kartu / akun',
		type: INPUTFORM_CONST.text,
		for: 'ALL',
	},
	{
		className: 'tw-mt-4',
		name: 'phone_number',
		title: 'Nomor Hp',
		isRequired: true,
		placeholder: '08xxxxxxxxxx',
		inputmode: 'numeric',
		type: INPUTFORM_CONST.text,
		for: 'ALL',
	},
];

export const spreadInitialForms = [...initialFormsTemp[0], ...initialFormsTemp[1]];

export const updateFormLocalStorage = async (
	orderId?: string | number,
	name?: string,
	type?: string,
	value?: null | string,
	isRequired?: boolean,
	err?: string,
	options?: object,
	partnerXid?: string,
	partnerToken?: any,
) => {
	const trackProgressForm = (await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION)) ?? {
		orderId: orderId,
		forms: [],
		partnerXid,
		partnerToken: partnerToken,
	};

	const idx = trackProgressForm.forms?.findIndex((e: { name: string }) => e.name == name);

	trackProgressForm.partnerXid = partnerXid ?? (await getStorageDecrypt(LOCALSTORAGE.XID));
	if (
		(type == INPUTFORM_CONST.dropdown && value != null) ||
		(type != INPUTFORM_CONST.dropdown && value != null && value != '')
	) {
		if (idx == -1) {
			trackProgressForm.forms.push({
				name: name,
				value: value,
				isRequired: isRequired,
				options: options,
				errorMessage: err,
			});
		} else {
			trackProgressForm.forms[idx] = {
				name: name,
				value: value,
				isRequired: isRequired,
				options: options,
				errorMessage: err,
			};
		}
	} else {
		if (idx > -1) {
			trackProgressForm.forms.splice(idx, 1);
		} else {
			return;
		}
	}
	await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);
};

export const validateEmailRegex = (email: string) => {
	const re = REGEX_CONST.full_email;
	return re.test(String(email).toLowerCase());
};

export const validatePhoneNumberRegex = (phone: string | number) => {
	const re = REGEX_CONST.phone;
	return re.test(String(phone).toLowerCase());
};

export const validateAddressRegex = (address: string) => {
	const regexAddress = REGEX_CONST.address;
	return regexAddress.test(address);
};

export const validateEmail = (value: string) => {
	if (value.length < 10) {
		return FORM_ERROR_MESSAGE.ERROR_LENGTH_EMAIL;
	} else if (!validateEmailRegex(value)) {
		return FORM_ERROR_MESSAGE.ERROR_INVALID_EMAIL;
	}
	return null;
};

export const validatePhone = (value: string) => {
	if (value.length < 10) {
		return FORM_ERROR_MESSAGE.ERROR_LENGTH_PHONE;
	} else if (!validatePhoneNumberRegex(value)) {
		return FORM_ERROR_MESSAGE.ERROR_INVALID_PHONE;
	}
	return null;
};

export const validatePostalCode = (value: string) => {
	if (value.length < 5) {
		return FORM_ERROR_MESSAGE.ERROR_LENGTH_POSTAL_CODE;
	}
	return null;
};

export const validateName = (value: string) => {
	if (value.length < 3) {
		return FORM_ERROR_MESSAGE.ERROR_LENGTH_NAME;
	}
	return null;
};

export const validateAddress = (value: string) => {
	console.log('value', value, validateAddressRegex(value));
	if (!validateAddressRegex(value)) {
		return FORM_ERROR_MESSAGE.ERROR_INVALID_ADDRESS;
	}
	return null;
};

export const validateInput = (name: string, value: string) => {
	console.log('validateInput', name, value);
	if (name == FORM_CONSULTATION.EMAIL) {
		if (!value || !value.length) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY_EMAIL;
		} else {
			return validateEmail(value);
		}
	} else if (name == FORM_CONSULTATION.PHONE) {
		if (!value || !value.length) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY_PHONE;
		} else {
			return validatePhone(value);
		}
	} else if (name == FORM_CONSULTATION.NAME) {
		if (!value || !value.length) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY_NAME;
		} else {
			return validateName(value);
		}
	} else if (name == FORM_CONSULTATION.ALLERGIC) {
		if (!value) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY;
		}
		return '';
	} else if (name == FORM_CONSULTATION.ADDRESS) {
		if (!value || !value.length) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY;
		}
		return '';
	} else if (name == FORM_CONSULTATION.AGE) {
		if (!value) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY;
		}
		return '';
	} else if (name == FORM_CONSULTATION.GENDER) {
		if (!value) {
			return FORM_ERROR_MESSAGE.ERROR_EMPTY_CHOOSE;
		}
		return '';
	}
	return null;
};

export const checkSimilarity = (forms: object, initialFormLocal: any, activeForm: number) => {
	let sameAsProfile = true;
	try {
		if (initialFormLocal != null && initialFormLocal.length) {
			if (activeForm == 0) {
				let isEmpty = true;
				[FORM_CONSULTATION.NAME, FORM_CONSULTATION.GENDER, FORM_CONSULTATION.ADDRESS].forEach(
					(e, i) => {
						const fomsElementIndex = forms[activeForm].findIndex(
							(el: { name: string }) => el.name == e,
						);
						const localFomsElementIndex = initialFormLocal.findIndex(
							(el: { name: string }) => el.name == e,
						);
						console.log('index', fomsElementIndex, localFomsElementIndex);

						console.log(
							'forms',
							initialFormLocal[localFomsElementIndex]?.value,
							forms[activeForm][fomsElementIndex]?.value,
						);

						if (fomsElementIndex > -1 && localFomsElementIndex > -1) {
							isEmpty = false;
							if (
								initialFormLocal[localFomsElementIndex]?.value !=
								forms[activeForm][fomsElementIndex]?.value
							) {
								sameAsProfile = false;
							}
						}
					},
				);
			}
		} else {
			sameAsProfile = false;
		}
	} catch (error) {
		console.log('error on check if same as profile : ', error);
	} finally {
		// eslint-disable-next-line no-unsafe-finally
		return sameAsProfile;
	}
};

export const storeOrderNumber = async (orderNumber?: string) => {
	try {
		if (orderNumber) {
			const trackProgressForm = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
			trackProgressForm.orderId = orderNumber;
			await setStringifyLocalStorage(LOCALSTORAGE.FORM_CONSULTATION, trackProgressForm);
		}
	} catch (error) {
		console.log('error on storeOrdernumber : ', error);
	}
};

export const handleSubmitAddress = async (
	params?: any,
	token?: any,
	ct?: any,
	crt?: any,
	from = 'address',
	backto?: any,
	presc_id?: any,
	token_order?: any,
	checkout_instant_success?: string,
) => {
	const address: any = await getParsedLocalStorage(LOCALSTORAGE.ADDRESS);
	const cart: any = await getParsedLocalStorage(LOCALSTORAGE.CART);
	const voucher_seamless: any = await getStorageParseDecrypt(VOUCHER_CONST.SEAMLESS_VOUCHER);

	let url = `/order?token=${token}&fromPage=${PARAMS_CONST.ADDRESS}`;
	if (ct) {
		url = `/order?ct=${ct}&fromPage=${PARAMS_CONST.ADDRESS}`;
		if (crt) {
			url += `&crt=${crt}`;
		}
		if (backto) {
			url += `&backto=${backto}`;
		}
	}
	const findingPharmacy = `/address/finding-pharmacy?token=${token}&id=${
		params?.orderNumber ?? Router?.query?.id ?? ''
	}&fromPage=${PARAMS_CONST.ADDRESS}&backto=${from}`;

	if (Router?.query?.cart) {
		url = findingPharmacy + '&cart=1';
	} else if (Router?.query?.summary) {
		url = findingPharmacy + '&summary=1';
	} else if (Router.query?.from) {
		url = `/${Router.query?.from}?token=${token}&id=${
			params?.orderNumber ?? Router?.query?.id ?? ''
		}&fromPage=${PARAMS_CONST.ADDRESS}`;
	} else if (from === 'transaction' || from === 'transaction-wtoken') {
		url = `/address/finding-pharmacy?token=${token}&id=${
			params?.orderNumber ?? Router?.query?.id ?? ''
		}&fromPage=${PARAMS_CONST.TRANSACTION_SUMMARY}&presc_id=${presc_id ?? ''}&cart=1&wtoken=${
			from === 'transaction-wtoken' ? '1' : '0'
		}`;
	}
	if (Router?.query?.token_order || token_order) {
		url += '&token_order=' + token_order;
	}
	if (Router?.query?.fromPresc) {
		url += '&fromPresc=' + Router?.query?.fromPresc;
	}

	if (checkout_instant_success && checkout_instant_success == '0') {
		url += '&checkout_instant=' + checkout_instant_success;
	}

	const patient_data = cart?.data?.patient_data;
	const userInfo = cart?.data?.userInfo;
	const patient_detail_address =
		userInfo?.patient_detail_address ?? patient_data?.patient_detail_address ?? '';

	const payload = {
		name: params?.address,
		detail_address: patient_detail_address,
		lat: params?.lat?.toString(),
		lng: params?.lng?.toString(),
		postalCode: params?.postalCode,
	};

	// make sure the address is 205 characters and detail address is 50 characters follow the GOA requirement
	if (payload?.name) {
		payload.name = String(payload?.name).substring(0, 205).trim();
	}
	if (payload?.detail_address) {
		payload.detail_address = String(payload?.detail_address).substring(0, 50).trim();
	}

	setLocalStorage(
		Router?.query?.summary || Router?.query?.cart
			? LOCALSTORAGE.TEMP_ADDRESS
			: LOCALSTORAGE.ADDRESS,
		JSON.stringify(payload),
	);

	if (voucher_seamless) await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);

	window.location.replace(url);
};

export const excludeDetailedAddress = (forms: any) => {
	try {
		let formsTemp = Object.assign([], forms);

		formsTemp = formsTemp.filter(
			(e: any) =>
				e?.name != FORM_CONSULTATION.DETAIL_ADDRESS &&
				e?.name != FORM_CONSULTATION.LATITUDE &&
				e?.name != FORM_CONSULTATION.LONGITUDE,
		);
		const idxAddr = formsTemp?.findIndex((e: any) => e?.name == FORM_CONSULTATION.ADDRESS);
		if (idxAddr > -1) {
			formsTemp[idxAddr] = {
				...formsTemp[idxAddr],
				link: null,
				type: INPUTFORM_CONST.text,
				isRequired: true,
			};
		}
		return formsTemp;
	} catch (error) {
		console.log('err', error);
		return forms;
	}
};
