// TO FIX
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { IconRight } from '../../../assets';
import {
	BUTTON_ID,
	INPUTFORM_CONST,
	REGEX_CONST,
	calculateAgeYearMonth,
	removeCharByregex,
	validateInput,
} from '../../../helper';
import { PopupBottomsheet, PopupBottomsheetDropdown } from '../../organisms';
import { InputDate, InputDateScroll } from '../../atoms';
import { FORM_CONSULTATION } from '../../../pages/form-consultation';
import styles from './index.module.css';
import moment from 'moment';
import classNames from 'classnames';
import InputCheckbox from 'components/atoms/InputCheckbox';
import SvgIcon from 'assets/icons/SvgIcon';

interface Props {
	className?: string;
	inputClassName?: string;
	formId?: any;
	data: {
		type?: any;
		title?: string;
		isRequired?: boolean;
		options?: string[];
		value?: any;
		name?: string;
		valueText?: string;
		placeholder?: string;
		idComponent?: string;
		max_length?: any;
		errorMessage?: string;
		inputmode?: any;
		bottom_label?: any;
		counter_visible?: any;
		disabled?: boolean;
		hidden?: boolean;
		link?: string;
		icon?: React.ReactNode;
		notUseArrow?: boolean;
		bottomsheet?: {
			show?: boolean;
			onClose?: () => void;
			header?: React.ReactNode;
			content?: React.ReactNode;
			footer?: React.ReactNode;
		};
		inputStyle?: {
			borderWrapper?: string;
			backgroundWrapper?: string;
			valueColor?: string;
		};
	};
	onClick?: () => void;
	onChange?: (param: object) => void;
	onBlur?: (param?: object) => void;
	onChangeErrorMessage?: (param: object) => void;
	onClickLink?: (link: string) => void;
	buttonStyle?: React.CSSProperties;
}

const InputForm = ({
	className,
	inputClassName = '',
	formId,
	data,
	onClick = () => {},
	onChange = () => {},
	onBlur = () => {},
	onChangeErrorMessage = () => {},
	onClickLink = () => {},
	buttonStyle,
}: Props) => {
	const [isOpenBottomsheetDropdown, setisOpenBottomsheetDropdown] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isOrderForm, setIsOrderForm] = useState(false);

	const inputAreaRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const pathname = window.location.pathname;
		setIsOrderForm(pathname?.includes('/order'));
	}, [isOpenBottomsheetDropdown]);

	const [checkedAlergic, setCheckedAlergic] = useState(data?.disabled);
	const handleCheckboxAlergic = () => {
		setCheckedAlergic(!checkedAlergic);
	};

	useEffect(() => {
		if (data.type === INPUTFORM_CONST.alergic) {
			if (checkedAlergic) {
				setErrorMessage(null);
				onChangeErrorMessage({
					name: data?.name,
					errorMessage: null,
					type: data?.type,
					formId: formId,
					value: data?.value,
				});

				onChange({
					name: data?.name,
					type: data?.type,
					formId: formId,
					value: 'Tidak Ada',
					disabled: true,
				});
			} else {
				if (data?.value) {
					onChange({
						name: data?.name,
						type: data?.type,
						formId: formId,
						value: data?.value != null ? (data?.value == 'Tidak Ada' ? '' : data?.value) : '',
						disabled: false,
					});

					const validateRes = validateInput(data?.name, data?.value);
					setErrorMessage(validateRes);
					onChangeErrorMessage({
						name: data?.name,
						errorMessage: validateRes,
						type: data?.type,
						formId: formId,
						value: data?.value,
					});
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkedAlergic, data?.type]);

	if (data?.hidden) {
		return null;
	} else if (data?.type == INPUTFORM_CONST.options_radio) {
		return (
			<div className={className} id={formId}>
				{data?.title && (
					<label className="tw-mb-2 title-14-medium tw-text-tpy-def tw-bg-background-def">
						{data?.title} {data?.isRequired && <span className="tw-text-error-600">*</span>}
					</label>
				)}
				<div className="tw-flex tw-flex-row tw-m-0 tw-gap-4">
					{data?.options &&
						data?.options.length &&
						data.options.map((element: any, id) => (
							<button
								id={element?.idComponent ?? ''}
								key={'options' + id}
								className={cx(
									'tw-flex-1 tw-w-full tw-px-4 tw-p-3.5 tw-rounded tw-border-none tw-capitalize body-14-regular',
									data?.value != null && data?.value == element?.id
										? 'tw-bg-primary-def !tw-text-tpy-50'
										: 'tw-bg-monochrome-150 !tw-text-tpy-def',
								)}
								onClick={() => {
									if (!data?.disabled) {
										onChange({
											name: data?.name,
											type: data?.type,
											formId: formId,
											value: element.id,
										});
									}
								}}
								style={
									buttonStyle && data?.value != null && data?.value == element?.id
										? buttonStyle
										: {}
								}
							>
								{element.name}
							</button>
						))}
				</div>
				<ErrorMessage errorMessage={errorMessage} data={data} isOrderForm={isOrderForm} />
			</div>
		);
	} else if (data?.type == INPUTFORM_CONST.dropdown) {
		return data?.hidden ? null : (
			<>
				{!data?.disabled ? (
					<div className={className} id={formId}>
						{data?.title && (
							<label className="tw-mb-2 title-14-medium tw-text-tpy-def tw-bg-background-def">
								{data?.title ?? ''}{' '}
								{data?.isRequired && <span className="tw-text-error-600">*</span>}
							</label>
						)}
						<div
							className="tw-flex tw-m-0 tw-bg-monochrome-150 tw-rounded-[4px] tw-cursor-pointer tw-items-center"
							onClick={() => {
								console.log('onopen');
								setisOpenBottomsheetDropdown(true);
							}}
						>
							<p className="tw-mb-0 tw-py-3 tw-px-4 tw-flex-1 tw-break-words body-14-regular">
								{data?.valueText ?? data?.placeholder ?? ''}
							</p>
							<div className="tw-mr-4 tw-ml-2">
								<IconRight />
							</div>
						</div>
						<div id="popupdropdown">
							<PopupBottomsheetDropdown
								data={data}
								isSwipeableOpen={isOpenBottomsheetDropdown}
								setIsSwipeableOpen={(isOpen) => setisOpenBottomsheetDropdown(isOpen)}
								onChange={(value) => {
									onChange({
										name: data?.name,
										type: data?.type,
										formId: formId,
										value: value,
									});
								}}
							/>
						</div>
					</div>
				) : (
					<div className={className} id={formId}>
						{data?.title && (
							<label className="tw-mb-2 title-14-medium tw-text-tpy-def tw-bg-background-def">
								{data?.title ?? ''}{' '}
								{data?.isRequired && <span className="tw-text-error-600">*</span>}
							</label>
						)}
						<input
							style={{
								resize: 'none',
								width: '-webkit-fill-available',
							}}
							maxLength={data?.max_length ?? null}
							className={classNames(
								inputClassName,
								data?.disabled ? '!tw-bg-monochrome-300 tw-text-tpy-700' : '',
								'tw-flex-1 body-14-regular tw-px-4 tw-py-3.5',
								styles.defaultInput,
								errorMessage || data?.errorMessage ? styles.invalidForm : 'tw-border-0',
							)}
							disabled
							value={data?.valueText}
						/>
					</div>
				)}
			</>
		);
	} else if (data?.type == INPUTFORM_CONST.date) {
		return (
			<div className={className} id={formId}>
				{data?.title && (
					<label className="tw-mt-5 title-14-medium tw-text-tpy-def tw-bg-background-def">
						{data?.title ?? ''}{' '}
						{data?.isRequired && <span className="tw-text-error-600">*</span>}
					</label>
				)}
				<InputDate
					data={data}
					onChange={(val) =>
						onChange({
							name: data?.name,
							type: data?.type,
							formId: formId,
							value: val,
						})
					}
				/>
			</div>
		);
	} else if (data?.name == FORM_CONSULTATION.AGE) {
		return (
			<div className={className} id={formId}>
				{data?.title && (
					<label className="tw-mt-5 title-14-medium tw-text-tpy-def tw-bg-background-def">
						{data?.title ?? ''}{' '}
						{data?.isRequired && <span className="tw-text-error-600">*</span>}
					</label>
				)}

				{!data?.disabled ? (
					<div className="tw-mt-2">
						<InputDateScroll
							data={data}
							onChange={(val) => {
								onChange({
									name: data?.name,
									type: data?.type,
									formId: formId,
									value: val,
								});
							}}
							additionalClassName={
								errorMessage || data?.errorMessage ? styles.invalidForm : ''
							}
						/>
						<ErrorMessage errorMessage={errorMessage} data={data} isOrderForm={isOrderForm} />
					</div>
				) : (
					<input
						className={classNames(inputClassName, '!tw-bg-monochrome-150 tw-text-tpy-700')}
						disabled
						value={
							moment(data?.value ?? new Date()).format('DD MMMM YYYY') +
							' (' +
							calculateAgeYearMonth(data?.value ?? new Date()) +
							')'
						}
					/>
				)}
			</div>
		);
	} else if (data?.type == INPUTFORM_CONST.link) {
		return (
			<div className={className} id={formId}>
				{data?.title && (
					<label className="tw-mb-2 title-14-medium tw-text-tpy-def tw-bg-background-def">
						{data?.title ?? ''}{' '}
						{data?.isRequired && <span className="tw-text-error-600">*</span>}
					</label>
				)}

				{!data?.disabled ? (
					<div
						className={cx(
							'tw-flex tw-m-0 tw-bg-monochrome-150 tw-rounded-[4px] tw-cursor-pointer tw-items-center',
							errorMessage || data?.errorMessage ? styles.invalidForm : '',
						)}
						onClick={() => onClickLink(data.link)}
					>
						<p className="tw-mb-0 tw-py-3.5 tw-px-4 tw-flex-1 one-line-elipsis body-14-regular tw-text-monochrome-800">
							{data?.value || data?.placeholder || ''}
						</p>
						<div className="tw-mr-4 tw-ml-2">
							<IconRight />
						</div>
					</div>
				) : (
					<input
						className={classNames(inputClassName, '!tw-bg-monochrome-150 tw-text-tpy-700')}
						disabled
						value={data?.value}
					/>
				)}

				<ErrorMessage errorMessage={errorMessage} data={data} isOrderForm={isOrderForm} />
			</div>
		);
	} else if (data?.type == INPUTFORM_CONST.bottomsheet) {
		return (
			<div className={className} id={formId}>
				{data?.title && (
					<label className="tw-mb-2 title-14-medium">
						{data?.title ?? ''}{' '}
						{data?.isRequired && <span className="tw-text-error-600">*</span>}
					</label>
				)}

				<div
					className={cx(
						data?.inputStyle?.borderWrapper ?? 'tw-border-monochrome-200',
						data?.inputStyle?.backgroundWrapper ?? 'tw-bg-white',
						data?.inputStyle?.valueColor ?? 'tw-text-monochrome-700',
						'tw-flex tw-m-0 tw-rounded-[8px] tw-cursor-pointer tw-items-center tw-border tw-border-solid tw-h-9',
						errorMessage || data?.errorMessage ? styles.invalidForm : '',
					)}
					onClick={() => {
						if (!data?.disabled) {
							onClick();
						}
					}}
				>
					{data?.icon && <div className="tw-ml-2 tw-mt-[-3px]">{data?.icon}</div>}
					<p
						className={cx(
							'tw-mb-0 tw-px-2 tw-flex-1 one-line-elipsis label-12-medium',
							data?.inputStyle?.valueColor,
						)}
					>
						{data?.value || data?.placeholder || ''}
					</p>
					{!data?.disabled && !data?.notUseArrow && (
						<div className="tw-mr-2 tw-ml-2">
							<SvgIcon name="IconRight" height="16" width="16" />
						</div>
					)}
				</div>

				<ErrorMessage errorMessage={errorMessage} data={data} isOrderForm={isOrderForm} />

				<PopupBottomsheet
					expandOnContentDrag={false}
					isSwipeableOpen={data?.bottomsheet?.show}
					setIsSwipeableOpen={(isOpen) => {
						if (!isOpen) data?.bottomsheet?.onClose();
					}}
					headerComponent={data?.bottomsheet?.header}
					footerComponent={data?.bottomsheet?.footer}
				>
					{data?.bottomsheet?.content}
				</PopupBottomsheet>
			</div>
		);
	} else if (data?.type == INPUTFORM_CONST.textarea) {
		const textareaRef = useRef<HTMLTextAreaElement>(null);

		useEffect(() => {
			if (textareaRef.current && data?.value) {
				const textarea = textareaRef.current;
				textarea.style.height = 'auto';
				textarea.style.height = textarea.scrollHeight + 'px';
			}
		}, [data?.value]);

		return (
			<div className={className} id={formId}>
				{data?.title && (
					<label className="tw-mb-2 title-14-medium">
						{data?.title ?? ''}{' '}
						{data?.isRequired && <span className="tw-text-error-600">*</span>}
					</label>
				)}
				<textarea
					id={data?.idComponent}
					ref={textareaRef}
					disabled={data?.disabled}
					style={{
						resize: 'none',
						width: '-webkit-fill-available',
						overflow: 'hidden',
					}}
					maxLength={data?.max_length ?? null}
					className={cx(
						inputClassName,
						data?.disabled ? '!tw-bg-monochrome-300 tw-text-monochrome-700' : '',
						'tw-flex-1 body-14-regular tw-px-4 tw-py-3.5',
						styles.defaultInput,
						errorMessage || data?.errorMessage ? styles.invalidForm : 'tw-border-0',
					)}
					value={data?.value ?? ''}
					placeholder={data?.placeholder}
					rows={1}
					onChange={(e) => {
						setErrorMessage(null);
						onChangeErrorMessage({
							name: data?.name,
							errorMessage: null,
							type: data?.type,
							formId: formId,
							value: data?.value,
						});
						let tempVal = data?.max_length
							? e.target.value.substring(0, data?.max_length)
							: e.target.value;
						if (data?.inputmode == 'numeric') {
							tempVal = removeCharByregex(tempVal, REGEX_CONST.numeric);
						}

						if (data?.inputmode == 'alphabet') {
							tempVal = removeCharByregex(tempVal, REGEX_CONST.alphabet);
						}

						if (data?.inputmode == 'email') {
							tempVal = removeCharByregex(tempVal, REGEX_CONST.email);
						}

						// Remove newlines so pressing enter does not add a new line
						tempVal = tempVal.replace(/[\r\n]+/g, '');

						onChange({
							name: data?.name,
							type: data?.type,
							formId: formId,
							value: String(tempVal).trimStart(),
						});

						// Auto-grow textarea
						const target = e.target as HTMLTextAreaElement;
						target.style.height = 'auto';
						target.style.height = target.scrollHeight + 'px';
					}}
					inputMode={data?.inputmode ?? 'text'}
					onKeyDown={(e) => {
						// Prevent enter key from creating a new line
						if (e.key === 'Enter') {
							e.preventDefault();
						}
					}}
					onBlur={(e) => {
						onBlur();
						const validateRes = validateInput(data?.name, data?.value);
						setErrorMessage(validateRes);
						onChangeErrorMessage({
							name: data?.name,
							errorMessage: validateRes,
							type: data?.type,
							formId: formId,
							value: data?.value,
						});
						// Optionally shrink back to 1 row if empty
						const target = e.target as HTMLTextAreaElement;
						if (!target.value) {
							target.style.height = 'auto';
						}
					}}
				/>
				<ErrorMessage errorMessage={errorMessage} data={data} isOrderForm={isOrderForm} />
				<AllergicCheckbox
					data={data}
					checkedAlergic={checkedAlergic}
					handleCheckboxAlergic={handleCheckboxAlergic}
				/>
			</div>
		);
	}
	return (
		<div className={className} id={formId}>
			{data?.title && (
				<label className="tw-mb-2 title-14-medium tw-text-tpy-def tw-bg-background-def">
					{data?.title ?? ''}{' '}
					{data?.isRequired && <span className="tw-text-error-600">*</span>}
				</label>
			)}
			<div
				className={cx(
					'tw-flex tw-items-center tw-rounded',
					data?.disabled
						? '!tw-bg-monochrome-300 tw-text-monochrome-700'
						: 'tw-bg-monochrome-150',
				)}
			>
				{data?.icon && <div className="tw-ml-2 tw-mt-[-3px]">{data?.icon} </div>}
				<input
					id={data?.idComponent}
					ref={inputAreaRef}
					type={data?.type ?? 'text'}
					disabled={data?.disabled}
					style={{
						resize: 'none',
						width: '-webkit-fill-available',
					}}
					maxLength={data?.max_length ?? null}
					className={cx(
						inputClassName,
						data?.disabled ? '!tw-bg-monochrome-300 tw-text-monochrome-700' : '',
						'tw-flex-1 body-14-regular tw-py-3.5',
						data?.icon ? '!tw-pl-2' : 'tw-px-4',
						styles.defaultInput,
						errorMessage || data?.errorMessage ? styles.invalidForm : 'tw-border-0',
					)}
					value={data?.value ?? ''}
					placeholder={data?.placeholder}
					onChange={(e) => {
						setErrorMessage(null);
						onChangeErrorMessage({
							name: data?.name,
							errorMessage: null,
							type: data?.type,
							formId: formId,
							value: data?.value,
						});
						let tempVal = data?.max_length
							? e.target.value.substring(0, data?.max_length)
							: e.target.value;
						if (data?.inputmode == 'numeric') {
							tempVal = removeCharByregex(tempVal, REGEX_CONST.numeric);
						}

						if (data?.inputmode == 'alphabet') {
							tempVal = removeCharByregex(tempVal, REGEX_CONST.alphabet);
						}

						if (data?.inputmode == 'email') {
							tempVal = removeCharByregex(tempVal, REGEX_CONST.email);
						}

						onChange({
							name: data?.name,
							type: data?.type,
							formId: formId,
							value: String(tempVal).trimStart(),
						});
					}}
					inputMode={data?.inputmode ?? 'text'}
					onBlur={() => {
						onBlur();
						const validateRes = validateInput(data?.name, data?.value);
						setErrorMessage(validateRes);
						onChangeErrorMessage({
							name: data?.name,
							errorMessage: validateRes,
							type: data?.type,
							formId: formId,
							value: data?.value,
						});
					}}
				/>
			</div>
			<ErrorMessage errorMessage={errorMessage} data={data} isOrderForm={isOrderForm} />
			<AllergicCheckbox
				data={data}
				checkedAlergic={checkedAlergic}
				handleCheckboxAlergic={handleCheckboxAlergic}
			/>
		</div>
	);
};

const ErrorMessage = ({ errorMessage, data, isOrderForm = false }) => {
	return (
		<div className="tw-flex">
			{(errorMessage || data?.errorMessage) && (
				<label className="body-12-regular tw-mt-2 tw-text-error-def tw-col-span-12">
					{errorMessage ?? data?.errorMessage}
				</label>
			)}
			{data?.bottom_label && (
				<label className="body-12-regular tw-mt-2 tw-text-tpy-700 tw-col-span-8">
					{data?.bottom_label}
				</label>
			)}
			{data?.counter_visible && (
				<label
					className="tw-flex-1 body-12-regular tw-mt-2 tw-text-tpy-700 tw-col-span-4 tw-text-right"
					style={isOrderForm ? { marginBottom: -20 } : null}
				>
					{(data?.value?.length ?? '0') + '/' + data?.max_length}
				</label>
			)}
		</div>
	);
};

const AllergicCheckbox = ({ data, checkedAlergic, handleCheckboxAlergic }) => {
	return (
		<>
			{/* Need to render checkbox twice to avoid glitch on render checkbox  */}
			{data?.type === INPUTFORM_CONST.alergic && data?.value ? (
				<>
					<label
						className="tw-text-tpy-def tw-bg-background-def tw-flex"
						style={{ paddingTop: 16, paddingBottom: 16 }}
					>
						<InputCheckbox
							inputId={BUTTON_ID.CHECK_ALERGIC_AUTO_FILL}
							className="tw-w-max tw-ml-0 tw-mr-3"
							checked={checkedAlergic}
							onChange={handleCheckboxAlergic}
						/>
						Tidak ada riwayat alergi
					</label>
				</>
			) : null}
			{data?.type === INPUTFORM_CONST.alergic && !data?.value ? (
				<>
					<label
						className="tw-text-tpy-def tw-bg-background-def"
						style={{ paddingTop: 16, paddingBottom: 16 }}
					>
						<InputCheckbox
							inputId={BUTTON_ID.CHECK_ALERGIC_AUTO_FILL}
							className="tw-w-max tw-ml-0 tw-mr-3 tw-mb-1.5"
							checked={checkedAlergic}
							onChange={handleCheckboxAlergic}
						/>
						Tidak ada riwayat alergi
					</label>
				</>
			) : null}
		</>
	);
};

export default InputForm;
