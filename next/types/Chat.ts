import { Meta, PatientData } from './Common';
import { MedicalNote, MedicineConsumptionTime, Time } from './Prescription';

export type Diagnosis = {
	code: string;
	description: string;
	id: number;
};

export type DataChatItem = {
	advice?: string;
	diagnoses: Diagnosis[];
	resume: string;
};

export type ChatItem = {
	xid?: string;
	message?: string;
	consultationId?: number;
	conversationId?: number;
	orderNumber?: string;
	memberId?: string;
	memberName?: string;
	createdAt?: number | any;
	localId?: number | string;
	statusMessage?: string;
	type?: string;
	userType?: string;
	status?: string;
	data?: DataChatItem | MedicalNote | any;
	timeLimit?: Date;
	action?: string;
	updated_at?: any;
	replyTo?: string;
	replyToDetail?: any;
};

///----

export type ChatHeader = {
	label: string;
	key: string;
	name: string;
	image: string;
};

export type DoctorData = {
	name: string;
	photo: string;
	specialization: string[];
	education: string[];
};

export type DailyWeekly = {
	id: number;
	isEnableTime?: boolean;
	name: string;
	shortName?: string;
};

export type DataMedicine = {
	daily_weekly: DailyWeekly;
	drugId: number;
	frequency: any;
	image: string;
	medicine_consumption_time: MedicineConsumptionTime;
	medicine_name: string;
	note: string;
	price: number;
	priceTag: string;
	product_url: string;
	qty: string;
	time: Time[];
	unit: string;
};

export type DataMessage = {
	data_medicine: DataMedicine[];
	note_status: string;
	note_status_id: string;
	status: string;
	type: string;
	advice: string;
	diagnoses: Diagnosis[];
	resume: string;
};

export type Message = {
	xid: string;
	message: string;
	consultationId: number;
	conversationId: number;
	orderNumber: string;
	memberId: string;
	memberName: string;
	createdAt: any;
	statusMessage: string;
	type: string;
	userType: string;
	status: string;
	data: DataMessage;
};

export type DataChatDetail = {
	status: string;
	orderNumber: string;
	expiredAt: Date | string;
	closed_at: Date | string;
	startedAt: Date | string;
	timeLimitPrescription: Date | string;
	timeLimitNote: Date | string;
	minConsultationAt: Date | string;
	roomId: string;
	roomToken: string;
	chatHeaders: ChatHeader[];
	patientData: PatientData;
	doctorData: DoctorData;
	messages: Message[];
	suggestPrescription: boolean;
	consultationPartner: string;
	consultationType: string;
	ctaLabel: string;
	backUrl: string;
	endUrl?: any;
	redirectAfter?: null | string;
	consultationUrl?: string;
};

export type ChatDetailResponse = {
	consultationPartner?: string;
	meta: Meta;
	data: DataChatDetail;
};
