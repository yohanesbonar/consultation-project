import React from 'react';
import cx from 'classnames';

interface Props {
	data?: {
		isAvailable: boolean;
		icon?: React.ReactNode;
		desc?: string;
	};
	isLoading: boolean;
}

const HeaderInfo = ({ data, isLoading }: Props) => {
	return (
		<div className="tw-flex tw-flex-col tw-px-4 tw-pt-4 tw-pb-0">
			<div
				className={cx(
					'tw-flex tw-justify-start tw-items-center tw-p-3 tw-z-0 tw-rounded-md tw-border-1 tw-border-monochrome-200 tw-border-solid',
					isLoading
						? 'box-light-gray'
						: data?.isAvailable
						? 'tw-bg-info-50 tw-text-info-def'
						: 'box-light-red',
				)}
			>
				{isLoading ? null : data?.icon}

				<p className={cx('body-12-regular tw-ml-3 tw-z-10 tw-mb-0 tw-flex-1 tw-text-black')}>
					{isLoading ? '' : data?.desc ?? ''}
				</p>
			</div>
		</div>
	);
};
export default HeaderInfo;
