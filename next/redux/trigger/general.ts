import { store } from '../next-store-wrapper';
import {
	setTimeLeftAction as setTimeLeftDispatch,
	setIsOpenBottomsheetEndConsulAction as setIsOpenBottomsheetEndConsulDispatch,
	setFormProgressAction as setFormProgressDispatch,
	setIsSendingChatAction as setIsSendingChatDispatch,
	showEndConsulAction as showEndConsulDispatch,
	setIsPageLoadingAction as setIsPageLoadingDispatch,
	setIsChatExpiredAction as setIsChatExpiredDispatch,
	setNetworkStateAction as setNetworkStateDispatch,
	setIsOpenOfflineBottomsheetAction as setIsOpenOfflineBottomsheetDispatch,
	getTncPatientAction as getTncPatientDispatch,
	setErrorAlertAction as setErrorAlertDispatch,
} from '../actions/generalAction';

import { setPivotParamsAction as setPivotParamsDispatch } from '../actions/consultationAction';

export const setTimeLeft = (payload: number) => {
	return store.dispatch(setTimeLeftDispatch(payload));
};

export const setIsOpenBottomsheetEndConsul = (payload: boolean) => {
	return store.dispatch(setIsOpenBottomsheetEndConsulDispatch(payload));
};

export const setFormProgress = (payload: any) => {
	return store.dispatch(setFormProgressDispatch(payload));
};

export const setIsSendingChat = (payload: boolean) => {
	return store.dispatch(setIsSendingChatDispatch(payload));
};

export const showEndConsul = (payload: boolean) => {
	return store.dispatch(showEndConsulDispatch(payload));
};

export const setIsPageLoading = (payload: boolean) => {
	return store.dispatch(setIsPageLoadingDispatch(payload));
};

export const setPivotParams = (payload: any) => {
	return store.dispatch(setPivotParamsDispatch(payload));
};

export const setIsChatExpired = (payload: boolean) => {
	return store.dispatch(setIsChatExpiredDispatch(payload));
};

export const setNetworkState = (payload: {
	isOnline: boolean;
	isNeedToReconnect: boolean;
	isDetected: boolean;
}) => {
	return store.dispatch(setNetworkStateDispatch(payload));
};

export const setIsOpenOfflineBottomsheet = (payload: boolean) => {
	return store.dispatch(setIsOpenOfflineBottomsheetDispatch(payload));
};

export const getTncPatient = (payload: string) => {
	return store.dispatch(getTncPatientDispatch(payload));
};

export const setErrorAlertRedux = (payload: {
	danger: boolean;
	data?: {
		message?: string;
	};
}) => {
	return store.dispatch(setErrorAlertDispatch(payload));
};
