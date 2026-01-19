import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconEmptyProduct } from '../../../assets';
import { DETAIL_ITEM } from '../../../helper';

type Props = {
	type?: string;
};

const SkeletonDetailItem = ({ type }: Props) => {
	const renderTitle = () => {
		return (
			<div className={'tw-flex-1 tw-px-4 tw-py-3 box-light-yellow'}>
				<p className="title-16-medium tw-z-1 tw-w-[150px]">
					<Skeleton />
				</p>
			</div>
		);
	};

	const renderProduct = () => {
		return (
			<div className="bd-gray-2 tw-border tw-rounded-[8px] tw-mx-4 tw-mb-4 tw-p-4">
				<div className="tw-flex tw-flex-1 tw-items-center">
					<IconEmptyProduct />

					<div className="tw-flex-1 tw-ml-4">
						<p className="title-16-medium tw-mb-[5px]">
							<Skeleton />
						</p>
						<p className="font-14 tw-mb-0 tx-green">
							<Skeleton />
						</p>
					</div>
				</div>
				{renderTextLabel()}
			</div>
		);
	};

	const renderTextLabel = () => {
		return (
			<div className={'tw-flex-1 tw-mt-4 '}>
				<p className="label-12-medium tw-text-tpy-700 tw-w-[100px]">
					<Skeleton />
				</p>
				<p className="label-14-medium tw-mt-2 tw-w-[200px] ">
					<Skeleton />
				</p>
			</div>
		);
	};

	const renderBody = () => {
		if (type != null && type == DETAIL_ITEM.PRODUCT) {
			return (
				<div>
					<div className="bg-gray-2 tw-m-4 tw-rounded-[8px]">
						<p className="body-16-regular tw-py-3 tw-px-4">
							<Skeleton />
							<Skeleton className=" tw-mt-2 !tw-w-[50%]" />
						</p>
					</div>
					{renderProduct()}
				</div>
			);
		} else {
			return (
				<div className="tw-mx-4 tw-pb-4">
					{renderTextLabel()}
					{renderTextLabel()}
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

export default SkeletonDetailItem;
