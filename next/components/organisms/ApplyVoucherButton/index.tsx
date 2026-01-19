import * as React from 'react';
import { IconVoucher, IconCheckGreen, IconArrowRightBlue } from '@icons';
import { numberToIDR } from 'helper';
import styles from './index.module.css';
import cx from 'classnames';

export interface IApplyVoucherButtonProps {
	onClickBtnVoucher?: () => void;
	discount?: number;
	isVoucherUsed?: boolean;
	withCheckedWhenApplied?: boolean;
	isShippingSelected?: boolean;
}

export default function ApplyVoucherButton(props: IApplyVoucherButtonProps) {
	const {
		onClickBtnVoucher,
		isVoucherUsed,
		discount,
		withCheckedWhenApplied,
		isShippingSelected,
	} = props;
	return (
		<div onClick={onClickBtnVoucher} className={styles.inputVoucherBtn}>
			<div className="tw-flex tw-items-center">
				<div className="voucher-01-ic voucher-02-ic voucher-03-ic">
					<IconVoucher />
				</div>
				{isVoucherUsed ? (
					<div className="tw-flex tw-items-center">
						<p className={cx(styles.inputVoucherLabel, 'tw-text-tpy-700')}>
							{isShippingSelected
								? 'Anda dapat diskon'
								: discount
								? 'Anda berpotensi diskon'
								: 'Diskon aktif, cek setelah pilih pengiriman'}
							<span className="label-14-medium tw-text-primary-def tw-ml-2">
								{discount ? numberToIDR(discount) : null}
							</span>
						</p>
						{withCheckedWhenApplied && <IconCheckGreen />}
					</div>
				) : (
					<p className={cx('tw-text-secondary-800', styles.inputVoucherLabel)}>
						Gunakan Voucher
					</p>
				)}
			</div>
			<div className="tw-text-secondary-def">
				<IconArrowRightBlue />
			</div>
		</div>
	);
}
