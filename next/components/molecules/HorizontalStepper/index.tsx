import React from 'react';
import styles from './index.module.css';
import { HorizontalDivider, HorizontalIndicator } from '@atoms';

type Props = {
	index: number;
	item: any;
	isFirst: boolean;
	isLast: boolean;
	isRejected?: boolean;
};

const HorizontalStepper = (props: Props) => {
	const { item, isFirst, isLast, index, isRejected } = props;

	const activeStep = item.isActive && !item.isComplete;
	const completeStep = !item.isActive && item.isComplete;

	return (
		<div key={index} className={styles.stepContainer}>
			<div className={styles.stepWrapper}>
				{!isFirst && (
					<HorizontalDivider
						isComplete={completeStep}
						isActive={index + 1 === item.id && item.isActive && !isRejected}
						position="left"
					/>
				)}
				<HorizontalIndicator
					id={item.id}
					isActive={activeStep && !isRejected}
					isComplete={completeStep}
					itemComplete={item.isComplete}
				/>
				{!isLast && <HorizontalDivider isComplete={completeStep} position="right" />}
			</div>
			<div className={styles.labelProgressContainer}>
				<p className={styles.labelProgress}>{item.label}</p>
			</div>
		</div>
	);
};

export default HorizontalStepper;
