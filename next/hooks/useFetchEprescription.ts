import * as React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getConsulVerifyData, getPrescription } from 'redux/actions';
import { showToast } from 'helper';

export default function useFetchEprescription() {
	const router = useRouter();
	const [prescription, setPrescription] = React.useState({});
	const [error, setError] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const dispatch = useDispatch();
	const verifyData = useSelector(({ verifyData }) => verifyData?.verifyData);

	React.useEffect(() => {
		dispatch(getConsulVerifyData());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (verifyData) {
			if (verifyData?.error) {
				showToast(verifyData?.error);
			} else if (verifyData?.token) {
				fetchPrescription();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verifyData]);

	const fetchPrescription = async () => {
		setIsLoading(true);
		try {
			const res = await dispatch(getPrescription(`${router.query?.id}`));
			if (res?.errorMessage) {
				setError(res?.errorMessage);
			} else {
				setPrescription(res?.data);
			}
		} catch (error: any) {
			setError(error?.response);
		}
	};

	return { prescription, isLoading, error };
}
