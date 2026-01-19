import * as React from 'react';
import cx from 'classnames';
import { ButtonHighlight } from '@atoms';
import styles from './index.module.css';

export interface ICustomPopupProps {
	show: boolean;
	close?: () => void;
	icon: any;
	title: string;
	desc: any;
	primaryButtonLabel: string;
	secondaryButtonLabel?: string;
	primaryButtonAction?: () => void;
	secondaryButtonAction?: () => void;
	primaryButtonLoading?: boolean;
	secondaryButtonLoading?: boolean;
	classNameBtnSecondary?: string;
}

export default function CustomPopup(props: ICustomPopupProps) {
	const {
		show,
		icon,
		title,
		desc,
		primaryButtonAction,
		primaryButtonLabel,
		secondaryButtonAction,
		secondaryButtonLabel,
		primaryButtonLoading,
		secondaryButtonLoading,
		classNameBtnSecondary,
	} = props;
	return (
		<div className="tw-relative">
			<div
				className={cx(show ? styles.showOverlay : styles.hideOverlay, styles.animateOverlay)}
			/>
			{show ? (
				<div className={cx(styles.box, 'transXY')}>
					{icon}
					<p className="title-18-medium tw-my-4">{title}</p>
					<p className="body-14-regular tw-pb-4 tw-break-words">{desc}</p>
					<div className="tw-flex tw-flex-col tw-flex-1 tw-gap-3">
						<ButtonHighlight
							isLoading={primaryButtonLoading}
							isDisabled={primaryButtonLoading}
							text={primaryButtonLabel}
							onClick={primaryButtonAction}
						/>
						{secondaryButtonLabel ? (
							<ButtonHighlight
								color="grey"
								classNameBtn={classNameBtnSecondary}
								text={secondaryButtonLabel}
								onClick={secondaryButtonAction}
								isLoading={secondaryButtonLoading}
								isDisabled={secondaryButtonLoading}
							/>
						) : null}
					</div>
				</div>
			) : null}
		</div>
	);
}
