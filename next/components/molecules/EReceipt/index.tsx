/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { CardBox } from '../../atoms';
import {
	IconArrowDownBlue,
	IconArrowUpBlue,
	IconMedicineReject,
	IconReceiptApplied,
} from '../../../assets/index.js';
import { PRESCRIPTION_CONST } from '../../../helper';
import { PrescriptionDetailData } from '../../../types/Prescription';
import ProductItem from '../ProductItem';
import cx from 'classnames';
import styles from './index.module.css';

type Props = {
	data?: PrescriptionDetailData;
	prescriptionRef: any;
};

const EReceipt = ({ data, prescriptionRef }: Props) => {
	const [isShowingAll, setIsShowingAll] = useState(false);

	const renderEmptyPrescription = () => {
		return (
			<div className={styles.emptyContainer}>
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

	const mappingPrescription =
		data?.prescriptions?.length > 2 && !isShowingAll
			? data?.prescriptions?.slice(0, 2)
			: data?.prescriptions;

	const renderBody = () => {
		return (
			<div>
				{data?.prescriptions &&
				data?.prescriptions.length &&
				data?.status !== PRESCRIPTION_CONST?.REJECTED &&
				data?.status !== PRESCRIPTION_CONST?.PENDING
					? mappingPrescription.map((element, idx) => {
							const firstIndex = idx == 0;
							const lastIndex = idx == mappingPrescription?.length - 1;
							return (
								<div
									key={'productitem-' + idx}
									className={firstIndex || !lastIndex ? 'line-9-bottom' : ''}
								>
									<ProductItem data={element} className={cx('tw-px-4 tw-my-4')} />
								</div>
							);
					  })
					: renderEmptyPrescription()}
				{data?.prescriptions &&
				data?.prescriptions?.length > 2 &&
				data?.status !== PRESCRIPTION_CONST?.REJECTED &&
				data?.status !== PRESCRIPTION_CONST?.PENDING ? (
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
		<CardBox
			containerRef={prescriptionRef}
			className={styles.cardBoxClass}
			classNameBody="!tw-px-0 !tw-py-0"
			icon={<IconReceiptApplied />}
			titleClass={'tw-bg-monochrome-100 tw-bg-black'}
			title={data?.status == PRESCRIPTION_CONST?.REJECTED ? null : 'Resep Elektronik'}
			body={renderBody()}
		/>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EReceipt);
