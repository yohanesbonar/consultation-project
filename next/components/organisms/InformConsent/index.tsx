'use client';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import { ButtonHighlight, Header } from '../..';
import {
	BUTTON_ID,
	CONSENT_CONST,
	getMasterTncPartner,
	getMasterTnc,
	LOCALSTORAGE,
	getStorageDecrypt,
	BUTTON_CONST,
	TNC_CONST,
	PARTNER_CONST,
} from '../../../helper';
import { IconDkonsul40, LottieScrollHandGesture } from '../../../assets/index.js';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import InputCheckbox from 'components/atoms/InputCheckbox';

type Props = {
	show?: boolean;
	toggle?: () => void;
	submit?: (additionalParams?: any) => void;
	informConsentDetail?: string;
	logoUrl?: string;
	isNonPaid?: boolean;
	partnerDetail?: any;
	isDisableSubmit?: boolean;
	isLoading?: boolean;
	onOpenTnc?: (type: string) => void;
	isOrderByPartner?: boolean;
};

const InformConsent = ({
	show,
	toggle,
	submit,
	informConsentDetail,
	logoUrl,
	isNonPaid,
	partnerDetail,
	isDisableSubmit = false,
	isLoading = false,
	onOpenTnc,
	isOrderByPartner = false,
}: Props) => {
	const [informDetail, setInformDetail] = useState('');
	const [playLottie, setPlayLottie] = useState(false);
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const [loading, setLoading] = useState(true);
	const [informConsentCheck, setInformConsentCheck] = useState({
		agree: true,
		promotional: true,
	});

	useEffect(() => {
		if (partnerDetail) {
			getInformConsent();
			return () => {
				setInformDetail('');
			};
		}
	}, [partnerDetail]);

	useEffect(() => {
		if (show) {
			setTimeout(() => {
				const box = document.querySelector('#footerButtonConsent');
				if (!isInViewport(box)) {
					toggleLottie();
				}
			}, 1000);
		}
	}, [show]);

	const getInformConsent = async () => {
		setLoading(true);
		const xidFromLocal = await getStorageDecrypt(LOCALSTORAGE.XID);
		let result;
		if (!informConsentDetail) {
			const tempXid = xidFromLocal || partnerDetail?.partnerXid;
			result = tempXid ? await getMasterTncPartner(tempXid) : await getMasterTnc();
			setInformDetail(result?.data?.informedConsent);
		} else {
			result = informConsentDetail;
			setInformDetail(informConsentDetail);
		}
		setLoading(false);
		return result;
	};

	const openTnC = (type: string) => {
		if (onOpenTnc) {
			onOpenTnc(type);
		}
	};

	const renderFooterButton = () => {
		return (
			<div id="footerButtonConsent" className="tw-p-4 box-shadow-m">
				<div className="tw-flex tw-items-center tw-pb-4">
					<label className="tw-text-black tw-flex">
						<InputCheckbox
							inputId={BUTTON_ID.CHECK_ALERGIC_AUTO_FILL}
							className="tw-w-max tw-ml-0 tw-mr-3"
							spanClassName="checkmark-square"
							checked={informConsentCheck.agree}
							onChange={() =>
								setInformConsentCheck((prev) => ({
									...prev,
									agree: !prev.agree,
								}))
							}
						/>
					</label>
					<p className="body-12-regular">
						Saya menyetujui Informed Consent,{' '}
						<a
							id={BUTTON_ID.BUTTON_VIEW_TNC}
							className="tx-link"
							onClick={() => openTnC(TNC_CONST.TNC)}
						>
							Syarat Ketentuan
						</a>{' '}
						dan{' '}
						<a
							id={BUTTON_ID.BUTTON_VIEW_PRIVACY}
							className="tx-link"
							onClick={() => openTnC(TNC_CONST.PRIVACY_POLICY)}
						>
							Kebijakan Privasi
						</a>
						.
					</p>
				</div>
				{(partnerDetail?.name == null ||
					partnerDetail?.name?.toUpperCase()?.includes(PARTNER_CONST.SHOPEE)) &&
				isOrderByPartner ? null : (
					<div className="tw-flex tw-items-center tw-pb-1">
						<label className="tw-text-black tw-flex pb-1">
							<InputCheckbox
								inputId={BUTTON_ID.CHECK_ALERGIC_AUTO_FILL}
								className="tw-w-max tw-ml-0 tw-mr-3"
								spanClassName="checkmark-square"
								checked={informConsentCheck.promotional}
								onChange={() =>
									setInformConsentCheck((prev) => ({
										...prev,
										promotional: !prev.promotional,
									}))
								}
							/>
						</label>
						<p className="body-12-regular">
							Saya bersedia menerima materi promosi dan informasi dari ddd dan pihak
							terafiliasinya.
						</p>
					</div>
				)}
				<div className="tw-flex tw-mt-4 tw-gap-4">
					{isNonPaid ? null : (
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_BACK_CONSENT}
							color="grey"
							onClick={handleClose}
							text={CONSENT_CONST.BACK}
							isDisabled={isDisableSubmit || isLoading}
							circularContainerClassName="tw-h-4"
							circularClassName="circular-inner-16"
						/>
					)}
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_START_CONSENT}
						onClick={() => {
							submit(
								informConsentCheck.promotional
									? {
											allowPromotionalContent: informConsentCheck.promotional,
									  }
									: null,
							);
						}}
						text={isNonPaid ? BUTTON_CONST.START_CONSULTATION : CONSENT_CONST.AGREE}
						isDisabled={isDisableSubmit || isLoading || !informConsentCheck.agree}
						isLoading={isLoading || isDisableSubmit}
						circularContainerClassName="tw-h-4"
						circularClassName="circular-inner-16"
					/>
				</div>
			</div>
		);
	};

	const toggleLottie = () => {
		const lottiePlay = !playLottie;
		if (lottiePlay) {
			lottieRef?.current?.play();
		} else {
			lottieRef?.current?.stop();
		}
		setPlayLottie(lottiePlay);
	};
	const debounceScroll = debounce(toggleLottie, 5000);
	const scrollEvent = (event) => {
		const element = event.target;
		if (element.scrollHeight - Math.ceil(element.scrollTop) <= element.clientHeight) {
			debounceScroll.cancel();
		} else {
			debounceScroll();
		}
	};

	const isInViewport = (element) => {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	const handleClose = () => {
		toggle();
	};

	return (
		<div className={`${show ? 'tw-flex' : 'tw-hidden'} tw-flex-col tw-w-full height-dynamic`}>
			<div className={`${playLottie == true ? 'tw-block' : 'tw-hidden'}`}>
				<Lottie
					lottieRef={lottieRef}
					loop={1}
					autoplay={false}
					animationData={LottieScrollHandGesture}
					style={{
						height: 100,
						width: 150,
						position: 'absolute',
						bottom: '200px',
						right: '16px',
						cursor: 'default',
					}}
					onComplete={() => {
						toggleLottie();
					}}
				/>
			</div>
			<div className="tw-overflow-y-scroll tw-flex-1" onScroll={scrollEvent}>
				<div className="body-width tw-fixed tw-w-full tw-z-10">
					<Header
						title="Informed Consent"
						titleClassName="tw-font-normal"
						onClickBack={handleClose}
					/>
				</div>
				<div className="tw-h-[60px]" />
				<div className="body-width tw-flex tw-flex-col tw-justify-center">
					<div className="tw-flex tw-justify-center">
						{logoUrl ? (
							<div className="tw-w-[200px] tw-h-[90px] tw-mt-[10px] tw-mb-[20px] tw-relative">
								<Image src={logoUrl} alt="logo-partner" layout="fill" objectFit="contain" />
							</div>
						) : (
							<div className="tw-my-[30px]">
								<IconDkonsul40 />
							</div>
						)}
					</div>
					{loading ? (
						<div className="tw-mx-4 tw-p-4 box-inform-consent">
							<Skeleton className="tw-w-[100%] tw-h-[33px]" />
							<Skeleton className="tw-w-[80%] tw-h-[33px]" />
							<Skeleton className="tw-w-[80%] tw-h-[33px]" />
						</div>
					) : (
						<div
							className="tw-mx-4 tw-p-4 box-inform-consent"
							dangerouslySetInnerHTML={{ __html: informDetail }}
						></div>
					)}

					{renderFooterButton()}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	informConsentDetail: state.general?.tncPatient?.result?.informedConsent,
});
const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(InformConsent);
