import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DataChatDetail } from '@types';
import capitalize from 'lodash/capitalize';

import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { IconRadioOff, IconRadioOn } from '../../../assets';
import { feedbackList, setEndConsultation } from '../../../redux/actions';
import ImageLoading from '../../atoms/ImageLoading';
import { RejectPrescription, ApprovePrescription } from '../../../assets';
import { CountdownNumber } from '../../molecules';
import { LOCALSTORAGE, backHandling, getLocalStorage, removeLocalStorage } from 'helper';

type IdType = string | number;
type EndConsultationBodyType = {
	feedback: {
		id?: IdType;
		message?: string;
	};
};
type Props = {
	show: boolean;
	togglePopup: (val: boolean) => void;
	getFeedbackList: (val: string) => void;
	feedbackDataList: any;
	selected?: {
		id?: IdType;
		value?: string;
	};
	onChange: (id: IdType, value: string) => void;
	feedbackTemp: {
		value?: IdType;
		valueText?: string;
	};
	endConsultation?: (_orderNumber: IdType, body: EndConsultationBodyType) => void;
	prescriptionStatus?: null | string;
	consulDetail?: DataChatDetail;
};
type HandleConsulType = { redirect?: boolean };

const PopupBottomsheetFeedback = ({
	show,
	togglePopup,
	getFeedbackList,
	feedbackDataList,
	selected,
	onChange = () => {
		/* intentional */
	},
	feedbackTemp,
	endConsultation,
	prescriptionStatus,
	consulDetail,
}: Props) => {
	const [submitFeedback, setSubmitFeedback] = useState<boolean>(false);
	useEffect(() => {
		if (show) {
			getFeedback();
		}
	}, [show]);

	const getFeedback = async () => {
		if (feedbackDataList?.length < 1) await getFeedbackList('feedback');
	};

	const handleEndConsul = async ({ redirect = false }: HandleConsulType) => {
		const body: any = {
			feedback: {
				id: feedbackTemp.value,
				message: feedbackTemp.valueText,
			},
		};
		await endConsultation(global.orderNumber, body);
		if (redirect) {
			removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
			const redirectUrl = await getLocalStorage(LOCALSTORAGE.REDIRECT_URL);
			const url = redirectUrl || consulDetail?.endUrl;
			backHandling({ backToPartner: url });
		}
	};

	let headerComponent = (
		<div className="tw-mt-[36px] tw-mb-[20px] tw-mx-4">
			<p className="title-20-medium tw-text-left">Alasan akhiri telekonsultasi</p>
		</div>
	);

	let bodyComponent =
		feedbackDataList?.length > 0 &&
		feedbackDataList?.map((val, i) => (
			<div
				key={i}
				className="tw-flex tw-px-4 tw-items-center btn-hover link-cursor"
				onClick={() => {
					onChange(val?.id, val?.value);
				}}
			>
				<p className="tw-flex-1 tw-mb-0 tw-text-4">{val.value}</p>
				<div className="tw-text-secondary-def">
					{selected && val?.id == selected?.id ? <IconRadioOn /> : <IconRadioOff />}
				</div>
			</div>
		));

	let footerComponent = (
		<div className="tw-flex tw-flex-row tw-p-4 tw-gap-4">
			<ButtonHighlight color="grey" text={'BATAL'} onClick={() => togglePopup(false)} />
			<ButtonHighlight
				classNameBtn={!(selected && selected?.id) ? `tw-bg-light-2 tw-text-tpy-700` : ''}
				text={'KONFIRMASI'}
				isDisabled={!(selected && selected?.id)}
				onClick={async () => {
					if (selected && selected?.id) {
						const body: any = {
							feedback: {
								id: feedbackTemp.value,
								message: feedbackTemp.valueText,
							},
						};
						togglePopup(false);
						await removeLocalStorage(LOCALSTORAGE.TEMP_POPUP_PRESC);
						await endConsultation(global.orderNumber, body);
					}
				}}
			/>
		</div>
	);

	let handleSwipeableOpen = (isOpen) => {
		if (!isOpen) togglePopup(false);
	};

	if (
		consulDetail?.consultationType == 'APPROVAL' &&
		prescriptionStatus &&
		consulDetail?.redirectAfter
	) {
		headerComponent = (
			<div className="tw-mt-[36px] tw-mb-[20px] tw-mx-4">
				<div className="tw-w-full tw-flex tw-justify-center tw-items-center">
					<ImageLoading
						data={{
							url: prescriptionStatus == 'ACCEPT' ? ApprovePrescription : RejectPrescription,
						}}
						classNameContainer={`tw-relative ${
							prescriptionStatus == 'ACCEPT'
								? '!tw-w-[126px] !tw-h-[82px]'
								: '!tw-w-[88px] !tw-h-[78px]'
						}`}
					/>
				</div>
				<p className="title-20-medium tw-text-center tw-mx-4 tw-my-5">
					{prescriptionStatus == 'ACCEPT'
						? `Obat Disetujui dan Resep Digital Otomatis Terlampir di `
						: `Maaf, Dokter Belum Bisa meresepkan Obat Anda. Anda akan
               Kembali ke `}
					{capitalize(consulDetail?.consultationPartner)}
				</p>
			</div>
		);

		bodyComponent = (
			<>
				<div className="tw-mx-4 tw-border-t-0 tw-border-b-2 tw-border-dashed bd-gray-2"></div>
				<div className="title-16-medium tw-px-4 tw-my-[18px]">
					Konsultasi berakhir karena resep sudah terbit. Silakan beri feedback untuk dokter
				</div>
				{bodyComponent}
			</>
		);

		footerComponent = (
			<div className="tw-flex tw-flex-row tw-p-4">
				<ButtonHighlight
					text={
						consulDetail?.redirectAfter == '0' ? 'AKHIRI TELEKONSULTASI' : 'SUBMIT FEEDBACK'
					}
					classNameBtn={'tw-rounded-[8px]'}
					isDisabled={!(selected && selected?.id)}
					onClick={() => {
						if (selected && selected?.id) {
							if (consulDetail?.redirectAfter == '0') {
								handleEndConsul({ redirect: true });
							} else {
								handleEndConsul({});
								setSubmitFeedback(true);
							}
						}
					}}
				/>
			</div>
		);

		handleSwipeableOpen = () => undefined;

		if (consulDetail?.redirectAfter && submitFeedback) {
			bodyComponent = (
				<>
					<div className="body-16-regular tw-px-4 tw-my-4 tw-text-center">
						Anda akan diarahkan kembali ke {consulDetail?.consultationPartner} dalam
					</div>
					<div className="tw-text-[24px] tw-my-4 tw-text-center tw-text-red-600 tw-font-bold">
						<CountdownNumber
							duration={parseInt(consulDetail?.redirectAfter)}
							handleTimeout={async () => {
								removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
								const redirectUrl = await getLocalStorage(LOCALSTORAGE.REDIRECT_URL);
								const url = redirectUrl || consulDetail?.endUrl;
								backHandling({ backToPartner: url });
							}}
						/>
					</div>
				</>
			);
			footerComponent = <></>;
		}
	}

	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={handleSwipeableOpen}
			headerComponent={headerComponent}
			footerComponent={footerComponent}
		>
			{bodyComponent}
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	feedbackDataList: state.general.feedback.result,
});

const mapDispatchToProps = (dispatch) => ({
	getFeedbackList: (type) => dispatch(feedbackList(type)),
	endConsultation: (orderNumber, body) => dispatch(setEndConsultation(orderNumber, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetFeedback);
