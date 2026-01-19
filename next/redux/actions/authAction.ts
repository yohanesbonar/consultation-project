import { LOCALSTORAGE, MESSAGE_CONST, getConsulVerify, getStorageParseDecrypt } from 'helper';
import Router from 'next/router';

export const SET_VERIFY_DATA = 'AUTH/SET_VERIFY_DATA';

export const setVerifyDataAction = (verifyData: any) => ({
	type: SET_VERIFY_DATA,
	payload: verifyData,
});

export const getConsulVerifyData: any = () => {
	return async (dispatch: any) => {
		try {
			const token = Router.query?.token ?? global?.tokenAuthorization;
			if (token) {
				const res = await getConsulVerify(token);

				if (res?.meta?.acknowledge) {
					dispatch(setVerifyDataAction(res?.data));
				} else {
					dispatch(
						setVerifyDataAction({
							error:
								res?.meta?.message ?? res?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
						}),
					);
				}
			} else {
				try {
					const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
					if (consulSession?.token || consulSession?.tokenAuthorization) {
						dispatch(
							setVerifyDataAction({
								orderNumber: consulSession?.orderNumber,
								token: consulSession?.token || consulSession?.tokenAuthorization,
								partner: consulSession?.partner,
							}),
						);
					}
				} catch (error) {
					console.log('error on get consul from localstorage : ', error);
					throw error;
				}
			}
		} catch (error) {
			dispatch(setVerifyDataAction({ error: MESSAGE_CONST.SOMETHING_WENT_WRONG }));
		}
	};
};
