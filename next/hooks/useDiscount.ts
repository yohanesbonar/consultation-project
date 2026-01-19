import { useMemo } from 'react';

const useDiscount = (data: any) => {
	const discount = useMemo(() => {
		let result = 0;
		const seamlessVoucherAmount =
			data?.voucher?.amount > 0
				? data?.voucher?.amount
				: data?.voucher?.shipping_amount > 0
				? data?.voucher?.shipping_amount
				: 0;
		if (data?.discount != null && data?.discount > 0) result = data?.discount; // guepay
		else if (seamlessVoucherAmount && seamlessVoucherAmount > 0) result = seamlessVoucherAmount; // seamless voucher
		return result;
	}, [data]);

	return discount;
};

export default useDiscount;
