/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
// need to check eslint
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ButtonHighlight, CardBox, ImageLoading } from '../../atoms';

import { IconEmptyImage, IconMedicine, ImgDefaultProduct } from '../../../assets/index.js';

import { Prescription } from '@types';
import { BUTTON_ID, LABEL_CONST } from 'helper';
import PopupBottomsheet from '../PopupBottomsheet';

interface Props {
	general?: { isPageLoading: boolean };
	data?: Prescription[];
	isLoading?: boolean;
}

const InitialReceipt = ({ general = { isPageLoading: true }, data, isLoading = true }: Props) => {
	const medicineMapData = data?.length > 0 ? data?.filter((med) => !med?.isRecommendation) : [];
	const [isShowBottomsheet, setIsShowBottomsheet] = useState<boolean>(false);

	const renderItem = (item: Prescription, idx: number) => {
		return (
			<div className="tw-flex gap-3 tw-mt-4 " key={'render-item-initial-receipt-' + idx}>
				<div>
					{item?.productImage ? (
						<div className="img-40">
							<ImageLoading
								data={{ url: item?.productImage }}
								classNameContainer="img-40 pos-relative rounded"
								className="img-40"
								fallbackImg={ImgDefaultProduct.src}
							/>
						</div>
					) : (
						<IconEmptyImage />
					)}
				</div>
				<div className={``}>
					<div className={`title-16-medium tx-spacing-015 `}>{item?.name}</div>
					<div className={`label-12-medium tw-text-tpy-700 tw-mt-1 `}>
						{item?.originalQty} {item?.unit || 'barang'}
					</div>
				</div>
			</div>
		);
	};

	const renderBody = (spread = false) => {
		return (
			<div className="tw-mx-4">
				<p className={'font-12 tw-font-roboto tw-text-tpy-700'}>
					Total:{' '}
					<span className="tw-text-black tw-font-roboto tw-font-medium">
						{medicineMapData?.length} jenis obat
					</span>
				</p>
				<div>
					{medicineMapData?.length
						? !spread
							? renderItem(medicineMapData[0], 0)
							: medicineMapData?.map((e: Prescription, i: number) => renderItem(e, i))
						: null}
				</div>
				{medicineMapData?.length > 1 && !spread ? (
					<div>
						<p className="tw-text-black tw-my-4 label-12-medium">
							dan {medicineMapData?.length - 1} obat lainnya
						</p>
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_CHAT_VIEW_ALL_INITIAL_RECEIPT}
							color="grey-link"
							classNameBtn="tw-py-2"
							text={`LIHAT SEMUA OBAT`}
							onClick={() => {
								setIsShowBottomsheet(true);
							}}
						/>
					</div>
				) : null}
			</div>
		);
	};
	if (general?.isPageLoading || data == null) {
		return null;
	}
	return (
		<>
			<CardBox
				className={'card-border tw-overflow-hidden tw-mt-5 tw-bg-white'}
				classNameBody="!tw-px-0"
				icon={<IconMedicine />}
				titleClass={'card-chat-gray'}
				title={LABEL_CONST.ORDERED_MEDICINE}
				body={renderBody()}
			/>
			<PopupBottomsheet
				expandOnContentDrag={false}
				isSwipeableOpen={isShowBottomsheet}
				setIsSwipeableOpen={(val: boolean) => setIsShowBottomsheet(val)}
				headerComponent={
					<p className="label-16-medium tw-mt-9 tw-mx-4 tw-text-start ">
						{LABEL_CONST.ORDERED_MEDICINE}
					</p>
				}
				footerComponent={<div></div>}
			>
				<div className="tw-mb-4">{renderBody(true)}</div>
			</PopupBottomsheet>
		</>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(InitialReceipt);
