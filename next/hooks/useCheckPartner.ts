import { useEffect, useState } from 'react';
import { LOCALSTORAGE, STATUS_CONST, getPartnerDetail, setStorageEncrypt } from 'helper';
import Router from 'next/router';

type Props = {
	token?: any;
	from?: any;
	query?: any;
};

const useCheckPartner = (props: Props) => {
	const { token, from, query } = props;

	const [partnerDetail, setPartnerDetail] = useState(null);
	const [isFetch, setIsFetch] = useState(true);

	const checkPartner = async () => {
		setIsFetch(true);
		const res = await getPartnerDetail(token);
		setPartnerDetail(res?.data);
		setIsFetch(false);
		if (res?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
			setIsFetch(false);
			const data = {
				from,
				query,
				data: res?.data,
			};
			setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, data);
			setTimeout(() => {
				return Router.push({
					pathname: '/partner-closed',
					query: { token },
				});
			}, 300);
		}
	};

	useEffect(() => {
		if (token) checkPartner();
	}, [token]);

	return { partnerDetail, isFetch };
};

export default useCheckPartner;
