/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { BUTTON_ID, DETAIL_ITEM, checkIsEmpty, getConsulUser } from '../../../helper';
import { ButtonHighlight, ImageLoading } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { BGProfile, PasienOffRound } from '../../../assets';
import { DoctorType, PatientType } from '@types';

type DataType = {
	desc?: string;
	value?: null | string | number | string[];
	type?: string;
};

type Props = {
	isSwipeableOpen?: boolean;
	setIsSwipeableOpen?: (val: boolean) => void;
	setActiveTab?: (idx: number) => void;
	activeTab?: number;
};

const PopupBottomsheetDetailChat = ({
	isSwipeableOpen = false,
	setIsSwipeableOpen = (_val: boolean) => {},
	setActiveTab = (_idx) => {},
	activeTab = 0,
}: Props) => {
	const [doctorData, setDoctorData] = useState<DataType[]>([]);
	const [patientData, setPatientData] = useState<DataType[]>([]);

	useEffect(() => {
		if (!isSwipeableOpen) {
			setTimeout(() => setActiveTab(0), 500);
		}
	}, [isSwipeableOpen]);

	useEffect(() => {
		if (isSwipeableOpen) {
			getData();
		}
	}, [isSwipeableOpen, activeTab]);

	const getData = async () => {
		const res = await getConsulUser(global.orderNumber, activeTab == 0 ? 'doctor' : 'patient');
		if (activeTab == 0) {
			setDoctor(res?.data);
		} else {
			setPatient(res?.data);
		}
	};

	const setPatient = (params: PatientType) => {
		setPatientData([
			{ desc: 'Nama Pasien', value: params?.name },
			{
				desc: 'Usia pasien',
				value: params?.age,
			},
			{
				desc: 'Gender pasien',
				value:
					params?.gender == 'MALE'
						? 'Laki Laki'
						: params?.gender == 'FEMALE'
						? 'Perempuan'
						: null,
			},
			// {
			// 	desc: 'Pekerjaan',
			// 	value: params?.occupation,
			// },
			{
				desc: 'Alamat pasien',
				value: params?.address,
			},
			// {
			// 	desc: 'Tinggi Badan pasien',
			// 	value: params?.bodyHeight ? params?.bodyHeight + ' cm' : null,
			// },
			// {
			// 	desc: 'Berat Badan pasien',
			// 	value: params?.bodyWeight ? params?.bodyWeight + ' kg' : null,
			// },
			// {
			// 	desc: 'Keluhan',
			// 	value: params?.medicalComplaint,
			// },
			// {
			// 	desc: 'Obat yang biasa diminum',
			// 	value: params?.oftenUsedMedication,
			// },
			{
				desc: 'Riwayat Alergi Obat',
				value: params?.preexistingAllergy,
			},
		]);
	};

	const setDoctor = (params: DoctorType) => {
		setDoctorData([
			{
				type: DETAIL_ITEM.IMAGE,
				value: params?.photo,
			},
			{ desc: 'Nama Dokter', value: params?.name || '-' },
			{ desc: 'Spesialisasi', value: params?.specialization || '-' },
			{
				desc: 'Durasi Pengalaman Kerja',
				value: params?.experienceYears ? params?.experienceYears + ' Tahun' : '-',
			},
			{
				desc: 'Lokasi Praktek',
				value: params?.practiceLocation || '-',
			},
			{
				desc: 'Pendidikan',
				value: checkIsEmpty(params?.education) ? '-' : params?.education,
			},
			{
				desc: 'Nomor STR',
				value: params?.str || '-',
			},
			{
				desc: 'Nomor SIP',
				value: params?.sip || '-',
			},
		]);
	};

	const renderDataItemDetailData = (element, id) => {
		if (element?.value != null && element?.value instanceof Array) {
			return (
				<div className="tw-flex-1 tw-mt-4" key={id}>
					<p className="label-12-medium tw-text-tpy-700">{element.desc}</p>
					{element.value.map((elementVal, id) => {
						return (
							<p className="label-14-medium tw-mt-2 text-break" key={id}>
								{elementVal}
							</p>
						);
					})}
				</div>
			);
		} else if (element.type == DETAIL_ITEM.IMAGE) {
			return (
				<div
					className="img-fit-cover tw-rounded-[16px] tw-overflow-hidden tw-relative tw-w-full img-16-9"
					style={{
						backgroundImage: `url(${BGProfile.src})`,
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
					}}
					key={id}
				>
					<div className="tw-h-full tw-flex tw-justify-center tw-items-center ">
						{element.value ? (
							<ImageLoading
								data={{ url: element.value }}
								classNameContainer="!tw-w-[40%] !tw-h-[70%] tw-rounded-[50%] tw-relative tw-overflow-hidden"
							/>
						) : (
							<ImageLoading
								data={{ url: PasienOffRound.src }}
								classNameContainer="!tw-w-[40%] !tw-h-[70%] tw-rounded-[50%] tw-relative tw-overflow-hidden"
							/>
						)}
					</div>
				</div>
			);
		} else {
			return (
				<div className="tw-flex-1 tw-mt-4" key={id}>
					<p className="label-12-medium tw-text-tpy-700">{element.desc}</p>
					{element.value ? (
						<p className="label-14-medium tw-mt-2 text-break">{element.value}</p>
					) : (
						<p className="label-14-medium tw-mt-2 tx-red">Belum diisi</p>
					)}
				</div>
			);
		}
	};

	return (
		<PopupBottomsheet
			isSwipeableOpen={isSwipeableOpen}
			setIsSwipeableOpen={(isOpen) => {
				setIsSwipeableOpen(isOpen);
				if (!isOpen) {
					setActiveTab(0);
				}
			}}
			headerComponent={
				<Nav tabs className="tw-flex tw-flex-1 tw-mt-[26px] box-shadow-bottom">
					<NavItem className="tw-flex-1">
						<NavLink
							id={BUTTON_ID.BUTTON_BOTTOMSHEET_TAB_DOCTOR}
							className={activeTab == 0 ? 'active' : 'tx-gray-3'}
							onClick={() => setActiveTab(0)}
						>
							INFORMASI DOKTER
						</NavLink>
					</NavItem>
					<NavItem className="tw-flex-1 tw-items-center">
						<NavLink
							id={BUTTON_ID.BUTTON_BOTTOMSHEET_TAB_PATIENT}
							className={activeTab == 1 ? 'active' : 'tx-gray-3'}
							onClick={() => setActiveTab(1)}
						>
							INFORMASI PASIEN
						</NavLink>
					</NavItem>
				</Nav>
			}
			footerComponent={
				<ButtonHighlight
					id={BUTTON_ID.BUTTON_BOTTOMSHEET_DETAIL_CLOSE}
					className="tw-p-4"
					onClick={() => setIsSwipeableOpen(false)}
					text="TUTUP"
				/>
			}
		>
			<div className="tx-black tw-h-[70vh] tw-overflow-y-auto">
				<TabContent activeTab={activeTab}>
					<TabPane tabId={0}>
						<div className="tw-p-4">
							{doctorData?.map((element, id) =>
								renderDataItemDetailData(element, 'doctorData_' + id),
							)}
						</div>
					</TabPane>
					<TabPane tabId={1}>
						<div className="tw-p-4">
							{patientData?.map((element, id) =>
								renderDataItemDetailData(element, 'patientData_' + id),
							)}
						</div>
					</TabPane>
				</TabContent>
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetDetailChat;
