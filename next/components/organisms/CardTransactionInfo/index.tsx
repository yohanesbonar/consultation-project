import React from 'react';
import styles from './index.module.css';
import { IconCopy, IconInfoRed } from '@icons';
import { TOAST_MESSAGE, copyValue } from 'helper';

export interface Props {
	data: { top_label: string; total: string; invoice_number: string; message: string };
}

const CardTransactionInfo = (props: Props) => {
	const { data } = props;

	return (
		<div className="tw-w-full tw-p-4 tw-rounded-lg tw-shadow-md">
			<div className="tw-flex tw-justify-between">
				<p className="body-16-regular tw-mb-0">{data.top_label}</p>
				<p className="title-16-medium tw-mb-0">{data.total}</p>
			</div>
			<hr className={styles.divider} />
			<div className="tw-flex tw-justify-between">
				<p className="body-14-regular tw-mb-0">Nomor Invoice</p>

				<div className="tw-flex tw-items-center">
					<p className="title-14-medium tw-mb-0 tw-mr-2">{data?.invoice_number}</p>
					<div
						onClick={() => copyValue(data?.invoice_number, TOAST_MESSAGE.INVOICE)}
						className="secondary-ic"
					>
						{data?.invoice_number !== '-' ? <IconCopy /> : null}
					</div>
				</div>
			</div>
			<div className="tw-flex tw-justify-start tw-items-center tw-bg-info-50 tw-px-2 tw-py-2 tw-rounded-lg tw-mt-4">
				<div className="tw-w-6">
					<IconInfoRed />
				</div>
				<p className="body-12-regular tw-mb-0 tw-mr-2 tw-ml-2">{data.message}</p>
			</div>
		</div>
	);
};

export default CardTransactionInfo;
