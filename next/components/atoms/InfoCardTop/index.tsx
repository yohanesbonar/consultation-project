import moment from 'moment';
import React from 'react';
import { FaClock } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';

interface InfoCardTopProps {
	classContainer?: string;
	dateTime: Date;
	label?: string;
	loading?: boolean;
}

const InfoCardTop: React.FC<InfoCardTopProps> = ({
	classContainer,
	dateTime,
	label = 'Bayar sebelum',
	loading = false,
}) => {
	return (
		<div
			className={cx(
				'tw-flex tw-justify-center tw-items-center tw-gap-2 tw-text-center',
				loading ? '' : 'tw-bg-info-50 tw-px-2 tw-py-1.5',
				classContainer,
			)}
		>
			{loading ? (
				<Skeleton className="tw-w-screen tw-h-[33px]" />
			) : (
				<>
					<div className="tw-flex tw-justify-center tw-items-center">
						<div className="tw-text-info-def">
							<FaClock size={15} />
						</div>
					</div>
					<div className="label-12-medium tw-mb-0 tw-text-info-700">
						{label}{' '}
						{dateTime != null ? moment(dateTime).format('DD MMM YYYY [jam] HH:mm') : '-'}
					</div>
				</>
			)}
		</div>
	);
};

export default InfoCardTop;
