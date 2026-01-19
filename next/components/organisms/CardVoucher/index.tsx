import React from 'react';
import { IconInfoGray, IconClockGraySmall } from '@icons';
import { numberToIDR } from 'helper';
import { VoucherType } from '@types';
import moment from 'moment';
import styles from './index.module.css';
import Router from 'next/router';
import cx from 'classnames';
import InputCheckbox from 'components/atoms/InputCheckbox';

const CardVoucher = (props: VoucherType) => {
	const {
		isSelected,
		enabled,
		end_date,
		name,
		onSelectVoucher,
		min_transaction,
		containerClass,
		code,
	} = props;

	return (
		<div
			className={cx(
				isSelected && enabled
					? styles.voucherContainerActive
					: enabled
					? styles.voucherContainer
					: styles.voucherContainerDisabled,
				containerClass,
			)}
		>
			<div
				className={isSelected && enabled ? styles.roundedVoucherActive : styles.roundedVoucher}
			/>
			<div className={styles.roundedOverlay} />
			<div className={styles.contentWrapper}>
				<div className={styles.contentLeft}>
					<p
						className={cx(
							'tw-mb-0 label-16-medium two-line-elipsis',
							enabled ? 'tw-text-black' : 'tw-text-tpy-700',
						)}
					>
						{name || code || '-'}
					</p>
					<div
						className={cx(
							'tw-flex tw-pl-1px tw-my-1.5',
							enabled ? 'tw-text-tpy-700' : 'tw-text-tpy-700',
						)}
					>
						<IconInfoGray />
						<p className="tw-mb-0 tw-font-roboto tx-normal tw-ml-2 tw-text-xs">
							Min. transaksi {numberToIDR(min_transaction ?? 0)}
						</p>
					</div>
					<div className={cx('tw-flex', enabled ? 'tw-text-tpy-700' : 'tw-text-tpy-700')}>
						<IconClockGraySmall />
						<p className="tw-mb-0 tw-mx-2 tw-text-xs">
							hingga {moment(end_date).format('D MMM YYYY')}
						</p>
						{!Router.query?.presc && (
							<p
								className="tw-mb-0 label-12-medium tw-text-secondary-def tw-cursor-pointer"
								onClick={() =>
									Router.push({ pathname: '/voucher/' + code, query: Router.query })
								}
							>
								Lihat Detail
							</p>
						)}
					</div>
				</div>
				{enabled && (
					<div className={styles.contentRight}>
						<InputCheckbox onChange={onSelectVoucher} checked={isSelected} />
					</div>
				)}
			</div>
		</div>
	);
};

export default CardVoucher;
