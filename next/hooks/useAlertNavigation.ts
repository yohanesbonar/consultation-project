import { checkIsEmpty, PARTNER_CONST } from 'helper';
import { useEffect } from 'react';

function useAlertNavigation(callback?: () => void, consulDetail?: any): void {
	useEffect(() => {
		if (!checkIsEmpty(consulDetail)) {
			const handlePopState = () => {
				if (
					!consulDetail?.data?.consultationPartner
						?.toUpperCase()
						.includes(PARTNER_CONST.SHOPEE)
				) {
					history.pushState(null, '', location.href); // TODO : jadi loop di historynya
					history.pushState(null, '', location.href); // TODO : jadi loop di historynya
				}
				callback();
			};

			// Tambahkan state baru ke history
			if (
				!consulDetail?.data?.consultationPartner?.toUpperCase().includes(PARTNER_CONST.SHOPEE)
			) {
				history.pushState(null, '', location.href); // TODO : jadi loop di historynya
			}
			window.addEventListener('popstate', handlePopState);

			return () => {
				window.removeEventListener('popstate', handlePopState);
			};
		}
	}, [consulDetail]);
}

export default useAlertNavigation;
