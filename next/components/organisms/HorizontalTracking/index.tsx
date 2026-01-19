import React from 'react';
import styles from './index.module.css';
import { HorizontalStepper } from '@molecules';

type Props = {
	data: {
		id: number;
		label: string;
		isComplete: boolean;
		isActive: boolean;
	}[];
	isRejected?: boolean;
};

function HorizontalTracking(props: Props) {
	const { data, isRejected } = props;
	return (
		<div className={styles.container}>
			{data?.map((item, index) => {
				const isFirst = index === 0;
				const isLast = index === data?.length - 1;
				const p = { item, isFirst, isLast, index, isRejected };
				return <HorizontalStepper key={index} {...p} />;
			})}
		</div>
	);
}

export default HorizontalTracking;
