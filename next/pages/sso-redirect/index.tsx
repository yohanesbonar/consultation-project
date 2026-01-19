// TODO: fix these lints
/* eslint-disable no-unsafe-finally */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/prop-types */
import { isBlockedUser } from 'helper/Network/requestHelper';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
	checkCookieSession,
	checkIsEmpty,
	getPartnerDetail,
	fetchCachedTheme,
	LOCALSTORAGE,
	objectToQueryString,
	setStorageEncrypt,
	STATUS_CONST,
	STATUS_CONSULTATION,
	COOKIES_CONST,
	removeLocalStorage,
} from '../../helper';
import { authToken, submitPartnerOrderConsultation } from '../../helper/Network/consultation';
import SSORedirect from './sso-redirect';
import { Wrapper } from '@organisms';
import InfoPageTemplate from 'components/templates/InfoPageTemplate';
import { deleteCookie } from 'cookies-next';

const SSORedirectPage = (props) => {
	const router = useRouter();
	const { req, consulTime } = props;
	const [pageProps, setPageProps] = useState(undefined);
	// DK-86 : disable device on sso redirect
	// const [device, setDeviceId] = useState('');

	const ssrDuplicate = async () => {
		await deleteCookie(COOKIES_CONST.THEME_SESSION);
		await deleteCookie(COOKIES_CONST.THEME_CSS_SESSION);
		await deleteCookie(COOKIES_CONST.THEME_CSS_SESSION_DATA);
		await removeLocalStorage(LOCALSTORAGE.THEME);

		let auth = '';
		try {
			if (req?.query?.t) {
				// handling for partner active hour
				const checkPartner = await getPartnerDetail(req?.query?.t);
				const params = objectToQueryString(req?.query);

				if (checkPartner?.data?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
					const payload = {
						from: '/sso-redirect',
						query: req?.query,
						data: checkPartner?.data?.data,
					};
					setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
					return Router.push('/partner-closed' + '?' + params);
				}
			}
			if (!checkIsEmpty(req?.query?.source)) {
				const getToken = await authToken(req?.query?.source.toUpperCase());
				if (getToken?.meta?.status !== 200) {
					return Router.push('/503');
				}
				auth = getToken?.data?.token;
			} else {
				return Router.push('/503');
			}

			const theme = await fetchCachedTheme(auth || global.tokenAuthorization);

			if (consulTime?.timeLeft > 0 && consulTime?.status == 'STARTED' && req?.query?.t) {
				// block user flag
				const res = await submitPartnerOrderConsultation({
					token: req?.query?.t,
					auth: auth,
					...(req?.query?.consultation_id_full
						? { consultation_id_full: req?.query?.consultation_id_full }
						: {}),
				});

				if (
					res?.data?.meta?.status &&
					res?.data?.meta?.message &&
					isBlockedUser(res?.data?.meta?.status, res?.data?.meta?.message)
				) {
					return Router.push('/blocked');
				}

				if (
					res?.data?.consultationUrl &&
					!(res?.data?.status && res?.data?.status === STATUS_CONSULTATION.FINDING)
				) {
					return window.location.replace(res?.data?.consultationUrl);
				} else {
					setPageProps({ res, auth, theme });
					return;
				}
			} else if (checkIsEmpty(req.query)) {
				return Router.push('/503');
			} else {
				setPageProps({ auth, theme });
				return;
			}
		} catch (error) {
			console.log('error on get cookies : ', error);
		}
	};

	useEffect(() => {
		// DK-86 : disable device on sso redirect
		// if (device && router?.isReady) {
		if (router?.isReady) {
			ssrDuplicate();
		}
	}, [router?.isReady]);

	return (
		<>
			{/* {router?.isReady ? (
				<ShieldClient
					onGetId={(id?: any) => {
						setDeviceId(id);
					}}
				/>
			) : null} */}
			{pageProps ? (
				<SSORedirect {...pageProps} />
			) : (
				<Wrapper header={false} footer={false}>
					<InfoPageTemplate
						title="Tunggu sebentar ya,"
						description="Telekonsultasimu sedang disiapkan."
					/>
				</Wrapper>
			)}
		</>
	);
};

export const getServerSideProps = async ({ req, res, query }) => {
	const consulTime = await checkCookieSession(req, res);

	return {
		props: {
			req: { query },
			consulTime,
		},
	};
};

export default SSORedirectPage;
