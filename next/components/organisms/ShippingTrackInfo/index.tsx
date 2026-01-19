import React from 'react';
import { IconCopyBlue } from '@icons';
import { Text } from '@atoms';
import { copyValue } from 'helper';
import styles from './index.module.css';
import cx from 'classnames';

type Props = {
	expedition: string;
	resi: string;
	send_date: string;
	estimation_date: string;
};

const ShippingTrackInfo = (props: Props) => {
	const { expedition, resi, send_date, estimation_date } = props;

	return (
		<div className={styles.infoWrapper}>
			<div className={styles.infoGrid}>
				<Text textClass="body-14-regular !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
					Kurir
				</Text>

				<div className={styles.colSpan2}>
					<Text textClass="title-14-medium !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
						{expedition}
					</Text>{' '}
				</div>
				<div className="!tw-mb-0 tw-mt-3">
					<Text textClass="body-14-regular !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
						No. Resi
					</Text>
				</div>
				<div
					onClick={() => copyValue(resi, `${resi} berhasil disalin`)}
					className={cx(styles.colSpan2, styles.flexItem)}
				>
					<Text textClass="title-14-medium !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
						{resi}
					</Text>{' '}
					{resi !== '-' && (
						<span className="tw-ml-2 secondary-ic">
							<IconCopyBlue />
						</span>
					)}
				</div>

				<Text
					textClass="body-14-regular !tw-mb-0 tw-mt-3"
					skeletonClass="tw-w-24 !tw-mb-0 tw-mt-3"
				>
					Tanggal Kirim
				</Text>

				<div className={styles.colSpan2}>
					<Text
						textClass="title-14-medium !tw-mb-0 tw-mt-3"
						skeletonClass="tw-w-24 !tw-mb-0 tw-mt-3"
					>
						{send_date}
					</Text>{' '}
				</div>
				<Text
					textClass="body-14-regular !tw-mb-0 tw-mt-3"
					skeletonClass="tw-w-24 !tw-mb-0 tw-mt-3"
				>
					Estimasi Tiba
				</Text>

				<div className={styles.colSpan2}>
					<Text
						textClass="title-14-medium !tw-mb-0 tw-mt-3"
						skeletonClass="tw-w-24 !tw-mb-0 tw-mt-3"
					>
						{estimation_date}
					</Text>{' '}
				</div>
			</div>
		</div>
	);
};

export default ShippingTrackInfo;
