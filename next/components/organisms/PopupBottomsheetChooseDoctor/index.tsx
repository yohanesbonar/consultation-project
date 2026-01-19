import React from 'react';
import { connect } from 'react-redux';
import PopupBottomsheet from '../PopupBottomsheet';
import { IconClear, IconRiCalendarScheduleFill } from '@icons';
import { TSpecialization } from 'components/templates/OrderTemplate';
import { numberToIDR } from 'helper';
import cx from 'classnames';
import { isNull } from 'lodash';
import momentTimezone from 'moment-timezone';
type Props = {
	show?: boolean;
	toggle?: () => void;
	submit?: (specialization: TSpecialization) => void;
	data: any[];
	selected: any;
};

const PopupBottomsheetChooseDoctor = ({ show, toggle, submit, data, selected }: Props) => {
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={() => {
				toggle();
			}}
			headerComponent={
				<div className="tw-pt-6 tw-px-4 tw-flex-row tw-flex tw-items-center">
					<div
						onClick={() => {
							setTimeout(() => {
								toggle();
							}, 1);
						}}
					>
						<IconClear />
					</div>
					<p className="tw-text-left tw-my-0 title-18-medium tw-ml-3 ">Konsultasi dengan</p>
				</div>
			}
		>
			<div className="tw-w-full tw-max-h-[90dvh] tw-overflow-y-auto tw-flex-col tw-p-4">
				{data?.map((item) => {
					const { id, name, price, promoPrice, duration, schedules } = item;
					const browserTimezone = momentTimezone.tz.guess();
					// console.debug('browserTimezone', browserTimezone);

					let renderActiveHour = () => null;
					let isDisabled = false;

					/**
						 * example schedules data
						 *  "schedules": [
							{
								"day": 1,
								"hour_from": "08:00:00",
								"hour_to": "09:00:00"
							},
							{
								"day": 1,
								"hour_from": "08:00:00",
								"hour_to": "09:00:00"
							},
							{
								"day": 2,
								"hour_from": "08:00:00",
								"hour_to": "09:00:00"
							}
							{
								"day": 3,
								"hour_from": "08:00:00",
								"hour_to": "09:00:00"
							}
						]
						 */
					if (schedules?.length) {
						const todayInNumber = momentTimezone.tz('Asia/Jakarta').isoWeekday();

						// console.debug('todayInNumber', todayInNumber);
						const todaySchedules = schedules.filter(
							(schedule) => schedule.day === todayInNumber,
						);
						// console.debug('todaySchedules', todaySchedules);
						const todaySchedule = todaySchedules.find((schedule) => {
							return momentTimezone
								.tz('Asia/Jakarta')
								.isBetween(
									momentTimezone.tz(schedule.hour_from, 'HH:mm:ss', 'Asia/Jakarta'),
									momentTimezone.tz(schedule.hour_to, 'HH:mm:ss', 'Asia/Jakarta'),
								);
						});

						const todayScheduleButNotBetween = todaySchedules.find((schedule) =>
							momentTimezone
								.tz('Asia/Jakarta')
								.isBefore(momentTimezone.tz(schedule.hour_to, 'HH:mm:ss', 'Asia/Jakarta')),
						);
						// console.debug('todaySchedule', todaySchedule);

						if (todaySchedule) {
							renderActiveHour = () => (
								<div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-mt-2 tw-px-3 tw-py-2 tw-border-2 tw-border-dashed tw-border-monochrome-500 tw-rounded-lg">
									<div className="tw-flex tw-flex-row tw-items-center">
										<div className="tw-flex tw-flex-1 tw-flex-row tw-items-center">
											<IconRiCalendarScheduleFill />
											<span className="body-12-regular tw-text-black tw-ml-2">
												Tersedia pada
											</span>
										</div>
									</div>
									<span className="label-12-medium tw-text-black">{`jam ${momentTimezone
										.tz(todaySchedule.hour_from, 'HH:mm:ss', 'Asia/Jakarta')
										.clone()
										.tz(browserTimezone)
										.format('HH:mm')}-${momentTimezone
										.tz(todaySchedule.hour_to, 'HH:mm:ss', 'Asia/Jakarta')
										.clone()
										.tz(browserTimezone)
										.format('HH:mm')}`}</span>
								</div>
							);
						} else if (todayScheduleButNotBetween) {
							renderActiveHour = () => (
								<div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-mt-2 tw-px-3 tw-py-2 tw-border-2 tw-border-dashed tw-border-monochrome-500 tw-rounded-lg">
									<div className="tw-flex tw-flex-row tw-items-center">
										<div className="tw-flex tw-flex-1 tw-flex-row tw-items-center">
											<IconRiCalendarScheduleFill
												color={isDisabled ? '#989898' : '#666666'}
											/>
											<span
												className={cx(
													isDisabled
														? 'body-12-regular tw-ml-2 tw-text-tpy-700'
														: 'body-12-regular tw-ml-2 tw-text-tpy-def',
												)}
											>
												Tersedia lagi
											</span>
										</div>
									</div>
									<span
										className={cx(
											isDisabled
												? 'label-12-medium tw-text-tpy-700'
												: 'label-12-medium tw-text-black',
										)}
									>{`jam ${momentTimezone
										.tz(todayScheduleButNotBetween.hour_from, 'HH:mm:ss', 'Asia/Jakarta')
										.clone()
										.tz(browserTimezone)
										.format('HH:mm')}-${momentTimezone
										.tz(todayScheduleButNotBetween.hour_to, 'HH:mm:ss', 'Asia/Jakarta')
										.clone()
										.tz(browserTimezone)
										.format('HH:mm')}`}</span>
								</div>
							);
							isDisabled = true;
						} else {
							const anotherDaySchedules = schedules
								.filter((schedule) => schedule.day !== todayInNumber)
								.sort((a, b) => {
									if (a.day === b.day) {
										return a.hour_from.localeCompare(b.hour_from);
									}
									return a.day - b.day;
								});

							// console.debug('anotherDaySchedules', anotherDaySchedules);

							if (!anotherDaySchedules.length) {
								const nextScheduleDate = momentTimezone
									.tz('Asia/Jakarta')
									.add(7, 'day')
									.clone()
									.tz(browserTimezone)
									.format('DD MMM');
								// console.debug('nextScheduleDate', nextScheduleDate);
								const closestSchedule = todaySchedules[0];
								// console.debug('closestSchedule', closestSchedule);
								renderActiveHour = () => (
									<div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-mt-2 tw-px-3 tw-py-2 tw-border-2 tw-border-dashed tw-border-monochrome-500 tw-rounded-lg">
										<div className="tw-flex tw-flex-row tw-items-center">
											<div className="tw-flex tw-flex-1 tw-flex-row tw-items-center">
												<IconRiCalendarScheduleFill
													color={isDisabled ? '#989898' : '#666666'}
												/>
												<span
													className={cx(
														isDisabled
															? 'body-12-regular tw-ml-2 tw-text-tpy-700'
															: 'body-12-regular tw-ml-2 tw-text-tpy-def',
													)}
												>
													Tersedia lagi
												</span>
											</div>
										</div>
										<span
											className={cx(
												isDisabled
													? 'label-12-medium tw-text-tpy-700'
													: 'label-12-medium tw-text-black',
											)}
										>
											{`${nextScheduleDate} jam ${momentTimezone
												.tz(closestSchedule.hour_from, 'HH:mm:ss', 'Asia/Jakarta')
												.clone()
												.tz(browserTimezone)
												.format('HH:mm')}-${momentTimezone
												.tz(closestSchedule.hour_to, 'HH:mm:ss', 'Asia/Jakarta')
												.clone()
												.tz(browserTimezone)
												.format('HH:mm')}`}
										</span>
									</div>
								);
								isDisabled = true;
							} else {
								// console.debug('anotherDaySchedules', anotherDaySchedules);
								let nextScheduleDate;

								let closestSchedule;
								if (anotherDaySchedules.some((schedule) => schedule.day > todayInNumber)) {
									closestSchedule = anotherDaySchedules.find(
										(schedule) => schedule.day > todayInNumber,
									);
									nextScheduleDate = momentTimezone
										.tz('Asia/Jakarta')
										.add(closestSchedule.day - todayInNumber, 'day')
										.clone()
										.tz(browserTimezone)
										.format('DD MMM');
								} else {
									closestSchedule = anotherDaySchedules.find(
										(schedule) => schedule.day < todayInNumber,
									);
									nextScheduleDate = momentTimezone
										.tz('Asia/Jakarta')
										.add(7 - (todayInNumber - closestSchedule.day), 'day')
										.clone()
										.tz(browserTimezone)
										.format('DD MMM');
								}

								// console.debug('nextScheduleDate', nextScheduleDate);
								// console.debug('closestSchedule', closestSchedule);

								renderActiveHour = () => (
									<div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-mt-2 tw-px-3 tw-py-2 tw-border-2 tw-border-dashed tw-border-monochrome-500 tw-rounded-lg">
										<div className="tw-flex tw-flex-row tw-items-center">
											<div className="tw-flex tw-flex-1 tw-flex-row tw-items-center">
												<IconRiCalendarScheduleFill
													color={isDisabled ? '#989898' : '#666666'}
												/>
												<span
													className={cx(
														isDisabled
															? 'body-12-regular tw-ml-2 tw-text-tpy-700'
															: 'body-12-regular tw-ml-2 tw-text-tpy-def',
													)}
												>
													Tersedia lagi
												</span>
											</div>
										</div>
										<span
											className={cx(
												isDisabled
													? 'label-12-medium tw-text-tpy-700'
													: 'label-12-medium tw-text-black',
											)}
										>
											{`${nextScheduleDate} jam ${momentTimezone
												.tz(closestSchedule.hour_from, 'HH:mm:ss', 'Asia/Jakarta')
												.clone()
												.tz(browserTimezone)
												.format('HH:mm')}-${momentTimezone
												.tz(closestSchedule.hour_to, 'HH:mm:ss', 'Asia/Jakarta')
												.clone()
												.tz(browserTimezone)
												.format('HH:mm')}`}
										</span>
									</div>
								);
								isDisabled = true;
							}
						}
					}

					const selectedDoctor = selected?.id === id;
					return (
						<div
							key={id}
							className={cx(
								isDisabled
									? 'tw-flex tw-flex-col tw-p-4 tw-cursor-pointer tw-select-none  tw-rounded-lg tw-shadow tw-mb-4 hover:tw-opacity-100 tw-bg-[#F5F5F5]'
									: selectedDoctor
									? 'tw-flex tw-flex-col tw-p-4 tw-cursor-pointer tw-select-none  tw-rounded-lg tw-shadow tw-mb-4  hover:tw-opacity-100 tw-bg-[#E2F1FC]'
									: 'tw-flex tw-flex-col tw-p-4 tw-cursor-pointer tw-select-none  tw-rounded-lg tw-shadow tw-mb-4 hover:tw-opacity-80',
							)}
							onClick={
								isDisabled
									? null
									: () => {
											submit({
												specialization_id: id,
												specialization_name: name,
											});
											toggle();
									  }
							}
						>
							<div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full">
								<div>
									<div
										className={cx(
											isDisabled
												? 'body-14-regular tw-text-tpy-700'
												: 'body-14-regular tw-text-black',
										)}
									>
										{name}
									</div>
									<div
										className={cx(
											isDisabled
												? 'body-12-regular tw-text-tpy-700'
												: 'body-12-regular tw-text-black',
										)}
									>
										{duration} menit konsultasi
									</div>
								</div>
								<div className="tw-flex tw-flex-row">
									{pricingDoctor(price, promoPrice) === 'free_consultation' ? (
										<div
											className={cx(
												isDisabled
													? 'title-14-medium tw-text-tpy-700'
													: 'title-14-medium tw-text-primary-def',
											)}
										>
											Gratis
										</div>
									) : pricingDoctor(price, promoPrice) === 'promo' ? (
										<>
											<div
												className={cx(
													isDisabled
														? 'title-14-medium tw-line-through tw-text-tpy-700'
														: 'title-14-medium tw-line-through tw-text-tpy-800',
												)}
											>
												{numberToIDR(price)}
											</div>
											<div
												className={cx(
													isDisabled
														? 'title-14-medium tw-ml-2 tw-text-tpy-700'
														: 'title-14-medium tw-ml-2 tw-text-primary-def ',
												)}
											>
												{numberToIDR(promoPrice)}
											</div>
										</>
									) : pricingDoctor(price, promoPrice) === 'no_promo' ? (
										<div
											className={cx(
												isDisabled
													? 'title-14-medium tw-ml-2 tw-text-tpy-700'
													: 'title-14-medium tw-ml-2 tw-text-black ',
											)}
										>
											{numberToIDR(price)}
										</div>
									) : null}
								</div>
							</div>
							{renderActiveHour()}
						</div>
					);
				})}
			</div>
		</PopupBottomsheet>
	);
};

export const pricingDoctor = (price, promoPrice): 'free_consultation' | 'no_promo' | 'promo' => {
	if (isNull(price)) return 'free_consultation';
	if (isNull(promoPrice) && price === 0) return 'free_consultation';
	if (isNull(promoPrice)) return 'no_promo';
	return 'promo';
};

const mapStateToProps = (state) => ({
	// isChatExpired: state.general.isChatExpired,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetChooseDoctor);
