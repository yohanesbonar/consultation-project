import { LOCALSTORAGE, getParsedLocalStorage } from 'helper';
import Router from 'next/router';
import debounce from 'debounce-promise';
import { getRatingList } from 'helper/Network/rating';
const debouncedFetchRate = debounce(getRatingList, 1000);

export const SET_RATE_LIST = 'RATE/LIST';

export const setRateList = (rate: any) => ({
	type: SET_RATE_LIST,
	payload: rate,
});

export const fetchRate: any = () => {
	return async (dispatch: any) => {
		dispatch(setRateList({ data: [], error: false, loading: true }));
		try {
			const order = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);

			const { data, meta }: any = await debouncedFetchRate({
				token: Router?.query?.token_order ?? order?.partnerToken,
			});
			if (meta?.acknowledge) dispatch(setRateList({ data, error: false, loading: false }));
		} catch (error) {
			console.error('error: ', error);
			dispatch(setRateList({ data: [], error: true, loading: false }));
		}
	};
};
