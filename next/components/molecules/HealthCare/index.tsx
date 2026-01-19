import { CardBox, ImageLoading } from '../../atoms';

import { MedicalAction } from '@types';
import classNames from 'classnames';
import { encryptData, navigateWithQueryParams } from 'helper';
import { useRouter } from 'next/router';
import {
	IconHealthCareBubbleChat,
	IconPdfGray,
	ImgDefaultHealthcare,
} from '../../../assets/index.js';
import { ButtonHighlight } from '../../atoms';
import { MutableRefObject, useEffect, useState } from 'react';

interface Props {
	id?: number;
	isChat?: boolean;
	medicalActions?: MedicalAction[];
	chatDetail?: any;
	scrollToType?: (param: string) => void;
	medicalActionRef?: MutableRefObject<any>;
	lastMedicalAction?: number;
}

const HealthCare = ({
	id,
	isChat = false,
	medicalActions = [],
	chatDetail,
	scrollToType,
	medicalActionRef,
	lastMedicalAction = -1,
}: Props) => {
	const router = useRouter();
	const [updated, setUpdated] = useState(false);

	useEffect(() => {
		chatDetail?.statusMessage == 'EXPIRED' && setUpdated(true);
	}, [chatDetail?.statusMessage]);

	const body = (
		<div className="" ref={medicalActionRef}>
			{medicalActions?.map((item: MedicalAction, i: number) => {
				return (
					<>
						<div
							key={i}
							className={classNames(
								'tw-flex tw-gap-3 tw-pb-4 last:tw-pb-0',
								isChat && (updated || chatDetail?.deleted_at) ? 'opacity-30' : '',
							)}
						>
							<div>
								<div className="img-40">
									<ImageLoading
										alt="product"
										data={{ url: item.image ?? ImgDefaultHealthcare.src }}
										classNameContainer="img-40 tw-relative tw-rounded-[8px]"
										className="img-40 tw-rounded-[8px]"
										fallbackImg={ImgDefaultHealthcare.src}
									/>
								</div>
							</div>
							<div className="">
								<div className={'label-14-medium tw-text-black tw-break-all'}>
									{item.name}
								</div>
								<div className="tw-flex tw-flex-1 tw-gap-1 tw-mt-1">
									<IconPdfGray />
									<div
										className={`tw-flex tw-flex-1 body-14-regular tw-text-black tw-break-all`}
									>
										{isChat ? item.notes : item.doctor_notes}
									</div>
								</div>
							</div>
						</div>
						{!isChat && i < medicalActions.length - 1 && (
							<div className="tw-border-0 tw-border-t-[1px] tw-border-monochrome-50 tw-border-dashed tw-mb-4"></div>
						)}
					</>
				);
			})}
			{isChat &&
				(!chatDetail?.deleted_at ||
					(chatDetail?.deleted_at && id != null && lastMedicalAction != id)) && (
					<div>
						<ButtonHighlight
							color="grey"
							text={updated ? 'LIHAT TERBARU' : 'LIHAT TINDAKAN MEDIS'}
							onClick={async () => {
								if (updated) {
									scrollToType('MEDICAL_ACTION');
								} else {
									return navigateWithQueryParams(
										'/healthcare-detail',
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
		</div>
	);

	return isChat ? (
		<>
			<CardBox
				className={'card-border overflow-hidden tw-bg-white'}
				icon={<IconHealthCareBubbleChat />}
				titleClass={'card-chat-gray '}
				title={`Saran Tindakan Medis ${
					chatDetail?.deleted_at ? 'Dihapus' : updated ? 'Diubah' : ''
				}`}
				body={body}
			/>
		</>
	) : (
		<>
			<div className="tw-flex tw-flex-col">
				<div className="tw-flex tw-gap-2 tw-p-4">
					<IconHealthCareBubbleChat />
					<div className="title-16-medium">{'Saran Tindakan Medis'}</div>
				</div>
				<div className="body-12-regular tw-px-4 tw-flex-1">
					{'Dokter menyarankan Anda melakukan pemeriksaan langsung berikut'}
				</div>
				<div className="tw-flex tw-flex-1  tw-p-4">{body}</div>
			</div>
		</>
	);
};

export default HealthCare;
