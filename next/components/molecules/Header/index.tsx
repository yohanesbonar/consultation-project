/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import { BUTTON_ID, STATUS_CONST } from '../../../helper';
import { IconBack, IconCloseThin } from '../../../assets';
import { Coachmark, SkeletonHeader } from '../../organisms';
import { setIsOpenBottomsheetEndConsul as setIsOpenBottomsheetEndConsulRedux } from '../../../redux/trigger';
import { connect } from 'react-redux';
import { ImageLoading } from '../../atoms';
import { CoachmarkDataType } from '../../../types/Coachmark';
import classNames from 'classnames';

type GeneralType = {
	networkState?: {
		isOnline?: boolean;
		isDetected?: boolean;
	};
	isPageLoading?: boolean;
	timeLeft?: number;
};

type DataType = {
	desc?: string;
	title?: string;
};

type ConsulDetailType = {
	status?: string;
};

type Props = {
	general?: GeneralType;
	data?: DataType;
	additionalHeaderComponent?: React.ReactNode;
	additionalInnerHeaderComponent?: React.ReactNode;
	additionalId?: string;
	title?: string;
	staticTitle?: boolean;
	desc?: string | string[];
	headerImage?: string;
	coachmarkHeaderData?: CoachmarkDataType;
	onClickHeaderTitle?: () => void;
	onClickBack?: () => void;
	showEndHeader?: boolean;
	disableBackButton?: boolean;
	consulDetail?: ConsulDetailType;
	titleStyle?: any; // TODO: unused prop
	isOverlay?: boolean;
	titleClassName?: string;
	descClassName?: string;
	isCloseIcon?: boolean;
	optionalShowEndConsultation?: boolean;
	onForceEndConsultaiton?: () => void;
	customRightBtn?: React.ReactNode;
	headerColor?: string;
	headerTextColor?: string;
};

const Header = ({
	general,
	data,
	additionalHeaderComponent,
	additionalInnerHeaderComponent,
	additionalId = '',
	title,
	staticTitle = false,
	desc,
	headerImage,
	coachmarkHeaderData = null,
	onClickHeaderTitle = () => {},
	onClickBack = null,
	showEndHeader = false,
	disableBackButton = false,
	consulDetail,
	titleStyle = '',
	isOverlay,
	titleClassName = '',
	descClassName = '',
	isCloseIcon,
	optionalShowEndConsultation = false,
	onForceEndConsultaiton,
	customRightBtn,
	headerColor,
	headerTextColor,
}: Props) => {
	const [isOffline, setIsOffline] = useState(false);

	const consutationEndCondition =
		consulDetail?.status == STATUS_CONST.STARTED || optionalShowEndConsultation;
	const forceWithTimeLeft = optionalShowEndConsultation ? true : general?.timeLeft != 0;

	useEffect(() => {}, [coachmarkHeaderData]);

	useEffect(() => {
		if (general?.networkState?.isOnline && general?.networkState?.isDetected) {
			setTimeout(() => {
				setIsOffline(false);
			}, 1000);
		} else if (!general?.networkState?.isOnline) {
			setIsOffline(true);
		}
	}, [general?.networkState?.isOnline]);

	const getDesc = () => {
		let res = '';
		const descTemp = data?.desc ?? desc ?? '';
		if (descTemp instanceof Array) {
			res = descTemp[0];
			descTemp.forEach((element, index) => {
				if (index > 0) {
					res += ', ' + element;
				}
			});
		} else {
			res = descTemp;
		}
		return res;
	};

	return (
		<React.Fragment>
			<div
				id="header"
				className={cx(
					'app-header',
					!additionalInnerHeaderComponent ? 'tw-h-[56px]' : 'tw-h-max',
					'tw-bg-primary-def',
				)}
				style={{
					filter: !isOffline ? 'grayscale(0)' : 'grayscale(1)',
					...(headerColor
						? {
								filter: !isOffline ? 'grayscale(0)' : 'grayscale(1)',
								['--primary-def']: headerColor,
						  }
						: {}),
				}}
			>
				{general?.isPageLoading && !staticTitle ? (
					<SkeletonHeader id={additionalId} />
				) : (
					<div className="tw-flex tw-flex-col tw-flex-1">
						<div className="menu tw-min-h-14">
							{!disableBackButton && (
								<a
									id={BUTTON_ID.BUTTON_BACK + '-' + additionalId}
									data-bs-display="static"
									className="menu-link"
									onClick={onClickBack != null ? onClickBack : () => Router.back()}
								>
									<div
										className="menu-img online tw-text-tpy-50 tw-bg-primary-def"
										style={{ padding: 4 }}
									>
										{isCloseIcon ? (
											<span className="tw-ml-3">
												<IconCloseThin />{' '}
											</span>
										) : (
											<IconBack />
										)}
									</div>
								</a>
							)}

							<Coachmark
								className="tw-flex tw-flex-1 tw-relative"
								classNameContainer={
									'tw-flex tw-flex-1 tw-h-full ' + (disableBackButton ? 'tw-mx-2' : '')
								}
								title={coachmarkHeaderData?.title ?? ''}
								desc={coachmarkHeaderData?.desc ?? ''}
								dotActivePosition={coachmarkHeaderData?.dotActivePosition ?? 1}
								dotLength={coachmarkHeaderData?.dotLength ?? 1}
								onClickNext={coachmarkHeaderData?.onPressNext}
								isPopoverOpen={coachmarkHeaderData?.isShow ?? false}
								targetId="popoverHeaderTitle"
								idNext={coachmarkHeaderData?.idNext}
								isOverlay={isOverlay}
							>
								{coachmarkHeaderData?.isShow && (
									<div className="tw-w-flex tw-w-full tw-h-full tw-absolute tw-z-10"></div>
								)}
								<div className="tw-flex tw-items-center tw-justify-between tw-w-full">
									<div
										id={BUTTON_ID.BUTTON_DETAIL_HEADER + '-' + additionalId}
										className={`${
											headerImage
												? 'tw-text-tpy-50 tw-bg-primary-def tw-border tw-border-primary-def'
												: 'tw-bg-primary-def'
										} tw-flex tw-flex-1 tw-p-1 tw-rounded-[28px] tw-cursor-pointer tw-items-center tw-flex-wrap tw-gap-2`}
										onClick={onClickHeaderTitle}
										style={headerColor ? { backgroundColor: headerColor } : {}}
									>
										{headerImage && (
											<div className="menu-img online tw-relative tw-h-9 tw-w-9 tw-rounded-half">
												{
													// !isOffline ? (
													<ImageLoading
														classNameContainer="tw-rounded-half tw-overflow-hidden"
														className="tw-rounded-half"
														data={{ url: headerImage }}
													/>
													// ) : (
													// 	<IconOfflineDoctor />
													// )
												}
											</div>
										)}
										<div className="tw-flex-1 tw-ml-2 tw-flex tw-flex-col tw-bg-primary-def tw-overflow-hidden tw-w-[200px]">
											<p
												className={classNames(
													'title-18-medium one-line-elipsis tw-mb-0 tw-bg-primary-def tw-text-tpy-50',
												)}
												style={{
													...(headerTextColor ? { color: headerTextColor } : {}),
												}}
											>
												{
													// isOffline
													// 	? OFFLINE_CONST.FAILED_LOAD_CONTENT
													// 	:
													data?.title ?? title ?? 'Telekonsultasi'
												}
											</p>
											<p
												className={classNames(
													'tw-mt-0.5 tw-text-xs tw-leading-[13px] tw-tracking-[0.19px] tw-mb-0 tw-font-roboto text-truncate',
													'tw-text-tpy-50 tw-bg-primary-def',
												)}
												style={{
													...(headerTextColor ? { color: headerTextColor } : {}),
												}}
											>
												{
													// isOffline
													// 	? OFFLINE_CONST.FAILED_LOAD_CONTENT
													// 	:
													getDesc()
												}
											</p>
										</div>
									</div>
									{customRightBtn && customRightBtn}
									{consutationEndCondition &&
										forceWithTimeLeft &&
										!isOffline &&
										showEndHeader && (
											<div>
												<div
													id={BUTTON_ID.BUTTON_END + '-' + additionalId}
													className="tw-text-tpy-50 tw-bg-primary-def tw-border tw-border-primary-def tw-px-4 tw-py-[13px] tw-rounded-[28px] tw-cursor-pointer"
													onClick={() => {
														if (optionalShowEndConsultation) {
															onForceEndConsultaiton();
														} else {
															setIsOpenBottomsheetEndConsulRedux(true);
														}
													}}
												>
													AKHIRI
												</div>
											</div>
										)}
								</div>
							</Coachmark>
						</div>
						{additionalInnerHeaderComponent && additionalInnerHeaderComponent}
					</div>
				)}
			</div>
			{additionalHeaderComponent != null ? (
				general?.isPageLoading ? (
					<p className="tw-mb-0">
						<Skeleton className="tw-leading-normal tw-h-[48px]" />
					</p>
				) : (
					additionalHeaderComponent
				)
			) : null}
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
	consulDetail: state.general.consulDetail.result,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
