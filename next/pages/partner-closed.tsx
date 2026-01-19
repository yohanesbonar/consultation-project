import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@organisms';
import { ImgPartnerClosed } from '@images';
import {
	LOCALSTORAGE,
	PAGE_ID,
	PAYMENT_STATUS,
	STATUS_CONST,
	getParsedLocalStorage,
	checkIsEmpty,
	encryptData,
	getPartnerDetail,
	getStorageParseDecrypt,
	navigateWithQueryParams,
	removeLocalStorage,
	requestTransaction,
	submitSelfOrderConsultation,
	fetchCachedTheme,
} from 'helper';
import { useRouter } from 'next/router';
import { PartnerClosedTemplate } from '@templates';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { PartnerTheme } from '@types';

const PartnerClosed = () => {
	const router = useRouter();
	const [partnerDetail, setPartnerDetail] = useState<any>({});
	const [isExpand, setIsExpand] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [from, setFrom] = useState('');
	// const [query, setQuery] = useState({});
	const isRefreshingRef = useRef(false);
	const isFromFinding = router.query?.from === 'finding';

	const handleToggle = () => {
		setIsExpand(!isExpand);
	};

	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');

	usePartnerInfo({ theme: themeData, token: partnerToken });

	const fetchTheme = async () => {
		const orders = await getParsedLocalStorage(LOCALSTORAGE.INITIAL_FORM);

		const responseTheme = await fetchCachedTheme(router?.query?.token || orders?.partnerToken);
		setPartnerToken(router?.query?.token || orders?.partnerToken);
		setThemeData(responseTheme?.data);
	};

	useEffect(() => {
		fetchTheme();
	}, []);

	useEffect(() => {
		if (partnerDetail?.back_url) {
			setTimeout(() => {
				localStorage.setItem(LOCALSTORAGE.BACK_URL, partnerDetail?.back_url);
			}, 500);
		}
	}, [partnerDetail?.back_url]);

	const handleClickBtn = (fromParam: string, queryParam: any) => {
		if (partnerDetail?.action === 'BACK_URL') {
			window.location.href = partnerDetail?.back_url;
			removeLocalStorage(LOCALSTORAGE.PARTNER_CLOSED);
		} else {
			navigateWithQueryParams(fromParam, queryParam, 'href');
			removeLocalStorage(LOCALSTORAGE.PARTNER_CLOSED);
		}
	};

	const getPartner = async () => {
		try {
			setIsLoading(true);
			const data = await getStorageParseDecrypt(LOCALSTORAGE.PARTNER_CLOSED);
			let res = await getPartnerDetail(router.query?.token, isFromFinding ? 'PARTNER' : 'PIVOT');

			if (
				res?.meta?.acknowledge &&
				router?.query?.from != PAGE_ID.OUT_SCHEDULE &&
				router?.query?.from != 'finding'
			) {
				if (data) {
					handleClickBtn(data?.from, data?.query);
				} else {
					window.location.href = `/order?token=${router.query?.token}`;
					removeLocalStorage(LOCALSTORAGE.PARTNER_CLOSED);
					return;
				}
			}

			if (
				(res?.data?.data?.status != STATUS_CONST.OUT_OFF_SCHEDULE &&
					router?.query?.from == PAGE_ID.OUT_SCHEDULE) ||
				(res?.data?.data?.status != STATUS_CONST.OUT_OFF_SCHEDULE &&
					router?.query?.from == 'finding')
			) {
				const dataTemp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
				// TODO : add condition if order by partner (assist) ---> router.query.ct
				if (data?.from == '/order' && res?.data?.paymentType == PAYMENT_STATUS.PAID) {
					requestTransaction({
						router,
						body: dataTemp?.params,
						token: router?.query?.token as string,
						props: null,
						partnerDetail: res?.data,
						isFreePaid: false,
						successCallback: () => {
							removeLocalStorage(LOCALSTORAGE.PARTNER_CLOSED);
						},
						stillClosedCallback: () => {
							console.log('still closed');
						},
					});
				} else {
					res = await submitSelfOrderConsultation(
						isFromFinding
							? data?.data?.body
							: !checkIsEmpty(dataTemp?.params)
							? dataTemp?.params
							: {},
						router?.query?.token as string,
						isFromFinding ? (router?.query?.token as string) : null,
					);
					if (res?.meta?.acknowledge) {
						const action = encodeURIComponent(await encryptData('orderConsul'));
						const url = isFromFinding
							? `/finding?token=${router?.query?.token}`
							: !checkIsEmpty(dataTemp?.params)
							? `/onboarding?action=${action}`
							: `/onboarding?token=${router.query?.token}`;
						navigateWithQueryParams(url, {}, 'href');

						removeLocalStorage(LOCALSTORAGE.PARTNER_CLOSED);
						return;
					}
				}
			}

			const _partner =
				router?.query?.from == PAGE_ID.OUT_SCHEDULE
					? { ...data?.data }
					: { ...res?.data?.data };
			const initDays = _partner?.schedules[0]?.days;
			const initHourTo = _partner?.schedules[0]?.hour_to;
			const initHourFrom = _partner?.schedules[0]?.hour_from;
			const _schedule = [];
			let isDiff = false;

			_partner?.schedules?.forEach((v: any) => {
				if (initDays?.length != 7 || v?.hour_from != initHourFrom || v?.hour_to != initHourTo)
					isDiff = true;
				_schedule.push(v);
			});

			_partner.schedules = isDiff
				? _schedule
				: [{ days: ['Setiap hari'], hour_from: initHourFrom, hour_to: initHourTo }];

			setPartnerDetail(_partner);
			// setFrom(data?.from);
			// setQuery(data?.query);
		} catch (error) {
			console.log('error on get partner : ', error);
		} finally {
			setIsLoading(false);
			isRefreshingRef.current = false;
		}
	};

	useEffect(() => {
		getPartner();
	}, [router.isReady]);

	const scheduleMapped =
		!isExpand && partnerDetail?.schedules?.length >= 3
			? partnerDetail?.schedules?.slice(0, 3)
			: partnerDetail?.schedules;

	const onRefresh = () => {
		try {
			if (!isRefreshingRef.current) {
				getPartner();
			}
			isRefreshingRef.current = true;
		} catch (error) {
			console.log('error on  : ', error);
		}
	};

	return (
		<Wrapper
			title=""
			additionalStyleContent={{
				height: '100vh',
			}}
			additionalClassNameContent="!tw-relative tw-pb-22"
			header={false}
			isHandleOnScroll
			onScroll={onRefresh}
			footer
			// #note: disable for temporary
			// footerComponent={
			// 	<div className="tw-w-full tw-p-4">
			// 		<ButtonHighlight
			// 			text={
			// 				partnerDetail?.partner_name
			// 					? upperCase(`KEMBALI KE ${partnerDetail?.partner_name}`)
			// 					: '-'
			// 			}
			// 			onClick={() => handleClickBtn(from, query)}
			// 			className="tw-h-[48px] tw-uppercase"
			// 		/>
			// 	</div>
			// }
		>
			<PartnerClosedTemplate
				ImgPartnerClosed={ImgPartnerClosed}
				handleToggle={handleToggle}
				isExpand={isExpand}
				partnerDetail={partnerDetail}
				scheduleMapped={scheduleMapped}
				theme={themeData}
			/>
		</Wrapper>
	);
};

export default PartnerClosed;
