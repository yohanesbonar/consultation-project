import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { numberToIDR } from 'helper';

type Props = {
	isShow: boolean;
	onOpen: () => void;
	styles: any;
	data: { label: string; value: number }[];
	total_amount: number;
};

const PopupBottomSheetOtherCost = (props: Props) => {
	const { isShow, onOpen, styles, data, total_amount } = props;
	return (
		<PopupBottomsheet isSwipeableOpen={isShow} setIsSwipeableOpen={onOpen}>
			{
				<div className="tw-px-5 tw-py-8">
					<p className="tw-text-xl">Biaya Lain-Lain</p>
					<p className="tw-text-sm tw-mb-2">
						Merupakan biaya lain di luar konsultasi agar kami bisa memberikan pelayanan yang
						lebih baik untuk Anda.
					</p>
					{data.map((item, index) => (
						<div key={index} className={styles.summarySection}>
							<p className={styles.fieldLabel}>{item.label}</p>
							<p className={`${styles.fieldValue}`}>{numberToIDR(item.value)}</p>
						</div>
					))}
					<div className={styles.summaryTotalSection}>
						<p className={styles.fieldLabel}>Total Biaya Lain-Lain</p>
						<p className={`${styles.fieldValueTotal}`}>{numberToIDR(total_amount)}</p>
					</div>
				</div>
			}
		</PopupBottomsheet>
	);
};

export default PopupBottomSheetOtherCost;
