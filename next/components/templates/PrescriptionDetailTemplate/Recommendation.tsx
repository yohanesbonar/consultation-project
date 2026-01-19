/* eslint-disable @next/next/no-img-element */
// TODO: fix these lints
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {
	IconEmptyProduct,
	IconInfoYellow,
	IconResep,
	IconScreenShot,
	ImgDefaultProduct,
} from '../../../assets/index.js';
import { CustomPopup, ImageLoading, Wrapper } from '../../../components';
import { CONSULTATION_TYPE, PAGE_ID, STATUS_CONST } from '../../../helper';

import classNames from 'classnames';
import { useRouter } from 'next/router.js';
import { connect } from 'react-redux';
import { PrescriptionDetailData } from '../../../types/Prescription';

interface Props {
	data?: PrescriptionDetailData;
	disableBackButton: boolean;
	consultationData?: any;
}

const PrescriptionRecommendation = ({ data, disableBackButton, consultationData }: Props) => {
	const router = useRouter();
	const [isShowSS, setIsShowSS] = React.useState(false);

	const renderCustomPopup = () => {
		return (
			<>
				<CustomPopup
					icon={<IconScreenShot />}
					show={isShowSS}
					title="Screenshot Resep Rekomendasi"
					desc={
						<span>
							Pastikan <span className="tw-font-bold">nomor resep dan kode QR</span>{' '}
							tertangkap dalam screenshot
						</span>
					}
					primaryButtonLabel="OKE MENGERTI"
					primaryButtonAction={() => setIsShowSS(false)}
				/>
			</>
		);
	};

	const prescLength = data?.prescriptions?.length;
	const isRejected = data?.status === STATUS_CONST.REJECTED;
	const isApproval = consultationData?.consultationType == CONSULTATION_TYPE.APPROVAL;
	const prescData = data?.prescriptions ?? [];

	const prescDateApproval = isRejected
		? prescData?.filter((e: any) => e?.is_recommendation)
		: prescData;

	const prescMapping = prescLength ? (isApproval ? prescDateApproval : prescData) : [];

	React.useEffect(() => {
		setIsShowSS(true);
	}, []);

	return (
		<Wrapper
			additionalId={PAGE_ID.PRESCRIPTION_DETAIL}
			title="Resep Rekomendasi"
			header={true}
			footer={true}
			addParentHeaderClassname="tw-z-2"
			additionalStyleContent={{}}
			disableBackButton={router?.query?.fromHealthcare ? false : disableBackButton}
			checkByQuery={true}
			onClickBack={() => {
				if (router?.query?.fromHealthcare) {
					router.back();
				} else if (consultationData?.backUrl && !router?.query?.chat) {
					router.replace(consultationData?.backUrl ?? '#');
				} else {
					router.back();
				}
			}}
			customPopupComponent={renderCustomPopup()}
		>
			<div className="tw-w-full tw-bg-white">
				<div className="tw-flex tw-items-center tw-flex-row tw-border-solid tw-border-0 tw-border-t tw-border-b tw-border-monochrome-300 tw-mb-3 tw-py-3 tw-px-2 tw-bg-info-50">
					<div className="tw-w-5 tw-mr-2">
						<IconInfoYellow />
					</div>
					<div className="body-12-regular tw-text-black">
						Resep hanya berlaku untuk pembelian dari seller apotek partner dkonsul
					</div>
				</div>
				<div className="tw-px-4 tw-flex tw-flex-row tw-border-b-1 tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-monochrome-300 tw-pb-4">
					<div className="tw-flex tw-flex-1 tw-flex-col">
						<div className={` tw-flex tw-items-center`}>
							<div className="tw-pr-3">
								<IconResep />
							</div>
							<div className="tw-text-[16px] tw-font-roboto tw-font-medium">
								Resep Elektronik
							</div>
						</div>

						<>
							<div className="tw-flex tw-flex-row tw-justify-between tw-mt-2">
								<div className="tw-text-[12px] tw-font-roboto tw-font-medium tw-text-tpy-700">
									{(String(data?.prescription_number) || '-') +
										' • ' +
										(data?.issued_at ? data?.issued_at?.replaceAll('-', ' ') : '-')}
								</div>
							</div>
						</>
					</div>
					{data?.qr_url?.length > 0 && (
						<div className="tw-rounded tw-bg-secondary-100 tw-p-1 tw-max-h-[48px] tw-max-w-[48px]">
							<img alt="qrcode" src={data?.qr_url} width={'40px'} />
						</div>
					)}
					<hr />
				</div>
				<div className="tw-pt-4 tw-px-4">
					{prescMapping?.map((item: any, i: number) => {
						return (
							<div key={i} className="tw-flex tw-items-center tw-mb-4">
								<div className="tw-mr-4">
									{item?.productImage ? (
										<div className="img-40">
											<ImageLoading
												alt="product"
												data={{ url: item?.productImage ?? ImgDefaultProduct.src }}
												classNameContainer="img-40 tw-relative tw-rounded-[8px]"
												className="img-40 tw-rounded-[8px]"
												fallbackImg={ImgDefaultProduct.src}
											/>
										</div>
									) : (
										<IconEmptyProduct />
									)}
								</div>
								<div>
									<div className="title-14-medium">{item?.name}</div>
									<div className="label-12-medium tw-text-success-def">
										{item?.doseTag}
									</div>
									<div className="body-12-regular tw-text-tpy-700 tw-capitalize">
										{item?.time?.map((t: any) => t?.name)?.join(', ')}
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div className="tw-flex tw-px-4 tw-justify-between tw-items-center tw-border-y-1 tw-border-x-0 tw-border-solid  tw-border-monochrome-300 tw-py-2">
					<div className="label-14-medium tw-text-tpy-700">Resep berlaku hingga</div>
					<div className="label-14-medium tw-text-error-600">{data?.expired_at ?? '-'}</div>
				</div>
				<div className="tw-px-4">
					{data?.doctor?.map((doctor: any, i: number) => {
						return (
							<div
								className={classNames(
									'tw-mb-1',
									i === 0 ? 'label-14-medium tw-mt-4' : 'label-12-medium tw-text-tpy-700',
								)}
								key={i}
							>
								{doctor?.value}
							</div>
						);
					})}
					{data?.patient?.map((patient: any, i: number) => {
						return (
							<div
								className={classNames(
									'tw-mb-1',
									i === 0 ? 'label-14-medium tw-mt-4' : 'label-12-medium tw-text-tpy-700',
								)}
								key={i}
							>
								{patient?.value}
							</div>
						);
					})}
				</div>
			</div>
		</Wrapper>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionRecommendation);
