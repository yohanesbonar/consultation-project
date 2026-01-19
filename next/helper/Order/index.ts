import { checkIsEmpty, encryptData, navigateWithQueryParams, setCRPartner } from 'helper/Common';
import { MESSAGE_CONST, ORDER_TYPE, PAGE_ID, PAYMENT_STATUS, STATUS_CONST } from 'helper/Const';
import { LOCALSTORAGE, setStorageEncrypt, setStringifyLocalStorage } from 'helper/LocalStorage';
import { getConsultationDetailPartner, postRequestTransaction } from 'helper/Network';
import { isBlockedUser } from 'helper/Network/requestHelper';
import { NextRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const requestTransaction = async (params: {
	router: NextRouter;
	body: object;
	device?: any;
	token: string;
	props: any;
	partnerDetail?: any;
	isFreePaid: boolean;
	finallyCallback?: () => void | null;
	successCallback?: () => void | null;
	stillClosedCallback?: () => void | null;
	errorCallback?: () => void | null;
}) => {
	try {
		const type = params?.router?.query?.ct ? ORDER_TYPE.PARTNER : ORDER_TYPE.PIVOT;
		// block user flag
		const response = await postRequestTransaction(
			{ ...params?.body, ...(!checkIsEmpty(params?.device) ? { device: params?.device } : {}) },
			params?.token,
			type,
		);
		if (!response?.meta?.acknowledge) {
			params?.errorCallback ? params?.errorCallback() : null;
		}

		if (
			response?.data?.meta?.status &&
			response?.data?.meta?.message &&
			isBlockedUser(response?.data?.meta?.status, response?.data?.meta?.message)
		) {
			return params?.router.push('/blocked');
		}
		if (response?.meta?.acknowledge) {
			let partner: any = {};
			if (params?.router?.query?.ct) {
				const resConsulPartner = await getConsultationDetailPartner(params?.token);
				partner = resConsulPartner?.data?.transaction;
				setCRPartner(
					params?.props?.initialData?.consultationRequestToken,
					resConsulPartner?.data?.transaction,
				);
			}
			await setStringifyLocalStorage(LOCALSTORAGE.TRANSACTION, response.data);
			// redirect page init
			const redirectInit = {
				pathname: '/onboarding',
				query: { action: await encryptData('orderConsul') },
			};

			let redirectTo: any = {};

			// payment status conditioning
			const is_free_paid = response?.data?.total_amount == 0 && params?.isFreePaid ? 1 : 0;

			switch (params?.partnerDetail.paymentType) {
				case PAYMENT_STATUS.PAID || PAYMENT_STATUS.PRE_PAID:
					redirectTo = {
						pathname: '/order/detail',
						query: {
							token: params?.router?.query?.ct ? partner?.token : params?.token,
							transaction_xid: params?.router?.query?.ct
								? partner?.xid
								: response?.data?.xid,
							back: 1,
							freepaid: is_free_paid,
						},
					};
					break;
				case PAYMENT_STATUS.PAID_CONFIRM:
					redirectTo = {
						pathname: '/order/email',
						query: { email: params?.props.pivotParams?.email, token: params?.token },
					};
					break;
				default:
					redirectTo = redirectInit;
					break;
			}
			navigateWithQueryParams(redirectTo?.pathname, redirectTo?.query, 'replace');
			params?.successCallback ? params?.successCallback() : null;
		} else {
			params?.errorCallback ? params?.errorCallback() : null;
			if (params?.stillClosedCallback != null) {
				params?.stillClosedCallback();
			} else {
				if (response?.data?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
					const payload = {
						from: '/order',
						query: { ...(params?.router?.query || {}), token: params?.token },
						data: response?.data?.data,
					};
					await setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
					return params?.router.push({
						pathname: '/partner-closed',
						query: { from: PAGE_ID.OUT_SCHEDULE, token: params?.token },
					});
				}
				alert(response.meta.message);
			}
		}
	} catch (error) {
		params?.errorCallback ? params?.errorCallback() : null;
		console.log('error on req trx : ', error);
		toast.dismiss();
		toast.error(MESSAGE_CONST.SOMETHING_WENT_WRONG, {
			icon: null,
			style: { background: '#B00020', color: '#FFFFFF', marginBottom: 16, width: '100%' },
		});
	} finally {
		params?.finallyCallback ? params?.finallyCallback : null;
	}
};
