/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from 'react';
import cx from 'classnames';
import { PrescriptionDetailData } from '@types';
import { PRESCRIPTION_CONST } from 'helper';

interface Props {
	data?: PrescriptionDetailData;
	className?: string;
	icon?: React.ReactNode;
	title?: string | React.ReactNode;
	titleClass?: string;
	body?: React.ReactNode;
	classNameBody?: string;
	containerRef?: any;
	type?: 'resepElektronik' | 'catatanPasien' | 'rekomendasi';
}

const CardBox = ({
	data,
	className,
	icon,
	title,
	titleClass = 'card-chat-gray',
	body,
	classNameBody,
	containerRef,
	type,
}: Props) => {
	const isNotHaveBoth = useMemo(
		() =>
			(!data?.prescriptions ||
				!data?.prescriptions?.length ||
				(!data?.prescriptions?.some((e) => e?.is_recommendation) &&
					data?.status == PRESCRIPTION_CONST.REJECTED)) &&
			(!data?.medicalNote?.diagnoses || !data?.medicalNote?.diagnoses?.length),
		[data],
	);
	return (
		<div
			className={cx(className, type === 'rekomendasi' ? 'tw-bg-custom-gradient-1' : '')}
			style={{ width: '100%' }}
			ref={containerRef}
		>
			{data?.status == PRESCRIPTION_CONST.REJECTED && (
				<div className={'tw-py-4 ' + classNameBody}>{body}</div>
			)}
			{data?.status === PRESCRIPTION_CONST.REJECTED && (
				<div
					className={cx(
						type !== 'catatanPasien' && !isNotHaveBoth
							? 'tw-w-full tw-h-[1px] tw-bg-[#D7D7D7] tw-mb-4'
							: '',
					)}
				/>
			)}
			<div className="tw-flex tw-flex-row">
				<div className="tw-flex tw-flex-1 tw-flex-col">
					{title && (
						<div className={`${titleClass} tw-flex tw-items-center`}>
							<div className="tw-pr-3">{icon}</div>
							<div className="tw-text-[16px] tw-font-roboto tw-font-medium">
								{title}
								{type === 'rekomendasi' && (
									<div className="tw-flex-1 tw-text-[12px] tw-font-roboto tw-font-regular tw-text-tpy-700">
										Anda dapat pilih obat berikut nantinya untuk atasi keluhan Anda
									</div>
								)}
							</div>
						</div>
					)}

					{type === 'resepElektronik' && data?.qr_url?.length > 0 && (
						<>
							<div className="tw-flex tw-flex-row tw-justify-between tw-mt-2">
								<div className="tw-text-[12px] tw-font-roboto tw-font-medium w-text-tpy-700">
									{(String(data?.prescription_number) || '-') +
										' • ' +
										(data?.issued_at ? data?.issued_at?.replaceAll('-', ' ') : '-')}
								</div>
							</div>
						</>
					)}
				</div>
				{type === 'resepElektronik' && data?.qr_url?.length > 0 && (
					<div className="tw-rounded tw-bg-secondary-100 tw-p-1 tw-max-h-[48px] tw-max-w-[48px]">
						<img alt="qrcode" src={data?.qr_url} width={'40px'} />
					</div>
				)}
			</div>

			{type === 'resepElektronik' && data?.status != PRESCRIPTION_CONST.REJECTED && (
				<div className="tw-w-full tw-h-[1px] tw-bg-monochrome-500 tw-my-2" />
			)}

			{isNotHaveBoth && type == 'resepElektronik' ? (
				<div className={'tw-w-full tw-h-[1px] tw-bg-monochrome-300 tw-my-4'} />
			) : null}
			{data?.status != PRESCRIPTION_CONST.REJECTED && (
				<div className={'tw-py-4 ' + classNameBody}>{body}</div>
			)}
			{data?.status !== PRESCRIPTION_CONST.REJECTED && (
				<div
					className={cx(
						type !== 'catatanPasien' && !isNotHaveBoth
							? 'tw-w-full tw-h-[1px] tw-bg-monochrome-300 tw-mb-[-16px]'
							: '',
					)}
				/>
			)}
		</div>
	);
};
export default CardBox;
