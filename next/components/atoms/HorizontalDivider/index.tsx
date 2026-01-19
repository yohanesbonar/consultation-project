import React from 'react';
import styles from './index.module.css';
import cx from 'classnames';

type Props = {
	position: string;
	isComplete: boolean;
	isActive?: boolean;
};

const HorizontalDivider = (props: Props) => {
	const { position, isComplete, isActive } = props;
	return (
		<div
			className={cx(
				styles.progressDivider,
				isComplete || isActive ? 'tw-bg-success-def' : 'tw-bg-monochrome-400',
				position === 'left' ? 'tw-left-0' : 'tw-right-0',
			)}
		/>
	);
};

export default HorizontalDivider;
