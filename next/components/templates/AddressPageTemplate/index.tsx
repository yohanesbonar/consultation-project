import React, { useEffect, useState } from 'react';
import { PopupBottomsheetPostalCode, Wrapper } from '@organisms';
import { InputSearch } from '@molecules';
import {
	LOCALSTORAGE,
	MESSAGE_CONST,
	PARAMS_CONST,
	PLACEHOLDER_CONST,
	SEAMLESS_CONST,
	getLocalStorage,
	getParsedLocalStorage,
	handleSubmitAddress,
	setLocalStorage,
	showToast,
} from 'helper';
import { IconCurrentLocationRed, IconMapEmpty, IconMapGray, IconMapMarker } from '@icons';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchAddress,
	fetchCurrentAddress,
	getUserCurrentLocation,
	setCurrentAddressAction,
	setCurrentLatLong,
	setLocationPermission,
} from 'redux/actions/seamlessPrescriptionAction';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { Text } from '@atoms';
import { LoadScript } from '@react-google-maps/api';
import { getAddressComponent } from 'helper/Network/seamless';
import styles from './index.module.css';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import useBrowserNavigation from 'hooks/useBrowserNavigation';

type Props = {
	token?: any;
	ct?: any;
	crt?: any;
	from?: any;
	backto?: any;
};

const AddressPageTemplate = (props: Props) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const { token, ct, crt, from, backto } = props;
	const { lat, lng, currLat, currLng } = useSelector(({ seamless }) => seamless?.latLng);

	const [keyword, setKeyword] = React.useState('');
	const [isPostalCodeBottomsheetOpen, setIsPostalCodeBottomsheetOpen] = useState(false);
	const [dataTemp, setDatTemp] = useState(null);

	const store = useSelector((state: any) => state.seamless);
	const loading = store.adressList.loading;
	const adressList = store.adressList;
	const currentAddress = store.currentAddress;
	const isPermissionLocation = store.isPermissionLocation;

	useBrowserNavigation(() => {
		onClickBackHeader();
	});

	const onClickBackHeader = async () => {
		let url = `/order?token=${token}&fromPage=address`;
		if (ct) {
			url = `/order?ct=${ct}&fromPage=address`;
			if (crt) {
				url += `&crt=${crt}`;
			}
			if (backto) {
				url += `&backto=${backto}`;
			}
		}
		const notFromFinding = router.query?.fromPage !== PARAMS_CONST.FINDING_PHARMACY;
		const isCheckoutInstantSuccess =
			router?.query?.checkout_instant && router?.query?.checkout_instant == '0';

		if (router?.query?.cart && notFromFinding && !isCheckoutInstantSuccess) {
			url = `/transaction/cart?token=${token}&id=${router?.query?.id}&fromPage=${PARAMS_CONST.ADDRESS}`;
		} else if (router?.query?.summary && notFromFinding && !isCheckoutInstantSuccess) {
			url = `/transaction/summary?token=${token}&id=${router?.query?.id}&fromPage=${PARAMS_CONST.ADDRESS}`;
		} else if (router.query?.from || router.query?.fromPage || isCheckoutInstantSuccess) {
			const _from = router.query?.from || router.query?.fromPage;
			const _url = `${_from === PARAMS_CONST.FINDING_PHARMACY ? 'address/' : ''}${_from}`;
			url = `/${_url}?token=${router.query?.token}&id=${router?.query?.id}&fromPage=${router.query?.fromPage}`;
		}
		if (router?.query?.token_order) {
			url += '&token_order=' + router?.query?.token_order;
		}
		if (router?.query?.fromPresc) {
			url += '&fromPresc=' + router?.query?.fromPresc;
		}
		if (router?.query?.cart) {
			url += '&cart=' + router?.query?.cart;
		}

		if (isCheckoutInstantSuccess) {
			url += '&checkout_instant=' + router?.query?.checkout_instant;
		}

		const address = await getLocalStorage(LOCALSTORAGE.ADDRESS);
		if (!address) {
			setLocalStorage(LOCALSTORAGE.ADDRESS, SEAMLESS_CONST.ADDRESS_NOT_SET);
		}
		Router.replace(url);
	};

	const onSubmitAddress = (address: any, lat: number, lng: number, postalCode?: any) => {
		if (currentAddress.loading) return;
		if (!postalCode && (router?.query?.cart || router?.query?.summary)) {
			setDatTemp({
				address,
				lat,
				lng,
			});
			setIsPostalCodeBottomsheetOpen(true);
		} else {
			handleSubmitAddress(
				{
					address,
					lat,
					lng,
					postalCode,
					orderNumber: router.query?.id,
				},
				token,
				ct,
				crt,
				'address',
				backto,
				router.query?.id,
				router.query?.token_order,
			);
		}
	};

	const onClickToChooseMaps = () => {
		let url = `/address/maps?token=${token}`;
		if (ct) {
			url = `/address/maps?ct=${ct}`;
			if (crt) {
				url += `&crt=${crt}`;
			}
			if (backto) {
				url += `&backto=${backto}`;
			}
		}

		const cartOrSummary = `/address/maps?token=${token}&id=${router?.query?.id}&fromPage=${PARAMS_CONST.ADDRESS}`;
		if (router?.query?.cart) {
			url = cartOrSummary + '&cart=1';
		} else if (router?.query?.summary) {
			url = cartOrSummary + '&summary=1';
		}
		if (router?.query?.token_order) {
			url += '&token_order=' + router?.query?.token_order;
		}
		if (router?.query?.fromPresc) {
			url += '&fromPresc=' + router?.query?.fromPresc;
		}

		if (from) {
			url += `&from=${from}`;
		}

		if (router?.query?.checkout_instant && router?.query?.checkout_instant == '0') {
			url += '&checkout_instant=' + router?.query?.checkout_instant;
		}

		Router.replace(url);
	};

	const onClickCurrentLocation = () => {
		const isPermission =
			isPermissionLocation === SEAMLESS_CONST.LOCATION_DENIED || isPermissionLocation === '';

		if (isPermission || !currentAddress?.data) {
			dispatch(getUserCurrentLocation(true));
		} else {
			onSubmitAddress(currentAddress.data, lat, lng, currentAddress?.postalCode);
		}
	};

	const getAddress = async () => {
		const tempAddress = await getParsedLocalStorage(LOCALSTORAGE.TEMP_ADDRESS);
		const prevAddress = tempAddress || (await getParsedLocalStorage(LOCALSTORAGE.ADDRESS));
		if (prevAddress && prevAddress !== SEAMLESS_CONST.ADDRESS_NOT_SET) {
			if (prevAddress?.name) setKeyword(prevAddress?.name);
			dispatch(
				setCurrentLatLong({ lat: prevAddress.lat, lng: prevAddress.lng, currLat, currLng }),
			);
			dispatch(fetchCurrentAddress(prevAddress.lat, prevAddress.lng));
			dispatch(setLocationPermission(SEAMLESS_CONST.LOCATION_ALLOWED));
		}
	};

	useEffect(() => {
		getAddress();
	}, []);

	useEffect(() => {
		dispatch(fetchAddress(keyword, null, 'country:id', 'id'));
	}, [keyword]);

	useEffect(() => {
		dispatch(fetchCurrentAddress(lat, lng));
	}, [lat, lng]);

	// Split render content
	const renderChooseMap = () => {
		return (
			<div onClick={onClickToChooseMaps} className={styles.chooseMapContainer}>
				<div className="tw-pr-1">
					<IconMapGray />
				</div>
				<p className={styles.labelChooseMap}>Pilih Lewat Peta</p>
			</div>
		);
	};

	const renderCurrentLocation = () => {
		return (
			<div onClick={onClickCurrentLocation} className={styles.currentLocationContainer}>
				<div className="tw-pr-1 tw-text-primary-def">
					<IconCurrentLocationRed />
				</div>
				<div>
					<Text
						skeletonClass="tw-w-24"
						isLoading={currentAddress.loading && !currentAddress.data}
						textClass={styles.labelSetCurrentLocation}
					>
						Gunakan alamat saat ini
					</Text>
					<Text
						skeletonClass="tw-w-36"
						isLoading={currentAddress.loading && !currentAddress.data}
						textClass={styles.labelCurrentLocation}
					>
						{isPermissionLocation === SEAMLESS_CONST.LOCATION_ALLOWED &&
						currentAddress.data?.length
							? currentAddress.data
							: SEAMLESS_CONST.CLICK_TO_GET_LOCATION}
					</Text>
				</div>
			</div>
		);
	};

	const renderEmptyState = () => {
		return (
			<div className={styles.emptyContainer}>
				<div>
					<IconMapEmpty />
				</div>
				<div className="tw-ml-3">
					<p className={styles.emptyTitle}>Lokasi Tidak Ditemukan</p>
					<p className={styles.emptySub}>
						Mohon cek penulisan Anda atau silakan pilih lewat peta
					</p>
				</div>
			</div>
		);
	};

	const renderLoadingState = () => {
		return (
			<div className="tw-flex tw-my-2">
				<div>
					<Skeleton className="tw-w-7 tw-h-7" />
				</div>
				<div className="tw-ml-3">
					<Skeleton className="tw-w-[220px] tw-h-7" />
					<Skeleton className="tw-w-[300px] tw-h-7" />
				</div>
			</div>
		);
	};

	const renderListAddress = (item: any) => (
		<div
			onClick={() => {
				const geocoder = new google.maps.Geocoder();
				const full_address = `${item?.structured_formatting?.main_text}, ${item?.structured_formatting?.secondary_text}`;
				geocoder.geocode(
					{
						placeId: item?.place_id,
					},
					function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							const postalCode = getAddressComponent(SEAMLESS_CONST.POSTAL_CODE, results[0]);
							const latitude = results[0].geometry.location.lat();
							const longitude = results[0].geometry.location.lng();
							onSubmitAddress(full_address, latitude, longitude, postalCode);
						} else {
							showToast(MESSAGE_CONST.SOMETHING_WENT_WRONG);
						}
					},
				);
			}}
			className={styles.addressListContainer}
			key={item?.place_id}
		>
			<div className="tw-w-6">
				<IconMapMarker />
			</div>
			<div className="tw-ml-[12px] tw-w-[90%]">
				<p className={cx(styles.addressTitle, 'one-line-elipsis')}>
					{item?.structured_formatting?.main_text}
				</p>
				<p className={cx(styles.addressSub, 'two-line-elipsis')}>
					{item?.structured_formatting?.secondary_text}
				</p>
			</div>
		</div>
	);

	const handleOnChangePostalCode = (res: any) => {
		if (res && res?.code) {
			handleSubmitAddress(
				{
					address: dataTemp?.address,
					lat: dataTemp?.lat,
					lng: dataTemp?.lng,
					postalCode: res?.code,
					orderNumber: router.query?.id,
				},
				token,
				ct,
				crt,
				'address',
				backto,
				router.query?.id,
				router.query?.token_order,
			);
		}
		setIsPostalCodeBottomsheetOpen(false);
	};

	const clearAddress = () => {
		setKeyword('');
		dispatch(
			setCurrentAddressAction({
				postalCode: false,
				result: false,
				original: false,
				loading: false,
				error: false,
			}),
		);
	};

	return (
		<Wrapper
			title="Alamat Pasien"
			metaTitle="Alamat Pasien"
			onClickBack={onClickBackHeader}
			additionalClassNameContent="tw-p-[18px]"
		>
			<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
				<label className="title-16-medium">
					{router?.query?.cart || router?.query?.summary
						? SEAMLESS_CONST.ADDRESS_TOP_TITLE_CHECKOUT
						: SEAMLESS_CONST.ADDRESS_TOP_TITLE}
				</label>
				<p className="body-12-regular tw-mt-1 tw-mb-2">
					{router?.query?.cart || router?.query?.summary
						? SEAMLESS_CONST.ADDRESS_TOP_SUBTITLE_CHECKOUT
						: SEAMLESS_CONST.ADDRESS_TOP_SUBTITLE}
				</p>
				<InputSearch
					value={keyword}
					placeholder={PLACEHOLDER_CONST.SEARCH_LOCATION}
					onClear={clearAddress}
					onChange={(e) => setKeyword(e.target.value)}
					isShowMessage={keyword.length && keyword.length < 3 ? true : false}
					message={SEAMLESS_CONST.MESSAGE_BOTTOM_INPUT_SEARCH}
				/>
				{adressList?.loading && renderLoadingState()}

				{adressList?.data &&
					adressList.data?.length > 0 &&
					adressList?.data.map((item: any) => renderListAddress(item))}

				{adressList?.data?.length === 0 && renderChooseMap()}

				{adressList?.data?.length === 0 && keyword.length === 0 && renderCurrentLocation()}

				{!loading &&
					adressList?.data?.length === 0 &&
					keyword.length !== 0 &&
					!currentAddress?.data &&
					renderEmptyState()}
			</LoadScript>
			<PopupBottomsheetPostalCode
				isOpen={isPostalCodeBottomsheetOpen}
				callback={handleOnChangePostalCode}
			/>
		</Wrapper>
	);
};

export default AddressPageTemplate;
