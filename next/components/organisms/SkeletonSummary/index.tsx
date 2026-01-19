import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonSummary = () => {
	return (
		<div className="tw-p-4 card-border">
			{[...Array(2)].map((e, i) => (
				<div key={i} className=" tw-flex tx-black tw-items-center  tw-mb-4">
					<div className="tw-flex-1">
						<p className="label-12-medium tw-text-tpy-700">
							<Skeleton />
						</p>
						<p className="label-14-medium tw-mt-2">
							<Skeleton />
						</p>
					</div>
					<Skeleton width={100} height={44} className="mg-l-16 lh-base" />
				</div>
			))}
		</div>
	);
};

export default SkeletonSummary;
