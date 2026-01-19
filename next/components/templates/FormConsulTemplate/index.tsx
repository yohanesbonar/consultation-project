import { InputForm } from '../../molecules';
import { PopupBottomsheetConfirmation } from '../../organisms';
import React from 'react';
import { ButtonHighlight } from '../../../components';
import {
	BUTTON_ID,
	CONFIRMATION_KEY_CONST,
	navigateWithQueryParams,
	TNC_CONST,
} from '../../../helper';

import { PopupErrorAlert } from '../../atoms';

type Props = {
	additionalId: string;
	title: string;
	metaTitle: string;
	header?: boolean;
	footer?: boolean;
	forms: any[];
	activeForm: 0 | 1;
	onChangeForm: any;
	footerComponent?: React.ReactNode;
	checked: boolean;
	isDisabledNext: boolean;
	checkIfValidOrder: () => boolean;
	setActiveForm: any;
	setConfirmationButtonData: any;
	onClickBack: () => void;
	bottomsheetData: any;
	bottomsheetCallback: (res) => void;
	isLoading: boolean;
	handleClickLink?: (link?: string) => void;
};

const FormConsulTemplate = ({
	forms,
	activeForm,
	onChangeForm,
	isDisabledNext,
	checkIfValidOrder,
	setConfirmationButtonData,
	bottomsheetData,
	bottomsheetCallback,
	isLoading,
	handleClickLink,
}: Props) => {
	const onOpenTnC = (type) => {
		navigateWithQueryParams(
			'/tnc',
			{
				type: type,
			},
			'href',
		);
	};

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 box-shadow-m tw-fixed tw-bottom-0 tw-bg-white">
				<p className="tw-text-xs">
					Saya menyetujui Informed Consent,{' '}
					<a
						id={BUTTON_ID.BUTTON_FORM_TNC}
						className="tw-text-secondary-def"
						onClick={() => onOpenTnC(TNC_CONST.TNC)}
					>
						Syarat Ketentuan
					</a>{' '}
					dan{' '}
					<a
						id={BUTTON_ID.BUTTON_FORM_PRIVACY}
						className="tw-text-secondary-def"
						onClick={() => onOpenTnC(TNC_CONST.PRIVACY_POLICY)}
					>
						Kebijakan Privasi
					</a>
					.
				</p>
				<ButtonHighlight
					id={BUTTON_ID.BUTTON_FORM_SAVE}
					onClick={() => {
						const isValid = checkIfValidOrder();
						if (isValid) {
							setConfirmationButtonData(CONFIRMATION_KEY_CONST.FORM_CONFIRMATION);
						}
					}}
					text="SIMPAN"
					isDisabled={isDisabledNext}
				/>
			</div>
		);
	};

	return (
		<>
			<div className="tw-flex tw-flex-col tw-relative">
				<div className="tw-flex-1 tw-p-4 tw-w-full tw-pb-[130px]">
					<div className="tw-text-black">
						{forms[activeForm]?.map((element, id) => (
							<InputForm
								key={'forms' + activeForm + id}
								formId={element?.slug}
								className={element?.className}
								data={element}
								onChange={onChangeForm}
								onClickLink={handleClickLink}
							/>
						))}
					</div>
				</div>
				{renderFooterButton()}
			</div>
			<PopupBottomsheetConfirmation
				data={bottomsheetData}
				callback={bottomsheetCallback}
				isLoading={isLoading}
				isDisabled={isLoading}
			/>
			<PopupErrorAlert />
		</>
	);
};

export default FormConsulTemplate;
