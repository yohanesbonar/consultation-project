/* eslint-disable @typescript-eslint/no-empty-function */
import { connect } from 'react-redux';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { IconTimeGreen, IconTimeRed } from '../../../assets';
import { getFormattedTimeFromSeconds, OFFLINE_CONST } from '../../../helper';
import {
	setTimeLeft as setTimeLeftRedux,
	showEndConsul as showEndConsulRedux,
} from '../../../redux/trigger';
import { GENERAL_CONST } from '../../../helper';
import { DataChatDetail } from '../../../types/Chat';
import classNames from 'classnames';

type Props = {
	duration: number;
	setTimeLeft?: (val: number) => void;
	isDisplaying?: boolean;
	consulDetail?: DataChatDetail;
	general: {
		networkState: {
			isOnline: boolean;
			isNeedToReconnect: boolean;
			isDetected: boolean;
		};
		showEndConsultation: boolean;
	};
};

const CountdownTimerBar = ({
	duration = null,
	setTimeLeft = () => {},
	isDisplaying = true,
	consulDetail,
	general,
}: Props) => {
	const [time, setTime] = useState<number>();
	const [isBackOnline, setIsBackOnline] = useState<boolean>(false);
	const timerRef: any = useRef(null);

	useEffect(() => {
		if (duration != time) {
			clearTimeout(timerRef.current);
			setTime(duration);
		}
	}, [duration]);

	useEffect(() => {
		if (duration != null && time != null) {
			if (time > 0) {
				updateTimeLeft();
				showEndConsulBtn();
			} else {
				setTimeLeft(0);
				setTimeLeftRedux(0);
			}
		}
	}, [time]);

	useEffect(() => {
		if (general?.networkState?.isOnline && general?.networkState?.isDetected) {
			setIsBackOnline(true);
			setTimeout(() => {
				setIsBackOnline(false);
			}, 1000);
		}
	}, [general?.networkState]);

	const updateTimeLeft = () => {
		timerRef.current = setTimeout(() => {
			setTime(time - 1);
		}, 1000);
	};

	const showEndConsulBtn = () => {
		if (
			moment(consulDetail?.minConsultationAt).isSameOrBefore(moment()) &&
			!general?.showEndConsultation
		) {
			showEndConsulRedux(true);
		}
	};

	if (isDisplaying) {
		if (isBackOnline) {
			return (
				<div
					className={`tw-flex tw-flex-1 tw-flex-row tw-px-4 tw-py-3 tw-bg-success-50 tw-items-center`}
				>
					<p
						className={`tw-flex-1 tw-text-success-800 label-16-medium tw-mb-0 tw-ml-4 tw-text-center`}
					>
						{OFFLINE_CONST.BACK_ONLINE}
					</p>
				</div>
			);
		} else if (!general?.networkState?.isOnline) {
			return (
				<div className={`tw-flex tw-flex-1 tw-px-4 tw-py-3 tw-bg-error-def tw-justify-center `}>
					<p className={`label-16-medium tw-flex-1 tw-text-center tw-text-tpy-50`}>
						{OFFLINE_CONST.NO_INTERNET_CONNECTION}
					</p>
				</div>
			);
		} else {
			return (
				<div
					className={`tw-flex tw-flex-1 tw-px-4 tw-py-3 ${
						time < 60 || consulDetail?.status !== GENERAL_CONST.STARTED
							? 'tw-bg-error-100 tw-flex tw-flex-row tw-items-center'
							: 'tw-bg-success-50 tw-flex tw-flex-row tw-items-center'
					} `}
				>
					{time < 60 || consulDetail?.status !== GENERAL_CONST.STARTED ? (
						<IconTimeRed />
					) : (
						<IconTimeGreen />
					)}
					<p
						className={classNames(
							`label-16-medium tw-mb-0 tw-ml-4 tw-flex-1 `,
							time < 60 || consulDetail?.status !== GENERAL_CONST.STARTED
								? 'tw-text-error-600'
								: 'tw-text-success-800',
						)}
					>
						{time == 0 || consulDetail?.status !== GENERAL_CONST.STARTED
							? 'Telekonsultasi telah berakhir'
							: time < 60
							? 'Telekonsultasi akan berakhir'
							: 'Durasi Telekonsultasi'}
					</p>
					{time > 0 && consulDetail?.status == GENERAL_CONST.STARTED ? (
						<p
							className={classNames(
								`label-16-medium tw-mb-0 tw-flex-none `,
								time < 60 || consulDetail?.status !== GENERAL_CONST.STARTED
									? 'tw-text-error-600'
									: 'tw-text-success-800',
							)}
						>
							{getFormattedTimeFromSeconds(time)}
						</p>
					) : null}
				</div>
			);
		}
	} else {
		return null;
	}
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CountdownTimerBar);
