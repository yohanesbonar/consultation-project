/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';

import { ButtonHighlight } from '../../atoms';
import { DropdownList, InputForm } from '../../molecules';
import PopupBottomsheet from '../PopupBottomsheet';

type ChangeParamsType = {
	id?: number | string;
	valueText?: string;
};

type Props = {
	isSwipeableOpen?: boolean;
	setIsSwipeableOpen?: (val: boolean) => void;
	styleSwipeable?: any; // TODO: unused prop
	data?: any;
	onChange?: (params?: ChangeParamsType) => void;
};

const PopupBottomsheetDropdown = ({
	isSwipeableOpen = false,
	setIsSwipeableOpen = (_val) => {},
	styleSwipeable,
	data,
	onChange = (_params) => {},
}: Props) => {
	const [dataTemp, setDataTemp] = useState(data);

	useEffect(() => {
		if (!isSwipeableOpen) {
			setDataTemp(data);
		}
	}, [isSwipeableOpen]);

	return (
		<PopupBottomsheet
			isSwipeableOpen={isSwipeableOpen}
			setIsSwipeableOpen={(isOpen) => {
				setIsSwipeableOpen(isOpen);
			}}
			footerComponent={
				<div className="tw-flex tw-flex-row tw-mt-4 box-shadow-top2 tw-p-4 tw-gap-2">
					<ButtonHighlight
						color="grey"
						onClick={() => {
							setIsSwipeableOpen(false);
						}}
						text="BATAL"
					/>
					<ButtonHighlight
						isDisabled={
							dataTemp?.value == null ||
							(dataTemp?.value != null &&
								dataTemp?.options[dataTemp?.value]?.textbox &&
								!dataTemp?.valueText)
						}
						onClick={() => {
							onChange(
								dataTemp?.valueText != null && dataTemp?.valueText != ''
									? {
											id: dataTemp?.value,
											valueText: dataTemp?.valueText,
									  }
									: null,
							);
							setIsSwipeableOpen(false);
						}}
						text="KONFIRMASI"
					/>
				</div>
			}
			headerComponent={
				<div className="tw-py-[20px] tw-mx-4">
					<p className="tw-text-left tw-mt-4 title-20-medium tw-b-0">
						{dataTemp?.options_title}
					</p>
				</div>
			}
		>
			<div className="">
				<DropdownList
					title={dataTemp?.options_title}
					data={dataTemp?.options}
					selected={{
						id: dataTemp?.value,
						text: dataTemp?.valueText,
					}}
					onChange={(id, valueText) =>
						setDataTemp({
							...dataTemp,
							value: id,
							valueText: valueText,
						})
					}
				/>
				{dataTemp?.value &&
				dataTemp?.options.find((val) => val.id == dataTemp.value) &&
				dataTemp?.options.find((val) => val.id == dataTemp.value).textbox ? (
					<InputForm
						className="tw-mx-4 tw-mt-2"
						data={{
							value: dataTemp?.valueText,
							placeholder: dataTemp?.other_placeholder,
						}}
						onChange={(params: { value: string }) =>
							setDataTemp({
								...dataTemp,
								valueText: params?.value,
							})
						}
					/>
				) : null}
			</div>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetDropdown;
