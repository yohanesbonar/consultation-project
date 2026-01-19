import React from 'react';

type Props = {
	label?: string;
	value?: string | number;
	checked?: boolean;
	onChange?: (e: any) => void;
};

const RadioInput = (props: Props) => {
	const { label, value, checked, onChange = (e) => e } = props;
	return (
		<section>
			<input
				onChange={(e) => onChange(e)}
				checked={checked}
				value={value}
				type="radio"
				name="styles"
				id="accent"
			/>
			<label htmlFor="accent">{label}</label>
		</section>
	);
};

export default RadioInput;
