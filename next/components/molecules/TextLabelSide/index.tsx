import React from 'react';
import { IconClockOrange, IconCopy, IconDone, IconFailed } from '@icons';
import { COMPONENT_TYPE, STATUS_CONST, STATUS_LABEL, TOAST_MESSAGE, copyValue } from 'helper';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';
import cx from 'classnames';

type Props = {
	data: {
		value: string | React.ReactNode;
		valueSecondary?: string | React.ReactNode;
		label: string;
		type?: string;
		date_format?: string;
		body?: React.ReactNode;
		labelSuffixIcon?: React.ReactNode;
		labelPrefixIcon?: React.ReactNode;
		labelPrefixIconClassName?: string;
		valuePrefixIcon?: React.ReactNode;
		valuePrefixIconClassName?: string;
		valueSecondaryPrefixIcon?: React.ReactNode;
		valueSecondaryPrefixClassName?: string;
		valueSecondaryPrefixIconClassName?: string;
	};
	className?: string;
	classNameLabel?: string;
	labelBold?: boolean;
	classNameValue?: string;
	emptyValue?: string;
	emptyLabel?: string;
	isLoading?: boolean;
};

const TextLabelSide = ({
	data = {
		value: '',
		valueSecondary: '',
		label: '',
		date_format: 'D MMM YYYY [jam] HH:mm',
		labelSuffixIcon: null,
		labelPrefixIcon: null,
		labelPrefixIconClassName: null,
		valuePrefixIcon: null,
		valuePrefixIconClassName: null,
		valueSecondaryPrefixIcon: null,
		valueSecondaryPrefixIconClassName: null,
		valueSecondaryPrefixClassName: null,
	},
	className = '',
	labelBold = false,
	classNameLabel = '',
	classNameValue = '',
	emptyValue = '',
	emptyLabel = '',
	isLoading = false,
}: Props) => {
	const renderStatus = () => {
		return (
			<div className="label-14-medium tw-flex tw-flex-1 tw-items-center tw-justify-end tw-gap-1">
				{data?.value ? (
					data?.value === STATUS_CONST.SUCCESS || data?.value === STATUS_CONST.REFUNDED ? (
						<IconDone />
					) : data?.value === STATUS_CONST.FAILED ||
					  data?.value === STATUS_CONST.EXPIRED ||
					  data?.value === STATUS_CONST.CANCELLED ? (
						<IconFailed />
					) : data?.value === STATUS_CONST.PENDING || data?.value === STATUS_CONST.CREATED ? (
						<IconClockOrange />
					) : null
				) : null}
				<p className="label-14-medium tw-text-end">
					{data?.value ? STATUS_LABEL[data?.value] : emptyValue}
				</p>
			</div>
		);
	};

	return (
		<div className={`tw-flex tw-h-6 tw-justify-between tw-items-center tw-gap-2 ${className}`}>
			{isLoading ? (
				<Skeleton className="tw-w-24" />
			) : (
				<p className={`label-14-medium ${labelBold ? 'tw-font-medium' : ''} ${classNameLabel}`}>
					{data?.labelPrefixIcon != null ? (
						<span
							className={
								data?.labelPrefixIconClassName ? data?.labelPrefixIconClassName : 'tw-mr-1'
							}
						>
							{data?.labelPrefixIcon}
						</span>
					) : null}
					{data?.label ? data?.label : emptyLabel}
					{data?.labelSuffixIcon != null ? (
						<span className="tw-ml-1">{data?.labelSuffixIcon}</span>
					) : null}
				</p>
			)}
			{data?.type === COMPONENT_TYPE.TEXT_COPY && data?.value ? (
				<div className="label-14-medium tw-flex tw-flex-1 tw-items-center tw-gap-1">
					<p className="label-14-medium tw-flex-1 tw-text-end">
						{isLoading ? <Skeleton /> : data?.value ? data?.value : emptyValue}
					</p>
					{isLoading ? null : (
						<div
							onClick={() => copyValue(data?.value, TOAST_MESSAGE.INVOICE)}
							className="tw-rounded-full tw-bg-none hover:tw-bg-gray-100 secondary-ic"
						>
							<IconCopy />
						</div>
					)}
				</div>
			) : data?.type === COMPONENT_TYPE.TEXT_STATUS ? (
				isLoading ? (
					<Skeleton className="tw-w-32" />
				) : (
					renderStatus()
				)
			) : data?.type === COMPONENT_TYPE.DATE ? (
				<p className="label-14-medium tw-flex-1 tw-text-end">
					{isLoading ? (
						<Skeleton className="tw-w-32" />
					) : data?.value && typeof data?.value == 'string' ? (
						moment(data?.value).format(data?.date_format)
					) : (
						emptyValue
					)}
				</p>
			) : data?.type === COMPONENT_TYPE.TEXT_START ? (
				<p className="label-14-medium tw-flex-1 tw-text-start">
					{data?.value != null ? data?.value : emptyValue}
				</p>
			) : (
				<p className={`${classNameValue} label-14-medium tw-flex-1 tw-text-end`}>
					{data?.valueSecondary && (
						<span className={cx('tw-mr-2', data?.valueSecondaryPrefixClassName ?? '')}>
							{data?.valueSecondary}
						</span>
					)}
					{isLoading ? null : data?.valuePrefixIcon != null ? (
						<span
							className={
								data?.valuePrefixIconClassName ? data?.valuePrefixIconClassName : 'tw-mr-1'
							}
						>
							{data?.valuePrefixIcon}
						</span>
					) : null}
					{isLoading ? (
						<Skeleton className="tw-w-32" />
					) : data?.value != null ? (
						data?.value
					) : (
						emptyValue
					)}
				</p>
			)}
		</div>
	);
};
export default TextLabelSide;
