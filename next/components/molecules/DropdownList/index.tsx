import React from 'react';
import { IconRadioOff, IconRadioOn } from '../../../assets';

interface Props {
	title?: string;
	data?: object[];
	selected?: { id?: string; text?: string } | null;
	onChange?: (paramsA?: string, paramsB?: string) => void;
}

interface PropElement {
	id?: string;
	textbox?: any;
	name?: string;
}

const DropdownList = ({
	title,
	data,
	selected,
	onChange = (_id, _valueText) => {
		/* intentional */
	},
}: Props) => {
	// default
	return (
		<div>
			{data?.map((element: PropElement, i) => {
				return (
					<div
						key={i}
						className="tw-flex tw-px-4 tw-items-center hover:tw-bg-monochrome-100 tw-cursor-pointer"
						onClick={() => onChange(element?.id, element?.textbox ? null : element?.name)}
					>
						<p className="tw-flex-1 tw-mb-0 body-16-regular">{element?.name}</p>
						<div className="tw-text-secondary-def">
							{selected && element?.id == selected?.id ? <IconRadioOn /> : <IconRadioOff />}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default DropdownList;
