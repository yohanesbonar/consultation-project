// TODO: fix these lints
/* eslint-disable react/prop-types */
import React, { useLayoutEffect } from 'react';
import NextHead from 'next/head';
import snapConfig from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { addLog, checkIsEmpty, fetchCachedThemeCss } from 'helper';
import { parseRootCssVars } from '@guetechteam/whitelabel/index';
import { setColorTonal } from 'redux/actions';

const defaultTitle = 'Teleconsultation';
const defaultDescription = 'Teleconsultation';
const defaultKeyword = 'Teleconsultation';
interface Props {
	title?: string;
	description?: string;
	keywords?: string;
	token?: string;
	isPreview?: boolean;
}

const Head = (props: Props) => {
	const theme = useSelector(({ general }) => general?.theme);
	const dispatch = useDispatch();

	const fetchCss = async () => {
		try {
			const resCss = await fetch('/assets/css/baseColor.css', { credentials: 'omit' });
			const resc = await resCss?.text();
			return resc;
		} catch (error) {
			console.log('error on  : ', error);
		}
		return '';
	};

	const loadCss = (isByLocal = false) => {
		try {
			if (isByLocal || checkIsEmpty(theme?.result?.token)) {
				fetchCss().then((res) => {
					const cssToObject: any = parseRootCssVars(res);
					dispatch(setColorTonal(cssToObject));
					injectCSS(res);
				});
				return;
			}

			fetchCachedThemeCss(theme?.result?.token)
				?.then((res) => {
					const cssToObject: any = parseRootCssVars(res);
					dispatch(setColorTonal(cssToObject));
					injectCSS(res);
				})
				.catch((err) => {
					addLog({ onErrorStyle: 'css not loaded', err });
					loadCss(true);
				});
		} catch (error) {
			console.log('error on  : ', error);
		}
	};

	const injectCSS = (css: string) => {
		try {
			const style = document.createElement('style');
			style.textContent = css;
			document.head.appendChild(style);
		} catch (error) {
			console.log('error on  : ', error);
		}
	};

	useLayoutEffect(() => {
		if (!theme?.loading) {
			loadCss(theme?.isByLocal);
		}
	}, [theme]);

	return (
		<NextHead>
			<meta charSet="UTF-8" />
			<title>{props.title || defaultTitle}</title>
			<meta
				name="description"
				content={
					props.description || props.title
						? props.title + ' - ' + defaultDescription
						: defaultDescription
				}
			/>
			<meta name="keywords" content={props.keywords || defaultKeyword} />
			<meta name="author" content="PT. GUE" />
			<meta name="HandheldFriendly" content="true" />
			<meta name="language" content="ID" />
			<meta name="revisit-after" content="7" />
			<meta name="webcrawlers" content="all" />
			<meta name="rating" content="general" />
			<meta name="spiders" content="all" />
			{/* this changed due to error auto zoom on some components */}
			<meta
				name="viewport"
				// content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				content="height=device-height, 
                      width=device-width, initial-scale=1.0, 
                      minimum-scale=1.0, maximum-scale=1.0, 
                      user-scalable=no, target-densitydpi=device-dpi"
			/>

			<meta name="google-site-verification" content="" />
			<meta name="msapplication-tap-highlight" content="no" />
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="application-name" content="Teleconsultation" />
			<meta name="theme-color" content="#ffffff" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
			<meta name="apple-mobile-web-app-title" content="Teleconsultation" />
			<meta name="apple-mobile-web-app-status-bar-style" content="#ffffff" />
			<meta property="og:title" content="Dkonsul - Doctor Teleconsultation" />
			<meta property="og:description" content="Terhubung dengan dokter lewat Dkonsul" />
			<meta property="og:site_name" content="Teleconsultation" />
			<meta
				property="og:image"
				content={`${snapConfig.BASE_URL}/assets/img/dkonsul_600x600.jpg`}
			/>
			<meta property="og:image:width" content="600" />
			<meta property="og:image:height" content="600" />
			<meta name="color-scheme" content="light only" />
			<meta name="supported-color-schemes" content="light" />
			<meta name="theme-color" content="#ffffff" />

			<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
			<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
			<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
			<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
			<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
			<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
			<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
			<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
			<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />

			<link href="/assets/css/vendor.min.css" rel="stylesheet" />
			<link href="/assets/css/app.min.css" rel="stylesheet" />
			<link href="/assets/css/main.css" rel="stylesheet" />
			<link href="/assets/css/customStyle.css" rel="stylesheet" />

			<link
				href="/assets/plugins/datatables.net-bs5/css/dataTables.bootstrap5.min.css"
				rel="stylesheet"
			/>
			<link
				href="/assets/plugins/datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css"
				rel="stylesheet"
			/>
			<link
				href="/assets/plugins/datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css"
				rel="stylesheet"
			/>

			<link rel="dns-prefetch" href="//goa.oss-ap-southeast-5.aliyuncs.com" />
			<link rel="dns-prefetch" href="//www.google-analytics.com" />
			<link rel="dns-prefetch" href="//www.googletagmanager.com" />
			<link rel="dns-prefetch" href="//fonts.googleapis.com" />
			<link rel="manifest" href="/manifest.json" />
			<link rel="manifest" href="/manifest.webmanifest" />

			{/* <link
					rel="stylesheet"
					href="https://unpkg.com/react-spring-bottom-sheet/dist/style.css"
					crossOrigin="anonymous"
				/> */}

			<link
				rel="stylesheet"
				href="/assets/plugins/react-spring-bottom-sheet@3.4.1/dist/style.css"
			/>

			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
				rel="stylesheet"
			/>

			<script
				dangerouslySetInnerHTML={{
					__html: `
					window.addEventListener('DOMContentLoaded', () => {
						App.init();
					});
				`,
				}}
			></script>
		</NextHead>
	);
};

export default Head;
