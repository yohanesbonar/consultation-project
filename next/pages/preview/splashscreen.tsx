import { SplashScreenTemplate } from '@templates';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from 'redux/actions';

const PreviewSplashScreen = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setTheme(null, false, false));
	}, []);
	const preview = JSON.parse(decodeURIComponent(String(router?.query?.preview)));

	return <SplashScreenTemplate preview={router?.query?.preview ? preview : null} />;
};

export default PreviewSplashScreen;
