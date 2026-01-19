/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
// need to check eslint
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CardBox, ImageLoading } from '../../atoms';

import { ButtonHighlight } from '../../atoms';
import {
	IconReceiptApplied,
	IconReceiptNotApplied,
	IconEmptyImage,
	ImgDefaultProduct,
	IconInfoYellow,
	IconMedicineReject,
	IconMoreHorizontal,
} from '../../../assets/index.js';

import {
	BUTTON_ID,
	CONSULTATION_TYPE,
	checkIfExpired,
	encryptData,
	navigateWithQueryParams,
} from '../../../helper';
import { useRouter } from 'next/router';
import cx from 'classnames';
import classNames from 'classnames';

interface Props {
	general?: { timeLeft: any };
	detailReceipt?: {
		statusMessage?: string;
		createdAt?: any;
		data?: { data_medicine: any; status: string; note_status: string };
	};
	prescriptionRef?: MutableRefObject<any>;
	scrollToType?: (param: string) => void;
	typePrescription?: any;
	onClickMoreItems?: any;
}

const Receipt = ({
	general,
	detailReceipt,
	prescriptionRef = useRef(null),
	scrollToType,
	typePrescription,
	onClickMoreItems,
}: Props) => {
	const router = useRouter();
	const [updated, setUpdated] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const [isHaveUpdatePrescription, setIsHaveUpdatePrescription] = useState(false);
	const isCheckingExpiredRef = useRef<boolean>(false);

	useEffect(() => {
		detailReceipt?.statusMessage == 'EXPIRED' && setUpdated(true);
	}, [detailReceipt?.statusMessage]);

	useEffect(() => {
		checkQuantity(detailReceipt?.data?.data_medicine ?? []);
	}, [detailReceipt]);

	const checkQuantity = (data: any[]) => {
		data.forEach((element) => {
			if (element?.update_qty_reason_id) {
				setIsHaveUpdatePrescription(true);
			}
		});
	};

	useEffect(() => {
		if (!isCheckingExpiredRef.current && detailReceipt != null) {
			isCheckingExpiredRef.current = true;
			setIsExpired(checkIfExpired(detailReceipt?.createdAt));
			setTimeout(() => {
				isCheckingExpiredRef.current = false;
			}, 60000);
		}
	}, [general?.timeLeft]);

	const medicineOnChat =
		detailReceipt?.data?.data_medicine?.filter((v: any) => v?.qty !== '0') || [];

	const isHaveRecommendation = detailReceipt?.data?.data_medicine?.some(
		(medicine) => medicine.is_recommendation === true,
	);

	const infoText = useMemo(() => {
		if (detailReceipt?.data?.status?.toUpperCase() == 'ACCEPT') {
			if (isHaveUpdatePrescription && !isHaveRecommendation)
				return 'Terdapat penyesuaian obat dipesan';
			if (isHaveUpdatePrescription && isHaveRecommendation)
				return 'Terdapat penyesuaian obat dipesan dan rekomendasi obat lain';
			if (!isHaveUpdatePrescription && isHaveRecommendation)
				return 'Terdapat rekomendasi obat lain';
		}

		return null;
	}, [isHaveRecommendation, isHaveUpdatePrescription]);

	const body = (
		<div ref={prescriptionRef}>
			{detailReceipt?.data?.status?.toUpperCase() == 'ACCEPT' && (
				<>
					<div className={cx(updated && 'tw-opacity-30')}>
						<div>
							{medicineOnChat
								.filter((val: any) => val?.is_recommendation !== true)
								.map((val: any, i: number) => {
									return (
										<div key={i} className="tw-flex tw-gap-3 tw-pb-4">
											<div>
												{val?.image ? (
													<div className="tw-w-10 tw-h-10">
														<ImageLoading
															data={{ url: val?.image }}
															classNameContainer="tw-w-10 tw-h-10 tw-relative tw-rounded"
															className="tw-w-10 tw-h-10"
															fallbackImg={ImgDefaultProduct.src}
														/>
													</div>
												) : (
													<IconEmptyImage />
												)}
											</div>
											<div
												className={`${updated ? 'tw-grayscale tw-line-through' : ''}`}
											>
												<div className={`label-16-medium tw-break-all`}>
													{val?.medicine_name}
												</div>
												<div className={`body-14-regular tw-text-success-def `}>
													{val?.frequency || '0'}x / {val?.daily_weekly?.shortName} •{' '}
													{val?.medicine_consumption_time?.name}
												</div>
											</div>
										</div>
									);
								})}
						</div>
						{!updated &&
							(isHaveUpdatePrescription || isHaveRecommendation) &&
							typePrescription == CONSULTATION_TYPE.APPROVAL && (
								<div className="tw-flex tw-bg-info-50 tw-flex-row tw-items-center tw-mb-4 tw-rounded-xl tw-p-2">
									<IconInfoYellow />
									<div className={`tw-flex-1 tw-ml-2 body-12-regular tw-text-black`}>
										{infoText}
									</div>
								</div>
							)}
					</div>

					<div>
						<ButtonHighlight
							id={
								updated
									? BUTTON_ID.BUTTON_CHAT_PRESCRIPTION_SEE_CHANGES
									: BUTTON_ID.BUTTON_CHAT_PRESCRIPTION_DETAIL
							}
							color="grey"
							text={`${updated ? 'LIHAT TERBARU' : 'LIHAT DETAIL RESEP'}`}
							onClick={async () => {
								if (updated) {
									return scrollToType('PRESCRIPTION');
								} else {
									return navigateWithQueryParams(
										'/prescription-detail',
										{
											id: await encryptData(global?.orderNumber),
											chat: 1,
											...router?.query,
										},
										'href',
									);
								}
							}}
							classNameBtn="tw-bg-monochrome-100"
							childrenClassName="label-14-medium"
						/>
					</div>
				</>
			)}
			{detailReceipt?.data?.status?.toUpperCase() == 'REJECT' && (
				<>
					<div>
						<div className="tw-flex tw-flex-row">
							<IconMedicineReject />
							<div className="tw-flex-1 tw-ml-4">
								<div
									className={`title-14-medium tw-text-error-def ${
										updated ? 'gray-scale text-decoration-line-through' : ''
									}`}
								>
									Obat pasien tidak disetujui
								</div>
								<div
									className={`body-12-regular tw-text-tpy-def ${
										updated ? 'gray-scale text-decoration-line-through' : ''
									}`}
								>
									{detailReceipt?.data?.note_status}
								</div>
							</div>
						</div>
						{!updated &&
							isHaveRecommendation &&
							typePrescription == CONSULTATION_TYPE.APPROVAL && (
								<div
									className={`tw-items-center tw-flex box-light-yellow tw-mb-4 tw-rounded-xl tw-p-2 tw-mt-4`}
								>
									<IconInfoYellow />
									<div className={`tw-ml-2 tw-text-center body-12-regular tx-black`}>
										Terdapat rekomendasi obat lain
									</div>
								</div>
							)}
					</div>
					{(updated ||
						(isHaveRecommendation && typePrescription == CONSULTATION_TYPE.APPROVAL)) && (
						<div className={classNames(updated ? 'tw-mt-4' : '')}>
							<ButtonHighlight
								id={
									updated
										? BUTTON_ID.BUTTON_CHAT_PRESCRIPTION_SEE_CHANGES
										: BUTTON_ID.BUTTON_CHAT_PRESCRIPTION_DETAIL
								}
								color="grey"
								text={`${updated ? 'LIHAT TERBARU' : 'LIHAT DETAIL RESEP'}`}
								onClick={async () => {
									if (updated) {
										return scrollToType('PRESCRIPTION');
									} else {
										return navigateWithQueryParams(
											'/prescription-detail',
											{
												id: await encryptData(global?.orderNumber),
												chat: 1,
												...router?.query,
											},
											'href',
										);
									}
								}}
								classNameBtn="tw-bg-monochrome-100"
								childrenClassName="label-14-medium"
							/>
						</div>
					)}
				</>
			)}
		</div>
	);

	const renderMoreAction = () => {
		if (!onClickMoreItems) return null;
		return (
			<div onClick={onClickMoreItems} className="tw-ml-2 tw-cursor-pointer">
				<IconMoreHorizontal />
			</div>
		);
	};

	return (
		<>
			<CardBox
				className="tw-rounded-lg tw-opacity-100 tw-shadow-sm tw-overflow-hidden tw-bg-white"
				icon={isExpired ? <IconReceiptNotApplied /> : <IconReceiptApplied />}
				titleClass={
					updated
						? 'tw-bg-monochrome-300 tw-text-tpy-700 tw-grayscale'
						: 'tw-bg-monochrome-100 tw-text-black ' + (isExpired ? ' tw-text-error-def' : '')
				}
				title={
					isExpired
						? 'Resep Elektronik Tidak Berlaku'
						: updated
						? 'Resep Elektronik Diubah'
						: 'Resep Elektronik'
				}
				body={body}
				renderMoreAction={renderMoreAction}
			/>
		</>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);
