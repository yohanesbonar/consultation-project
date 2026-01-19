import * as React from 'react';
import { IconErrorRed } from '../../../assets';

export interface IButtonErrorIconProps {
	id?: string;
	onClick?: () => void;
	isDiabled?: boolean;
}

export default function index(props: IButtonErrorIconProps) {
	const { id, onClick, isDiabled } = props;
	return (
		<button
			id={id}
			className="tw-bg-transparent tw-border-none"
			onClick={onClick}
			disabled={isDiabled}
		>
			<IconErrorRed />
		</button>
	);
}
