import React from 'react';
import cx from 'classnames';
import styles from './index.module.css';
import { IconSpinner } from '@icons';

type Props = {
	id?: string;
	idBtn?: string;
	className?: string;
	style?: React.CSSProperties;
	btnStyle?: React.CSSProperties;
	classNameBtn?: string;
	children?: React.ReactNode;
	text?: any;
	onClick?: (e: any) => void;
	isDisabled?: boolean;
	color?: string;
	isLoading?: boolean;
	circularClassName?: string;
	circularContainerClassName?: string;
	childrenClassName?: string;
	suffixIcon?: React.ReactNode;
	prefixIcon?: React.ReactNode;
	isOnlyIcon?: boolean;
};

const ButtonHighlight = ({
	id = '',
	idBtn = '',
	className = '',
	style,
	btnStyle = {},
	color = 'primary',
	classNameBtn = '',
	children,
	text = 'Submit',
	onClick = (e) => {
		/* intentional */
	},
	isDisabled = false,
	isLoading = false,
	circularContainerClassName = '',
	childrenClassName = '',
	suffixIcon = null,
	prefixIcon = null,
	isOnlyIcon = false,
}: Props) => {
	return (
		<div
			id={id}
			className={cx('tw-flex tw-flex-1', isOnlyIcon ? 'tw-w-max' : 'tw-w-full', className)}
			style={style}
		>
			<button
				id={idBtn}
				className={cx(
					'title-14-medium',
					classNameBtn,
					styles.btnHighlight,
					isDisabled
						? `tw-cursor-not-allowed ${styles.isSecondaryDisabled}`
						: 'tw-cursor-pointer',
					!color
						? 'tw-bg-transparent'
						: color != null
						? color === 'grey'
							? styles.isSecondary
							: styles.isPrimary
						: null,
				)}
				style={{ flex: 1, ...btnStyle }}
				onClick={onClick}
				disabled={isDisabled}
				color={isDisabled || color === 'grey' ? 'grey' : 'primary'}
			>
				{!isLoading && prefixIcon}
				<div className={childrenClassName}>
					{isLoading ? (
						<div className="tw-animate-spin">
							<IconSpinner />
						</div>
					) : (
						children ?? text
					)}
				</div>
				{suffixIcon}
			</button>
		</div>
	);
};
export default ButtonHighlight;
