import React from 'react';
import { IconCopyBlue } from '@icons';
import { Text } from '@atoms';
import { SEAMLESS_CONST, TOAST_MESSAGE, copyValue } from 'helper';
import styles from './index.module.css';
import cx from 'classnames';

type Props = {
	expedition: string;
	resi?: string;
	address?: {
		name?: string;
		phone?: string;
		address?: string;
		address_detail?: string;
	};
	loading?: boolean;
};

const ShippingInfo = (props: Props) => {
	const { expedition, resi, address, loading = false } = props;

	return (
		<div className={styles.infoWrapper}>
			<div className={styles.infoGrid}>
				<Text textClass="body-14-regular !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
					Kurir
				</Text>

				<div className={styles.colSpan2}>
					<Text
						textClass="title-14-medium !tw-mb-0"
						skeletonClass="tw-w-24 !tw-mb-0"
						isLoading={loading}
					>
						{expedition}
					</Text>{' '}
				</div>
				{resi ? (
					<>
						<div className="!tw-mb-0 tw-mt-3">
							<Text textClass="body-14-regular !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
								No. Resi
							</Text>
						</div>
						<div className={cx(styles.colSpan2, styles.flexItem)}>
							<Text
								textClass="title-14-medium !tw-mb-0"
								skeletonClass="tw-w-24 !tw-mb-0"
								isLoading={loading}
							>
								{resi}
							</Text>{' '}
							{resi !== '-' && (
								<span
									onClick={() => copyValue(resi, TOAST_MESSAGE.INVOICE)}
									className="tw-ml-2 secondary-ic"
								>
									<IconCopyBlue />
								</span>
							)}
						</div>
					</>
				) : null}
				{address ? (
					<div className={cx(styles.infoGrid, styles.colSpan3, 'tw-mt-3')}>
						<div className="!tw-mb-0 ">
							<Text textClass="body-14-regular !tw-mb-0" skeletonClass="tw-w-24 !tw-mb-0">
								{SEAMLESS_CONST.SEND_ADDRESS}
							</Text>
						</div>
						<div className={cx(styles.colSpan2)}>
							<Text
								textClass="title-14-medium !tw-mb-0"
								skeletonClass="tw-w-24 !tw-mb-0"
								isLoading={loading}
							>
								{address?.name ?? '-'}
							</Text>
							{address?.phone ? (
								<Text
									textClass="body-14-regular !tw-mb-0"
									skeletonClass="tw-w-24 !tw-mb-0"
									isLoading={loading}
								>
									{address?.phone}
								</Text>
							) : null}
							{address?.address ? (
								<Text
									textClass="body-14-regular !tw-mb-0"
									skeletonClass="tw-w-24 !tw-mb-0"
									isLoading={loading}
								>
									{address?.address}
									{address?.address_detail ? (
										<>
											<br />
											<span className="tw-text-tpy-700">
												({address?.address_detail})
											</span>
										</>
									) : null}
								</Text>
							) : null}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ShippingInfo;
