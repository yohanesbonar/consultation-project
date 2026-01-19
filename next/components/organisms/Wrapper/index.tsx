'use client';
// TODO: fix these lints
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Defer, Head, Header } from '../../molecules';
import PopupBottomsheetExpiredConsultation from '../PopupBottomsheetExpiredConsultation';
import { connect, useSelector } from 'react-redux';
import {
	setNetworkState as setNetworkStateRedux,
	setIsPageLoading as setIsPageLoadingRedux,
} from '../../../redux/trigger';
import PopupBottomsheetOffline from '../PopupBottomsheetOffline';
import { CoachmarkDataType } from '../../../types/Coachmark';
import {
	FIELD_CONST,
	LOCALSTORAGE,
	checkWhitelist,
	getParsedLocalStorage,
	getStorageDecrypt,
} from '../../../helper';
import { useRouter } from 'next/router';
import { BiRefresh } from 'react-icons/bi';
import { clarityInit, claritySetCustomTag, clarityUpgrade } from 'helper/Clarity';
import { clarity } from 'react-microsoft-clarity';
import Scroll from 'react-scroll';
import { PopupErrorAlert } from '@atoms';
import classNames from 'classnames';
import { syncCalculateColorPage } from '@guetechteam/whitelabel/index';
import usePageLoaded from 'hooks/usePageLoaded';

type GeneralType = {
	networkState?: {
		isNeedToReconnect?: boolean;
	};
};

type Props = {
	general?: GeneralType;
	additionalId?: string;
	title?: string;
	staticTitle?: boolean;
	metaTitle?: string;
	desc?: string | string[];
	header?: boolean;
	headerImage?: string;
	footer?: boolean;
	footerComponent?: React.ReactNode;
	additionalStyleParent?: React.CSSProperties;
	additionalStyleContent?: React.CSSProperties;
	additionalClassNameContent?: string;
	additionalHeaderComponent?: React.ReactNode;
	additionalInnerHeaderComponent?: React.ReactNode;
	data?: any; // TODO: unused prop
	coachmarkHeaderData?: CoachmarkDataType;
	children?: React.ReactNode;
	isOverlay?: boolean;
	onClickHeaderTitle?: () => void;
	onClickBack?: () => void;
	isDataEmpty?: boolean;
	showEndHeader?: any;
	disableBackButton?: boolean;
	handleOnScroll?: (e: any) => void;
	titleStyle?: any; // TODO: unused prop
	headClass?: any; // TODO: unused prop
	coachmarkIndex?: any; // TODO: unused prop
	addParentHeaderClassname?: string;
	checkByQuery?: boolean;
	onScroll?: () => void;
	isHandleOnScroll?: boolean;
	titleClassName?: string;
	descClassName?: string;
	isCloseIcon?: boolean;
	optionalShowEndConsultation?: boolean;
	onForceEndConsultaiton?: () => void;
	customRightBtn?: React.ReactNode;
	headerColor?: string;
	headerTextColor?: string;
	backgroundColor?: string;
	customPopupComponent?: React.ReactNode;
	disableHeaderHeight?: boolean;
	disableFooterHeight?: boolean;
	isPreview?: boolean;
	customFooter?: React.ReactNode;
	preview?: any;
	customBackground?: boolean;
};

const Wrapper = ({
	general,
	additionalId = '',
	title,
	staticTitle = false,
	metaTitle = '',
	desc,
	header = true,
	headerImage,
	footer,
	footerComponent,
	additionalStyleParent,
	additionalStyleContent,
	additionalClassNameContent,
	additionalHeaderComponent,
	additionalInnerHeaderComponent,
	data,
	coachmarkHeaderData = null,
	children,
	isOverlay = false,
	onClickHeaderTitle = () => {},
	onClickBack = null,
	isDataEmpty = false,
	showEndHeader = false,
	disableBackButton = false,
	handleOnScroll = () => {},
	titleStyle = '',
	headClass = '',
	coachmarkIndex = 0,
	addParentHeaderClassname = 'body-width tw-fixed tw-w-full tw-z-10',
	checkByQuery = false,
	isHandleOnScroll = false,
	onScroll,
	titleClassName = '',
	descClassName = '',
	isCloseIcon = false,
	optionalShowEndConsultation = false,
	onForceEndConsultaiton,
	customRightBtn,
	headerColor,
	headerTextColor,
	backgroundColor,
	customPopupComponent,
	disableHeaderHeight,
	disableFooterHeight,
	isPreview,
	customFooter,
	preview,
	customBackground = false,
}: Props) => {
	const Element = Scroll.Element;
	const router = useRouter();
	const reconnectRef = useRef(general?.networkState?.isNeedToReconnect ?? false);
	const theme = useSelector(({ general }) => general?.theme);
	const toneColor = useSelector(({ general }) => general?.colorTonal);

	const [pullChange, setPullChange] = useState<any>();
	const startPointRef = useRef<any>(0);
	const mainContainerRef = useRef<any>(null);

	function runColors(target?: HTMLElement) {
		const root = target || document.body;
		syncCalculateColorPage(toneColor, root);
	}

	usePageLoaded(runColors, [toneColor, theme?.loading]);

	const setTagEmailOnClarity = async () => {
		if (clarity.hasStarted()) {
			try {
				const trackProgressForm = await getParsedLocalStorage(LOCALSTORAGE.FORM_CONSULTATION);
				if (trackProgressForm && trackProgressForm?.forms) {
					const emailForm = trackProgressForm?.forms?.find(
						(e: any) => e?.name === FIELD_CONST.EMAIL,
					);
					if (emailForm && emailForm?.value) {
						claritySetCustomTag('email', emailForm?.value);
						clarityUpgrade('add email tag');
					}
				}
				const ordernumberForm = trackProgressForm?.orderId;
				if (ordernumberForm) {
					claritySetCustomTag('orderNumber', ordernumberForm);
					clarityUpgrade('add ordernumber tag');
				}
			} catch (error) {
				console.log('error on get email from formconsul : ', error);
			}
		}
	};

	const setTagPartnerIdOnClarity = async () => {
		const xidFromLocal = await getStorageDecrypt(LOCALSTORAGE.XID);
		if (xidFromLocal) {
			claritySetCustomTag('partnerXid', xidFromLocal);
			clarityUpgrade('add partner xid tag');
		}
	};

	const initClarity = async () => {
		clarityInit();
		setTagEmailOnClarity();
		setTagPartnerIdOnClarity();
	};

	useEffect(() => {
		checkQuery();
		initClarity();
		if (window) {
			window.addEventListener('offline', (e) => {
				console.log('network state: offline');
				setNetworkStateRedux({
					isOnline: false,
					isNeedToReconnect: true,
					isDetected: true,
				});
				reconnectRef.current = true;
			});

			window.addEventListener('online', (e) => {
				console.log('network state: online');
				setNetworkStateRedux({
					isOnline: true,
					isNeedToReconnect: reconnectRef.current,
					isDetected: true,
				});
			});
		}

		return () => {
			setIsPageLoadingRedux(false);
			window.removeEventListener('offline', () => {});
			window.removeEventListener('online', () => {});
		};
	}, []);

	useEffect(() => {}, [coachmarkHeaderData]);

	const checkQuery = async () => {
		if (checkByQuery && router?.query?.wl) {
			const res = await checkWhitelist({
				w: router.query.wl,
			});

			if (!res?.meta?.acknowledge) {
				checkBot();
			}
		} else {
			checkBot();
		}
	};

	const checkBot = async () => {
		///////////temporary : remove detect bot
		// await detectBot();
	};

	useEffect(() => {
		if (isHandleOnScroll) {
			window.addEventListener('touchstart', pullStart);
			window.addEventListener('touchmove', pull);
			window.addEventListener('touchend', endPull);
			return () => {
				window.removeEventListener('touchstart', pullStart);
				window.removeEventListener('touchmove', pull);
				window.removeEventListener('touchend', endPull);
			};
		}
	}, [isHandleOnScroll]);

	const pullStart = (e) => {
		const { screenY } = e.targetTouches[0];
		startPointRef.current = screenY;
	};

	const pull = (e) => {
		let top = 1;
		try {
			top = mainContainerRef.current?.scrollTop;
		} catch (error) {
			console.log('error on get top scroll : ', error);
		}
		if (top == 0) {
			const touch = e.targetTouches[0];
			const { screenY } = touch;
			const pullLength =
				startPointRef.current < screenY ? Math.abs(screenY - startPointRef.current) : 0;
			setPullChange(pullLength);
			if (pullLength > 240) {
				setPullChange(0);
				startPointRef.current = 0;
				onScroll();
			}
		}
	};

	const endPull = (e) => {
		try {
			startPointRef.current = 0;
			setPullChange(0);
		} catch (error) {
			console.log('onscroll errror', error);
		}
	};

	const [headerHeight, setHeaderHeight] = useState('0px');
	const [footerHeight, setFooterHeight] = useState('0px');
	const headerRef = useRef(null);
	const footerRef = useRef(null);

	useLayoutEffect(() => {
		if (headerRef.current) {
			const height = String(headerRef.current.getBoundingClientRect().height) + 'px';
			if (height !== headerHeight) {
				setHeaderHeight(height);
			}
		}

		if (footerRef.current) {
			const height = String(footerRef.current.getBoundingClientRect().height) + 'px';
			if (height !== footerHeight) {
				setFooterHeight(height);
			}
		}
	});

	return (
		<React.Fragment>
			<Head title={metaTitle || title} isPreview={isPreview} />
			<div
				id="app"
				className={classNames(
					'tw-h-screen tw-w-full tw-overflow-hidden tw-flex tw-flex-col tw-max-w-[500px] tw-m-auto tw-overscroll-none height-dynamic',
					theme?.loading && !isPreview ? 'tw-opacity-0' : 'fade-in',
				)}
				style={{
					...(additionalStyleParent ? additionalStyleParent : null),
					...(preview?.backgroundColor
						? { ['--background-def']: preview?.backgroundColor }
						: {}),
				}}
			>
				{header && (
					<div
						id="header-container"
						className={addParentHeaderClassname}
						style={{ ...(isHandleOnScroll && pullChange ? { zIndex: 2 } : {}) }}
						ref={headerRef}
					>
						<Header
							title={title}
							staticTitle={staticTitle}
							desc={desc}
							headerImage={headerImage}
							data={data}
							coachmarkHeaderData={coachmarkHeaderData ?? null}
							onClickHeaderTitle={onClickHeaderTitle}
							onClickBack={onClickBack}
							showEndHeader={showEndHeader}
							disableBackButton={disableBackButton}
							additionalId={additionalId}
							additionalHeaderComponent={additionalHeaderComponent}
							additionalInnerHeaderComponent={additionalInnerHeaderComponent}
							titleStyle={titleStyle}
							isOverlay={isOverlay}
							titleClassName={titleClassName}
							descClassName={descClassName}
							isCloseIcon={isCloseIcon}
							optionalShowEndConsultation={optionalShowEndConsultation}
							onForceEndConsultaiton={onForceEndConsultaiton}
							customRightBtn={customRightBtn}
							headerColor={headerColor}
							headerTextColor={headerTextColor}
						/>
					</div>
				)}

				<Defer chunkSize={10}>
					<Element
						id="content"
						name="container"
						className={classNames(
							additionalClassNameContent,
							' body-width tw-fixed tw-w-full tw-z-1',
							customBackground ? '' : 'tw-bg-background-def',
						)}
						style={{
							flex: 1,
							overflowY: !isOverlay ? 'scroll' : 'hidden',
							...additionalStyleContent,
							...(isHandleOnScroll
								? { marginTop: pullChange ? pullChange / 3.118 : 0 }
								: {}),
							height: '100dvh',
						}}
						onScroll={handleOnScroll}
					>
						<div
							style={{ ...(disableHeaderHeight ? {} : { height: headerHeight }) }}
							ref={mainContainerRef}
						/>
						{isHandleOnScroll ? (
							<div
								className={`refresh-icon tw-absolute tw-top-2 tw-left-0 tw-right-0 tw-text-center tw-justify-center `}
								style={{
									marginTop: pullChange ? pullChange / 3.118 : 0,
									display: pullChange ? 'block' : 'none',
									zIndex: header ? 0 : 10,
								}}
							>
								<BiRefresh
									className={classNames(
										'tw-text-tpy-700',
										pullChange > 200 ? 'tw-bg-monochrome-100' : 'tw-bg-none',
									)}
									size={36}
									style={{
										transform: `rotate(${pullChange}deg)`,
										padding: 4,
										borderRadius: '100%',
									}}
								/>
							</div>
						) : null}
						{!isDataEmpty && children}
						<PopupBottomsheetExpiredConsultation />
						<PopupBottomsheetOffline />
						<div style={{ ...(disableFooterHeight ? {} : { height: footerHeight }) }} />
					</Element>
				</Defer>

				{customFooter && customFooter}

				{footer ? (
					<div
						id="footer"
						className="body-width tw-fixed tw-w-full tw-bottom-0 tw-bg-background-def bg-opacity-90 tw-z-2"
						ref={footerRef}
					>
						{isOverlay && (
							<div className="tw-absolute tw-inset-x-0 tw-inset-y-0 tw-bg-black tw-bg-opacity-80 tw-z-[1]" />
						)}
						{footerComponent ? footerComponent : <div></div>}
					</div>
				) : null}

				{isOverlay && (
					<div className="tw-absolute tw-inset-x-0 tw-inset-y-0 tw-bg-black tw-bg-opacity-80 tw-z-[1]" />
				)}
				<PopupErrorAlert />
				{customPopupComponent && customPopupComponent}
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
