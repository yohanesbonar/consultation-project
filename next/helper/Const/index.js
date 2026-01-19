import { IconChatUnavailable, IconInfoYellow, IconNoConnection } from '../../assets';
import { openTnC } from '../Navigator';
import { addLog } from '../Network';

export const GENERAL_CONST = {
	EXPIRED: 'EXPIRED',
	STARTED: 'STARTED',
	CLOSED: 'CLOSED',
	PRESCRIPTION: 'PRESCRIPTION',
	NOTES: 'NOTES',
};

export const FIELD_CONST = {
	EMAIL: 'email',
};

export const BUTTON_CONST = {
	PILIH: 'PILIH',
	TERPILIH: 'TERPILIH',
	SEE_OTHER_MERCHENT: 'LIHAT OPSI APOTEK LAIN',
	OK: 'OKE',
	I_AGREE: 'SAYA SETUJU',
	CANCEL: 'BATALKAN',
	CLOSE: 'TUTUP',
	TRY_AGAIN: 'COBA LAGI',
	APPLY_PRESCRIPTION: 'TEBUS RESEP',
	NOT_INTERESTED: 'SAYA TIDAK TERTARIK',
	CONTACT_US: 'HUBUNGI KAMI',
	SUBMIT_A_REFUND: 'AJUKAN REFUND',
	CANCEL_TRANSACTION: 'BATALKAN TRANSAKSI',
	RELOAD: 'MUAT ULANG',
	I_UNDERSTAND: 'SAYA MENGERTI',
	BACK: 'KEMBALI',
	SAVE: 'SIMPAN',
	SAVE_AND_SUBMIT: 'SIMPAN DAN MULAI KONSULTASI',
	CANCEL_SUBMIT: 'BATAL',
	PAY: 'BAYAR',
	PAY_NOW: 'BAYAR SEKARANG',
	CHECK_PAYMENT: 'CEK STATUS PEMBAYARAN',
	SELECT_PAYMENT: 'PILIH METODE BAYAR',
	ORDER_AGAIN: 'PESAN KONSULTASI LAGI',
	START_CONSULTATION: 'MULAI KONSULTASI',
	CONTINUE_CONSULTATION: 'LANJUT KONSULTASI',
	TRANSACTION_DETAIL: 'DETAIL TRANSAKSI',
	USE_VOUCHER: 'TERAPKAN VOUCHER',
	CANCEL_VOUCHER: 'BATALKAN VOUCHER ',
	DONT_USE_VOUCHER: 'TRANSAKSI TANPA VOUCHER',
	PAKAI: 'PAKAI',
	OTHER: 'LAINNYA',
	CONTINUE: 'LANJUT',
	DELETE: 'HAPUS',
	CANCEL_ACTION: 'TIDAK JADI',
	VIEW_ORDER_STATUS: 'LIHAT STATUS PESANAN',
	COMPLAIN_REQUEST: 'Ajukan Komplain',
	CHANGE_SEND_ADDRESS: 'UBAH ALAMAT KIRIM',
	TRACK_ORDER: 'LACAK PESANAN',
	VIEW_HOW_TO_PAY: 'LIHAT CARA BAYAR',
	ORDER_RECEIVED: 'PESANAN DITERIMA',
	LIHAT_RINGKASAN: 'LIHAT RINGKASAN',
	LIHAT_RESEP: 'LIHAT RESEP',
	BACK_TO_SUMMARY: 'KEMBALI KE RINGKASAN PEMBAYARAN',
	HOW_TO_PAY: 'LIHAT CARA PEMBAYARAN',
	DOWNLOAD_QR_CODE: 'DOWNLOAD KODE QR',
};

export const PLACEHOLDER_CONST = {
	FULLNAME: 'Masukkan Nama Lengkap Pasien',
	EMAIL: 'Contoh@email.com',
	PHONE: '081XXXXXXXXX',
	ADDRESS: 'Pilih Alamat Pasien',
	DETAIL_ADDRESS: 'Perumahan, nomor rumah, nama gedung',
	POSTAL_CODE: 'Masukkan kode pos',
	CHOOSE_SPECIALIST: 'Pilih Dokter',
	ALERGIC: 'Tulis Riwayat Alergi Obat Pasien',
	SEARCH_LOCATION: 'Ketik nama jalan, perumahan, gedung',
};

export const PAGE_ID = {
	CHAT_DETAIL: 'chat-detail',
	CHAT_HISTORY: 'chat-history',
	FORM_CONSULTATION: 'form-consultation',
	TNC: 'tnc',
	PREVIEW_PDF: 'preview-pdf',
	PRESCRIPTION_DETAIL: 'prescription-detail',
	ORDER: 'order',
	NOT_FOUND: 'NOT_FOUND',
	ERROR_503: 'ERROR_503',
	GENERAL_ERROR: 'GENERAL_ERROR',
	ACCESS_DENIED: 'ACCESS_DENIED',
	PAYMENT: 'payment',
	WAITING_PAYMENT: 'waiting_payment',
	ORDER_DETAIL: 'order_detail',
	PAYMENT_HISTORY: 'payment_history',
	PAYMENT_STATUS: 'payment-status',
	TRANSACTION_DETAIL: 'transaction-detail',
	TRANSACTION_ERROR: 'transaction-error',
	TRANSACTION_REFUND: 'transaction-refund',
	TRANSACTION_CART: 'transaction-cart',
	TRANSACTION_SUMMARY: 'transaction-summary',
	VOUCHER: 'VOUCHER',
	VOUCHER_DETAIL: 'voucher-detail',
	MAIL_SUCCESS: 'mail-success',
	ATTACHMENTS: 'ATTACHMENTS',
	SPLASH: 'SPLASH',
	FINDING_PHARMACY: 'FINDING_PHARMACY',
	OUT_SCHEDULE: 'out-of-schedule',
};

export const BUTTON_ID = {
	//general
	BUTTON_BACK: 'button-back',
	BUTTON_INFO_CONSULTATION: 'button-info-consultation',
	BUTTON_BACK_TO_APP: 'button-back-to-app',
	BUTTON_DETAIL: 'button-detail',
	BUTTON_DETAIL_HEADER: 'button-detail-header',
	BUTTON_END: 'button-end',
	BUTTON_ADD_FILE: 'button-add-file',
	BUTTON_SEND: 'button-send',
	BUTTON_VIEW_TNC: 'button-view-tnc',
	BUTTON_VIEW_PRIVACY: 'button-view-privacy',
	BUTTON_UPLOAD: 'button-upload',
	BUTTON_PREVIEW: 'button-preview',
	BUTTON_CLOSE_BOTTOMSHEET: 'button-close-prefix',
	BUTTON_START_CONSULTATION: 'button-start-consultation',
	BUTTON_CONTACT_US: 'button-contact-us',
	BUTTON_APPLY_VOUCHER: 'button-apply-voucher',
	BUTTON_CANCEL_ORDER: 'button-cancel-order',
	BUTTON_CONFIRM: 'button-confirm',
	BUTTON_NO: 'button-no',
	BUTTON_CONTINUE: 'button-continue',
	BUTTON_OTHER: 'button-other',
	BUTTON_CANCEL: 'button-cancel',
	BUTTON_SAVE: 'button-save',
	BUTTON_CHANGE_ADDRESS: 'button-change-address',

	//chat
	INPUT_CHAT: 'input-chat',
	BUTTON_CHAT_CLEAR_FILE: 'button-chat-clear-file',
	BUTTON_FORM_FILL: 'button-form-fill',
	BUTTON_FORM_VIEW: 'button-form-view',
	BUTTON_FORM_SUBMIT: 'button-form-submit',
	BUTTON_CHAT_ERROR: 'button-chat-error',
	BUTTON_CHAT_RESEND: 'button-chat-resend',
	BUTTON_CHAT_SCROLL_DOWN: 'button-chat-scroll-down',
	BUTTON_CHAT_PRESCRIPTION_DETAIL: 'button-chat-prescription-detail',
	BUTTON_CHAT_PRESCRIPTION_SEE_CHANGES: 'button-chat-prescription-see-changes',
	BUTTON_CHAT_NOTE_SEE_CHANGES: 'button-chat-note-see-changes',
	BUTTON_CHAT_PREVIEW_IMAGE: 'button-chat-preview-image',
	BUTTON_CHAT_CLOSE_PREVIEW_IMAGE: 'button-chat-close-preview-image',
	BUTTON_CHAT_PREVIEW_FILE: 'button-chat-preview-file',
	BUTTON_CHAT_VIEW_ALL_INITIAL_RECEIPT: 'button-chat-view-all-initial-receipt',

	//bottomsheet
	BUTTON_BOTTOMSHEET_TAB_DOCTOR: 'button-bottomsheet-tab-doctor',
	BUTTON_BOTTOMSHEET_TAB_PATIENT: 'button-bottomsheet-tab-patient',
	BUTTON_BOTTOMSHEET_DETAIL_CLOSE: 'button-bottomsheet-detail-close',
	BUTTON_BOTTOMSHEET_CHAT_FORM_SAVE: 'button-bottomsheet-chat-form-save',
	BUTTON_BOTTOMSHEET_CHAT_FORM_VIEW_AGAIN: 'button-bottomsheet-chat-form-view-again',
	BUTTON_BOTTOMSHEET_CHAT_FORM_TNC: 'button-bottomsheet-chat-form-tnc',
	BUTTON_BOTTOMSHEET_CHAT_FORM_PRIVACY: 'button-bottomsheet-chat-form-privacy',
	BUTTON_BOTTOMSHEET_CHAT_END_OK: 'button-bottomsheet-chat-end-ok',
	BUTTON_BOTTOMSHEET_CHAT_END_CANCEL: 'button-bottomsheet-chat-end-cancel',
	BUTTON_BOTTOMSHEET_PRESCRIPTIN_NOT_INTERESTED_OK:
		'button-bottomsheet-prescription-not-interested-ok',
	BUTTON_BOTTOMSHEET_PRESCRIPTIN_NOT_INTERESTED_CANCEL:
		'button-bottomsheet-prescription-not-interested-cancel',
	FILE_PICKER: '-file-picker',

	//form
	CHECK_FORM_AUTO_FILL: 'check-form-auto-fill',
	CHECK_ALERGIC_AUTO_FILL: 'check-alergic-auto-fill',
	CHECK_AGREE_INFORM_CONSENT: 'check-agree-inform-consent',
	CHECK_AGREE_PROMOTIONAL: 'check-agree-promotional',
	BUTTON_FORM_NEXT: 'button-form-next',
	BUTTON_FORM_BACK_TO_FIRST_FORM: 'button-form-back-to-first-form',
	BUTTON_FORM_SAVE: 'button-form-save',
	BUTTON_FORM_TNC: 'button-form-tnc',
	BUTTON_FORM_PRIVACY: 'button-form-privacy',
	BUTTON_BOTTOMSHEET_FORM_VIEW_AGAIN: 'button-bottomsheet-form-view-again',
	BUTTON_BOTTOMSHEET_FORM_OK: 'button-bottomsheet-form-ok',
	BUTTON_BOTTOMSHEET_FORM_BACK_CANCEL: 'button-bottomsheet-form-back-cancel',
	BUTTON_BOTTOMSHEET_FORM_BACK_OK: 'button-bottomsheet-form-back-ok',
	BUTTON_FORM_INPUT_BIRTHDATE: 'button-form-input-birthdate',
	BUTTON_FORM_INPUT_GENDER_MALE: 'button-form-input-gender-male',
	BUTTON_FORM_INPUT_GENDER_FEMALE: 'button-form-input-gender-female',
	INPUT_FORM_NAME: 'input-form-name',
	INPUT_FORM_ADDRESS: 'input-form-address',
	INPUT_FORM_DETAIL_ADDRESS: 'input-form-detail-address',
	INPUT_FORM_POSTAL_CODE: 'input-form-postal-code',
	INPUT_FORM_SYMPTOMS: 'input-form-symptoms',
	INPUT_FORM_ALLERGIC: 'input-form-allergic',
	INPUT_FORM_MEDICINE: 'input-form-medicine',
	INPUT_FORM_HEIGHT: 'input-form-height',
	INPUT_FORM_WEIGHT: 'input-form-weight',
	INPUT_FORM_EMAIL: 'input-form-email',
	INPUT_FORM_PHONE: 'input-form-phone',

	//coachmark
	BUTTON_COACHMARK_NEXT_DETAIL: 'button-coachmark-next-detail',
	BUTTON_COACHMARK_NEXT_DURATION: 'button-coachmark-next-duration',
	BUTTON_COACHMARK_PREV_DURATION: 'button-coachmark-prev-duration',
	BUTTON_COACHMARK_DONE_ADD_FILE: 'button-coachmark-done-add-file',
	BUTTON_COACHMARK_PREV_ADD_FILE: 'button-coachmark-prev-add-file',

	//file
	BUTTON_CHAT_GALLERY_PICKER: 'button-chat-gallery-picker',
	BUTTON_CHAT_CAMERA_PICKER: 'button-chat-camera-picker',
	BUTTON_CHAT_FILE_PICKER: 'button-chat-file-picker',
	IMAGE_THUMBNAIL: '-image-thumbnail',
	FILE_THUMBNAIL: '-file-thumbnail',

	//inform consent
	BUTTON_BACK_CONSENT: 'button-back-consent',
	BUTTON_START_CONSENT: 'button-start-consent',

	//payment
	BUTTON_PAY: 'button-pay',
	BUTTON_CHECK_PAY: 'button-check-pay',
	BUTTON_SELECT_PAYMENT_METHOD: 'button-select-payment-method',
	BUTTON_DOWNLOAD_QR: 'button-download-qr',

	//transaction
	BUTTON_TRANSACTION_LIST: 'button-transaction-list',
	BUTTON_ORDER_AGAIN: 'button-order-again',
	BUTTON_SUBMIT_A_REFUND: 'button-submit-a-refund',

	//voucher
	BUTTON_USE_VOUCHER: 'button-use-voucher',

	//seamless
	BUTTON_CONFIRM_MAPS_ADDRESS: 'button-confirm-maps-address',
	BUTTON_CANCEL_VOUCHER: 'button-cancel-voucher',
	TRACK_ORDER: 'button-track-order',
	VIEW_HOW_TO_PAY: 'button-view-how-to-pay',
	ORDER_RECEIVED: 'button-order-received',
};

export const INPUTFORM_CONST = {
	text: 'text',
	textarea: 'textarea',
	checkbox: 'checkbox',
	date: 'date',
	options_radio: 'options_radio',
	dropdown: 'dropdown',
	month: 'month',
	year: 'year',
	file: 'file',
	alergic: 'alergic',
	link: 'link',
	bottomsheet: 'bottomsheet',
};

export var CHAT_CONST = {
	DONE: 'DONE',
	INCOMING_MESSAGE: 'INCOMING_MESSAGE',
	READ_RECEIPT: 'READ_RECEIPT',
	MESSAGE: 'MESSAGE',
	TEXT: 'TEXT',
	READ: 'READ',
	DELIVERED: 'DELIVERED',
	FAILED: 'FAILED',
	SENT: 'SENT',
	FILL_FORM: 'FILLFORM',
	FILL_FORM_DONE: 'FILLFORMDONE',
	EXPIRED: 'EXPIRED',
	IMAGE: 'IMAGE',
	FILE: 'FILE',
	PATIENT: 'PATIENT',
	DOCTOR: 'DOCTOR',
	PRESCRIPTION: 'PRESCRIPTION',
	NOTE: 'NOTE',
	UPDATE_MESSAGE: 'UPDATE_MESSAGE',
	PING: 'PING',
	PONG: 'PONG',
	INITIAL_PRESCRIPTION: 'INITIAL_PRESCRIPTION',
	ATTACHMENTS: 'ATTACHMENTS',
	PDF: 'PDF',
	LINK: 'LINK',
	INDICATOR: 'INDICATOR',
	TYPING: 'TYPING',
	NOTES: 'NOTES',
	LINK_CLICKABLE: 'LINK_CLICKABLE',
	WEB_VIEW: 'web_view',
	MEDICAL_ACTION: 'MEDICAL_ACTION',
	BLOCKED_LINK: 'BLOCKED_LINK',
};

export const PRESCRIPTION_CONST = {
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	EXPIRED: 'EXPIRED',
	NOT_GIVEN: 'Tidak Diberikan',
	INTERESTED: 'INTERESTED',
	NOT_INTERESTED: 'NOT_INTERESTED',
	PENDING: 'PENDING',
	CONTACT_US: 'CONTACT_US',
	DOCTOR_NAME: 'nama_dokter',
	DOCTOR_SPECIALIZATION: 'spesialisasi',
	DOCTOR_REFERENCE_NUMBER: 'nomor_surat_izin_praktik',
	HEALTH_FACILITY_NAME: 'nama_fasilitas_kesehatan',
	HEALTH_FACILITY_ADDRESS: 'alamat_fasilitas_kesehatan',
	PRESCRIPTION_NUMBER: 'nomor_resep',
	PRESCRIPTION_CREATED_DATE: 'tanggal_dikeluarkan',
	PRESCRIPTION_EXPIRED_DATE: 'tanggal_kadaluarsa',
	PATIENT_NAME: 'nama_pasien',
	PATIENT_GENDER: 'jenis_kelamin',
	PATIENT_AGE: 'usia',
};

export const FILE_CONST = {
	FILE: 'file',
	PHOTO: 'foto',
	UPLOADED_PHOTO: 'UPLOADED_PHOTO',
};

export const FILE_TYPE = {
	CAMERA: 'camera',
	GALLERY: 'gallery',
	DOCS: 'docs',
};

export const DETAIL_ITEM = {
	PRODUCT: 'PRODUCT',
	MEDICAL_FACILITY: 'MEDICAL_FACILITY',
	IMAGE: 'IMAGE',
};

export const OFFLINE_CONST = {
	FAILED_LOAD_CONTENT: 'Gagal memuat konten',
	NO_INTERNET_CONNECTION: 'Tidak Ada Koneksi Internet',
	WE_WIL_INFORM_YOU: 'Kami akan memberi tahu Anda jika terhubung lagi ke internet.',
	CHECK_YOUR_CONNECTION:
		'Periksa koneksi internet Anda dan pastikan perangkat Anda terhubung ke internet.',
	BACK_ONLINE: 'Kembali Online',
	RELLOAD: 'MUAT ULANG',
};

export const LABEL_CONST = {
	PRESCRIPTION_ONLY_ONE_TIME_USE_STARTED_CONSULTATION:
		'Resep elektronik akan dikirim ke email Anda setelah telekonsultasi berakhir dan hanya bisa dipakai 1x.',
	PRESCRIPTION_ONLY_ONE_TIME_USE: 'Resep elektronik hanya bisa dipakai 1x.',
	PRESCRIPTION_INVALID: 'Resep elektronik sudah tidak berlaku',
	TELECONSULTATION_ENDED: 'Telekonsultasi telah berakhir',
	PRODUCT_DETAIL: 'Rincian Produk',
	PRODUCT_DETAIL_REFUND: 'Rincian Produk untuk Refund',
	PAYMENT_DETAIL: 'Rincian Pembayaran',
	REFUND_DETAIL: 'Rincian Refund',
	DOCTOR_CONSULTATION: 'Konsultasi Kesehatan',
	PRESCRIPTION: 'Tebus Resep',
	DOCTOR: 'Dokter',
	PATIENT_NAME: 'Nama Pasien',
	PATIENT_DATA: 'Data Pasien',
	AGE: 'Usia',
	GENDER: 'Jenis Kelamin',
	OTHER: 'Lainnya',
	CHECK_PAYMENT_STATUS: 'Cek Status Pembayaran',
	PLEASE_WAITING_THIS_PAGE: 'Mohon menunggu di halaman ini',
	QUOTA_HAS_BEEN_SENT_TO_EMAIL: 'Kuota telekonsultasi sudah dikirim ke email Anda.',
	SUBMIT_REFUND: 'Ajukan Refund',
	YES_CANCEL_TRANSACTION: 'YA, BATALKAN TRANSAKSI',
	NO: 'TIDAK',
	CONTINUE: 'LANJUT',
	CHOOSE_SHIPPING: 'Pilih Pengiriman',
	EDIT_PHONE_NUMBER: 'Edit Nomor Hp',
	ORDERED_MEDICINE: 'Obat Dipesan',
	SHIPPING_INFO: 'Info Pengiriman',
	CHOOSE_POSTAL_COED: 'Kode Pos Alamat Kirim',
	FORCE_END_BY_ADMIN: 'Konsultasi diakhiri oleh admin',
	DOCTOR_TYPING: 'dokter sedang mengetik',
	DOCTOR_GIVE_PRESCRIPTION: 'dokter sedang menulis resep',
	DOCTOR_GIVE_NOTES: 'dokter sedang menulis catatan',
	FREE_PAID_CONSULTATION: 'Konsultasi Bebas Biaya',
	NEED_TO_PAY: 'Tagihan Perlu Dibayar',
	FAIL_TO_PAY: 'Tagihan Gagal Dibayar',
	RESUME_WILL_BE_SENT_TO_EMAIL_INFO:
		'Ringkasan telekonsultasi akan dikirim ke email Anda setelah telekonsultasi berakhir',
	HEALTHCARE_WILL_BE_SENT_TO_EMAIL_INFO:
		'Saran Tindakan Medis akan dikirim ke email Anda setelah telekonsultasi berakhir',
	APPROVAL_HEALTHCARE_WILL_BE_SENT_TO_EMAIL_INFO:
		'Saran Tindakan Medis akan dikirim ke email Anda setelah telekonsultasi berakhir dan dapat dipesan',
};

export const COMPONENT_CONST = {
	TNC_LINK_COMPONENT: (
		<p className="body-12-regular">
			Saya menyetujui Informed Consent,{' '}
			<a
				id={BUTTON_ID.BUTTON_VIEW_TNC}
				className="tx-link"
				onClick={() => openTnC(TNC_CONST.TNC)}
			>
				Syarat Ketentuan
			</a>{' '}
			dan{' '}
			<a
				id={BUTTON_ID.BUTTON_VIEW_PRIVACY}
				className="tx-link"
				onClick={() => openTnC(TNC_CONST.PRIVACY_POLICY)}
			>
				Kebijakan Privasi
			</a>
			.
		</p>
	),
	BOTTOMSHEET_EXPIRED_COMPONENT: (
		<div>
			<IconChatUnavailable />
			<p className="font-20 mg-t-24 tw-font-roboto tw-font-medium">
				Telekonsultasi Telah Berakhir
			</p>
			<p className="font-16 mg-t-16">
				Mohon maaf, sesi telekonsultasi telah berakhir karena waktu telah habis. Silakan
				konsultasi kembali.
			</p>
		</div>
	),
	BOTTOMSHEET_OFFLINE_COMPONENT: (
		<div>
			<IconNoConnection />
			<p className="font-20 mg-t-24 tw-font-roboto tw-font-medium">
				{OFFLINE_CONST.NO_INTERNET_CONNECTION}
			</p>
			<p className="font-16 mg-t-16">{OFFLINE_CONST.CHECK_YOUR_CONNECTION}</p>
		</div>
	),
	MODAL_CANCEL_TRANSACTION_COMPONENT: (
		<div>
			<p className="title-18-medium tw-text-center ">Anda Yakin Mau Membatalkan Transaksi?</p>
			<p className="body-14-regular tw-text-center tw-mb-0">
				Konfirmasi untuk membatalkan transaksi Anda
			</p>
		</div>
	),
	MODAL_DELETE_CART_ITEM: 'MODAL_DELETE_CART_ITEM',
};

export const getComponentConst = (type = '', params) => {
	try {
		switch (type) {
			case COMPONENT_CONST.MODAL_DELETE_CART_ITEM:
				return (
					<div>
						<p className="title-18-medium tw-text-center ">Yakin untuk Menghapus Item?</p>
						<p className="body-14-regular tw-text-center tw-mb-0">
							Anda yakin untuk menghapus “{params?.title}” dari keranjang?
						</p>
						<div className="tw-py-3 tw-px-2 tw-bg-info-50 tw-rounded-lg tw-flex tw-gap-2 tw-mt-4">
							<IconInfoYellow />
							<p className="tw-mb-0 flex-1">
								Resep hanya bisa <b>ditebus sekali</b>. Item yang dihapus tidak dapat
								ditebus di lain waktu.
							</p>
						</div>
					</div>
				);
			default:
				return null;
		}
	} catch (error) {
		addLog({ errComponentConst: error });
		console.log('error on get component const : ', error);
		return null;
	}
};

export const CONFIRMATION_KEY_CONST = {
	BACK_CONFIRMATION: 'BACK_CONFIRMATION',
	FORM_CONFIRMATION: 'FORM_CONFIRMATION',
	FORM_CONFIRMATION_BOTTOMSHEET: 'FORM_CONFIRMATION_BOTTOMSHEET',
	NOT_INTERESTED_APPLY_PRESCRIPTION: 'NOT_INTERESTED_APPLY_PRESCRIPTION',
};

export const CONFIRMATION_CONST = {
	BACK_CONFIRMATION: {
		title: 'Ingin Kembali?',
		desc: 'Semua data yang telah diisi tidak tersimpan.',
		cancelButtonText: 'BATAL',
		okButtonText: 'KEMBALI',
		cancelButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_FORM_BACK_CANCEL,
		okButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_FORM_BACK_OK,
	},
	FORM_CONFIRMATION: {
		title: 'Yakin untuk Simpan? Pastikan Data Pasien Sudah Benar.',
		desc: (
			<span>
				Pastikan data yang dimasukkan adalah <b>data pasien yang membutuhkan pengobatan</b>.
				Data yang benar memastikan diagnosis dan pengobatan sesuai.
			</span>
		),
		cancelButtonText: 'CEK LAGI',
		okButtonText: 'YAKIN',
		cancelButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_FORM_VIEW_AGAIN,
		okButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_FORM_OK,
	},
	FORM_CONFIRMATION_BOTTOMSHEET: {
		title: 'Konfirmasi Pengisian Formulir',
		desc: 'Apakah Anda yakin formulir yang diisi telah benar? Jika iya, Anda tidak bisa mengubah formulir lagi.',
		descComponent: COMPONENT_CONST.TNC_LINK_COMPONENT,
		cancelButtonText: 'LIHAT LAGI',
		okButtonText: 'SIMPAN',
		cancelButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_CHAT_FORM_VIEW_AGAIN,
		okButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_CHAT_FORM_SAVE,
	},
	NOT_INTERESTED_APPLY_PRESCRIPTION: {
		title: 'Apakah Anda Yakin Tidak Tertarik?',
		desc: 'Jika yakin maka tebus resep sekarang akan hangus.',
		cancelButtonText: 'BATAL',
		okButtonText: 'YAKIN',
		cancelButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_PRESCRIPTIN_NOT_INTERESTED_CANCEL,
		okButtonId: BUTTON_ID.BUTTON_BOTTOMSHEET_PRESCRIPTIN_NOT_INTERESTED_OK,
	},
};

export const CALLBACK_CONST = {
	SEND_WITH_SOCKET: 'SEND_WITH_SOCKET',
	SEND_WITH_API: 'SEND_WITH_API',
};

export const TITLE_CONST = {
	TELECONSULTATION_INFORMATION: 'Informasi Telekonsultasi',
};

export const MESSAGE_CONST = {
	SOMETHING_WENT_WRONG: 'Something went wrong!',
	MAX_5MB: 'Maaf, maksimal ukuran adalah 5.0 MB',
	ALREADY_FILLED_CONSULTATION_FORM:
		'Halo, saya sudah mengisi formulir dan hendak melakukan konsultasi dok',
	PAYMENT_NOT_COMPLETED_PLEASE_CHECK: 'Pembayaran Anda belum masuk. Pastikan Anda sudah membayar.',
	END_CONSULTATION_REQUIRED: 'Resep bisa ditebus setelah konsultasi berakhir',
	INVALID_FORM: 'mohon lengkapi data yang perlu diisi',
	INVALID_LINK: 'Link yang Anda masukkan tidak diizinkan dikirim dalam telekonsultasi',
};

export const TNC_CONST = {
	TNC: 'tnc',
	PRIVACY_POLICY: 'privacypolicy',
	TNC_title: 'T & C',
	PRIVACY_POLICY_TITLE: 'Privacy Policy',
};

export const CONSENT_CONST = {
	BACK: 'KEMBALI',
	START: 'MULAI',
	AGREE: 'SETUJU',
};

export const STATUS_CONSULTATION = {
	FINDING: 'FINDING',
	EXPIRED: 'EXPIRED',
	STARTED: 'STARTED',
	VERIFIED: 'VERIFIED',
	UNVERIFIED: 'UNVERIFIED',
	ON_TRANSACTION: 'ON_TRANSACTION',
	CLOSED: 'CLOSED',
	DONE: 'DONE',
	COMPLETED: 'COMPLETED',
};

export const CONSULTATION_TYPE = {
	APPROVAL: 'APPROVAL',
	RECOMMENDATION: 'RECOMMENDATION',
};

export const ORDER_TYPE = {
	WITH_PRESCRIPTION: 'WITH_PRESCRIPTION',
	WITHOUT_PRESCRIPTION: 'WITHOUT_PRESCRIPTION',
	PRODUCT: 'product',
	ORDER: 'order',
	CONSULTATION: 'consultation',
	PIVOT: 'PIVOT',
	PARTNER: 'PARTNER',
};

export const COMPONENT_TYPE = {
	TEXT: 'TEXT',
	TEXT_START: 'TEXT_START',
	TEXT_COPY: 'TEXT_COPY',
	TEXT_STATUS: 'TEXT_STATUS',
	DATE: 'DATE',
};

export const TRANSACTION_LABEL = {
	ALL_PRICE: 'Semua Biaya',
	INVOICE_NO: 'Nomor Invoice',
	PAYMENT_STATUS: 'Status Bayar',
	ORDER_TIME: 'Waktu Order',
	PRICE: 'Harga',
	TOTAL_PRICE: 'Total Harga',
	OTHER_FEE: 'Biaya Lain-Lain',
	DISCOUNT: 'Potongan Harga',
	GRAND_TOTAL: 'Total Pembayaran',
	GRAND_TOTAL_OTHER: 'Total Biaya Lain-Lain',
	TOTAL_REFUND: 'Total Refund',
	REFUND_DESTINATION: 'Tujuan Refund',
	SEND_FEE: 'Biaya Kirim',
	WAKTU_PENGAJUAN: 'Waktu Pengajuan',
};

export const PAYMENT_STATUS = {
	PAID: 'PAID',
	NON_PAID: 'NON_PAID',
	PAID_CONFIRM: 'PAID_CONFIRM',
	PRE_PAID: 'PRE_PAID',
	FREE_PAID: 'free-paid',
};

export const STATUS_CONST = {
	ACCEPT: 'ACCEPT',
	SUCCESS: 'SUCCESS',
	FAILED: 'FAILED',
	NOT_STARTED: 'NOT_STARTED',
	CONSULTATION_READY: 'READY',
	CONSULTATION_STARTED: 'CONSULTATION_STARTED',
	STARTED: 'STARTED',
	READY: 'READY',
	DONE: 'DONE',
	ENDED: 'ENDED',
	EXPIRED: 'EXPIRED',
	PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
	PAYMENT_FAILED: 'PAYMENT_FAILED',
	CREATED: 'CREATED',
	CANCEL: 'CANCEL',
	PENDING: 'PENDING',
	NON_PAID: 'NON_PAID',
	REFUNDED: 'REFUNDED',
	CANCELLED: 'CANCELLED',
	REJECTED: 'REJECTED',
	ARRIVED: 'ARRIVE',
	SENT: 'SENT',
	ON_PROCESS: 'ON_PROCESS',
	COMPLETED: 'COMPLETED',
	CLOSED: 'CLOSED',
	COMPLAIN: 'COMPLAIN',
	OUT_OFF_SCHEDULE: 'OUT_OFF_SCHEDULE',
	INVALID: 'INVALID',
};

export const STATUS_LABEL = {
	SUCCESS: 'Berhasil',
	REFUNDED: 'Refund Berhasil',
	FAILED: 'Gagal',
	CANCELLED: 'Gagal',
	EXPIRED: 'Kuota Expired',
	NOT_STARTED: 'Belum Dimulai',
	CONSULTATION_STARTED: 'Sudah Dimulai',
	CONSULTATION_USED: 'Sudah Konsultasi',
	STARTED: 'Dimulai',
	CONSULTATION_READY: 'Belum Konsultasi',
	ENDED: 'Selesai',
	CANCEL: 'Batal',
	PENDING: 'Menunggu Bayar',
	PAYMENT_PENDING: 'Menunggu Pembayaran',
	PAYMENT_SUCCESS: 'Pembayaran Berhasil',
	PAYMENT_FAILED: 'Pembayaran Gagal',
	PAYMENT_EXPIRED: 'Pembayaran Kadaluarsa',
	ONGOING: 'Sedang Berjalan',
	PENDING_PAYMENT: 'Menunggu Pembayaran',
	ARRIVED_DESTINATION: 'Tiba di Tujuan',
	ORDER_CANCELED: 'Pesanan Dibatalkan',
	ON_SEND: 'Sedang dikirim',
	COMPLETED: 'Pesanan Selesai',
	COMPLAIN: 'Dikomplain',
	ON_PROCESS: 'Pesanan Diproses',
	WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
	HOW_TO_PAY: 'Lihat Cara Bayar',
	VIEW_STATUS: 'Lihat status',
};

export const VOUCHER_CONST = {
	REQUIRED: 'Wajib Diisi',
	INVALID: 'Kode voucher tidak valid',
	SUCCESS_APPLY: 'Voucher berhasil diterapkan',
	SUCCESS_UNAPPLY: 'Voucher berhasil dibatalkan',
	SUCCESS_DELETED_VOUCHER: 'Voucher berhasil dihapus',
	VOUCHER_TOAST: 'voucher_toast',
	VOUCHER_INVALID_FLAG: 'invalid_voucher',
	VOUCHER_INVALID: 'voucher terpasang tidak valid',
	VOUCHER_APPLIED: 'voucher terpasang',
	SEAMLESS_VOUCHER: 'seamless_voucher',
	GRAND_TOTAL: 'GRAND_TOTAL',
	NON_GRAND_TOTAL: 'NON_GRAND_TOTAL',
	CART_PERCENT: 'cart_percent',
};

export const TOAST_CONST = {
	success: 'success',
	error: 'error',
	TRANSACTION_DETAIL_TOAST: 'TRANSACTION_DETAIL_TOAST',
};

export const TOAST_MESSAGE = {
	INVOICE: 'Nomor invoice berhasil disalin',
	SUCCESS_CANCEL_TRANSACTION: 'Transaksi berhasil dibatalkan',
	MERCHENT_AJUSTED: 'Terjadi penyesuaian harga dan apotek',
	PLEASE_SELECT_SHIPPING: 'Mohon pilih pengiriman dahulu',
	CONSULTATION_ENDED_AND_CAN_APPLY_PRESC:
		'Telekonsultasi berakhir dan Anda bisa proses tebus resep',
};

export const BROWSER_NAME = {
	SAFARI: 'Safari',
	CHROME: 'Google Chrome',
};

export const filterTab = (isProduct = false) => {
	let filterTabs = [
		{
			label: 'Semua',
			value: 'all',
		},
		{
			label: 'Menunggu Bayar',
			value: 'payment_pending', // payment_status === 'PENDING'
		},
		{
			label: 'Belum Konsultasi',
			value: 'consultation_ready', // payment_status === 'SUCCESS' && consultation_status === 'READY'
		},
		{
			label: 'Sudah Konsultasi',
			value: 'consultation_done', // payment_status === 'SUCCESS' && consultation_status === 'DONE'
		},
		{
			label: 'Sedang Konsultasi',
			value: 'consultation_started', // payment_status === 'SUCCESS' && consultaion_status === 'STARTED'
		},
		{
			label: 'Kuota Expired',
			value: 'quota_expired', // payment_status === 'EXPIRED' || payment_status === 'SUCCESS' && consultation_status !== 'READY', 'DONE', 'STARTED'
		},
		{
			label: 'Pembayaran Gagal',
			value: 'payment_failed', // payment_status === 'FAILED' || payment_status === 'CANCELLED'
		},
		{
			label: 'Refund',
			value: 'payment_refund', // payment_status === 'REFUNDED'
		},
	];
	if (isProduct) {
		filterTabs = [
			{
				label: 'SEMUA',
				value: 'all',
			},
			{
				label: STATUS_LABEL.PAYMENT_PENDING.toUpperCase(),
				value: 'payment_pending',
			},
			{
				label: STATUS_LABEL.PAYMENT_FAILED.toUpperCase(),
				value: 'payment_failed',
			},
			{
				label: STATUS_LABEL.WAITING_CONFIRMATION.toUpperCase(),
				value: 'processing',
			},
			{
				label: STATUS_LABEL.ON_PROCESS.toUpperCase(),
				value: 'ready_pickup',
			},
			{
				label: STATUS_LABEL.ON_SEND.toUpperCase(),
				value: 'in_transit',
			},
			{
				label: STATUS_LABEL.ARRIVED_DESTINATION.toUpperCase(),
				value: 'complete',
			},
			{
				label: STATUS_LABEL.ENDED.toUpperCase(),
				value: 'finished',
			},
			{
				label: STATUS_LABEL.ORDER_CANCELED.toUpperCase(),
				value: 'rejected',
			},
			{
				label: STATUS_LABEL.COMPLAIN.toUpperCase(),
				value: 'complained',
			},
		];
	}
	return filterTabs;
};

export const dataTransactionDummy = [
	{
		xid: '948e5287-1750-4b77-86e2-7c7b8e7e561f',
		specialist_id: 0,
		invoice_number: null,
		transaction_id: 'DK0230700157',
		paid_amount: 32000,
		payment_status: 'PENDING',
		consultation_status: null,
		payment_expired_at: '2023-07-19 21:45:00',
		consultation_expired_at: null,
		created_at: '2023-07-18 20:34:54',
		specialist: 'Dokter Umum dummy',
	},
	{
		xid: 'f321d528-a864-4f5f-8046-40360c9339cb',
		specialist_id: 0,
		invoice_number: 'INV/230718/00008',
		transaction_id: 'DK0230700159',
		paid_amount: 32000,
		payment_status: 'SUCCESS',
		consultation_status: 'READY',
		payment_expired_at: null,
		consultation_expired_at: null,
		created_at: '2023-07-18 21:44:17',
		specialist: 'Dokter Umum',
	},
	{
		xid: 'a9c1991d-88f9-4537-aa03-2a1d7d69e589',
		specialist_id: 0,
		invoice_number: 'INV/230719/00001',
		transaction_id: 'DK0230700160',
		paid_amount: 32000,
		payment_status: 'SUCCESS',
		consultation_status: 'DONE',
		payment_expired_at: null,
		consultation_expired_at: null,
		created_at: '2023-07-19 10:27:18',
		specialist: 'Dokter Umum',
	},
	{
		xid: 'aabc665f-38ae-4d04-b0bf-46ee23189c43',
		specialist_id: 0,
		invoice_number: 'INV/230719/00002',
		transaction_id: 'DK0230700161',
		paid_amount: 32000,
		payment_status: 'SUCCESS',
		consultation_status: 'EXPIRED',
		payment_expired_at: null,
		consultation_expired_at: null,
		created_at: '2023-07-19 10:33:25',
		specialist: 'Dokter Umum',
	},
	{
		//
		xid: '5534d057-a72d-4e4a-8170-972a2d700b0b',
		specialist_id: 0,
		invoice_number: 'INV/230719/00006',
		transaction_id: 'DK0230700166',
		paid_amount: 32000,
		payment_status: 'REFUNDED',
		consultation_status: 'CANCELED',
		payment_expired_at: null,
		consultation_expired_at: null,
		created_at: '2023-07-19 11:21:00',
		specialist: 'Dokter Umum',
	},
	{
		xid: 'de223768-39ff-4120-b47e-24ce6a5d4409',
		specialist_id: 0,
		invoice_number: 'INV/230719/00008',
		transaction_id: 'DK0230700169',
		paid_amount: 32000,
		payment_status: 'FAILED',
		consultation_status: null,
		payment_expired_at: null,
		consultation_expired_at: null,
		created_at: '2023-07-19 17:28:37',
		specialist: 'Dokter Umum',
	},
	{
		xid: 'dad01273-c4d0-4fd9-917d-5464573269c7',
		specialist_id: 0,
		invoice_number: 'INV/230720/00003',
		transaction_id: 'DK0230700177',
		paid_amount: 32000,
		payment_status: 'EXPIRED',
		consultation_status: null,
		payment_expired_at: null,
		consultation_expired_at: null,
		created_at: '2023-07-20 10:53:06',
		specialist: 'Dokter Umum expired',
	},
];

export const detailTransactionDummy = [
	{
		xid: '948e5287-1750-4b77-86e2-7c7b8e7e561f',
		transaction_id: 'DK0230700157',
		invoice_number: 'INV/230720/00004',
		payment_status: 'PENDING',
		consultation_status: 'PENDING',
		pricing_amount: 25000,
		discount: 0,
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-21 11:03:40',
		consultation_expired_at: null,
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-20 11:03:40',
		updated_at: '2023-07-20 11:03:40',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
	{
		xid: 'f321d528-a864-4f5f-8046-40360c9339cb',
		transaction_id: 'DK0230700159',
		invoice_number: 'INV/230718/00008',
		payment_status: 'SUCCESS',
		consultation_status: 'READY',
		pricing_amount: 25000,
		discount: 0,
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-21 11:03:40',
		consultation_expired_at: '2023-07-25 11:03:40',
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-18 21:44:17',
		updated_at: '2023-07-18 21:44:17',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
	{
		xid: 'a9c1991d-88f9-4537-aa03-2a1d7d69e589',
		transaction_id: 'DK0230700160',
		invoice_number: 'INV/230719/00001',
		payment_status: 'SUCCESS',
		consultation_status: 'DONE',
		pricing_amount: 25000,
		discount: 0,
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-21 11:03:40',
		consultation_expired_at: null,
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-20 11:03:40',
		updated_at: '2023-07-20 11:03:40',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
	{
		xid: 'aabc665f-38ae-4d04-b0bf-46ee23189c43',
		invoice_number: 'INV/230719/00002',
		transaction_id: 'DK0230700161',
		payment_status: 'SUCCESS',
		consultation_status: 'EXPIRED',
		pricing_amount: 25000,
		discount: 0,
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-18 11:03:40',
		consultation_expired_at: '2023-07-20 11:03:40',
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-19 10:33:25',
		updated_at: '2023-07-19 10:33:25',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
	{
		xid: '5534d057-a72d-4e4a-8170-972a2d700b0b',
		invoice_number: 'INV/230719/00006',
		transaction_id: 'DK0230700166',
		payment_status: 'REFUNDED',
		consultation_status: 'CANCELED',
		pricing_amount: 25000,
		discount: 0,
		failed_reason: 'Pembayaran belum dilakukan sampai melewati batas waktu',
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-21 11:03:40',
		consultation_expired_at: null,
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-19 11:21:00',
		updated_at: '2023-07-19 11:21:00',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
	{
		xid: 'de223768-39ff-4120-b47e-24ce6a5d4409',
		invoice_number: 'INV/230719/00008',
		transaction_id: 'DK0230700169',
		payment_status: 'FAILED',
		failed_reason: 'Terdapat gangguan. Dana otomatis kembali ke saldo Anda.',
		consultation_status: null,
		pricing_amount: 25000,
		discount: 0,
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-21 11:03:40',
		consultation_expired_at: null,
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-19 17:28:37',
		updated_at: '2023-07-19 17:28:37',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
	{
		xid: 'dad01273-c4d0-4fd9-917d-5464573269c7',
		invoice_number: 'INV/230720/00003',
		transaction_id: 'DK0230700177',
		payment_status: 'EXPIRED',
		failed_reason: 'Waktu bayar sudah melewati waktu expired',
		consultation_status: null,
		pricing_amount: 25000,
		discount: 0,
		other_amount: [
			{
				label: 'Biaya admin',
				value: 5000,
			},
			{
				label: 'Biaya Test',
				value: 2000,
			},
		],
		paid_amount: 32000,
		payment_expired_at: '2023-07-21 11:03:40',
		consultation_expired_at: null,
		payment_method: {
			id: '821fc580-7281-11eb-9f9d-f9ae31172d17',
			name: 'GoPay',
			type: 'Mobile Payment',
			logo_url: '',
		},
		created_at: '2023-07-20 10:53:06',
		updated_at: '2023-07-20 10:53:06',
		voucher: null,
		patient: {
			name: 'Test pasien',
			age: '6 Tahun',
			gender: 'MALE',
		},
		specialist: {
			name: 'Dokter Umum',
		},
		transaction_token:
			'c7c73b63b2d1bc6f7dd39276f67e8700929f461a261d163e4b1f02882b88b161af52299be7cd95f8ef26fb2fa0edadfbcb7bc739b2f8dd251d71748c8d7a3009013c35e22acae2ee990fded7d27d0d2473205f98d48c430648db77cd67bc94b2486d2831c50d9be9358757d30e9860a3499ebe19c90748ef634b4a0cac264007__5vdOGy81zLu6bZAu',
	},
];

export const REFUND_REASONS = [
	{
		id: 0,
		value: 'Tidak menemukan dokter',
	},
	{
		id: 1,
		value: 'Tidak jadi konsultasi',
	},
];

export const PARAMS_CONST = {
	ADDRESS: 'address',
	TRANSACTION_SUMMARY: 'transaction-summary',
	FINDING_PHARMACY: 'finding-pharmacy',
};

export const CHAT_ACTION = {
	READ_RECEIPT: 'READ_RECEIPT',
	INCOMING_MESSAGE: 'INCOMING_MESSAGE',
	EXPIRED: 'EXPIRED',
	UPDATE_MESSAGE: 'UPDATE_MESSAGE',
	DONE: 'DONE',
	TYPING: 'TYPING',
	PRESCRIPTION: 'PRESCRIPTION',
	NOTES: 'NOTES',
};

export const CHAT_TYPE = {
	IMAGE: 'IMAGE',
	MESSAGE: 'MESSAGE',
	PRESCRIPTION: 'PRESCRIPTION',
	NOTE: 'NOTE',
	FILLFORM: 'FILLFORM',
	FILE: 'FILE',
	DATE: 'DATE',
	PING: 'PING',
	PONG: 'PONG',
	INDICATOR: 'INDICATOR',
	MEDICAL_ACTION: 'MEDICAL_ACTION',
	MEDICAL_RECORD: 'MEDICAL_RECORD',
	TEXT: 'TEXT',
};

export const SEAMLESS_CONST = {
	ADDRESS_TOP_TITLE: 'Pilih Alamat Pasien',
	ADDRESS_TOP_SUBTITLE:
		'Pilih alamat terdekat jika tidak menemukan alamat. Anda dapat menambah detail alamat nanti',
	ADDRESS_TOP_TITLE_CHECKOUT: 'Set Alamat untuk Pengiriman Obat',
	ADDRESS_TOP_SUBTITLE_CHECKOUT:
		'Pilih alamat terdekat jika tidak menemukan alamat. Anda dapat menambah detail alamat nanti',
	ADDRESS_NOT_SET: 'not-set',
	MESSAGE_BOTTOM_INPUT_SEARCH: 'ketik min. 3 karakter untuk mengeluarkan hasil',
	SEND_ADDRESS: 'Lokasi Kirim',
	ITEM: 'Item',
	SUB_ITEM: 'Jumlah item yang diresepkan dokter tidak bisa ditambah',
	SUBTOTAL: 'Subtotal',
	GRAND_TOTAL: 'Total Pembayaran',
	POSTAL_CODE: 'postal_code',
	LOCATION_ALLOWED: 'location_allowed',
	LOCATION_DENIED: 'location_denied',
	CLICK_TO_GET_LOCATION: 'Klik disini untuk mendapatkan lokasi terkini',
	PLEASE_CHECK_YOUR_DEVICE_LOCATION_PERMISSION:
		'Tidak dapat mendapatkan lokasi. Silahkan aktifkan lokasi lewat pengaturan di perangkatmu',
};

export const horizontalTrack = [
	{
		id: 1,
		label: 'Menunggu Konfirmasi',
		isComplete: false,
		isActive: false,
	},
	{
		id: 2,
		label: 'Diproses',
		isComplete: false,
		isActive: false,
	},
	{
		id: 3,
		label: 'Sedang Dikirim',
		isComplete: false,
		isActive: false,
	},
	{
		id: 4,
		label: 'Tiba di Tujuan',
		isComplete: false,
		isActive: false,
	},
];

export const verticalTrack = [
	{
		id: 1,
		title: 'System',
		subtitle: 'Pesanan sudah diterima driver.',
		date: '11 Jul 2023',
		time: '11:11',
		isLatest: true,
	},
	{
		id: 2,
		title: 'System',
		subtitle:
			'Kurir sedang dalam perjalanan untuk mengambil pesanan. Nama Kurir: Budi Utomo, Telepon: 0818493768, Plat nomor: B 8394 CV',
		date: '11 Jul 2023',
		time: '11:11',
		isLatest: false,
	},
	{
		id: 3,
		title: 'Diproses',
		subtitle: 'Pesanan Anda sedang diproses',
		date: '11 Jul 2023',
		time: '11:11',
		isLatest: false,
	},
	{
		id: 4,
		title: 'Menunggu Konfirmasi',
		subtitle: 'Pembayaran Anda telah terverifikasi. Silahkan tunggu konfirmasi dari apotek.',
		date: '11 Jul 2023',
		time: '11:11',
		isLatest: false,
	},
	{
		id: 5,
		title: 'Menunggu Pembayaran',
		subtitle: 'Menunggu pembayaran Anda',
		date: '11 Jul 2023',
		time: '11:29',
		isLatest: false,
	},
];

export const TRANSACTION_CONST = {
	XEN_INVOICE: 'XEN INVOICE',
	XENINV: 'XENINV',
};

export const POST_CONSULTATION = {
	NO_SEAMLESS: 'NO_SEAMLESS',
	SEAMLESS_ADDRESS: 'SEAMLESS_ADDRESS',
	SEAMLESS_CART: 'SEAMLESS_CART',
	CHECKOUT_PARTNER: 'CHECKOUT_PARTNER',
};

export const QRIS_HOW_TO_PAY = [
	{
		payment_category: 'Scan Kode Langsung',
		instruction: [
			'Buka aplikasi pembayaran yang bisa membaca QRIS',
			'Scan QRIS di atas sebelum batas waktu berakhir',
			'Lakukan proses pembayaran',
			'Pembayaran selesai',
		],
	},
	{
		payment_category: 'Scan dengan Upload Kode',
		instruction: [
			'Download/screenshot Kode QR di atas',
			'Buka aplikasi pembayaran yang bisa membaca QRIS',
			'Buka fitur scan QRIS',
			'Upload kode QR yang sudah di-download',
			'Lakukan proses pembayaran',
			'Pembayaran selesai',
		],
	},
];

export const COOKIES_CONST = {
	CONSUL_SESSION: 'consulSession',
	THEME_SESSION: 'themeSession',
	THEME_CSS_SESSION: 'themeCSSSession',
	THEME_CSS_SESSION_2: 'themeCSSSession2',
	THEME_CSS_SESSION_DATA: 'themeCSSSessionData',
	THEME_COOkIES: 'themeCookies',
};

export const PARTNER_CONST = {
	TOKOPEDIA: 'TOKOPEDIA',
	TEMAN_BUMIL: 'TEMAN BUMIL',
	SHOPEE: 'SHOPEE',
};
