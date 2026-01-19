import { Meta } from './Common';

export type TransactionResponse = {
	meta: Meta;
	data: DetailTransactionData;
};

export const detailTransactionDummy = [
	{
		xid: '948e5287-1750-4b77-86e2-7c7b8e7e561f',
		transaction_id: 'DK0230700157',
		invoice_number: 'INV/230720/00004',
		payment_status: 'PENDING',
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
];

export type DetailTransactionData = {
	xid: string;
	transaction_id: string;
	invoice_number: string;
	payment_status?: string;
	consultation_status?: string;
	pricing_amount?: number;
	discount?: number;
	other_amount?: OtherAmount[];
	paid_amount?: number;
	payment_expired_at: Date | string;
	consultation_expired_at: Date | string;
	payment_method: PaymentMethod;
	voucher?: null;
	patient?: PatientTransactionType;
	specialist: Specialist;
	transaction_token?: string;
	contact_url?: string;
	order_only_from_partner?: boolean;
	deeplink_url?: string;
	invoice_url?: string;
};

export type PaymentMethod = {
	id: string;
	name: string;
	type: string;
	logo_url: string;
};

export type PatientTransactionType = {
	name: string;
	age: string;
	gender: string;
};

export type OtherAmount = {
	label: string;
	value: number;
};

export type Specialist = {
	name: string;
};

export type VoucherDetailType = {
	name: string;
	code: string;
	min_transaction?: number;
	end_date: Date;
	tnc?: string;
};
