import React, { useState } from 'react';
import { PopupBottomsheetPostalCode, Wrapper } from '@organisms';
import { IconMapMarker } from '@icons';
import { ButtonHighlight, Text } from '@atoms';
import { BUTTON_ID, PARAMS_CONST, SEAMLESS_CONST, handleSubmitAddress } from 'helper';
import { MapView } from 'components/molecules';
import { LoadScript } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import styles from './index.module.css';
import cx from 'classnames';
import { getAddressComponent } from 'helper/Network/seamless';
import useBrowserNavigation from 'hooks/useBrowserNavigation';

type Props = {
	token?: any;
	ct?: any;
	crt?: any;
	backto?: any;
};

const AddressMapPageTemplate = (props: Props) => {
	const { token, ct, crt, backto } = props;

	const store = useSelector((state: any) => state.seamless);
	const currentAddress = store.currentAddress;
	const mainText = currentAddress?.original?.city || '';
	const secondaryText = currentAddress?.data;
	const loading = currentAddress?.loading;
	const [isPostalCodeBottomsheetOpen, setIsPostalCodeBottomsheetOpen] = useState(false);
	const [dataTemp, setDataTemp] = useState(null);

	useBrowserNavigation(() => {
		onClickBackHeader();
	});

	const onClickBackHeader = () => {
		const isCheckoutInstantSuccess =
			Router?.query?.checkout_instant && Router?.query?.checkout_instant == '0';

		const fromPage = isCheckoutInstantSuccess
			? PARAMS_CONST.FINDING_PHARMACY
			: PARAMS_CONST.ADDRESS;

		let url = `/address?token=${token}&fromPage=${fromPage}`;
		if (ct) {
			url = `/address?ct=${ct}&fromPage=${fromPage}`;
			if (crt) {
				url += `&crt=${crt}`;
			}
			if (backto) {
				url += `&backto=${backto}`;
			}
		}

		const cartOrSummary = `${url}&id=${Router?.query?.id}`;

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
		if (Router?.query?.fromPresc) {
			url += '&fromPresc=' + Router?.query?.fromPresc;
		}

		if (isCheckoutInstantSuccess) {
			url += '&checkout_instant=' + Router?.query?.checkout_instant;
		}

		Router.replace(url);
	};

	const onSubmitAddress = (address: any, placeId?: any) => {
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode(
			{
				...(placeId
					? {
							placeId: placeId,
					  }
					: {
							address: address,
					  }),
			},
			function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					const postalCode = getAddressComponent(SEAMLESS_CONST.POSTAL_CODE, results[0]);
					const latitude = results[0].geometry.location.lat();
					const longitude = results[0].geometry.location.lng();
					const payload = {
						address,
						lat: latitude?.toString(),
						lng: longitude?.toString(),
						postalCode,
						orderNumber: Router.query?.id,
					};

					if (!postalCode && (Router?.query?.cart || Router?.query?.summary)) {
						setDataTemp(payload);
						setIsPostalCodeBottomsheetOpen(true);
					} else {
						handleSubmitAddress(
							payload,
							token,
							ct,
							crt,
							'maps',
							backto,
							Router.query?.id,
							Router.query?.token_order,
						);
					}
				}
			},
		);
	};

	const handleOnChangePostalCode = (res: any) => {
		if (res && res?.code) {
			handleSubmitAddress(
				{
					address: dataTemp?.address,
					lat: dataTemp?.lat,
					lng: dataTemp?.lng,
					postalCode: res?.code,
					orderNumber: Router.query?.id,
				},
				token,
				ct,
				crt,
				'maps',
				backto,
				Router.query?.id,
				Router.query?.token_order,
			);
		}
		setIsPostalCodeBottomsheetOpen(false);
	};

	const renderConfirmAddress = () => (
		<div className={styles.confirmAddressContainer}>
			<label className="title-18-medium">Konfirmasi Lokasi</label>

			<div className={styles.addressListContainer}>
				<div className="tw-w-6">
					<IconMapMarker />
				</div>
				<div className="tw-pl-[12px] tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
					<Text
						isLoading={loading}
						skeletonClass="tw-w-32"
						textClass={cx(styles.addressTitle, 'one-line-elipsis')}
					>
						{mainText}
					</Text>
					<Text
						isLoading={loading}
						skeletonClass="tw-w-44 tw-mt-1"
						textClass={cx(styles.addressSub, 'two-line-elipsis')}
					>
						{secondaryText}
					</Text>
				</div>
			</div>

			<ButtonHighlight
				onClick={() => onSubmitAddress(currentAddress?.data, currentAddress?.placeId)}
				id={BUTTON_ID.BUTTON_CONFIRM_MAPS_ADDRESS}
				text="KONFIRMASI"
			/>
		</div>
	);

	return (
		<Wrapper
			header={false}
			metaTitle="Maps"
			onClickBack={onClickBackHeader}
			additionalClassNameContent="tw-relative tw-bg-slate-200"
			additionalStyleContent={{ overflowY: 'hidden' }}
			footerComponent={renderConfirmAddress()}
			footer
		>
			<div className="tw-flex tw-flex-col tw-h-full">
				<div className="tw-flex-1 tw-w-full">
					<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
						<MapView
							token={token}
							ct={ct}
							crt={crt}
							center={{ lat: -6.176132, lng: 106.822864 }}
							backto={backto}
						/>
					</LoadScript>
				</div>
			</div>
			<PopupBottomsheetPostalCode
				isOpen={isPostalCodeBottomsheetOpen}
				callback={handleOnChangePostalCode}
			/>
		</Wrapper>
	);
};

export default AddressMapPageTemplate;
