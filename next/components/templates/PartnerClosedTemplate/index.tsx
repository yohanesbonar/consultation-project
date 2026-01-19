import { PartnerLogo } from '@atoms';
import { IconArrowDownBlue, IconArrowUpBlue, IconDkonsul40 } from '@icons';
import { PartnerTheme } from '@types';
import Image from 'next/image';
import React, { useState } from 'react';

interface PartnerClosedTemplateProps {
	partnerDetail?: {
		partner_logo: string;
		schedules: { days: string[]; hour_from: string; hour_to: string }[];
		partner_name?: string;
	};
	scheduleMapped?: { days: string[]; hour_from: string; hour_to: string }[];
	isExpand?: boolean;
	handleToggle?: () => void;
	ImgPartnerClosed?: { src: string };
	preview?: any;
	theme?: PartnerTheme;
	textColor?: string;
}

const PartnerClosedTemplate: React.FC<PartnerClosedTemplateProps> = ({
	partnerDetail,
	scheduleMapped,
	isExpand,
	handleToggle,
	ImgPartnerClosed,
	preview,
	theme,
	textColor,
}) => {
	const [isErrorLoadAssets, setIsErrorLoadAssets] = useState({
		closedLogo: false,
	});

	return (
		<div className="tw-px-7 tw-text-center">
			<div className="tw-flex tw-justify-center tw-mt-[97px]">
				{preview?.partnerLogo || partnerDetail?.partner_logo ? (
					<div className="tw-w-[160px] tw-h-[90px]">
						<PartnerLogo
							logoUrl={
								theme?.partnerInactivePage?.partnerLogo ?? partnerDetail?.partner_logo
							}
							classNameImgParent="tw-w-full tw-h-[72px]"
						/>
					</div>
				) : (
					<div className="tw-mt-6">
						<IconDkonsul40 />
					</div>
				)}
			</div>

			<div className="tw-w-[240px] tw-h-[240px] tw-mx-auto tw-mb-[19.39px] tw-mt-[32px]">
				<Image
					className="tw-w-full tw-h-auto tw-object-contain"
					src={
						isErrorLoadAssets?.closedLogo
							? ImgPartnerClosed.src
							: theme?.partnerInactivePage?.image ?? ImgPartnerClosed.src
					}
					alt="not-found"
					onError={() => setIsErrorLoadAssets({ ...isErrorLoadAssets, closedLogo: true })}
				/>
			</div>
			<p
				className="title-18-medium tw-mb-1"
				style={{
					...(textColor
						? {
								color: textColor,
						  }
						: {}),
				}}
			>
				Anda Berada di Luar Jam Aktif Dokter
			</p>
			<p
				className="body-14-regular tw-text-center tw-mb-1"
				style={{
					...(textColor
						? {
								color: textColor,
						  }
						: {}),
				}}
			>
				Anda mengakses telekonsultasi di luar jam aktif dokter. Telekonsultasi dokter tersedia
				pada
			</p>
			<div className="tw-w-full tw-bg-monochrome-100 tw-rounded-lg tw-mt-2 tw-border-b-1  tw-border-red-400">
				<div className="tw-px-4 tw-py-3 tw-pb-1">
					{scheduleMapped?.map((v: any, i: number) => {
						const dayString =
							v?.days?.length > 2
								? `${v?.days[0]} - ${v?.days[v?.days?.length - 1]}`
								: v?.days?.join(' & ');
						return (
							<div key={i} className="tw-flex tw-justify-between tw-items-center">
								<p className="body-14-regular tw-mb-2">{dayString}</p>
								<p className="label-14-medium tw-mb-2">
									{v?.hour_from} - {v?.hour_to} WIB.
								</p>
							</div>
						);
					})}
				</div>
				{partnerDetail?.schedules?.length > 3 ? (
					<div
						onClick={handleToggle}
						className="tw-flex tw-items-center tw-justify-start tw-px-4 tw-py-3 tw-cursor-pointer tw-border-t-[1px] tw-border-solid tw-border-monochrome-50"
					>
						<p className="label-14-medium tw-mb-0 tw-mr-2 tw-text-secondary-def">
							{isExpand ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Jadwal Lainnya'}
						</p>
						{isExpand ? <IconArrowUpBlue /> : <IconArrowDownBlue />}
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default PartnerClosedTemplate;
