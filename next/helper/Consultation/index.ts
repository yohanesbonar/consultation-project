import { Prescription, PrescriptionDetailData } from '@types';
import { checkIsEmpty, handleSendManualPresc } from 'helper/Common';
import { CHAT_CONST, CHAT_TYPE, MESSAGE_CONST, POST_CONSULTATION } from 'helper/Const';
import { addLog } from 'helper/Network';
import moment from 'moment';
import { toast } from 'react-hot-toast';

// findlastindex
declare global {
	interface Array<T> {
		findLastIndex(
			predicate: (value: T, index: number, obj: T[]) => unknown,
			thisArg?: any,
		): number;
	}
}

export const redirectApplyPresc = (
	data?: PrescriptionDetailData,
	params?: {
		contactUrl?: string;
		orderNumber?: string;
		handleSeamlessCart?: () => void;
		handleSeamlessAddress?: () => void;
		isSameAddressAndCartHandling?: boolean;
		isReplacePage?: boolean;
	},
) => {
	try {
		if (data?.post_consultation == POST_CONSULTATION.NO_SEAMLESS) {
			handleSendManualPresc(data, data?.contact_url ?? params?.contactUrl, params?.orderNumber);
		} else if (data?.post_consultation == POST_CONSULTATION.SEAMLESS_ADDRESS) {
			if (params?.isSameAddressAndCartHandling) {
				params?.handleSeamlessCart();
			} else {
				params?.handleSeamlessAddress();
			}
		} else if (data?.post_consultation == POST_CONSULTATION.SEAMLESS_CART) {
			params?.handleSeamlessCart();
		} else if (data?.post_consultation == POST_CONSULTATION.CHECKOUT_PARTNER) {
			const url = checkIsEmpty(data?.post_consultation_url)
				? data?.contact_url
				: data?.post_consultation_url;
			if (params?.isReplacePage) {
				window.location.href = url;
			} else {
				window.open(url);
			}
		} else {
			// if other condition, redirect to contact url
			handleSendManualPresc(data, params?.contactUrl, params?.orderNumber);
		}
	} catch (error) {
		addLog({ errRedirectApply: error });
		toast.dismiss();
		toast.error(MESSAGE_CONST.SOMETHING_WENT_WRONG, {
			icon: null,
			className: 'tw-bg-error-def tw-text-tpy-50 tw-mb-4 tw-w-full',
		});
		console.error('error on redirect apply presc  : ', error);
	}
};

export const extractLastMedicalActionIndex = (messages = []) => {
	try {
		// find last
		const resultIdx = messages?.length
			? messages?.findLastIndex((e) => e?.type == CHAT_TYPE.MEDICAL_ACTION)
			: -1;

		return resultIdx;
	} catch (error) {
		console.log('error on  : ', error);
		return null;
	}
};

export const changeToDeletedMedicalAction = (messages = []) => {
	try {
		// todo: replace to deleted
		const result = Object.assign([], messages);
		const temp = extractLastMedicalActionIndex(messages);
		if (temp > -1) {
			result[temp] = {
				...result[temp],
				deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				statusMessage: CHAT_CONST.EXPIRED,
			};
		}
		return result;
	} catch (error) {
		console.log('error on change to deleted medical action : ', error);
		return messages;
	}
};

export const getMergeObjectTrxtoPresc = (trxProducts?: any[], presc?: Prescription[]) => {
	try {
		let res = presc;
		if (trxProducts?.length > 0) {
			res = trxProducts;
			for (let index = 0; index < trxProducts.length; index++) {
				const element = presc?.find((e) => e?.productId == trxProducts[index]?.productId);
				if (element) {
					res[index] = {
						...res[index],
						//desc, short desc, indication
						description: element?.description,
						short_description: element?.short_description,
						indication: element?.indication,
					};
				}
			}
		}
		return res;
	} catch (error) {
		console.log('error on  : ', error);
	}
};
