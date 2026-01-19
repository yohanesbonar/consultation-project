import * as React from 'react';
import { IconVoucher } from '@icons';
import { numberToIDR } from 'helper';
import styles from './index.module.css';
import cx from 'classnames';
import useDiscount from 'hooks/useDiscount';

export interface IApplyVoucherButtonProps {
	data: any;
}

export default function ApplyVoucherButton(props: IApplyVoucherButtonProps) {
	const { data } = props;
	const discount = useDiscount(data);
	return discount > 0 ? (
		<div className={styles.inputVoucherBtn}>
			<div className="tw-flex tw-flex-1 tw-items-center tw-justify-center">
				<div className="voucher-01-ic voucher-02-ic voucher-03-ic">
					<IconVoucher />
				</div>
				<div className="tw-flex tw-items-center">
					<p className={cx(styles.inputVoucherLabel, 'tw-text-tpy-700')}>
						{'Transaksi ini dapat potongan'}
						<span className="label-14-medium tw-text-primary-def tw-ml-2">
							{numberToIDR(discount)}
						</span>
					</p>
				</div>
			</div>
		</div>
	) : null;
}
