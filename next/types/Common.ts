export type ConfirmationConst = {
	title: string;
	desc: string;
	cancelButtonText: string;
	okButtonText: string;
	cancelButtonId: string;
	okButtonId: string;
	descComponent?: React.ReactNode;
};

export type FileData = {
	filename: string;
	size: number;
	type: string;
	url: string;
};

export type dataGallery = {
	type: string;
	files: any[];
	activeIndex: number;
	fileType?: string;
};

export type Meta = {
	acknowledge: boolean;
	status: number;
	message?: string;
	at?: Date | string;
};

export type PatientData = {
	name: string;
	formFill?: boolean;
	bornDate?: any;
	age?: string;
	gender?: string;
	medicalComplaint?: any;
	preexisting_allergy?: string;
};
