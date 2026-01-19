import React from 'react';
import cx from 'classnames';
import styles from './index.module.css';
import { IconCheckWhite } from '@icons';

type Props = {
	id: number;
	isActive: boolean;
	isComplete: boolean;
	itemComplete: boolean;
};

const HorizontalIndicator = (props: Props) => {
	const { id, isActive, isComplete, itemComplete } = props;
	return (
		<div
			className={cx(
				styles.circleProgress,
				isActive
					? styles.activeStepCircle
					: isComplete
					? 'tw-bg-success-def'
					: styles.idleStepCircle,
			)}
		>
			{itemComplete ? (
				<IconCheckWhite />
			) : (
				<p
					className={cx(
						styles.indicatorProgress,
						isActive
							? 'tw-text-success-def'
							: isComplete
							? 'tw-text-tpy-50'
							: 'tw-text-tpy-700',
					)}
				>
					{id}
				</p>
			)}
		</div>
	);
};

export default HorizontalIndicator;
