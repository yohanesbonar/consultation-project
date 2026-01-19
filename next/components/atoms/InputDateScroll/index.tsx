'use client';
import cx from 'classnames';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IconCalendar, IconClear } from '../../../assets';
import { BUTTON_CONST, BUTTON_ID, calculateAgeYearMonth } from '../../../helper';
import { PopupBottomsheet } from '@organisms';
import ButtonHighlight from '../ButtonHighlight';
import dynamic from 'next/dynamic';
import { setErrorAlertRedux } from 'redux/trigger';
import PopupErrorAlert from '../PopupErrorAlert';

// Dynamically import the component
const DateScrollPicker = dynamic(
	() => import('react-date-wheel-picker').then((mod) => mod.DateScrollPicker),
	{ ssr: false },
);

export interface IInputDateScrollProps {
	data: any;
	onChange: (value: any) => void;
	additionalClassName?: string;
}

export default function InputDateScroll(props: IInputDateScrollProps) {
	const { data, onChange, additionalClassName } = props;
	const yearNow = new Date().getFullYear();
	const dateNow = new Date().getDate();

	const [selectedDate, setSelectedDate] = useState<any>();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (data && isOpen) {
			setSelectedDate(data);
		}
	}, [data, isOpen]);

	const handleChange = (time) => {
		const tempTime = time;
		const temp = Object.assign({}, selectedDate);
		temp.value = tempTime;
		setSelectedDate(temp);
	};

	const monthMap = {
		1: 'Jan',
		2: 'Feb',
		3: 'Mar',
		4: 'Apr',
		5: 'May',
		6: 'Jun',
		7: 'Jul',
		8: 'Aug',
		9: 'Sep',
		10: 'Oct',
		11: 'Nov',
		12: 'Dec',
	};

	const dateConfig = {
		year: {
			format: 'YYYY',
			caption: 'Year',
			step: 1,
		},
		month: {
			format: (value) => monthMap[value.getMonth() + 1],
			caption: 'Mon',
			step: 1,
		},
		date: {
			format: 'DD',
			caption: 'Day',
			step: 1,
		},
	};

	return (
		<div
			id={BUTTON_ID.BUTTON_FORM_INPUT_BIRTHDATE}
			className={cx(
				'tw-relative tw-overflow-clip tw-flex tw-m-0 tw-py-3 tw-px-4 tw-bg-monochrome-150 tw-rounded tw-cursor-pointer tw-items-center',
				additionalClassName,
			)}
			onClick={() => setIsOpen(true)}
		>
			<p className="tw-mb-0 tw-flex-1 text-break body-14-regular tw-text-monochrome-800">
				{data?.value
					? moment(data?.value ?? new Date()).format('DD MMMM YYYY') +
					  ' (' +
					  calculateAgeYearMonth(data?.value ?? new Date()) +
					  ')'
					: data?.placeholder ?? 'Pilih Tanggal'}
			</p>
			<div color="gray" className="tw-border-0 tw-p-0">
				<IconCalendar />
			</div>

			<PopupBottomsheet
				expandOnContentDrag={false}
				isSwipeableOpen={isOpen}
				setIsSwipeableOpen={(isOpenBottomsheet) => setIsOpen(isOpenBottomsheet)}
				footerComponent={
					<div className="tw-p-4 tw-flex tw-gap-3">
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_SAVE}
							onClick={() => {
								if (
									!selectedDate?.value ||
									moment(new Date(selectedDate?.value)).isAfter(
										new Date().setMonth(new Date().getMonth() - 1),
									)
								) {
									setErrorAlertRedux({
										danger: true,
										data: {
											message: 'Tanggal lahir tidak valid',
										},
									});
									return;
								}
								onChange(selectedDate?.value ?? moment('1990-01-01').toDate());
								setTimeout(() => {
									setIsOpen(false);
								}, 1);
							}}
							text={BUTTON_CONST.SAVE}
							circularContainerClassName="tw-h-4"
							circularClassName="circular-inner-16"
						/>
					</div>
				}
				headerComponent={
					<div className="tw-py-6 tw-px-4 tw-flex-row tw-flex tw-items-center">
						<div
							onClick={() => {
								setTimeout(() => {
									setIsOpen(false);
								}, 1);
							}}
						>
							<IconClear />
						</div>
						<p className="tw-text-left tw-my-0 label-20-medium tw-ml-3 ">
							Pilih Tanggal Lahir
						</p>
					</div>
				}
			>
				<div className="tw-px-6">
					<div className="tw-h-52 customDatePicker">
						<DateScrollPicker
							onDateChange={handleChange}
							defaultYear={selectedDate?.value ? yearNow : 1990}
							defaultDay={dateNow}
							defaultMonth={
								selectedDate?.value ? new Date(selectedDate?.value).getMonth() : 0
							}
							startYear={new Date().getFullYear() - 99}
							itemHeight={36}
						/>
					</div>
				</div>
				<PopupErrorAlert />
			</PopupBottomsheet>
		</div>
	);
}
