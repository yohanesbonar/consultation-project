import { PreviewOverlay } from '@atoms';
import { PrescriptionDetailTemplate } from '@templates';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from 'redux/actions';

const PreviewPrescriptionDetail = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setTheme(null, false, false));
	}, []);

	return (
		<>
			<PreviewOverlay />
			<PrescriptionDetailTemplate
				token="SFMyNTY.g2gDbQAAACRmZTY3N2MzOS04Y2I3LTQyMWYtYmY0Zi03ZmUyNjQ0ZjJmYTFuBgDYOWoCkgFiAAFRgA.GDJ7jTFm-37661BCDPWqQhfTq2Kn-8r9rP8U3V1BjCo"
				data={{
					id: 219950,
					status: 'ACCEPTED',
					expired_at: '13-September-2024',
					issued_at: '12-September-2024',
					reject_reason: null,
					prescription_number: 'PR-PK240906634',
					partnerName: 'Notification Onboard',
					prescriptionStatus: 'INVALID',
					prescriptions: [
						{
							id: 306024,
							name: 'NEURALGIN RX KAPLET',
							productId: '29866',
							productUrl: 'neuralgin-rx-kaplet',
							productImage:
								'https://assets.goa.com/mediums/neuralgin-rx-kaplet_1-79.jpg',
							merchantName: 'Apotek Berkah Medica',
							qty: 1,
							originalQty: 1,
							price: 1294,
							unit: '1 KAPLET SALUT SELAPUT',
							medicineConsumptionTime: {
								id: 2,
								name: 'Setelah Makan',
							},
							dailyWeekly: {
								id: 1,
								name: 'Harian',
							},
							notes: '',
							time: [
								{
									id: 0,
									name: 'PAGI',
								},
								{
									id: 2,
									name: 'MALAM',
								},
							],
							enabler_name: null,
							frequency: '2',
							transaction_qty: 1,
							is_recommendation: 0,
							priceTag: 'Rp. 1.294 - 1 Per 1 KAPLET SALUT SELAPUT',
							isRecommendation: false,
							doseTag: '2X / hari • Setelah Makan',
						},
					],
					updatedPrescriptions: [],
					no_seamless: false,
					transaction_xid: '45ea9a91-e277-472a-8b6c-2653ccadb440',
					checkout_instant_success: 1,
					submit_redeem: false,
					contact_url:
						'https://wa.me/6281399969269?text=Hai%20Tim%20DKonsul,%20Saya%20ingin%20menebus%20obat%20di%20dalam%20resep%20saya,%20mohon%20dibantu%20ya,%20ini%20nomer%20ordernya%20PR-DK240900006.%20Terima%20kasih.',
					medicalNote: {
						advice: 'Sarab',
						resume: 'Tidak Ada',
						diagnoses: ['Typhoid fever, unspecified', 'Typhoid fever with heart involvement'],
					},
					medical_facility: [
						{
							label: 'Nama Fasilitas Kesehatan',
							value: 'Onboard Notification Internal Only',
						},
						{
							label: 'Alamat Fasilitas Kesehatan',
							value: 'Jl. Boulevard Bintaro Jaya Blok B7/B1.5 No.7, Pd. Jaya, Kec. Pd. Aren, Kota Tangerang Selatan, Banten 15220, Pondok Aren, Tangerang Selatan, Banten 15220',
						},
						{
							label: 'Nomor Resep',
							value: 'PR-PK240906634',
						},
						{
							label: 'Tanggal Dikeluarkan',
							value: '12-September-2024',
						},
						{
							label: 'Tanggal Kadaluarsa',
							value: '13-September-2024',
						},
					],
					doctor: [
						{
							label: 'Nama Dokter',
							value: 'Zayn Xiu',
						},
						{
							label: 'Spesialisasi',
							value: ['Dokter Umum', 'Spesialis Bedah Anak'],
						},
						{
							label: 'Nomor Surat Izin Praktik',
							value: '12345',
						},
					],
					patient: [
						{
							label: 'Nama Pasien',
							value: 'Bagus',
						},
						{
							label: 'Jenis Kelamin',
							value: 'LAKI-LAKI',
						},
						{
							label: 'Usia',
							value: '34 Tahun 8 Bulan',
						},
					],
					patient_data: {
						patient_phonenumber: '6287739905644',
						patient_address:
							'Titan Center, Jalan Boulevard Bintaro Jaya, Pondok Jaya, Kota Tangerang Selatan, Banten, Indonesia',
						patient_detail_address: null,
						patient_longitude: '106.7261941',
						patient_latitude: '-6.280483599999999',
						patient_postal_code: '15220',
					},
					order_token:
						'd99add8c17b416d04e8905bbd1365402a74a3df9022f657ffadcab5006003447144f673ae96e3ffcb9dd3a1e0180d35e6556e5087ed51d8c6d1e17b86b5bf5cffc91610a9cc74802fc10ad788fec20d972f9aa34c34d43121db4a1ca60c6d91b__inHWa95FnjDOeIF7',
					transaction_products: [
						{
							name: 'NEURALGIN RX KAPLET',
							productId: '29866',
							productUrl: 'neuralgin-rx-kaplet',
							productImage:
								'https://assets.goa.com/mediums/neuralgin-rx-kaplet_1-79.jpg',
							merchantName: 'Apotek Berkah Medica',
							qty: 1,
							originalQty: 1,
							price: 1294,
						},
					],
				}}
				consultationData={{
					status: 'COMPLETED',
					orderNumber: 'PR-DK240900006',
					expiredAt: '2024-09-12T02:02:53.000Z',
					closed_at: '2024-09-12T01:49:03.000Z',
					chatHeaders: [
						{
							label: 'Informasi Registrasi Faskes',
							key: 'FASKES_NAME',
							name: 'Onboard Notification Internal Only',
							image: 'https://static.ddd.co.id/image/dkonsul.png',
						},
					],
					doctorData: {
						name: 'Zayn Xiu',
						photo: 'https://static.ddd.co.id/image/profile/afe2c17c694b0e092d4cfe31b62d21f9.jpg',
						specialization: ['Dokter Umum', 'Spesialis Bedah Anak'],
						education: ['Doktor'],
					},
					patientData: {
						name: 'Bagus',
						email: 'muhammad.ishak@ptgue.com',
						gender: 'MALE',
						address:
							'Monas, Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia',
						occupation: null,
						preexistingAllergy: null,
						bornDate: '2020-02-05',
						age: '4 Tahun 1 Bulan',
					},
					suggestPrescription: true,
					waitingRoom:
						'3ZrrazYW6onHHMIFiuJxm1Wrcc9AOElocr2bKjfrMSWpTKJs18LEyfpYCknyI0JTfFZcHig9scPHbsMm',
					tokenRoom:
						'SFMyNTY.g2gDbQAAACRmZTY3N2MzOS04Y2I3LTQyMWYtYmY0Zi03ZmUyNjQ0ZjJmYTFuBgDYOWoCkgFiAAFRgA.GDJ7jTFm-37661BCDPWqQhfTq2Kn-8r9rP8U3V1BjCo',
					consultationPartner: 'PIVOT',
					consultationType: 'RECOMMENDATION',
					ctaLabel: 'Lihat Ringkasan',
					backUrl: '',
					endUrl: '',
					redirectAfter: null,
					messages: [],
				}}
				isRedeemType={false}
				disableBackButton={false}
				isExpired={false}
				timeLeft={0}
				isOpenInfoBottomsheet={false}
				setTimeLeft={() => {
					//
				}}
				setIsOpenInfoBottomsheet={() => {
					//
				}}
				confirmationButtonData={null}
				setConfirmationButtonData={() => {
					//
				}}
				sendResponse={() => {
					//
				}}
				preview={
					router?.query?.preview
						? JSON.parse(decodeURIComponent(String(router?.query?.preview)))
						: null
				}
			/>
		</>
	);
};

export default PreviewPrescriptionDetail;
