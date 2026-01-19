import * as React from 'react';
import { DkonsulGrayscale } from '@images';
import styles from './index.module.css';
import cx from 'classnames';

export default function DkonsulWatermark(props: { isWithExpiredText?: boolean }) {
	return (
		<div className={styles?.watermark}>
			{Array.apply(0, Array(20)).map((x: any, i: number) => (
				<div key={i} className={cx('tw-flex tw-items-center', styles.rotatedText)}>
					{props.isWithExpiredText && (
						<p
							className={cx(
								'title-18-medium tw-whitespace-nowrap tw-mt-6 tw-text-[#F3F3F3] tw-mb-0 -tw-ml-16',
							)}
						>
							RESEP ELEKTRONIK TIDAK BERLAKU
						</p>
					)}

					{!props.isWithExpiredText && (
						<>
							<img
								className="tw-w-32 tw-object-contain tw-mt-7 tw-mx-5 -tw-ml-16"
								src={DkonsulGrayscale.src}
								alt="watermark"
							/>
							<img
								className="tw-w-32 tw-object-contain tw-mt-7 tw-mx-5"
								src={DkonsulGrayscale.src}
								alt="watermark"
							/>
							<img
								className="tw-w-32 tw-object-contain tw-mt-7 tw-mx-5"
								src={DkonsulGrayscale.src}
								alt="watermark"
							/>
						</>
					)}

					<img
						className="tw-w-32 tw-object-contain tw-mt-7 tw-mx-5"
						src={DkonsulGrayscale.src}
						alt="watermark"
					/>
					{props.isWithExpiredText && (
						<p
							className={cx(
								'title-18-medium tw-whitespace-nowrap tw-mt-6 tw-text-[#F3F3F3] tw-mb-0',
							)}
						>
							RESEP ELEKTRONIK TIDAK BERLAKU
						</p>
					)}
				</div>
			))}
		</div>
	);
}
