// TODO: fix these lints
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/prop-types */
import { isBlockedUser } from 'helper/Network/requestHelper';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import {
	checkCookieSession,
	checkIsEmpty,
	decryptData,
	fetchCachedTheme,
	getPartnerDetail,
	getTransactionDetail,
	LOCALSTORAGE,
	navigateWithQueryParams,
	objectToQueryString,
	PAGE_ID,
	setStorageEncrypt,
	ShieldClient,
	STATUS_CONST,
} from '../../helper';
import { submitSelfOrderConsultation } from '../../helper/Network/consultation';
import Onboarding from './onboarding';
import { Wrapper } from '@organisms';
import InfoPageTemplate from 'components/templates/InfoPageTemplate';
import { getShieldStateFromStorage, SHIELD_ERROR_ID } from 'helper/Shield';

const OnboardingPage = (props) => {
	const router = useRouter();
	const { req, consulTime } = props;
	const [pageProps, setPageProps] = useState(undefined);

	// Get device ID from Redux state

	const ssrDuplicate = async () => {
		const shield = await getShieldStateFromStorage();
		const device = shield?.result ?? SHIELD_ERROR_ID;
		const action = req.query.action && (await decryptData(req.query.action));

		const { token, transaction_xid } = req.query;
		let detailTransaction = {
			data: {
				patient: {
					email: '',
				},
			},
		};
		if (token && transaction_xid) {
			detailTransaction = await getTransactionDetail({
				id: transaction_xid,
				token: token,
				noAuth: true,
			});
		}

		if (token) {
			const theme = await fetchCachedTheme(token);
			// handling for partner active hour
			const checkPartner = await getPartnerDetail(token, null, true);
			const params = objectToQueryString(req?.query);

			if (checkPartner?.data?.data?.status == STATUS_CONST.OUT_OFF_SCHEDULE) {
				const payload = {
					from: '/onboarding',
					query: req?.query,
					data: checkPartner?.data?.data,
				};
				setStorageEncrypt(LOCALSTORAGE.PARTNER_CLOSED, payload);
				return Router.push(`/partner-closed?from=${PAGE_ID.OUT_SCHEDULE}&` + params);
			}

			// block user flag
			const res = await submitSelfOrderConsultation(
				device
					? {
							email: detailTransaction?.data?.patient?.email,
							device,
					  }
					: null,
				token,
			);
			if (
				res?.data?.meta?.status &&
				res?.data?.meta?.message &&
				isBlockedUser(res?.data?.meta?.status, res?.data?.meta?.message)
			) {
				return Router.push('/blocked');
			}

			if (
				(res?.meta?.acknowledge != null && !res?.meta?.acknowledge) ||
				(res?.data?.meta?.acknowledge != null && !res?.data?.meta?.acknowledge)
			) {
				if (!checkIsEmpty(res?.data?.token || res?.data?.data?.token)) {
					return Router.push(
						'/prescription-detail?token=' + (res?.data?.token || res?.data?.data?.token),
					);
				} else {
					return Router.push(
						'/transaction/error?token=' + token + '&transaction_xid=' + transaction_xid,
					);
				}
			} else {
				if (res?.data?.consultationUrl) {
					return Router.push(res?.data?.consultationUrl);
				}
			}

			setPageProps({
				initialData: {
					waitingData: res?.data,
					token: token,
					params: { email: detailTransaction?.data?.patient?.email },
				},
				detailTransaction: detailTransaction?.data,
				theme: theme,
			});
			return;
		}

		if (
			consulTime?.timeLeft > 0 &&
			consulTime?.status != null &&
			consulTime?.status == 'STARTED'
		) {
			navigateWithQueryParams('/chat-detail', {}, 'href');
		} else if (action != 'orderConsul') {
			navigateWithQueryParams('/404', {}, 'href');
		}

		setPageProps({});
		return;
	};

	useEffect(() => {
		if (router?.isReady) {
			setTimeout(() => {
				ssrDuplicate();
			}, 2000); // 2s is timeout for shield
		}
	}, [router?.isReady]);

	return (
		<>
			{router?.isReady ? <ShieldClient enabled={true} /> : null}

			{pageProps ? (
				<Onboarding {...pageProps} />
			) : (
				<Wrapper header={false} footer={false}>
					<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
						<InfoPageTemplate hideDkonsulLogo isSpinner title="" description="" />
					</div>
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
			consulTime: consulTime ?? {},
		},
	};
};

export default OnboardingPage;
