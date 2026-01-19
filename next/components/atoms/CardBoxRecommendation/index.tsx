import React from 'react';
import { ButtonHighlight } from '..';
import {
	IconDrugPlus,
	IconLogo,
	IconLogoVivaApotek,
	IconWarningOrange,
	IconWarningTrianglePrimary12,
} from '../../../assets/index.js';

type Props = {
	renderBody: (onlyRecommendation?: boolean) => React.JSX.Element;
	onClickDownload?: () => void;
	isNotHaveBoth: boolean;
	partnerName?: string;
};

const CardBoxRecommendation = ({
	renderBody,
	isNotHaveBoth,
	onClickDownload,
	partnerName,
}: Props) => {
	return (
		<>
			<div className="tw-flex tw-flex-col tw-m-4 tw-rounded-lg tw-border tw-border-monochrome-300 tw-border-solid">
				<div className="tw-flex tw-flex-row tw-items-center tw-mt-2 tw-mx-4">
					<IconDrugPlus />
					<div className="tw-flex tw-flex-1 title-14-medium tw-text-black tw-ml-2">
						Obat Lainnya
					</div>
				</div>
				<div className="tw-flex tw-flex-row tw-border-solid tw-border-0 tw-border-t tw-border-b tw-border-monochrome-300 tw-my-3 tw-py-3 tw-px-2 tw-bg-info-50">
					<div className="tw-text-info-def">
						<IconWarningOrange />
					</div>
					<div className="tw-flex tw-flex-1 tw-flex-col tw-ml-2">
						<div className="body-12-regular tw-text-black">
							Resep dengan obat lainnya dapat digunakan
						</div>
						<a href="#recommendation" className="label-12-medium tw-underline">
							Lihat Cara Gunakan
						</a>
					</div>
				</div>
				<div className="tw-flex tw-flex-col tw-px-4 tw-pb-4">{renderBody(true)}</div>
				<div
					id="recommendation"
					className="tw-flex tw-border-solid tw-border-0 tw-border-t tw-border-b tw-border-monochrome-300 tw-p-4"
				>
					<ButtonHighlight text="LIHAT RESEP REKOMENDASI" onClick={onClickDownload} />
				</div>
				<div className="tw-flex tw-flex-col tw-pt-4 tw-pb-4 tw-px-5 tw-bg-monochrome-150">
					<div className="title-14-medium tw-text-black">
						Cara Gunakan Resep dengan Obat Lainnya
					</div>
					<div className="tw-flex tw-flex-row tw-mt-4">
						<div className="tw-flex label-12-medium tw-bg-black tw-text-tpy-50 tw-w-5 tw-h-5 tw-rounded-full tw-items-center tw-justify-center tw-mr-2">
							1
						</div>
						<div className="body-14-regular tw-text-black tw-flex tw-flex-1">
							Klik “Lihat Resep Rekomendasi”
						</div>
					</div>
					<div className="tw-flex tw-flex-row tw-mt-4">
						<div className="tw-flex label-12-medium tw-bg-black tw-text-tpy-50 tw-w-5 tw-h-5 tw-rounded-full tw-items-center tw-justify-center tw-mr-2">
							2
						</div>
						<div className="tw-flex tw-flex-1 tw-flex-col">
							<div className="body-14-regular tw-text-black tw-flex tw-flex-1">
								Screenshot keseluruhan resep (nomor resep dan kode QR harus terlihat)
							</div>
						</div>
					</div>
					<div className="tw-flex tw-flex-row tw-mt-4">
						<div className="tw-flex label-12-medium tw-bg-black tw-text-tpy-50 tw-w-5 tw-h-5 tw-rounded-full tw-items-center tw-justify-center tw-mr-2">
							3
						</div>
						<div className="tw-flex tw-flex-1 tw-flex-col">
							<div className="body-14-regular tw-text-black tw-flex tw-flex-1">
								Pilih obat-obatan dari seller apotek partner dkonsul di {partnerName}{' '}
								berlabel:
							</div>
							<div className="tw-flex tw-flex-row tw-items-center tw-gap-2">
								<IconLogo />
								<IconLogoVivaApotek />
							</div>
						</div>
					</div>
					<div className="tw-flex tw-flex-row tw-mt-4">
						<div className="tw-flex label-12-medium tw-bg-black tw-text-tpy-50 tw-w-5 tw-h-5 tw-rounded-full tw-items-center tw-justify-center tw-mr-2">
							4
						</div>
						<div className="body-14-regular tw-text-black tw-flex tw-flex-1">
							Upload resep saat akan Checkout
						</div>
					</div>
					<div className="tw-flex tw-flex-row tw-mt-4">
						<div className="tw-ml-1 tw-mr-3 tw-mt-[-2px]">
							<IconWarningTrianglePrimary12 />
						</div>
						<div className="tw-flex tw-flex-1 tw-flex-col">
							<div className="label-11-medium tw-text-error-600">
								Gunakan Resep Elektronik dengan Bijak
							</div>
							<div className="label-11-medium tw-text-error-600 tw-font-normal">
								Resep hanya berlaku untuk 1x penggunaan. Mohon gunakan sesuai instruksi
								untuk menjaga keamanan dan efektivitas pengobatan Anda.
							</div>
						</div>
					</div>
				</div>
			</div>
			{!isNotHaveBoth ? (
				<div className="tw-w-full tw-px-4">
					<div className={'tw-w-full tw-h-[1px] tw-bg-[#D7D7D7] tw-px-4'} />
				</div>
			) : null}
		</>
	);
};

export default CardBoxRecommendation;
