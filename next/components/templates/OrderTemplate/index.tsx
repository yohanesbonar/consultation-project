import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import PopupBottomsheetEmailConfirm from 'components/organisms/PopupBottomsheetEmailConfirm';
import {
	BgLogo,
	IconArrowRightBlue,
	IconClockBlue,
	IconDkonsul40,
	IconHandAndHeart,
	IconPerson,
} from '../../../assets';
import {
	numberToIDR,
	checkIsEmpty,
	PAGE_ID,
	PARAMS_CONST,
	backHandling,
	LOCALSTORAGE,
	getMasterTncPartner,
	getMasterTnc,
	getStorageDecrypt,
	TNC_CONST,
	MESSAGE_CONST,
} from '../../../helper';
import { Header, InputForm } from '../../molecules';
import { Wrapper } from '../../organisms';
import InformConsent from '../../organisms/InformConsent';
import Scroll from 'react-scroll';
import SplashScreenTemplate from '../SplashScreenTemplate';
import InfoPageTemplate from '../InfoPageTemplate';
import cx from 'classnames';
import moment from 'moment';
import PopupBottomsheetChooseDoctor, {
	pricingDoctor,
} from 'components/organisms/PopupBottomsheetChooseDoctor';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import { setErrorAlertRedux } from '../../../redux/trigger';

export interface TSpecialization {
	specialization_id: number;
	specialization_name: string;
}
interface Props {
	footerComponent: () => React.ReactNode;
	forms: any[];
	handleFormChange: (val: object) => void;
	handleFormChangeError: (val: object) => void;
	handleClickLink: (val: string) => void;
	informConsentShow: boolean;
	emailConfirmShow: boolean;
	emailConfirmToggle: () => void;
	informConsentToggle: () => void;
	informConsentSubmit: () => void;
	submitForm: () => void;
	logoUrl: string;
	isLoading: boolean;
	isNonPaid?: boolean;
	partnerDetail?: any;
	isDisableSubmit?: boolean;
	fromPage?: string;
	preview?: any;
	isMcuForm?: boolean;
	showPopupDoctor?: boolean;
	popupDoctorToggle?: () => void;
	selectDoctor?: (specialization: TSpecialization) => void;
	doctorSpecialization?: any;
	backUrl?: string;
	withSpecialist?: boolean;
	// TNC Modal props
	showTncModal?: boolean;
	tncModalToggle?: () => void;
	openTncModal?: (type: string) => void;
}

const OrderTemplate = ({
	footerComponent,
	forms,
	handleFormChange,
	handleFormChangeError,
	handleClickLink,
	informConsentShow,
	informConsentToggle,
	informConsentSubmit,
	emailConfirmShow,
	emailConfirmToggle,
	submitForm,
	logoUrl,
	isLoading,
	isNonPaid,
	partnerDetail,
	isDisableSubmit = false,
	fromPage,
	preview,
	isMcuForm = false,
	showPopupDoctor,
	popupDoctorToggle,
	selectDoctor,
	doctorSpecialization,
	backUrl,
	withSpecialist,
	showTncModal = false,
	tncModalToggle,
	openTncModal,
}: Props) => {
	const Element = Scroll.Element;
	const scroller = Scroll.scroller;
	const theme = useSelector(({ general }) => general?.theme);
	const [isErrorLoadImage, setIsErrorLoadImage] = useState(null);
	const [partnerLogo, setPartnerLogo] = useState(null);
	const router = useRouter();

	// TNC Modal state
	const [tncContent, setTncContent] = useState('');
	const [tncType, setTncType] = useState('');
	const [tncLoading, setTncLoading] = useState(false);

	useEffect(() => {
		if (!preview?.partnerLogo && !theme?.result?.data?.order?.partnerLogo && !logoUrl) return;
		checkPartnerLogo();
	}, [preview, theme, logoUrl]);

	useEffect(() => {
		if (backUrl) {
			setTimeout(() => {
				localStorage.setItem(LOCALSTORAGE.BACK_URL, backUrl);
			}, 500);
		}
	}, [backUrl]);

	const checkPartnerLogo = (param?: string) => {
		try {
			if (!checkIsEmpty(param)) {
				if (param == 'default') {
					setPartnerLogo(null);
					setIsErrorLoadImage(true);
				} else if (param == 'preview') {
					setPartnerLogo({ logo: theme?.result?.data?.order?.partnerLogo, name: 'theme' });
				} else if (param == 'theme') {
					setPartnerLogo({ logo: logoUrl, name: 'default' });
				} else {
					setPartnerLogo(null);
					setIsErrorLoadImage(true);
				}
			} else {
				if (preview?.partnerLogo && checkIsEmpty(param)) {
					setPartnerLogo({ logo: preview?.partnerLogo, name: 'preview' });
				} else if (theme?.result?.data?.order?.partnerLogo) {
					setPartnerLogo({ logo: theme?.result?.data?.order?.partnerLogo, name: 'theme' });
				} else {
					setPartnerLogo({ logo: logoUrl, name: 'default' });
				}
			}
		} catch (error) {
			console.log('error on checkpartnerlogo : ', error);
			setPartnerLogo(null);
			setIsErrorLoadImage(true);
		}
	};

	const displayLogo = () => {
		if (!isLoading) {
			return (
				<div className="tw-w-full tw-h-24 tw-relative tw-flex tw-items-center tw-justify-center">
					<img
						src={BgLogo.src}
						style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1 }}
						alt="bg-logo"
					/>
					<div className="tw-w-full tw-h-[72px] tw-relative tw-flex">
						{!isErrorLoadImage && partnerLogo && !checkIsEmpty(partnerLogo?.logo) ? (
							<Image
								src={partnerLogo?.logo}
								alt="logo-partner"
								layout="fill"
								objectFit="contain"
								className="tw-max-h-[81px] tw-max-w-[144px] tw-self-center tw-justify-self-center tw-m-auto"
								onError={() => checkPartnerLogo(partnerLogo?.name)}
							/>
						) : (
							<div className="tw-flex tw-justify-center tw-flex-1 tw-items-center">
								<IconDkonsul40 />
							</div>
						)}
					</div>
				</div>
			);
		} else {
			return <Skeleton className="!tw-w-[300px] tw-h-[80px] tw-z-[1] tw-flex-1 tw-flex" />;
		}
	};

	React.useEffect(() => {
		if (fromPage === PARAMS_CONST.ADDRESS) {
			scroller.scrollTo('6', {
				duration: 1500,
				delay: 100,
				smooth: true,
				containerId: 'content',
			});
		}
	}, [isLoading]);

	const renderFooterComponent = () => {
		if (isLoading) return null;
		if (informConsentShow && !showTncModal) {
			return (
				<InformConsent
					show={informConsentShow}
					toggle={informConsentToggle}
					submit={informConsentSubmit}
					logoUrl={logoUrl}
					isNonPaid={isNonPaid}
					partnerDetail={partnerDetail}
					isDisableSubmit={isDisableSubmit}
					isLoading={isLoading}
					onOpenTnc={handleOpenTncModal}
					isOrderByPartner={router?.query?.ct != null}
				/>
			);
		}

		if (showTncModal) {
			return renderTncModal();
		}

		return footerComponent();
	};

	const handleClickSpecialist = () => {
		popupDoctorToggle();
	};

	const handleOpenTncModal = async (type: string) => {
		setTncType(type);
		setTncLoading(true);
		if (openTncModal) {
			openTncModal(type);
		}

		try {
			const xidFromLocal = await getStorageDecrypt(LOCALSTORAGE.XID);
			const res =
				xidFromLocal || partnerDetail?.partnerXid
					? await getMasterTncPartner(xidFromLocal || partnerDetail?.partnerXid)
					: await getMasterTnc();

			if (res?.meta?.acknowledge) {
				if (type === TNC_CONST.PRIVACY_POLICY) {
					setTncContent(res?.data?.privacyPolicyTnc || '');
				} else {
					setTncContent(res?.data?.tnc || '');
				}
			} else {
				setErrorAlertRedux({
					danger: true,
					data: {
						message: res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG,
					},
				});
			}
		} catch (error) {
			console.log('error on get data tnc : ', error);
			setErrorAlertRedux({
				danger: true,
				data: {
					message: MESSAGE_CONST.SOMETHING_WENT_WRONG,
				},
			});
		} finally {
			setTncLoading(false);
		}
	};

	const handleCloseTncModal = () => {
		if (tncModalToggle) {
			tncModalToggle();
		}
		setTncContent('');
		setTncType('');
	};

	const handleClickBack = backUrl
		? () => {
				if (informConsentShow) {
					informConsentToggle();
					return;
				}
				backHandling({
					router,
					backToPartner: backUrl,
				});
				return;
		  }
		: null;

	const renderFieldSpecialist = () => {
		return (
			<>
				<h5 className="tw-font-roboto tw-font-medium tw-mt-4 tw-mb-2">Konsultasi Dengan</h5>
				<div
					className={cx(
						'tw-flex tw-flex-row tw-items-center tw-p-2 tw-pl-3 tw-rounded-lg tw-border-monochrome-500 tw-border-solid tw-border-[1px]',
						!forms?.[0]?.disabled
							? 'tw-cursor-pointer tw-select-none hover:tw-opacity-80'
							: '',
					)}
					onClick={!forms?.[0]?.disabled ? handleClickSpecialist : null}
				>
					<IconHandAndHeart />
					<div className="tw-flex tw-flex-1 tw-flex-col tw-mx-3">
						<div className="body-14-regular tw-text-black">{doctorSpecialization?.name}</div>
						<div className="tw-flex tw-flex-row">
							{pricingDoctor(
								doctorSpecialization?.price,
								doctorSpecialization?.promoPrice,
							) === 'free_consultation' ? (
								<div className="body-14-regular tw-text-primary-def">Gratis</div>
							) : pricingDoctor(
									doctorSpecialization?.price,
									doctorSpecialization?.promoPrice,
							  ) === 'promo' ? (
								<>
									<div className="body-14-regular tw-text-monochrome-def tw-line-through">
										{numberToIDR(doctorSpecialization?.price)}
									</div>
									<div className="tw-ml-1 body-14-regular tw-text-primary-def">
										{numberToIDR(doctorSpecialization?.promoPrice)}
									</div>
								</>
							) : pricingDoctor(
									doctorSpecialization?.price,
									doctorSpecialization?.promoPrice,
							  ) === 'no_promo' ? (
								<div className="body-14-regular tw-text-black">
									{numberToIDR(doctorSpecialization?.price)}
								</div>
							) : null}
						</div>
					</div>
					{!forms?.[0]?.disabled ? <IconArrowRightBlue /> : null}
				</div>

				{checkIsEmpty(doctorSpecialization?.duration) ? null : (
					<div className="tw-flex tw-bg-secondary-100 tw-h-8 tw-my-5 tw-flex-row tw-items-center tw-mx-[-15px] tw-px-[15px] secondary-ic">
						<IconClockBlue />
						<div className="label-12-medium tw-text-tpy-900 tw-ml-2">
							durasi konsultasi {doctorSpecialization?.duration} menit
						</div>
					</div>
				)}
			</>
		);
	};

	const renderTncModal = () => {
		return (
			<div
				className={`${
					showTncModal ? 'tw-flex' : 'tw-hidden'
				} tw-flex-col tw-w-full height-dynamic`}
			>
				{/* Modal Content */}
				<div className="tw-flex-1 tw-overflow-y-auto">
					{tncLoading ? (
						<div className="tw-space-y-3">
							<Skeleton className="tw-w-full tw-h-4" />
							<Skeleton className="tw-w-4/5 tw-h-4" />
							<Skeleton className="tw-w-3/4 tw-h-4" />
							<Skeleton className="tw-w-full tw-h-4" />
							<Skeleton className="tw-w-2/3 tw-h-4" />
						</div>
					) : (
						<>
							<div className="body-width tw-fixed tw-w-full tw-z-10">
								<Header
									title="T & C Telekonsultasi"
									titleClassName="tw-font-normal"
									onClickBack={handleCloseTncModal}
								/>
							</div>
							<div className="tw-h-[60px]" />
							<div className="tw-p-4 tw-border tw-border-gray-200 tw-rounded-lg tw-overflow-y-auto">
								{parse(tncContent)}
							</div>
						</>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
			<Wrapper
				additionalId={PAGE_ID.ONBOARDING_FORM}
				title="Form Konsultasi"
				metaTitle="Chat Dokter"
				header={!isLoading && backUrl && !informConsentShow && !showTncModal ? true : false}
				onClickBack={handleClickBack}
				footer={true}
				footerComponent={renderFooterComponent()}
				additionalStyleContent={{
					overflowY: isLoading ? 'hidden' : 'scroll',
				}}
				isPreview={!checkIsEmpty(preview)}
				additionalStyleParent={{
					width: '100%',
					...(preview?.primaryColor ? { ['--primary-def']: preview?.primaryColor } : {}),
					...(preview?.secondaryColor ? { ['--secondary-def']: preview?.secondaryColor } : {}),
				}}
			>
				{isLoading ? (
					<>
						{fromPage === PARAMS_CONST.ADDRESS ? (
							<InfoPageTemplate
								hideDkonsulLogo
								isSpinner={fromPage === PARAMS_CONST.ADDRESS}
								title="Tunggu sebentar ya,"
								description="Telekonsultasimu sedang disiapkan."
							/>
						) : (
							<SplashScreenTemplate
								partner={partnerDetail}
								isDharmaDexa={partnerDetail?.splashAsset ? true : false}
							/>
						)}
					</>
				) : (
					<div className={cx('tw-flex tw-flex-col')}>
						{displayLogo()}
						<div className="tw-p-[15px] tw-pt-2">
							{withSpecialist && renderFieldSpecialist()}

							<h5 className="tw-font-roboto tw-font-medium tw-mt-6">Formulir Konsultasi</h5>
							{withSpecialist ? null : (
								<p className="body-12-regular tw-mb-6">
									Formulir perlu diisi agar dokter dapat meresepkan obat Anda dengan sesuai
								</p>
							)}
							{isMcuForm ? (
								<div className="tw-my-5 tw-rounded-[8px] tw-py-2 tw-px-4 tw-border tw-border-solid tw-border-gray-300 tw-flex tw-flex-row tw-items-center">
									<IconPerson />
									<div className="tw-flex tw-flex-col tw-flex-1 tw-ml-3">
										<div className="tw-flex tw-flex-1 font-14 tw-font-roboto tw-font-medium tw-text-tpy-900">
											{partnerDetail?.patientInfo?.name}
										</div>
										<div className="font-12 tw-font-roboto tw-font-medium tw-text-tpy-700">{`${
											String(partnerDetail?.patientInfo?.gender).toUpperCase() === 'MALE'
												? 'Laki-laki'
												: 'Perempuan'
										} • ${moment().diff(
											new Date(partnerDetail?.patientInfo?.born_date),
											'years',
										)} tahun`}</div>
									</div>
								</div>
							) : (
								<></>
							)}
							<div className="w-text-tpy-def tw-bg-background-def">
								{forms?.map((element) => (
									<Element key={element.slug} name={element.slug}>
										<InputForm
											formId={element.slug}
											className={element?.className}
											data={element}
											onChange={handleFormChange}
											onChangeErrorMessage={handleFormChangeError}
											onClickLink={handleClickLink}
											buttonStyle={
												preview?.primaryColor
													? { backgroundColor: preview?.primaryColor }
													: {}
											}
										/>
									</Element>
								))}
							</div>
						</div>
					</div>
				)}
				<PopupBottomsheetEmailConfirm
					show={emailConfirmShow}
					toggle={emailConfirmToggle}
					submit={submitForm}
					dataForm={forms}
				/>
				<PopupBottomsheetChooseDoctor
					show={showPopupDoctor}
					toggle={popupDoctorToggle}
					submit={selectDoctor}
					data={partnerDetail?.specialists ?? []}
					selected={doctorSpecialization}
				/>
			</Wrapper>
		</>
	);
};

export default OrderTemplate;
