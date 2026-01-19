import React, { useCallback, useEffect, useState } from 'react';

interface FlatlistTabProps {
	data: { label: string; value: string }[];
	setHistoryStatus: any;
	selected?: string;
}

const FLatlistTab: React.FC<FlatlistTabProps> = ({ data, setHistoryStatus, selected }) => {
	const [isSelected, setIsSelected] = useState('all');

	useEffect(() => {
		if (selected) {
			setIsSelected(selected);
		}
	}, [selected]);

	const handleClick = useCallback(
		(val) => {
			if (val == isSelected) {
				setIsSelected('all');
				setHistoryStatus('all');
			} else {
				setIsSelected(val);
				setHistoryStatus(val);
			}
		},
		[isSelected],
	);

	return (
		<div className="display-webkit-box tw-overflow-x-auto tw-box-content flatlist">
			{data?.map((item, index) => (
				<div
					key={index}
					onClick={() => handleClick(item?.value)}
					className={`tw-flex first:tw-ml-0 tw-ml-3 tw-px-4 tw-py-2 tw-rounded-full tw-cursor-pointer label-12-medium ${
						isSelected == item?.value
							? 'tw-bg-secondary-50 tw-text-secondary-def tw-border-solid tw-border-1 tw-border-secondary-def'
							: 'tw-bg-monochrome-150 tw-text-tpy-800'
					}`}
				>
					{item.label.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
				</div>
			))}
		</div>
	);
};

export default FLatlistTab;
