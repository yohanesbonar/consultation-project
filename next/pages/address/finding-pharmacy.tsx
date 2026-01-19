import React, { useEffect, useState } from 'react';
import { FindNearbyPharmacyTemplate } from '@templates';
import {
	LOCALSTORAGE,
	PARAMS_CONST,
	checkoutCart,
	removeLocalStorage,
	setStringifyLocalStorage,
	TOAST_MESSAGE,
	setLocalStorage,
	getPrescData,
	getConvertedProductToUpdate,
	getParsedLocalStorage,
	addLog,
	redirectApplyPresc,
	fetchCachedTheme,
} from 'helper';
import Router, { useRouter } from 'next/router';
import { PartnerTheme, PrescriptionDetailData } from '@types';
import { useSelector } from 'react-redux';
import useToastFromLocalStorage from 'hooks/useToastFromLocalStorage';
import usePartnerInfo from 'hooks/usePartnerInfo';

const FindingPharmacy = () => {
	const router = useRouter();
	const [isFinding, setIsFinding] = useState(true);
	const general = useSelector(({ general }) => general);

	const [themeData, setThemeData] = useState<PartnerTheme>();
	const [partnerToken, setPartnerToken] = useState('');

	usePartnerInfo({ theme: themeData, token: partnerToken });

	useToastFromLocalStorage(LOCALSTORAGE.CONSULTATION_ENDED_PRESC);

	useEffect(() => {
		sync();
	}, []);

	const sync = async () => {
		try {
			let address: any = await getParsedLocalStorage(LOCALSTORAGE.TEMP_ADDRESS);
			address = address || (await getParsedLocalStorage(LOCALSTORAGE.ADDRESS));
			setIsFinding(true);
			const resPresc = await getPrescData(
				router?.query?.token as string,
				router?.query?.id as string,
			);
			if (resPresc?.meta?.acknowledge) {
				const responseTheme = await fetchCachedTheme(resPresc?.data?.order_token);
				setPartnerToken(resPresc?.data?.order_token);
				setThemeData(responseTheme?.data);
			}
			redirectApplyPresc(resPresc?.data, {
				contactUrl: general?.contactUrl,
				orderNumber: Router?.query?.id as string,
				isSameAddressAndCartHandling: true,
				isReplacePage: true,
				handleSeamlessCart: async () => {
					let productToUpdate;

					const rescPrescData: PrescriptionDetailData = resPresc?.data;
					let bodyReq: any = {};
					if (resPresc?.meta?.acknowledge) {
						productToUpdate = getConvertedProductToUpdate(
							rescPrescData?.prescriptions,
							rescPrescData?.updatedPrescriptions,
						);
						const patientData = rescPrescData?.patient_data;
						if (patientData) {
							bodyReq = {
								prescription_id: rescPrescData?.id,
								address: address?.name ?? patientData?.patient_address,
								detail_address:
									address?.detail_address ?? patientData?.patient_detail_address,
								phone_number: patientData?.patient_phonenumber,
								postal_code: address?.postalCode ?? patientData?.patient_postal_code,
								latitude: address?.lat ?? patientData?.patient_latitude,
								longitude: address?.lng ?? patientData?.patient_longitude,
							};

							// make sure the address is 205 characters and detail address is 50 characters follow the GOA requirement
							if (bodyReq?.address) {
								bodyReq.address = String(bodyReq?.address).substring(0, 205).trim();
							}
							if (bodyReq?.detail_address) {
								bodyReq.detail_address = String(bodyReq?.detail_address)
									.substring(0, 50)
									.trim();
							}
						}
					} else {
						throw 'cannot get user info data';
					}

					const partnerToken = Router?.query?.token_order ?? rescPrescData?.order_token;
					let res: any;
					if (productToUpdate?.meta?.acknowledge) {
						res = await checkoutCart({
							data: { ...bodyReq, products: productToUpdate?.data },
							token: partnerToken,
						});
					} else {
						throw productToUpdate?.meta?.message;
					}

					if (res?.meta?.acknowledge) {
						if (res?.data?.is_merchant_changed) {
							setLocalStorage(LOCALSTORAGE.CART_TOAST, TOAST_MESSAGE.MERCHENT_AJUSTED);
						}
						setStringifyLocalStorage(LOCALSTORAGE.ADDRESS, {
							name: address?.name ?? rescPrescData?.patient_data?.patient_address,
							detail_address:
								address?.detail_address ??
								rescPrescData?.patient_data?.patient_detail_address,
							lat: address?.lat ?? rescPrescData?.patient_data?.patient_latitude,
							lng: address?.lng ?? rescPrescData?.patient_data?.patient_longitude,
							postalCode:
								address?.postalCode ?? rescPrescData?.patient_data?.patient_postal_code,
						});
						removeLocalStorage(LOCALSTORAGE.TEMP_ADDRESS);
						removeLocalStorage(LOCALSTORAGE.SHIPMENT);

						let url = `/${
							router?.query?.cart || router?.query?.summary || !router.query?.from
								? 'transaction/cart'
								: router.query?.from
						}?token=${router?.query?.token}&id=${router?.query?.id}&fromPage=${
							PARAMS_CONST.ADDRESS
						}`;
						if (Router?.query?.token_order) {
							url += '&token_order=' + Router?.query?.token_order;
						}
						if (Router?.query?.fromPresc) {
							url += '&fromPresc=' + Router?.query?.fromPresc;
						}
						window.location.replace(url);
					} else {
						setTimeout(() => {
							setIsFinding(false);
						}, 3000);
					}
				},
			});
		} catch (error) {
			console.log('error on checkout', error);
			setTimeout(() => {
				setIsFinding(false);
			}, 3000);
			addLog({ err_finding_pharmacy: error, q: router?.query });
		}
	};

	return <FindNearbyPharmacyTemplate finding={isFinding} resubmit={sync} />;
};

export default FindingPharmacy;
