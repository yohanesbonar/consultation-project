/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react';
import PopupBottomsheet from '../PopupBottomsheet';
import { ButtonHighlight } from '@atoms';
import {
	IconBad,
	IconBest,
	IconGood,
	IconWorst,
	IconBadActive,
	IconBestActive,
	IconGoodActive,
	IconWorstActive,
	IconPrescAccept,
	IconPrescReject,
} from '@icons';
import { RATING_CONST, RATING_TYPE } from './constants';
import styles from './inde.module.css';
import cx from 'classnames';
import {
	backHandling,
	checkIsEmpty,
	endConsultation,
	getLocalStorage,
	LOCALSTORAGE,
	removeLocalStorage,
} from 'helper';
import { CountdownNumber } from '@molecules';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRate } from 'redux/actions/ratingAction';
import { useRouter } from 'next/router';
import { postSubmitRating } from 'helper/Network/rating';

type Props = {
	show: boolean;
	toggle: () => void;
	prescriptionStatus?: string;
	consulDetail?: any;
	callbackSubmit?: () => void;
};

const PopupBottomsheetRating = ({
	show,
	toggle,
	prescriptionStatus,
	consulDetail,
	callbackSubmit = null,
}: Props) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const [active, setActive] = React.useState('');
	const [disabledBtn, setDisabledBtn] = React.useState(false);
	const [submitFeedback, setSubmitFeedback] = React.useState<boolean>(false);
	const [detailReview, setDetailReview] = React.useState('');
	const [selected, setSelected] = React.useState([]);
	const [submitStatus, setSubmitStatus] = React.useState<'idle' | '0' | '1'>('idle');

	const payload = {
		order_number: global.orderNumber,
		score: active,
		feedback: selected,
		detail_feedback: detailReview,
	};

	const handleEndConsul = async ({
		redirect = false,
		withoutEnd = false,
		autoRedirect = false,
	}: any) => {
		if (!withoutEnd) await endConsultation(global.orderNumber, {});
		const res = await postSubmitRating({ body: payload, token: router.query?.token });
		if (res?.meta?.acknowledge && autoRedirect && withoutEnd) setSubmitFeedback(true);

		if (res?.meta?.acknowledge && !autoRedirect && withoutEnd) {
			if (callbackSubmit != null) {
				callbackSubmit();
				return;
			}
			router.push({
				pathname: '/prescription-detail',
			});
			return;
		}

		if (res?.meta?.acknowledge && !autoRedirect) {
			if (redirect) {
				removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
				const redirectUrl = await getLocalStorage(LOCALSTORAGE.REDIRECT_URL);
				const url = redirectUrl || consulDetail?.endUrl;
				backHandling({ router, backToPartner: url });
				toggle();
			} else return;
		}
	};

	React.useEffect(() => {
		dispatch(fetchRate());
	}, [dispatch]);

	React.useEffect(() => {
		if (show) {
			if (consulDetail?.ratingDoctorData && !(consulDetail?.redirectAfter && submitFeedback)) {
				setSubmitStatus('1');
				toggle();
			} else {
				setSubmitStatus('0');
			}
		} else {
			setSubmitStatus('idle');
		}
	}, [show]);

	const prescAcceptSub = `Resep digital sudah terlampir otomatis pada keranjang ${consulDetail?.consultationPartner}`;
	const prescRejectSub = `Obat tidak sesuai indikasi medis. Anda akan kembali ke ${consulDetail?.consultationPartner}`;

	return submitStatus !== '0' ? (
		<></>
	) : (
		<PopupBottomsheet
			isSwipeableOpen={show}
			footerComponent={
				<>
					{!submitFeedback && (
						<>
							<div className={styles.containerFooter}>
								<ButtonHighlight
									color={'primary'}
									isDisabled={!disabledBtn}
									onClick={
										prescriptionStatus
											? () => {
													if (consulDetail?.redirectAfter == '0') {
														handleEndConsul({ redirect: true });
													} else {
														handleEndConsul({});
														setSubmitFeedback(true);
													}
											  }
											: () =>
													handleEndConsul({
														withoutEnd: true,
														autoRedirect: consulDetail?.redirectAfter
															? consulDetail?.redirectAfter !== '0'
															: false,
													})
									}
								>
									{RATING_CONST.SUBMIT_BTN}
								</ButtonHighlight>
							</div>
							{/* DK-275: TODO: temporary hide this button, uncomment after improve on popup feedback  */}
							{/* {prescriptionStatus && (
								<p className="body-14-regular tw-text-center">
									Masih ingin konsultasi?
									<span
										onClick={toggle}
										className="label-14-medium tw-underline tw-text-blue-secondary"
									>
										{' '}
										Kembali ke Chat
									</span>
								</p>
							)} */}
						</>
					)}
				</>
			}
		>
			<div className={styles.containerBody}>
				{prescriptionStatus ? (
					<div className={styles.headPrescContainer}>
						{prescriptionStatus === 'ACCEPT' ? <IconPrescAccept /> : <IconPrescReject />}
						<div className="tw-w-[251px] tw-ml-3">
							<p className="title-16-medium tw-mb-0">
								{prescriptionStatus === 'ACCEPT'
									? RATING_CONST.PRESC_ACCEPT_TITLE
									: RATING_CONST.PRESC_REJECT_TITLE}
							</p>
							<p className="body-14-regular tw-mb-0 tw-text-tpy-def">
								{prescriptionStatus === 'ACCEPT' ? prescAcceptSub : prescRejectSub}
							</p>
						</div>
					</div>
				) : null}

				{consulDetail?.redirectAfter && submitFeedback ? (
					<>
						<div className="font-16 tw-px-4 tw-my-4 tw-text-center">
							Anda akan diarahkan kembali ke {consulDetail?.consultationPartner} dalam
						</div>
						<div className="tw-text-[24px] tw-mt-4 tw-mb-8 tw-text-center tw-text-red-600 tw-font-bold">
							<CountdownNumber
								duration={parseInt(consulDetail?.redirectAfter)}
								handleTimeout={async () => {
									removeLocalStorage(LOCALSTORAGE.PARTNER_CONSUL);
									const redirectUrl = await getLocalStorage(LOCALSTORAGE.REDIRECT_URL);
									const url = redirectUrl || consulDetail?.endUrl;
									backHandling({ router, backToPartner: url });
									if (
										callbackSubmit != null &&
										(checkIsEmpty(consulDetail?.redirectAfter) ||
											consulDetail?.redirectAfter == '0')
									) {
										toggle();
										callbackSubmit();
										return;
									}
								}}
							/>
						</div>
					</>
				) : (
					<>
						<p className={styles.title}>
							{prescriptionStatus === 'ACCEPT'
								? RATING_CONST.HEADER_TITLE_PRESC
								: RATING_CONST.HEADER_TITLE_CONSUL}
						</p>
						<RatingOption
							selected={selected}
							setSelected={setSelected}
							active={active}
							onClick={setActive}
							setEnable={setDisabledBtn}
						/>
						{active !== '' && (
							<input
								onChange={(e) => setDetailReview(e.target?.value)}
								className={cx(styles.input, styles.inputStyle)}
								placeholder={RATING_CONST.INPUT_PLACEHOLDER}
							/>
						)}
					</>
				)}
			</div>
		</PopupBottomsheet>
	);
};

const RatingOption = ({ active, onClick, setEnable, selected, setSelected }) => {
	const ratingStore: any = useSelector<any>(({ rating }) => rating?.rating);

	// mapping condition
	const findReasonFeedback = ratingStore?.data?.find((v: any) => v?.score === active)?.feedback;

	// handling select reason
	const onSelectReason = (id: number) => {
		const _temp = [...selected];
		const findExistingId = _temp.find((v) => v === id);

		if (findExistingId) {
			const findExistingIndex = _temp.findIndex((v) => v === id);
			_temp.splice(findExistingIndex, 1);
		} else {
			_temp.push(id);
		}
		setSelected(_temp);
		if (_temp?.length > 0) {
			setEnable(true);
		} else {
			setEnable(false);
		}
	};

	// handling reaction
	const handleReaction = (value: string) => {
		onClick(value);
		setSelected([]);
		setEnable(false);
	};

	return (
		<>
			<div className={styles.reactionContainer}>
				{ratingStore?.data?.length
					? ratingStore?.data?.map((item: any) => (
							<div key={item?.xid} onClick={() => handleReaction(item?.score)}>
								{item?.score == RATING_TYPE.W ? (
									<>{active == RATING_TYPE.W ? <IconWorstActive /> : <IconWorst />}</>
								) : item?.score == RATING_TYPE.BD ? (
									<>{active == RATING_TYPE.BD ? <IconBadActive /> : <IconBad />}</>
								) : item?.score == RATING_TYPE.GD ? (
									<>{active == RATING_TYPE.GD ? <IconGoodActive /> : <IconGood />}</>
								) : (
									<>{active == RATING_TYPE.BS ? <IconBestActive /> : <IconBest />}</>
								)}
							</div>
					  ))
					: ''}
			</div>

			<div>
				{active === RATING_TYPE.W && (
					<p className={styles.labelMessage}>{RATING_CONST.W_REASON}</p>
				)}
				{active === RATING_TYPE.BD && (
					<p className={styles.labelMessage}>{RATING_CONST.BD_REASON}</p>
				)}
				{active === RATING_TYPE.GD && (
					<p className={styles.labelMessage}>{RATING_CONST.GD_REASON}</p>
				)}
				{active === RATING_TYPE.BS && (
					<p className={styles.labelMessage}>{RATING_CONST.BS_REASON}</p>
				)}
			</div>

			{/* WILL DYNAMIC -> */}
			{active !== '' && (
				<div className="tw-mb-3">
					{findReasonFeedback?.map((v: any, i: number) => {
						return (
							<span
								onClick={() => onSelectReason(v)}
								key={i}
								className={cx(
									styles.tag,
									selected.includes(v) ? styles.tagActive : styles.tagIdle,
									'body-12-regular',
								)}
							>
								{v}
							</span>
						);
					})}
				</div>
			)}
		</>
	);
};

export default PopupBottomsheetRating;
