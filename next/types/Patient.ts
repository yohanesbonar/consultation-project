export type PatientType = {
	name?: string;
	age?: string;
	gender?: string;
	address?: string;
	bodyHeight?: number;
	bodyWeight?: number;
	medicalComplaint?: string;
	oftenUsedMedication?: string;
	preexistingAllergy?: string;
};

export type PivotParamsType = {
	address?: string;
	age?: string;
	email?: string;
	gender?: string;
	name?: string;
	phone?: string;
	specialistId?: number;
};
