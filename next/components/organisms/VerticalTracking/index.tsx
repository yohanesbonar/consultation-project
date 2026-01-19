import React from 'react';
import cx from 'classnames';
import styles from './index.module.css';

type Props = {
	data: {
		id: number;
		title: string;
		subtitle: string;
		date: string;
		time: string;
		isLatest: boolean;
	}[];
	isRejected?: boolean;
};

const VerticalTracking = (props: Props) => {
	const { data, isRejected } = props;
	return (
		<>
			{data.map((item, index) => (
				<div key={item.id} className="tw-flex">
					<p className={styles.dateTime}>
						{item.date} <br /> jam {item.time}
					</p>
					<div className={styles.stepWrapper}>
						<div
							className={cx(
								styles.circleItem,
								item.isLatest
									? isRejected
										? 'tw-bg-error-def'
										: 'tw-bg-success-def'
									: 'tw-bg-monochrome-300',
							)}
						/>
						{index !== data?.length - 1 && <div className={styles.verticalDivider} />}
					</div>
					<div>
						<p
							className={cx(
								styles.title,
								isRejected && item.isLatest ? 'tw-text-error-def' : '',
							)}
						>
							{item.title}
						</p>
						<p className={styles.subtitle}>{item.subtitle}</p>
					</div>
				</div>
			))}
		</>
	);
};

export default VerticalTracking;
