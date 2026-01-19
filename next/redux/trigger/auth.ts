import { store } from '../next-store-wrapper';
import { setVerifyDataAction as setVerifyDataDispatch } from '../actions/authAction';

export const setVerifyData = (payload: any) => {
	return store.dispatch(setVerifyDataDispatch(payload));
};
