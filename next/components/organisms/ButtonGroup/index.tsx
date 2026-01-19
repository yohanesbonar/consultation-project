import React from 'react';
import { ButtonHighlight } from '@atoms';

type Props = {
	items: { prefixIcon: any; classNameBtn: string; label: string; onClick: () => void }[];
};

const ButtonGroup = (props: Props) => {
	const { items } = props;
	return (
		<div className="tw-flex tw-gap-3">
			{items.map((item, index) => (
				<ButtonHighlight
					onClick={item.onClick}
					key={index}
					prefixIcon={item.prefixIcon && item.prefixIcon}
					classNameBtn={item.classNameBtn}
				>
					<span className="tw-ml-2">{item.label}</span>
				</ButtonHighlight>
			))}
		</div>
	);
};

export default ButtonGroup;
