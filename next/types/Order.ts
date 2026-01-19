export type OrderSummary = {
	name: string;
	age: string;
	gender: string;
	specialist: string;
	pricing_amount: number;
	other_amount?: { label: string; value: number }[];
	total_other_amount?: number;
	total_amount: number;
	products?: ProductType;
	back_url?: string;
	discount?: number;
	promo_price?: number;
};

export type VoucherType = {
	index?: number;
	isSelected: boolean;
	code?: string;
	enabled: boolean;
	end_date: string;
	expired_date?: string;
	min_transaction: number;
	name: string;
	containerClass?: string;
	onSelectVoucher?: any;
	shipping_amount?: number;
	amount?: number;
	voucher_type?: string;
	discount_amount?: number;
	discount_shipping_amount?: number;
	grand_total_percentage?: number;
};

export type ProductType = {
	name?: string;
	image?: string;
	qty?: number;
	price?: number;
	merchant_name: string;
	merchant_logo: string;
	merchant_address: string;
};
