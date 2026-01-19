import { PartnerTheme } from '@types';
import {
	checkIsEmpty,
	getParsedLocalStorage,
	LOCALSTORAGE,
	removeLocalStorage,
	setStringifyLocalStorage,
} from 'helper';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from 'redux/actions';

const usePartnerInfo = (props?: {
	theme?: PartnerTheme;
	token?: string;
	isByLocal?: boolean;
}): void => {
	const dispatch = useDispatch();
	const theme = useSelector(({ general }) => general?.theme);

	useLayoutEffect(() => {
		if (
			((!checkIsEmpty(props?.theme) && !checkIsEmpty(props?.token)) || props?.isByLocal) &&
			theme?.loading
		)
			fethAssets();
	});

	const fethAssets = async () => {
		try {
			if (props?.isByLocal) {
				const themeFromStorage = await getParsedLocalStorage(LOCALSTORAGE.THEME);
				if (themeFromStorage) {
					dispatch(setTheme(themeFromStorage, false, false));
				} else {
					dispatch(setTheme(null, false, false, props?.isByLocal));
				}
			} else if (!checkIsEmpty(props?.token)) {
				const themeObj = {
					...(checkIsEmpty(props?.theme) ? {} : { ...props?.theme }),
					token: props?.token,
				};
				dispatch(setTheme(themeObj, false, false));
				setStringifyLocalStorage(LOCALSTORAGE.THEME, themeObj);
			} else {
				dispatch(setTheme(null, false, false));
				removeLocalStorage(LOCALSTORAGE.THEME);
			}
		} catch (error) {
			console.error('error on fetch asset : ', error);
			dispatch(setTheme(null, false, false));
		}
	};
};

export default usePartnerInfo;
