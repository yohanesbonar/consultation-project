import { checkIsEmpty, getLocalStorage, removeLocalStorage, showToast } from 'helper';
import { useEffect, useRef } from 'react';

const useToastFromLocalStorage = (
	key = '',
	type: 'error' | 'success' = 'success',
	additionalStyle = { marginBottom: 70 },
) => {
	const isCheckingRef = useRef(false);
	const checkFromLocalStorage = async () => {
		try {
			if (!isCheckingRef.current) {
				isCheckingRef.current = true;
				const res = await getLocalStorage(key);
				if (checkIsEmpty(res)) return;
				showToast(res, additionalStyle, type);
				removeLocalStorage(key);
			}
		} catch (error) {
			console.log('error on  : ', error);
		}
	};
	useEffect(() => {
		checkFromLocalStorage();
	}, []);
};

export default useToastFromLocalStorage;
