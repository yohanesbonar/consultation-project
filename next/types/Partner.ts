export type PartnerTheme = {
	onboarding: Onboarding;
	splashscreen: Splashscreen;
	chatRoom: ChatRoom;
	partnerInactivePage: PartnerInactivePage;
	order: Order;
	prescriptionDetail: PrescriptionDetail;
	theme?: any;
	general?: General;
};

export type General = {
	logo?: string;
	logoWhite?: string;
	isAdvancedColor: boolean;
	primaryOnly?: boolean;
	isDefault?: boolean;
};

export type Onboarding = {
	logo: string;
	animation: string;
};

export type Splashscreen = {
	logo: string;
	device: string;
	bgColor: string;
	text: string;
	overlayColor: string;
};

export type ChatRoom = {
	headerColor: string;
	logo: string;
	primaryBubbleChatColor: string;
	secondaryBubbleChatColor: string;
};

export type PartnerInactivePage = {
	partnerLogo: string;
	image: string;
};

export type Order = {
	partnerLogo: string;
	primaryColor: string;
};

export type PrescriptionDetail = {
	primaryColor: string;
};
