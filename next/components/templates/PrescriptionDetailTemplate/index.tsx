// TODO: fix these lints
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	IconArrowRightBlue,
	IconHealthCareBubbleChat,
	IconPrescriptionExpired,
	IconWarningOrange,
} from '../../../assets/index.js';
import {
	AjustmentPrescription,
	ButtonHighlight,
	ButtonOpacity,
	CountdownTimerBar,
	DkonsulWatermark,
	EreceiptDetail,
	FaskesInfo,
	HeaderInfo,
	HorizontalSlider,
	NewsItem,
	NotesPrescription,
	PopupBottomsheetConfirmation,
	PopupBottomsheetConsultationInfo,
	PopupBottomsheetEndConsultation,
	PopupBottomsheetPostalCode,
	PopupBottomsheetRating,
	SkeletonDetailItem,
	Wrapper,
} from '../../../components';
import {
	BUTTON_CONST,
	CONFIRMATION_CONST,
	CONFIRMATION_KEY_CONST,
	CONSULTATION_TYPE,
	DETAIL_ITEM,
	GENERAL_CONST,
	LABEL_CONST,
	MESSAGE_CONST,
	PAGE_ID,
	PRESCRIPTION_CONST,
	STATUS_CONST,
	STATUS_CONSULTATION,
	VOUCHER_CONST,
	encryptData,
	getStorageParseDecrypt,
	redirectApplyPresc,
	handleSubmitAddress,
	navigateWithQueryParams,
	removeLocalStorage,
	showToast,
	handleSendManualPresc,
	setLocalStorage,
	LOCALSTORAGE,
	TOAST_MESSAGE,
	fetchCachedTheme,
	backHandling,
	checkIsEmpty,
} from '../../../helper';

import { PartnerTheme, PatientRecommendationType } from '@types';
import classNames from 'classnames';
import { useRouter } from 'next/router.js';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchCart } from 'redux/actions';
import { ChatItem } from '../../../types/Chat';
import { ConfirmationConst } from '../../../types/Common';
import { PrescriptionDetailData } from '../../../types/Prescription';
import useFaskesInfo from '../../../hooks/useFaskesInfo';
import { setIsOpenBottomsheetEndConsul } from 'redux/trigger';
import usePartnerInfo from 'hooks/usePartnerInfo';

interface Props {
	general: {
		isPageLoading: boolean;
	};
	data?: PrescriptionDetailData;
	token?: string;
	isRedeemType: boolean;
	disableBackButton: boolean;
	isExpired: boolean;
	timeLeft: number;
	isOpenInfoBottomsheet: boolean;
	setTimeLeft: (val: number) => void;
	setIsOpenInfoBottomsheet: (val: boolean) => void;
	confirmationButtonData: ConfirmationConst;
	setConfirmationButtonData: (val: ConfirmationConst) => void;
	sendResponse: (status: string, redirectToContact?: boolean) => void;
	consultationData?: any;
	orderNumber?: string;
	preview?: any;
	patientData?: any;
	refreshData?: () => void;
	theme?: PartnerTheme;
}

const PrescriptionDetailTemplate = ({
	general,
	data,
	token,
	isRedeemType,
	disableBackButton,
	isExpired,
	timeLeft,
	isOpenInfoBottomsheet,
	setTimeLeft,
	setIsOpenInfoBottomsheet,
	confirmationButtonData,
	setConfirmationButtonData,
	sendResponse,
	consultationData,
	orderNumber,
	preview,
	patientData,
	refreshData,
	...props
}: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const prescriptionRef = useRef(null);
	const noteRef = useRef(null);
	const store = useSelector(({ general }: any) => general);
	const contactUrl = store?.contactUrl;
	const redirectAfterRatingRef = useRef(false);
	const postalCodeRef = useRef(null);

	const [isShowRate, setIsShowRate] = React.useState(false);
	const [isPostalCodeBottomsheetOpen, setIsPostalCodeBottomsheetOpen] = useState(false);

	const toggleRate = () => setIsShowRate(!isShowRate);

	const isAvailablePresc =
		data?.status == PRESCRIPTION_CONST.ACCEPTED &&
		!isExpired &&
		data?.payment_status != STATUS_CONST.SUCCESS;
	const isWattermark = router.query?.wm && router.query?.wm == '1';

	const isNotHavePrescButNotes = useMemo(
		() =>
			(!data?.prescriptions || !data?.prescriptions?.length) &&
			data?.medicalNote?.diagnoses &&
			data?.medicalNote?.diagnoses?.length,
		[data],
	);

	const isNotHaveBoth = useMemo(
		() =>
			(!data?.prescriptions ||
				!data?.prescriptions?.length ||
				(!data?.prescriptions?.some((e) => e?.is_recommendation) &&
					data?.status == PRESCRIPTION_CONST.REJECTED)) &&
			(!data?.medicalNote?.diagnoses || !data?.medicalNote?.diagnoses?.length),
		[data],
	);

	const isShowWatermark =
		(!isAvailablePresc || isWattermark) &&
		!isNotHavePrescButNotes &&
		!isNotHaveBoth &&
		data?.payment_status != STATUS_CONST.SUCCESS;

	const [applying, setApplying] = React.useState(false);

	usePartnerInfo({ theme: props?.theme, token: (router.query?.token_order ?? token) as string });

	useEffect(() => {
		console.log('updated loading', general?.isPageLoading);
	}, [general?.isPageLoading]);

	const faskesInfo = useFaskesInfo(data);

	const consultationCompleted = useMemo(
		() =>
			consultationData?.status === GENERAL_CONST.EXPIRED ||
			consultationData?.status === STATUS_CONSULTATION.COMPLETED ||
			consultationData?.status === GENERAL_CONST.CLOSED,
		[consultationData],
	);

	useEffect(() => {
		if (consultationCompleted && redirectAfterRatingRef.current) {
			setLocalStorage(
				LOCALSTORAGE.CONSULTATION_ENDED_PRESC,
				TOAST_MESSAGE.CONSULTATION_ENDED_AND_CAN_APPLY_PRESC,
			);
			handleApplyPrescription();
		}
	}, [consultationCompleted]);

	const handleApplyPrescription = async () => {
		try {
			setApplying(true);
			const voucher_seamless: any = await getStorageParseDecrypt(VOUCHER_CONST.SEAMLESS_VOUCHER);
			if (voucher_seamless) await removeLocalStorage(VOUCHER_CONST.SEAMLESS_VOUCHER);

			if (consultationCompleted) {
				/// show postal code if not selected yet
				if (
					checkIsEmpty(data?.patient_data?.patient_postal_code) &&
					checkIsEmpty(postalCodeRef.current)
				) {
					setIsPostalCodeBottomsheetOpen(true);
					setApplying(false);
					return;
				}

				redirectApplyPresc(data, {
					contactUrl,
					orderNumber,
					handleSeamlessAddress: () => {
						dispatch(fetchCart({ id: orderNumber, isAlreadyRedirect: true }));
						setTimeout(() => {
							setApplying(false);
							handleSubmitAddress(
								{
									address: data?.patient_data?.patient_address,
									lat: data?.patient_data?.patient_latitude,
									lng: data?.patient_data?.patient_longitude,
									postalCode:
										postalCodeRef.current ?? data?.patient_data?.patient_postal_code,
									orderNumber: consultationData?.orderNumber,
								},
								router.query?.token ?? '',
								null,
								null,
								router.query?.token ? 'transaction-wtoken' : 'transaction',
								false,
								router.query?.id ?? orderNumber,
								data?.order_token,
								data?.checkout_instant_success?.toString(),
							);
						}, 1000);
					},
					handleSeamlessCart: () => {
						sendResponse(PRESCRIPTION_CONST.INTERESTED);
						setApplying(false);
					},
				});
			} else {
				setIsOpenBottomsheetEndConsul(true);
			}
		} catch (error) {
			showToast(MESSAGE_CONST.SOMETHING_WENT_WRONG);
			console.log('error on handle apply : ', error);
		} finally {
			setApplying(false);
		}
	};

	const handleOnChangePostalCode = (res: any) => {
		try {
			if (res && res?.code) {
				postalCodeRef.current = res?.code;
				handleApplyPrescription();
			}
		} catch (error) {
			console.log('error on handle on change postal code : ', error);
		} finally {
			setIsPostalCodeBottomsheetOpen(false);
		}
	};

	const hasRecommendation = useMemo(() => {
		if (data?.prescriptions && data?.prescriptions?.length) {
			return data?.prescriptions?.some((e) => e?.is_recommendation);
		}
		return false;
	}, [data]);

	const renderHeader = () => {
		const isAvailable =
			data?.status == PRESCRIPTION_CONST.ACCEPTED &&
			!isExpired &&
			data?.payment_status != STATUS_CONST.SUCCESS;
		if (data?.status == PRESCRIPTION_CONST.REJECTED && hasRecommendation) {
			return null;
		}

		if (isNotHavePrescButNotes || isNotHaveBoth) {
			if (consultationData?.status == STATUS_CONST.STARTED) {
				return (
					<HeaderInfo
						isLoading={data == null || general?.isPageLoading}
						data={{
							isAvailable: true,
							icon: <IconWarningOrange />,
							desc: LABEL_CONST.RESUME_WILL_BE_SENT_TO_EMAIL_INFO,
						}}
					/>
				);
			}

			return null;
		}

		const descApprovalLabelStarted = `Resep elektronik sudah otomatis terlampir di ${consultationData?.consultationPartner} dan hanya bisa dipakai 1x. Anda bisa akhiri konsultasi jika sudah cukup.`;
		const descApprovalLabel = `Resep elektronik sudah otomatis terlampir di ${consultationData?.consultationPartner} dan hanya bisa dipakai 1x.`;
		return (
			<HeaderInfo
				isLoading={data == null || general?.isPageLoading}
				data={{
					isAvailable: isAvailablePresc,
					icon: isAvailable ? <IconWarningOrange /> : <IconPrescriptionExpired />,
					desc: isAvailable
						? consultationData?.consultationType == CONSULTATION_TYPE.APPROVAL
							? consultationData?.status == STATUS_CONST.STARTED
								? descApprovalLabelStarted
								: descApprovalLabel
							: consultationData?.status == STATUS_CONST.STARTED
							? LABEL_CONST.PRESCRIPTION_ONLY_ONE_TIME_USE_STARTED_CONSULTATION
							: LABEL_CONST.PRESCRIPTION_ONLY_ONE_TIME_USE
						: LABEL_CONST.PRESCRIPTION_INVALID,
				}}
			/>
		);
	};

	const renderFooterButton = () => {
		if (data == null) {
			return null;
		} else if (data?.payment_status == STATUS_CONST.SUCCESS) {
			return null;
		} else if (data?.submit_redeem || isExpired) {
			return null;
		} else {
			return (
				<div className="tw-px-4 tw-pt-4 box-shadow-m tw-bg-white">
					<ButtonHighlight
						onClick={handleApplyPrescription}
						text={BUTTON_CONST.APPLY_PRESCRIPTION}
						isLoading={applying}
						classNameBtn={'title-14-medium'}
						circularContainerClassName="tw-h-[16px]"
						circularClassName="circular-inner-16"
					/>
					<div className="tw-flex tw-items-center tw-justify-center tw-my-5">
						<p className="body-14-regular tw-mr-1 tw-mb-0 tw-text-black">
							Butuh info lebih lanjut?
						</p>
						<p
							onClick={() => sendResponse(PRESCRIPTION_CONST.CONTACT_US, true)}
							className="label-14-medium tw-text-secondary-def tw-mb-0 tw-cursor-pointer"
						>
							Hubungi Kami
						</p>
					</div>
				</div>
			);
		}
	};

	const renderContactUs = () => {
		if (data?.payment_status == STATUS_CONST.SUCCESS || data?.submit_redeem || isExpired) {
			return (
				<>
					<div className="tw-w-full tw-h-[4px] tw-bg-monochrome-100"></div>
					<div className="tw-px-4 tw-bg-white">
						<div className="tw-flex tw-items-center tw-justify-center tw-my-5">
							<p className="body-14-regular tw-mr-1 tw-mb-0 tw-text-black">
								Butuh info lebih lanjut?
							</p>
							<p
								onClick={() => handleSendManualPresc(data, contactUrl, orderNumber)}
								className="label-14-medium tw-text-secondary-def tw-mb-0 tw-cursor-pointer"
							>
								Hubungi Kami
							</p>
						</div>
					</div>
				</>
			);
		}

		return null;
	};

	const renderCustomPopup = () => {
		return (
			<>
				<PopupBottomsheetEndConsultation
					email={patientData?.email}
					setPopupFeedback={toggleRate}
					isPresc={true}
				/>
				<PopupBottomsheetRating
					show={isShowRate}
					toggle={toggleRate}
					consulDetail={consultationData}
					callbackSubmit={() => {
						toggleRate();
						redirectAfterRatingRef.current = true;
						refreshData();
					}}
				/>
			</>
		);
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.PRESCRIPTION_DETAIL}
			title={token ? 'Ringkasan Telekonsultasi' : 'Detail Resep Elektronik'}
			header={true}
			footer={true}
			footerComponent={
				consultationData?.consultationType != null &&
				consultationData?.consultationType == CONSULTATION_TYPE.RECOMMENDATION
					? renderFooterButton()
					: null
			}
			// additionalHeaderComponent={renderHeader()}
			addParentHeaderClassname="tw-z-2"
			additionalStyleContent={{}}
			disableBackButton={router?.query?.fromHealthcare ? false : disableBackButton}
			checkByQuery={true}
			onClickBack={() => {
				if (router?.query?.fromHealthcare) {
					router.back();
				} else if (consultationData?.backUrl && !router?.query?.chat) {
					backHandling({ backToPartner: consultationData?.backUrl, router });
				} else {
					router.back();
				}
			}}
			headerColor={preview?.primaryColor}
			customPopupComponent={renderCustomPopup()}
			isPreview
		>
			{isShowWatermark && !hasRecommendation && (
				<DkonsulWatermark isWithExpiredText={!isAvailablePresc} />
			)}

			<CountdownTimerBar
				duration={timeLeft}
				setTimeLeft={(time) => setTimeLeft(time)}
				isDisplaying={false}
			/>
			{general?.isPageLoading ? (
				<div className="tw-relative !tw-min-h-full">
					{/* lanjut sini */}
					<SkeletonDetailItem />
					<SkeletonDetailItem />
					<SkeletonDetailItem type={DETAIL_ITEM.PRODUCT} />
					<SkeletonDetailItem />
				</div>
			) : (
				<div className="tw-relative !tw-min-h-full">
					{renderHeader()}
					{token && (
						<div className="">
							{isNotHavePrescButNotes || isNotHaveBoth ? null : (
								<>
									<EreceiptDetail
										data={data}
										consultationData={consultationData}
										prescriptionRef={prescriptionRef}
										isAvailablePresc={isAvailablePresc}
									/>
									{data?.updatedPrescriptions.length > 0 && (
										<AjustmentPrescription data={data?.updatedPrescriptions} />
									)}
								</>
							)}

							{data?.medical_actions?.length ? (
								<div>
									{isNotHavePrescButNotes || isNotHaveBoth ? (
										<div className="tw-mt-4" />
									) : (
										<div
											className={'tw-w-full tw-my-4 tw-h-[4px] tw-bg-monochrome-100'}
										/>
									)}

									<div className="tw-px-4">
										<ButtonOpacity
											onClick={async () => {
												if (router?.query?.fromHealthcare) {
													return router.back();
												} else {
													return navigateWithQueryParams(
														'/healthcare-detail',
														router?.query
															? {
																	...router?.query,
																	fromPrescriptionDetail: 1,
															  }
															: {
																	id: await encryptData(global?.orderNumber),
																	chat: 1,
																	fromPrescriptionDetail: 1,
															  },
														'href',
													);
												}
											}}
											text="Anda dapat saran tindakan medis"
											prefixIcon={<IconHealthCareBubbleChat />}
											suffixIcon={<IconArrowRightBlue />}
										/>
									</div>
								</div>
							) : null}

							<NotesPrescription
								noteDetail={{ data: data?.medicalNote } as ChatItem}
								isNotHaveBoth={isNotHaveBoth}
								className={classNames(
									'tw-mt-4',
									isNotHavePrescButNotes || isNotHaveBoth ? 'tw-border-t-0 !tw-mt-0' : '',
								)}
								containerRef={noteRef}
								showEmptyContent={true}
							/>
						</div>
					)}
					{/* <DetailItem
						type={DETAIL_ITEM.MEDICAL_FACILITY}
						data={{
							title: 'Fasilitas Kesehatan',
							list: data?.medical_facility,
							partnerName: data?.partnerName,
						}}
						hideValueByLabel={['Tanggal Kadaluarsa']}
					/>
					<DetailItem
						data={{
							title: 'Dokter',
							list: data?.doctor,
							partnerName: data?.partnerName,
						}}
					/>
					<DetailItem
						data={{
							title: 'Pasien',
							list: data?.patient,
							partnerName: data?.partnerName,
						}}
					/> */}

					<FaskesInfo data={faskesInfo} key={'receiptinfo'} />
					<div className="tw-w-full tw-h-[4px] tw-bg-monochrome-100"></div>

					{data?.patient_recommendation && data?.patient_recommendation?.length ? (
						<HorizontalSlider title="Info Sehat untuk Anda">
							{data?.patient_recommendation?.map(
								(el: PatientRecommendationType, i: number) => (
									<NewsItem
										key={'patientrecommendation_' + i}
										data={el}
										total={data?.patient_recommendation?.length}
									/>
								),
							)}
						</HorizontalSlider>
					) : null}

					{renderContactUs()}
				</div>
			)}
			<PopupBottomsheetConfirmation
				data={
					confirmationButtonData
						? CONFIRMATION_CONST[CONFIRMATION_KEY_CONST.NOT_INTERESTED_APPLY_PRESCRIPTION]
						: null
				}
				callback={() => setConfirmationButtonData(null)}
				isLoading={false}
				isDisabled={false}
			/>
			{isRedeemType && (
				<PopupBottomsheetConsultationInfo
					isOpenBottomsheet={isOpenInfoBottomsheet}
					setIsOpenBottomsheet={(isOpen) => setIsOpenInfoBottomsheet(isOpen)}
				/>
			)}
			<PopupBottomsheetPostalCode
				isOpen={isPostalCodeBottomsheetOpen}
				callback={handleOnChangePostalCode}
			/>
		</Wrapper>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export const getServerSideProps = async ({ req, res, query }) => {
	const token = query?.token_order ?? query?.token;
	const responseTheme = await fetchCachedTheme(query?.token as string, { req, res });
	try {
		if (responseTheme?.meta?.acknowledge) {
			return {
				props: {
					theme: responseTheme?.data,
				},
			};
		}
	} catch (error) {
		console.log('error on server side props theme : ', error);
	}

	return { props: {} };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionDetailTemplate);
