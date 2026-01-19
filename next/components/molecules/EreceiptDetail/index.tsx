/* eslint-disable @next/next/no-img-element */
import { DataChatDetail } from '@types';
import cx from 'classnames';
import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
	IconArrowDownBlue,
	IconArrowUpBlue,
	IconMedicineReject,
	IconResep,
} from '../../../assets/index.js';
import { CONSULTATION_TYPE, PRESCRIPTION_CONST } from '../../../helper';
import { PrescriptionDetailData } from '../../../types/Prescription';
import { CardBoxReceipt } from '../../atoms';
import CardBoxRecommendation from '../../atoms/CardBoxRecommendation';
import ProductItem from '../ProductItem';
import styles from './index.module.css';
import { useRouter } from 'next/router.js';

type Props = {
	data?: PrescriptionDetailData;
	prescriptionRef: any;
	consultationData?: DataChatDetail;
	isAvailablePresc?: boolean;
};

const EReceipt = ({ data, consultationData, prescriptionRef, isAvailablePresc }: Props) => {
	const [isShowingAll, setIsShowingAll] = useState(false);
	const router = useRouter();

	const isNotHaveBoth = useMemo(
		() =>
			(!data?.prescriptions ||
				!data?.prescriptions?.length ||
				(!data?.prescriptions?.some((e) => e?.is_recommendation) &&
					data?.status == PRESCRIPTION_CONST.REJECTED)) &&
			(!data?.medicalNote?.diagnoses || !data?.medicalNote?.diagnoses?.length),
		[data],
	);

	const renderEmptyPrescription = () => {
		return (
			<div className={cx('tw-mb-4', isNotHaveBoth ? '!tw-mb-0' : '')}>
				<div className="tw-flex tw-flex-row">
					<IconMedicineReject />
					<div className="tw-flex-1 tw-ml-4">
						<div className="title-14-medium tw-text-error-def">
							Obat pasien tidak disetujui
						</div>
						<div className="body-12-regular tw-text-tpy-700">
							{data?.reject_reason || 'Resep tidak diberikan oleh Dokter'}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const hasRecommendation = useMemo(() => {
		if (data?.prescriptions && data?.prescriptions?.length) {
			return data?.prescriptions?.some((e) => e?.is_recommendation);
		}
		return false;
	}, [data]);

	const renderBody = (onlyRecommendation = false) => {
		const filterExceptRecommendation = data?.prescriptions?.length
			? consultationData?.consultationType == CONSULTATION_TYPE.APPROVAL
				? data?.prescriptions?.filter((e) =>
						onlyRecommendation ? e?.is_recommendation : !e?.is_recommendation,
				  )
				: data?.prescriptions
			: [];

		const mappingPrescription =
			data?.prescriptions?.length > 2 && !isShowingAll
				? filterExceptRecommendation?.slice(0, 2)
				: filterExceptRecommendation;

		return (
			<div>
				{data?.prescriptions &&
				data?.prescriptions.length &&
				((data?.status !== PRESCRIPTION_CONST?.REJECTED &&
					data?.status !== PRESCRIPTION_CONST?.PENDING) ||
					onlyRecommendation)
					? mappingPrescription.map((element, idx) => {
							const lastIndex = idx == mappingPrescription?.length - 1;
							return (
								<div
									key={'productitem-' + idx}
									className={
										!lastIndex
											? 'tw-border-0 tw-border-b-[1.5px] tw-border-dashed tw-border-monochrome-50'
											: ''
									}
								>
									<ProductItem data={element} className={cx('tw-my-4')} />
								</div>
							);
					  })
					: renderEmptyPrescription()}
				{data?.prescriptions &&
				filterExceptRecommendation?.length > 2 &&
				((data?.status !== PRESCRIPTION_CONST?.REJECTED &&
					data?.status !== PRESCRIPTION_CONST?.PENDING) ||
					onlyRecommendation) ? (
					<div
						onClick={() => setIsShowingAll((prevState) => !prevState)}
						className={cx(styles.collapseBtn, 'line-9-top')}
					>
						<p className={cx('label-14-medium', styles.collapseLabel)}>
							{isShowingAll ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Obat Lainnya'}
						</p>

						{isShowingAll ? <IconArrowUpBlue /> : <IconArrowDownBlue />}
					</div>
				) : null}
			</div>
		);
	};
	return (
		<>
			<CardBoxReceipt
				containerRef={prescriptionRef}
				className={cx(styles.cardBoxClass, isNotHaveBoth ? 'tw-pb-0' : '')}
				classNameBody={cx('!tw-px-0 !tw-py-0')}
				icon={<IconResep />}
				titleClass={''}
				title={!data?.qr_url?.length && !isNotHaveBoth ? null : 'Resep Elektronik'}
				body={renderBody()}
				type="resepElektronik"
				data={data}
			/>
			{hasRecommendation ? (
				<CardBoxRecommendation
					isNotHaveBoth={isNotHaveBoth}
					renderBody={renderBody}
					onClickDownload={() =>
						router.push({ pathname: 'prescription-recommendation', query: router.query })
					}
					partnerName={consultationData?.consultationPartner}
				/>
			) : null}

			{data?.status == PRESCRIPTION_CONST?.REJECTED ? null : (
				<div className="tw-flex tw-flex-row tw-justify-between tw-pt-4 tw-mx-4 tw-border-0 ">
					<div className="tw-text-[12px] tw-font-roboto tw-font-medium tw-text-tpy-700">
						Resep berlaku hingga
					</div>
					<div className="tw-text-[12px] tw-font-roboto tw-font-medium tw-text-tpy-700">
						{data?.expired_at ? data?.expired_at?.replaceAll('-', ' ') : '-'}
					</div>
				</div>
			)}
		</>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EReceipt);
