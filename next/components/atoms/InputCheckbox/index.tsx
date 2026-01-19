import React from 'react';
import cx from 'classnames';
import classNames from 'classnames';
type Props = {
	checked: boolean;
	onChange: () => void;
	className?: string;
	inputId?: any;
	spanClassName?: string;
};

const InputCheckbox = (props: Props) => {
	const { checked, onChange, className, inputId } = props;
	return (
		<label className={cx('container', className)}>
			<input id={inputId} checked={checked} onChange={onChange} type="checkbox" />
			<span className={classNames('checkmark', props?.spanClassName ?? '')}></span>
		</label>
	);
};

export default InputCheckbox;
