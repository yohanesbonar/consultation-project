import { DailyWeekly } from './Chat';

export type MedicineConsumptionTime = {
	id: number;
	name: string;
};

export type Time = {
	id: number;
	name: string;
};

export type Prescription = {
	id: number;
	name: string;
	productUrl: string;
	productImage: string;
	qty: number;
	price: number;
	unit: string;
	medicineConsumptionTime: MedicineConsumptionTime;
	dailyWeekly: DailyWeekly;
	notes: string;
	time: Time[];
	frequency: string;
	priceTag: string;
	doseTag: string;
	merchantName?: string;
	originalQty?: number;
	enabler_name?: string;
	transaction_qty?: number;
	productId?: number | string;
	is_priority?: boolean;
	is_recommendation?: boolean | number;
	is_package?: boolean;
	isRecommendation?: boolean;
	recommendation_type?: string;
	short_description?: string;
	description?: string;
	indication?: string;
};

export type MedicalNote = {
	advice?: string;
	resume: string;
	diagnoses: string[];
};

export type MedicalFacility = {
	label: string;
	value: string;
	desc?: any;
};

export type Doctor = {
	label: string;
	value: any;
};

export type Patient = {
	label: string;
	value: string;
};

export type MedicalAction = {
	xid: string;
	name: string;
	image: string;
	doctor_notes?: string;
	notes?: string;
};

export type PrescriptionDetailData = {
	id?: number;
	status?: string;
	expired_at?: string;
	issued_at?: string;
	reject_reason?: any;
	prescription_number?: any;
	partnerName?: string;
	prescriptionStatus?: string;
	prescriptions?: Prescription[];
	submit_redeem?: boolean;
	contact_url?: string;
	medicalNote?: MedicalNote;
	medical_facility?: MedicalFacility[];
	doctor?: Doctor[];
	patient?: Patient[];
	order_token?: string;
	updatedPrescriptions?: any[];
	checkout_instant_success?: boolean | number;
	patient_data?: any;
	no_seamless?: boolean;
	transaction_xid?: string;
	transaction_products?: any;
	patient_recommendation?: PatientRecommendationType[];
	payment_status?: string;
	shipping_status?: string;
	medical_actions?: MedicalAction[];
	medical_action_url?: string;
	post_consultation?: string;
	post_consultation_url?: string;
	qr_url?: string;
};

export type PatientRecommendationType = {
	title: string;
	banner_url?: string;
	description?: string;
	link?: string;
};

export type DetailItemData = Prescription & MedicalFacility & Doctor & Patient;
