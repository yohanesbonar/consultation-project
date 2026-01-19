import { useEffect } from 'react';
import { IconArrowRightBlue, IconResep, IconWarningOrange } from '../../../assets/index.js';
import {
	ButtonHighlight,
	ButtonOpacity,
	CountdownTimerBar,
	FaskesInfo,
	HeaderInfo,
	HealthCare,
	SkeletonDetailItem,
	Wrapper,
} from '../../../components';
import {
	CONSULTATION_TYPE,
	LABEL_CONST,
	PAGE_ID,
	PRESCRIPTION_CONST,
	STATUS_CONST,
	encryptData,
	navigateWithQueryParams,
	showToast,
} from '../../../helper';

import { useRouter } from 'next/router.js';
import { connect } from 'react-redux';
import { ConfirmationConst } from '../../../types/Common';
import { PrescriptionDetailData } from '../../../types/Prescription';
import useFaskesInfo from '../../../hooks/useFaskesInfo';

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
	patientData?: any;
	refreshData?: () => void;
}

const HealthcareDetailTemplate = ({
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
	patientData,
	refreshData,
}: Props) => {
	const router = useRouter();
	const isApproval = consultationData?.consultationType == CONSULTATION_TYPE.APPROVAL;

	useEffect(() => {
		console.log('updated loading', general?.isPageLoading);
	}, [general?.isPageLoading]);

	const faskesInfo = useFaskesInfo(data);

	const renderHeader = () => {
		if (consultationData?.status === STATUS_CONST.STARTED) {
			return (
				<HeaderInfo
					isLoading={data == null || general?.isPageLoading}
					data={{
						isAvailable: true,
						icon: <IconWarningOrange />,
						desc: isApproval
							? LABEL_CONST.APPROVAL_HEALTHCARE_WILL_BE_SENT_TO_EMAIL_INFO
							: LABEL_CONST.HEALTHCARE_WILL_BE_SENT_TO_EMAIL_INFO,
					}}
				/>
			);
		}

		return null;
	};

	const renderFooterButton = () => {
		return (
			<div className="tw-px-4 tw-pt-4 box-shadow-m tw-bg-white">
				<ButtonHighlight
					onClick={() => {
						if (data?.medical_action_url) {
							router.replace(data?.medical_action_url);
						} else {
							showToast('Anda perlu akhiri konsultasi untuk bisa pesan tindakan');
						}
					}}
					text={'PESAN TINDAKAN'}
					isLoading={false}
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
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.PRESCRIPTION_DETAIL}
			title="Saran Tindakan Medis"
			header={true}
			footer={true}
			footerComponent={renderFooterButton()}
			addParentHeaderClassname="tw-z-2"
			additionalStyleContent={{}}
			disableBackButton={router?.query?.fromPrescriptionDetail ? false : disableBackButton}
			checkByQuery={true}
			onClickBack={() => {
				if (router?.query?.fromPrescriptionDetail) {
					router.back();
				} else if (consultationData?.backUrl && !router?.query?.chat) {
					router.replace(consultationData?.backUrl ?? '#');
				} else {
					router.back();
				}
			}}
		>
			<CountdownTimerBar
				duration={timeLeft}
				setTimeLeft={(time) => setTimeLeft(time)}
				isDisplaying={false}
			/>

			{general?.isPageLoading ? (
				<div className="tw-relative !tw-min-h-full">
					<SkeletonDetailItem />
				</div>
			) : (
				<div className="tw-relative !tw-min-h-full">
					{renderHeader()}
					<HealthCare medicalActions={data?.medical_actions ?? []} />
					{data?.prescriptions?.length ? (
						<>
							<div className={'tw-w-full tw-h-[4px] tw-bg-monochrome-100'} />
							<div className="tw-px-4 tw-py-4">
								<ButtonOpacity
									onClick={async () => {
										if (router?.query?.fromPrescriptionDetail) {
											return router.back();
										} else {
											return navigateWithQueryParams(
												'/prescription-detail',
												router?.query
													? {
															...router?.query,
															fromHealthcare: 1,
													  }
													: {
															id: await encryptData(global?.orderNumber),
															chat: 1,
															fromHealthcare: 1,
													  },
												'href',
											);
										}
									}}
									text="Anda dapat resep elektronik"
									prefixIcon={<IconResep />}
									suffixIcon={<IconArrowRightBlue />}
								/>
							</div>
						</>
					) : null}

					<div className={'tw-w-full tw-h-[4px] tw-bg-monochrome-100'} />
					<FaskesInfo data={faskesInfo} />
				</div>
			)}
		</Wrapper>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HealthcareDetailTemplate);
