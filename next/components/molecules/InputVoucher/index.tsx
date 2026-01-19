import React from 'react';
import { BUTTON_CONST } from 'helper';
import styles from './index.module.css';
import { IconSpinnerV2 } from '@icons';

type Props = {
	isVoucherValid?: boolean;
	value?: string;
	errorMessage?: string;
	onChange?: (e: any) => void;
	onUseVoucher?: () => void;
	disabled?: boolean;
	isSubmittingByKeyword?: boolean;
};

const InputVoucher = (props: Props) => {
	const {
		onChange,
		value,
		onUseVoucher,
		isVoucherValid,
		errorMessage,
		disabled,
		isSubmittingByKeyword,
	} = props;
	return (
		<div className={styles.container}>
			<div className={styles.inputWraper}>
				<input
					disabled={disabled}
					onChange={onChange}
					value={value}
					className={`${styles.inputVoucher} ${!isVoucherValid && styles.invalidVoucher}`}
					placeholder="Masukkan kode voucher"
				/>
				{!isVoucherValid && <p className={styles.textIinvalidVoucher}>{errorMessage}</p>}
			</div>
			<button onClick={onUseVoucher} className={styles.btnInput}>
				{isSubmittingByKeyword ? (
					<div className="tw-animate-spin">
						<IconSpinnerV2 />
					</div>
				) : (
					BUTTON_CONST.PAKAI
				)}
			</button>
		</div>
	);
};

export default InputVoucher;
