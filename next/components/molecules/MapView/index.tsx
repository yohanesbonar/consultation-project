import React, { useRef, useEffect } from 'react';
import { IconBackEnable, IconCurrentLocationCircle, IconMapPoint } from '@icons';
import { GoogleMap } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import { LOCALSTORAGE, PARAMS_CONST, SEAMLESS_CONST, getParsedLocalStorage } from 'helper';
import {
	fetchCurrentAddress,
	getUserCurrentLocation,
	setCurrentLatLong,
} from 'redux/actions/seamlessPrescriptionAction';
import Router from 'next/router';
import useBrowserNavigation from 'hooks/useBrowserNavigation';

interface MapView {
	token?: any;
	ct?: any;
	crt?: any;
	center: { lat: number; lng: number };
	backto?: any;
}

export default function MapView(props: MapView) {
	const dispatch = useDispatch();
	const mapRef = useRef(null);

	const { token, ct, crt, backto } = props;
	const { lat, lng, currLat, currLng } = useSelector(({ seamless }) => seamless?.latLng);

	const defaultPos = {
		lat: -6.175392,
		lng: 106.827153,
	};

	const mapOptions = {
		disableDefaultUI: true,
		clickableIcons: true,
		scrollwheel: true,
	};

	useBrowserNavigation(() => {
		handleBack();
	});

	const handleBack = () => {
		const isCheckoutInstantSuccess =
			Router?.query?.checkout_instant && Router?.query?.checkout_instant == '0';

		const fromPage = isCheckoutInstantSuccess
			? PARAMS_CONST.FINDING_PHARMACY
			: PARAMS_CONST.ADDRESS;

		let url = `/address?token=${token}`;
		if (ct) {
			url = `/address?ct=${ct}`;
			if (crt) {
				url += `&crt=${crt}`;
			}
			if (backto) {
				url += `&backto=${backto}`;
			}
		}
		const cartOrSummary = `${url}&id=${Router?.query?.id}&fromPage=${fromPage}`;
		if (Router?.query?.cart) {
			url = cartOrSummary + '&cart=1';
		} else if (Router?.query?.summary) {
			url = cartOrSummary + '&summary=1';
		} else if (Router.query?.from) {
			url = `/${Router.query?.from}?token=${token}&id=${Router?.query?.id}&fromPage=${fromPage}`;
		}

		if (Router?.query?.token_order) {
			url += '&token_order=' + Router?.query?.token_order;
		}
		if (isCheckoutInstantSuccess) {
			url += '&checkout_instant=' + Router?.query?.checkout_instant;
		}
		Router.replace(url);
	};

	const handleLoad = (map: any) => (mapRef.current = map);

	const handleSetCurrentLocation = async () => {
		dispatch(getUserCurrentLocation());
	};

	const handleCenterChanged = () => {
		if (!mapRef.current) return;
		const newPos = mapRef.current.getCenter().toJSON();
		dispatch(fetchCurrentAddress(newPos.lat, newPos.lng));
		dispatch(setCurrentLatLong({ lat: newPos.lat, lng: newPos.lng, currLat, currLng }));
	};

	const getAddress = async () => {
		const prevAddress = await getParsedLocalStorage(LOCALSTORAGE.ADDRESS);
		if (prevAddress && prevAddress !== SEAMLESS_CONST.ADDRESS_NOT_SET) {
			dispatch(
				setCurrentLatLong({
					lat: prevAddress.lat,
					lng: prevAddress.lng,
					currLat,
					currLng,
				}),
			);
			dispatch(fetchCurrentAddress(prevAddress.lat, prevAddress.lng));
		}
	};

	useEffect(() => {
		getAddress();
	}, []);

	useEffect(() => {
		if (lat !== 0 && lng !== 0) {
			dispatch(fetchCurrentAddress(lat, lng));
		} else {
			dispatch(fetchCurrentAddress(defaultPos.lat, defaultPos.lng));
		}
	}, [lat, lng]);

	return (
		<GoogleMap
			id="map"
			zoom={15}
			center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
			onLoad={handleLoad}
			options={mapOptions}
			mapTypeId={google.maps.MapTypeId.ROADMAP}
			mapContainerStyle={{ width: '100%', height: '100%' }}
			onZoomChanged={handleCenterChanged}
			onDragEnd={handleCenterChanged}
		>
			<div
				className={styles.iconMapPoint}
				style={{
					top: 'calc(50% - 16px)',
				}}
			>
				<IconMapPoint />
			</div>
			<div className={styles.btnAction}>
				<div onClick={handleBack}>
					<IconBackEnable />
				</div>
				<div className="tw-text-primary-def" onClick={handleSetCurrentLocation}>
					<IconCurrentLocationCircle />
				</div>
			</div>
		</GoogleMap>
	);
}
