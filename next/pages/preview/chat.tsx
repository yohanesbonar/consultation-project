import { PreviewOverlay } from '@atoms';
import { ChatTemplate } from '@templates';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';
import React from 'react';

const PreviewChat = () => {
	const router = useRouter();
	const preview = JSON.parse(decodeURIComponent(String(router?.query?.preview)));

	usePartnerInfo({ isByLocal: true });

	return (
		<>
			<PreviewOverlay />
			<ChatTemplate
				isHistory={true}
				// general = {
				// 	isPageLoading: false,
				// 	formProgress: null,
				// 	endConsultation: {
				// 		result: null,
				// 		loading: false,
				// 		error: false,
				// 		meta: { acknowledge: false },
				// 	},
				// 	networkState: {
				// 		isOnline: true,
				// 		isNeedToReconnect: false,
				// 		isDetected: true,
				// 	},
				// 	errorAlert: {
				// 		danger: false,
				// 		data: null
				// 	},
				// 	showEndConsultation: false,
				// }
				chatData={{
					status: 'STARTED',
					orderNumber: 'DK240900256',
					expiredAt: '2024-09-17T09:00:34.000Z',
					closed_at: null,
					startedAt: '2024-09-17T07:00:34.000Z',
					timeLimitPrescription: '2024-09-17T08:59:34.000Z',
					timeLimitNote: '2024-09-17T08:59:34.000Z',
					minConsultationAt: '2024-09-17T07:01:34.000Z',
					roomId:
						'consul-kq3QuAgEg0xJfvnQ5qmoMqxfqTxTwngxwJ40xLpi1J64g5tytqPVyQKLWK6FRXzU5SGZjJvPdAivYpZc',
					roomToken:
						'SFMyNTY.g2gDbQAAACRmZTY3N2MzOS04Y2I3LTQyMWYtYmY0Zi03ZmUyNjQ0ZjJmYTFuBgCgb8j-kQFiAAFRgA.fVHqPkW2pCS1ZQB5BWQqi4N9KCWQJwKhFzTuCQruRvw',
					chatHeaders: [
						{
							label: 'Informasi Registrasi Faskes',
							key: 'FASKES_NAME',
							name: 'Coba Faskes 1',
							image: 'https://static.ddd.co.id/image/dkonsul.png',
						},
					],
					patientData: {
						name: 'Gunawan',
						formFill: true,
						bornDate: '1990-01-01',
						age: '34 Tahun 8 Bulan',
						medicalComplaint: null,
						preexisting_allergy: 'Tidak Ada',
					},
					doctorData: {
						name: 'dr. Toma Osipov',
						photo: 'https://i.imgur.com/xcBREKj.png',
						specialization: ['Dokter Umum'],
						education: [],
					},
					messages: [
						{
							xid: 'c4de975d-6cfc-4130-b220-4adeb49236f5',
							message:
								'Salam sehat kak, saya Coba Satu akan menjawab pertanyaan Anda seputar masalah kesehatan. Apakah ada yang ingin dikonsultasikan?',
							consultationId: 132587,
							conversationId: 9437,
							orderNumber: 'DK240900256',
							memberId: '63960',
							memberName: 'Coba Satu',
							createdAt: 1726556434352,
							statusMessage: 'ACTIVE',
							type: 'TEXT',
							userType: 'DOCTOR',
							status: 'READ',
							data: null,
						},
						{
							xid: '31c467d9-2aa4-4bff-9aad-5ad512518c5a',
							message: 'Silahkan ceritakan keluhan kesehatan Anda.',
							consultationId: 132587,
							conversationId: 9437,
							orderNumber: 'DK240900256',
							memberId: '63960',
							memberName: 'Coba Satu',
							createdAt: 1726556434352,
							statusMessage: 'ACTIVE',
							type: 'TEXT',
							userType: 'DOCTOR',
							status: 'READ',
							data: null,
						},
						{
							xid: '839269c1-f640-44af-acf9-afba819bfb21',
							message: 'Salam dok, saya ada keluhan sakit perut dok',
							consultationId: 132587,
							conversationId: 9437,
							orderNumber: 'DK240900256',
							memberId: '63964',
							memberName: 'Gunawan',
							createdAt: 1726556534718,
							statusMessage: 'ACTIVE',
							type: 'TEXT',
							userType: 'PATIENT',
							status: 'DELIVERED',
							data: null,
						},
					],
					suggestPrescription: true,
					consultationUrl:
						'https://staging-snap.ddd.co.id/chat-detail?token=59eb87975134833af0a619ddef71c745fa5eb2ecee730c5de926cece9f19432d29b5ec5c70ea67200926359d74e2b50df5a89c60509ad03385229100e249a95bfa062472ab99088bd36f77ea6fc4cd657afb5e377c12b15d43ebc99e4cf1c1565f390d433028741ddbc38ef60041d9ebbb2edc51b8f5d681658d13749b1498fa95c05c83dcada8722d527fc29c5951ca__WlFNYHvbzpP6D6h5',
					consultationPartner: 'PIVOT',
					consultationType: 'RECOMMENDATION',
					ctaLabel: 'Lihat Ringkasan',
					backUrl: 'https://www.dkonsul.com/',
					endUrl: 'https://www.dkonsul.com/',
					redirectAfter: null,
				}}
				consulDetail={{
					meta: {
						acknowledge: true,
						status: 200,
						message: 'Success!',
						at: '2024-09-17T07:02:36.060Z',
					},
					data: {
						status: 'STARTED',
						orderNumber: 'DK240900256',
						expiredAt: '2024-09-17T09:00:34.000Z',
						closed_at: null,
						startedAt: '2024-09-17T07:00:34.000Z',
						timeLimitPrescription: '2024-09-17T08:59:34.000Z',
						timeLimitNote: '2024-09-17T08:59:34.000Z',
						minConsultationAt: '2024-09-17T07:01:34.000Z',
						roomId:
							'consul-kq3QuAgEg0xJfvnQ5qmoMqxfqTxTwngxwJ40xLpi1J64g5tytqPVyQKLWK6FRXzU5SGZjJvPdAivYpZc',
						roomToken:
							'SFMyNTY.g2gDbQAAACRmZTY3N2MzOS04Y2I3LTQyMWYtYmY0Zi03ZmUyNjQ0ZjJmYTFuBgCgb8j-kQFiAAFRgA.fVHqPkW2pCS1ZQB5BWQqi4N9KCWQJwKhFzTuCQruRvw',
						chatHeaders: [
							{
								label: 'Informasi Registrasi Faskes',
								key: 'FASKES_NAME',
								name: 'Klinik Lorem Ipsum',
								image: 'https://static.ddd.co.id/image/dkonsul.png',
							},
						],
						patientData: {
							name: 'Gunawan',
							formFill: true,
							bornDate: '1990-01-01',
							age: '34 Tahun 8 Bulan',
							medicalComplaint: null,
							preexisting_allergy: 'Tidak Ada',
						},
						doctorData: {
							name: 'Coba Satu',
							photo: null,
							specialization: ['Dokter Umum'],
							education: [],
						},
						messages: [
							{
								xid: 'c4de975d-6cfc-4130-b220-4adeb49236f5',
								message:
									'Salam sehat kak, saya Coba Satu akan menjawab pertanyaan Anda seputar masalah kesehatan. Apakah ada yang ingin dikonsultasikan?',
								consultationId: 132587,
								conversationId: 9437,
								orderNumber: 'DK240900256',
								memberId: '63960',
								memberName: 'Coba Satu',
								createdAt: 1726556434352,
								statusMessage: 'ACTIVE',
								type: 'TEXT',
								userType: 'DOCTOR',
								status: 'READ',
								data: null,
							},
							{
								xid: '31c467d9-2aa4-4bff-9aad-5ad512518c5a',
								message: 'Silahkan ceritakan keluhan kesehatan Anda.',
								consultationId: 132587,
								conversationId: 9437,
								orderNumber: 'DK240900256',
								memberId: '63960',
								memberName: 'Coba Satu',
								createdAt: 1726556434352,
								statusMessage: 'ACTIVE',
								type: 'TEXT',
								userType: 'DOCTOR',
								status: 'READ',
								data: null,
							},
							{
								xid: '839269c1-f640-44af-acf9-afba819bfb21',
								message: 'Salam dok, saya ada keluhan sakit perut dok',
								consultationId: 132587,
								conversationId: 9437,
								orderNumber: 'DK240900256',
								memberId: '63964',
								memberName: 'Gunawan',
								createdAt: 1726556534718,
								statusMessage: 'ACTIVE',
								type: 'TEXT',
								userType: 'PATIENT',
								status: 'DELIVERED',
								data: null,
							},
						],
						suggestPrescription: true,
						consultationUrl:
							'https://staging-snap.ddd.co.id/chat-detail?token=59eb87975134833af0a619ddef71c745fa5eb2ecee730c5de926cece9f19432d29b5ec5c70ea67200926359d74e2b50df5a89c60509ad03385229100e249a95bfa062472ab99088bd36f77ea6fc4cd657afb5e377c12b15d43ebc99e4cf1c1565f390d433028741ddbc38ef60041d9ebbb2edc51b8f5d681658d13749b1498fa95c05c83dcada8722d527fc29c5951ca__WlFNYHvbzpP6D6h5',
						consultationPartner: 'PIVOT',
						consultationType: 'RECOMMENDATION',
						ctaLabel: 'Lihat Ringkasan',
						backUrl: 'https://www.dkonsul.com/',
						endUrl: 'https://www.dkonsul.com/',
						redirectAfter: null,
					},
				}}
				chats={[
					{
						xid: 'c4de975d-6cfc-4130-b220-4adeb49236f5',
						message:
							'Salam sehat kak, saya dr. Toma Osipov akan menjawab pertanyaan Anda seputar masalah kesehatan. Apakah ada yang ingin dikonsultasikan?',
						consultationId: 132587,
						conversationId: 9437,
						orderNumber: 'DK240900256',
						memberId: '63960',
						memberName: 'Coba Satu',
						createdAt: 1726556434352,
						statusMessage: 'ACTIVE',
						type: 'TEXT',
						userType: 'DOCTOR',
						status: 'READ',
						data: {},
					},
					{
						xid: '31c467d9-2aa4-4bff-9aad-5ad512518c5a',
						message: 'Silahkan ceritakan keluhan kesehatan Anda.',
						consultationId: 132587,
						conversationId: 9437,
						orderNumber: 'DK240900256',
						memberId: '63960',
						memberName: 'Coba Satu',
						createdAt: 1726556434352,
						statusMessage: 'ACTIVE',
						type: 'TEXT',
						userType: 'DOCTOR',
						status: 'READ',
						data: {},
					},
					{
						xid: '839269c1-f640-44af-acf9-afba819bfb21',
						message: 'Salam dok, saya ada keluhan sakit perut dok',
						consultationId: 132587,
						conversationId: 9437,
						orderNumber: 'DK240900256',
						memberId: '63964',
						memberName: 'Gunawan',
						createdAt: 1726556534718,
						statusMessage: 'ACTIVE',
						type: 'TEXT',
						userType: 'PATIENT',
						status: 'DELIVERED',
						data: {},
					},
				]}
				// timeLeft?: number;
				// setTimeLeft?: (val: number) => void;
				coachmarkIndex={100}
				// onHandleChangeCoachmark?: (val: number) => void;
				// handleOnScroll?: (e: any) => void;
				// isRedeemType?: boolean;
				// unreadMsg?: number;
				// isGettingDataRef?: any;
				// initData?: (val: boolean) => void;
				// sendNewChat?: (chatTemp: any, chat: ChatItem) => void;
				// sendNewChatWithSocket?: (chatTemp: any, chat: ChatItem, isIndicator?: boolean) => void;
				// handleNewMessage?: (newChat: ChatItem) => void;
				// pushMessageById?: string | number;
				// setPushMessageById?: (val?: string | number) => void;
				// chatErrorCallback?: (id?: number | string) => void;
				// resendChat?: (element: ChatItem) => void;
				// sendAlreadyFillFormMessage?: (messages?: ChatItem[]) => void;
				// triggerScrollDown?: number;
				// addParentHeaderClassname?: string;
				// prescriptionData?: Prescription[];
				// optionalShowEndConsultation?: boolean;
				// onForceEndConsultaiton?: () => void;
				// indicator?: string;
				isPreview={true}
				preview={router?.query?.preview ? preview : null}
			/>
		</>
	);
};

export default PreviewChat;
