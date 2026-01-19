import { upperFirst } from 'lodash';
import React from 'react';
import { IconEmptyProduct, ImgDefaultProduct } from '../../../assets';
import { Prescription } from '../../../types/Prescription';
import { ImageLoading, TextLabel } from '../../atoms';

interface Props {
	data: Prescription;
	className?: string;
}

const ProductItem = ({ data, className }: Props) => {
	const getTimesConsumption = () => {
		const length = data?.time?.length ?? 0;
		let times = data?.time && length ? ' • ' : '';
		for (let index = 0; index < data?.time?.length; index++) {
			const element =
				data?.time[index]?.name + (length > index && index < length - 1 ? ', ' : '');
			times += upperFirst(element.toLowerCase());
		}
		return times;
	};
	return (
		<div className={className ?? 'tw-border-monochrome-50 tw-border tw-rounded-[8px] tw-mx-4'}>
			<div className="tw-flex tw-flex-1 tw-items-center">
				{data?.productImage ? (
					<div className="tw-w-10 tw-h-10">
						<ImageLoading
							alt="product"
							data={{ url: data?.productImage ?? ImgDefaultProduct.src }}
							classNameContainer="tw-w-10 tw-h-10 tw-relative tw-rounded-[8px]"
							className="tw-w-10 tw-h-10 tw-rounded-[8px]"
							fallbackImg={ImgDefaultProduct.src}
						/>
					</div>
				) : (
					<IconEmptyProduct />
				)}

				<div className="tw-flex-1 tw-ml-4">
					<p className="title-14-medium tw-mb-[5px]">{data?.name}</p>
					<p className="label-12-medium tw-mb-0 tw-text-tpy-700">
						{(data?.qty ?? '-') + (data?.unit ? ' • ' + data?.unit : '')}
					</p>
				</div>
			</div>
			<TextLabel
				data={{
					label: 'Dosis',
					value: data?.doseTag + getTimesConsumption(),
				}}
			/>
			<TextLabel
				data={{
					label: 'Catatan',
					value: data?.notes && data?.notes != '' ? data?.notes : '-',
				}}
			/>
		</div>
	);
};
export default ProductItem;
