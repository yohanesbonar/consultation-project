import React from 'react';

import { DETAIL_ITEM } from '../../../helper';
import {
	DetailItemData,
	Doctor,
	MedicalFacility,
	Patient,
	Prescription,
} from '../../../types/Prescription';
import { TextLabel } from '../../atoms';
import { ProductItem } from '../../molecules';

interface Props {
	data: {
		title: string;
		list: Prescription[] | MedicalFacility[] | Doctor[] | Patient[];
		partnerName?: string;
	};
	type?: string;
	hideValueByLabel?: any[];
}

const DetailItem = ({ data, type = null, hideValueByLabel = [] }: Props) => {
	const renderTitle = () => {
		return (
			<div className={'tw-flex-1 tw-px-4 tw-py-3 box-light-yellow'}>
				<p className="title-16-medium">{data?.title ?? '-'}</p>
			</div>
		);
	};
	const renderBody = () => {
		if (type != null && type == DETAIL_ITEM.PRODUCT) {
			return (
				<div>
					<div className="bg-gray-2 tw-m-4 tw-rounded-[8px]">
						<p className="body-16-regular tw-py-3 tw-px-4">
							{data?.partnerName
								? 'Resep elektronik hanya bisa ditebus ke toko yang berafiliasi dengan DKonsul di ' +
								  data?.partnerName +
								  '.'
								: ''}
						</p>
					</div>
					{data?.list?.map((element: DetailItemData, idx: number) => {
						return <ProductItem data={element as Prescription} key={'productitem-' + idx} />;
					})}
				</div>
			);
		} else {
			return (
				<div className="tw-mx-4 tw-pb-4">
					{data?.list?.map((element: DetailItemData, idx: number) => {
						if (
							hideValueByLabel.length &&
							hideValueByLabel.some((e) => e == element?.label)
						) {
							return null;
						}
						if (element?.label?.includes('patient_')) {
							return null;
						}
						if (element?.value != null && element?.value instanceof Array) {
							return (
								<div className="tw-flex-1 tw-mt-4" key={'dataList-' + idx}>
									<p className="label-12-medium tx-gray-2 ">{element.label}</p>
									{element.value.map((elementVal: string, id: number) => {
										return (
											<p className="label-14-medium tw-mt-2" key={'elementval-' + id}>
												{elementVal}
											</p>
										);
									})}
								</div>
							);
						} else {
							return <TextLabel data={element} key={'dataList-' + idx} emptyValue="-" />;
						}
					})}
				</div>
			);
		}
	};
	return (
		<div>
			<div>
				{renderTitle()}
				{renderBody()}
			</div>
		</div>
	);
};

export default DetailItem;
