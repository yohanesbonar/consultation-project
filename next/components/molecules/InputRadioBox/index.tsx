import React from 'react';
import { InputRadio } from '@atoms';
import cx from 'classnames';
import style from './index.module.css';

type Props = {
	label: string;
	id?: string;
	checked?: boolean;
	onChange?: (e: any) => void;
	className?: string;
	value: any;
};

const InputRadioBox = (props: Props) => {
	const { label, id, value, checked, onChange, className } = props;
	return (
		<div className={cx(style.container, className)}>
			<label className="body-14-regular" htmlFor={id}>
				{label}
			</label>{' '}
			<InputRadio value={value} checked={checked} onChange={onChange} />{' '}
		</div>
	);
};

export default InputRadioBox;
