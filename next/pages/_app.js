/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect } from 'react';
import App from 'next/app';
import { ErrorBoundary } from '../components';
import { store, wrapper } from '../redux/next-store-wrapper';
import TagManager from 'react-gtm-module';
import { Toaster } from 'react-hot-toast';

import '../public/assets/css/global.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { contactUrlAction } from 'redux/actions';
import { useRouter } from 'next/router';

class MyApp extends App {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		TagManager.initialize({
			gtmId: process.env.NEXT_PUBLIC_GTM_ID,
			dataLayerName: 'PageDataLayer',
		});
		// this.props.dispatch(contactUrlAction());
	}

	render() {
		const { Component, pageProps } = this.props;
		//disable log
		if (process.env.NODE_ENV === 'production') {
			console.log = function no_console() {};
		}
		return (
			<Provider store={store}>
				<Contact />
				<ErrorBoundary>
					<Component {...pageProps} />
					<Toaster
						position="bottom-center"
						toastOptions={{
							success: {
								duration: 2000,
								style: {
									background: '#178038',
									color: '#FFFFFF',
									width: '100%',
								},
								icon: null,
							},
							error: {
								style: {
									background: 'red',
								},
							},
						}}
					/>
				</ErrorBoundary>
			</Provider>
		);
	}
}

const Contact = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const contactUrl = useSelector(({ general }) => general.contactUrl);

	useEffect(() => {
		if (router?.query?.token && !contactUrl) {
			dispatch(contactUrlAction(router?.query?.token));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contactUrl, router?.query?.token]);

	return <></>;
};

export default wrapper.withRedux(MyApp);
