'use client';

import Lottie from 'lottie-react';
import Router from 'next/router';
import { CountdownTimer, Wrapper } from '../../index';
import { LOCALSTORAGE, PhoenixClient, removeLocalStorage, BUTTON_CONST } from '../../../helper';
import {
	IconDkonsul40,
	IconSearchDoctorNotFound,
	LottieSearchDoctorV2,
	ImgGeneralError,
} from '../../../assets';
import { ButtonHighlight } from '../../atoms';
import ErrorPageTemplate from '../ErrorPageTemplate';
import InfoPageTemplate from '../InfoPageTemplate';

type DataType = {
	roomId?: string;
};

type UpdateConsulStatusBodyType = {
	waiting_room?: string;
};

type SubmitOrderBodyType = {
	token: string;
};

type QueryDataType = {
	status?: boolean;
	t?: string;
	consultation_id_full?: string;
};

type OnReceivesocketBodyType = {
	token?: string;
	orderNumber?: string | number;
};

type Props = {
	updateConsulStatus: (body: UpdateConsulStatusBodyType) => void;
	backUrl?: string;
	data?: DataType;
	isLoading?: boolean;
	resetData?: () => void;
	setDuration?: (duration: number) => void;
	isCancelRef?: React.MutableRefObject<boolean>;
	submitOrder?: (body: SubmitOrderBodyType) => void;
	queryData?: QueryDataType;
	error?: boolean;
	timeLeft?: number;
	onReceiveSocket?: (body: OnReceivesocketBodyType) => void;
	duration?: number;
	isCanceled?: boolean;
	setTimeLeft?: (time: number) => void;
	isEndedRef?: React.MutableRefObject<boolean>;
	checkInit?: boolean;
	genError?: boolean;
	udpateConsultation?: () => void;
};

const SSORedirectTemplate = ({
	updateConsulStatus,
	backUrl,
	data,
	isLoading,
	resetData,
	setDuration,
	isCancelRef,
	submitOrder,
	queryData,
	error,
	timeLeft,
	onReceiveSocket,
	duration,
	isCanceled,
	setTimeLeft,
	isEndedRef,
	checkInit,
	genError,
	udpateConsultation,
}: Props) => {
	const tryagainComponent = () => {
		return (
			<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
				<IconSearchDoctorNotFound />
				<div className="tw-mx-[43px] tw-mt-[24px]">
					<p className="title-20-medium tw-mb-0 tw-text-center">
						Maaf Dokter Belum Tersedia Saat Ini
					</p>
					<p className="body-16-regular tw-mt-4 tw-mb-0 tw-text-center">
						Anda mungkin menghubungi dokter di luar jam kerja atau semua dokter sedang sibuk.
					</p>
				</div>
			</div>
		);
	};

	const tryagainComponentFooter = () => {
		return (
			<div className="absolute-bottom-16 tw-flex tw-gap-4 ">
				<ButtonHighlight
					color="grey"
					onClick={async () => {
						await updateConsulStatus({
							waiting_room: data?.roomId,
						});
						Router.push(backUrl);
					}}
					text={BUTTON_CONST.CANCEL}
					className="tw-flex-1"
				/>
				<ButtonHighlight
					isLoading={isLoading}
					text={BUTTON_CONST.TRY_AGAIN}
					onClick={() => {
						resetData();
						setDuration(1);
						isCancelRef.current = false;
						setTimeout(() => {
							if (!isCancelRef.current) {
								submitOrder({
									token: queryData.t,
									...(queryData?.consultation_id_full
										? { consultation_id_full: queryData?.consultation_id_full }
										: {}),
								});
							}
						}, 1000);
					}}
					className="tw-flex-1"
				/>
			</div>
		);
	};

	const InitialPage = () => (
		<InfoPageTemplate
			title="Tunggu sebentar ya,"
			description="Telekonsultasimu sedang disiapkan."
		/>
	);

	const OrderPage = () => {
		return (
			<>
				<div className="tw-items-center tw-justify-center tw-mt-header tw-pt-5 tw-w-full tw-flex">
					<IconDkonsul40 />
				</div>
				<div className="tw-flex-1" style={{ marginBottom: 82 }}>
					{error ? (
						tryagainComponent()
					) : timeLeft != null ? (
						timeLeft > 0 || data == null ? (
							<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
								<Lottie
									loop={true}
									autoPlay={true}
									animationData={LottieSearchDoctorV2}
									style={{ width: 200, height: 200 }}
								/>
								<div className="tw-mx-[43px] tw-mt-[32px]">
									<p className="title-20-medium tw-mb-0 tw-text-center">Mohon Menunggu</p>
									<p className="body-16-regular tw-mt-4 tw-mb-0 tw-text-center">
										Kami sedang menghubungkan dengan dokter yang tersedia.
									</p>
									{data != null && timeLeft > 0 ? (
										<p className="tw-text-tpy-700 tw-mt-9 tw-text-center">
											Menghubungkan dengan dokter dalam{' '}
											<span className="tw-text-primary-def">{timeLeft}</span>...
										</p>
									) : null}
								</div>
							</div>
						) : (
							tryagainComponent()
						)
					) : (
						<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
							<Lottie
								loop={true}
								autoPlay={true}
								animationData={LottieSearchDoctorV2}
								style={{ width: 200, height: 200 }}
							/>
							<div className="tw-mx-[43px] tw-mt-[32px]">
								<p className="title-20-medium tw-mb-0 tw-text-center">Mohon Menunggu</p>
								<p className="body-16-regular tw-mt-4 tw-mb-0 tw-text-center">
									Kami sedang menghubungkan dengan dokter yang tersedia.
								</p>
								{data != null && timeLeft > 0 ? (
									<p className="tw-text-tpy-700 tw-mt-9 tw-text-center">
										Menghubungkan dengan dokter dalam{' '}
										<span className="tw-text-primary-def">{timeLeft}</span>...
									</p>
								) : null}
							</div>
						</div>
					)}
				</div>
				<PhoenixClient
					data={data}
					onReceiveMessage={(res) => {
						onReceiveSocket(res);
						console.log('res onReceiveMessage index', res);
					}}
				/>
				<CountdownTimer
					duration={duration}
					setTimeLeft={(time) => setDuration(time)}
					updateTime={(time) => {
						if (!isCanceled) {
							setTimeLeft(time);
						}
						if (time <= 0) {
							isEndedRef.current = true;
						} else {
							if (time < 115 && time > 10 && time % 25 === 0) {
								// if mod 25 = 0, then check consultation
								udpateConsultation();
							}
						}
					}}
				/>
			</>
		);
	};
	return (
		<>
			<Wrapper
				title="Menunggu Dokter"
				header={false}
				footer={true}
				footerComponent={
					<div className="tw-m-4">
						{error
							? tryagainComponentFooter()
							: timeLeft != null &&
							  (data == null
									? timeLeft > 0 && <div></div>
									: timeLeft <= 0 || isCanceled
									? tryagainComponentFooter()
									: null)}
					</div>
				}
				additionalStyleContent={{
					overflowY: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{!checkInit && <InitialPage />}
				{checkInit && genError && (
					<ErrorPageTemplate
						type="generalError"
						image={ImgGeneralError}
						title={'Sedang Ada Perbaikan'}
						description={
							'Mohon maaf, kalo kamu kurang nyaman. Tim kami sedang memperbaikinya untukmu.'
						}
						backUrl={() => {
							removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
							Router.push(backUrl);
						}}
						backDescription={BUTTON_CONST.BACK}
					/>
				)}
				{checkInit && !genError && queryData.status && OrderPage()}
			</Wrapper>
		</>
	);
};

export default SSORedirectTemplate;
