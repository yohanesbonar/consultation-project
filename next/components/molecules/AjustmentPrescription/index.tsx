import { ImageLoading } from '@atoms';
import { IconChevronDown, IconChevronUp } from '@icons';
import { ImgDefaultProduct } from '@images';
import cx from 'classnames';
import React, { useState } from 'react';
import styles from './index.module.css';

type Props = {
	data: any[];
};

const AjustmentPrescription = ({ data }: Props) => {
	const [isShowingAll, setIsShowingAll] = useState(false);

	const mappingPrescription = data?.length > 2 && !isShowingAll ? data?.slice(0, 2) : data;

	return (
		<div className="tw-border-[1px] tw-border-monochrome-50 tw-border-solid tw-mx-4 tw-bg-white tw-rounded-[8px] tw-my-5 tw-overflow-hidden">
			<div
				onClick={() => setIsShowingAll((prevState) => !prevState)}
				className="tw-flex tw-flex-row tw-h-[48px] tw-bg-white tw-items-center tw-px-4 tw-cursor-pointer"
			>
				<div className="tw-flex tw-flex-1 label-16-medium tw-text-[16px]">
					Penyesuaian Obat Dipesan
				</div>
				<div>
					{isShowingAll ? (
						<IconChevronUp className="tw-text-tpy-700" />
					) : (
						<IconChevronDown className="tw-text-secondary" />
					)}
				</div>
			</div>

			{isShowingAll && (
				<>
					{mappingPrescription.map((item, idx) => {
						const lastIndex = idx === mappingPrescription.length - 1;
						return <PrescriptionItem key={item?.id} item={item} lastIndex={lastIndex} />;
					})}
				</>
			)}
		</div>
	);
};
interface PrescriptionItemProps {
	item: {
		id?: string;
		productImage?: string;
		name?: string;
		originalQty?: number;
		qty?: number;
		updateQtyReason?: string;
	};
	lastIndex: boolean;
}

const PrescriptionItem: React.FC<PrescriptionItemProps> = ({ item, lastIndex }) => {
	return (
		<div
			key={item?.id}
			className={cx(
				'tw-mx-4 tw-mt-4',
				!lastIndex
					? 'tw-border-0 tw-border-b-[1.5px] tw-border-dashed tw-border-monochrome-50'
					: '',
			)}
		>
			<div className={styles.productWrapper}>
				<div className="tw-w-10 tw-h-10">
					<ImageLoading
						alt="product"
						data={{ url: item?.productImage ?? ImgDefaultProduct.src }}
						classNameContainer={styles.imgLoadContainer}
						className={styles.imgLoadClass}
						fallbackImg={ImgDefaultProduct.src}
					/>
				</div>
				<div className="tw-ml-4">
					<p className={styles.productName}>{item?.name}</p>
					<p className={styles.oriQty}>{item?.originalQty} barang</p>
				</div>
			</div>
			<div className="tw-mt-4">
				<p className={styles.newQtyLabel}>Kuantitas Baru</p>
				<p className={cx('label-14-medium tw-mb-0', item?.qty === 0 && 'tw-text-info-700')}>
					{item?.qty === 0 ? `0 barang (ditolak)` : `${item?.qty} barang`}
				</p>
			</div>
			<div className="tw-mt-4 tw-pb-4">
				<p className={styles.newQtyLabel}>Alasan</p>
				<p className={styles.reasonQty}>{item?.updateQtyReason ?? '-'}</p>
			</div>
		</div>
	);
};

export default AjustmentPrescription;
