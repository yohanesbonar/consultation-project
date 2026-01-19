import React, { useState } from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import SvgIcon from 'assets/icons/SvgIcon';
import { IconSearch } from '@icons';
import { ButtonHighlight } from '../../atoms';
import { BUTTON_CONST, BUTTON_ID, INPUTFORM_CONST } from 'helper';
import { InputForm, ListPostalCode } from '@molecules';
import { PostalCodeType } from 'components/molecules/ListPostalCode';

type Props = {
	isOpen?: boolean;
	callback: (param: any) => void;
	isDisabled?: boolean;
};

const PopupBottomsheetPostalCode = ({ isOpen, callback }: Props) => {
	const [postalCode, setPostalCode] = useState(null);
	const [keyword, setKeyword] = useState('');
	return (
		<PopupBottomsheet
			additionalClassName="tw-h-[90vh]"
			expandOnContentDrag={false}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) {
					callback(false);
					setPostalCode(null);
					setKeyword('');
				}
			}}
			isSwipeableOpen={isOpen}
			headerComponent={
				<div className="tw-mt-6 tw-mb-2 tw-mx-4">
					<div className="tw-flex">
						<span
							onClick={() => {
								callback(false);
								setPostalCode(null);
								setKeyword('');
							}}
						>
							<SvgIcon name="IconCloseGray" />
						</span>
						<p className="title-18-medium tw-ml-4 tw-mb-0">Kode POS</p>
					</div>
					<p className="body-14-regular tw-text-start tw-mt-4">
						Kode pos perlu diisi dulu supaya obat dapat dikirim ke alamat Anda.
					</p>
					<InputForm
						className="!tw-mb-0 tw-mt-2"
						inputClassName="tw-py-2"
						data={{
							type: INPUTFORM_CONST.text,
							placeholder: 'Cari dengan kode, kecamatan, kota',
							value: keyword,
							icon: <IconSearch />,
						}}
						onChange={(val: any) => setKeyword(val?.value)}
					/>
				</div>
			}
			footerComponent={
				postalCode && (
					<div className="tw-p-4">
						<ButtonHighlight
							onClick={() => {
								callback(postalCode);
								setKeyword('');
							}}
							id={BUTTON_ID.BUTTON_FORM_SAVE}
							text={BUTTON_CONST.SAVE}
						/>
					</div>
				)
			}
		>
			<ListPostalCode
				keyword={keyword}
				selected={postalCode}
				onSelect={(selected: PostalCodeType) => setPostalCode(selected)}
			/>
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetPostalCode;
