import React, { useMemo } from 'react';
import PopupBottomsheetArrivedConfirmation from '../PopupBottomsheetArrivedConfirmation';
import BadgePaymentStatus, { BadgePaymentStatusProps } from 'components/atoms/BadgePaymentStatus';
import BadgeStatusConsul from 'components/atoms/BadgeStatusConsul';
import InfoCardTop from 'components/atoms/InfoCardTop';
import Skeleton from 'react-loading-skeleton';
import Router, { useRouter } from 'next/router';
import moment from 'moment';
import cx from 'classnames';
import styles from './index.module.css';
import {
	BUTTON_CONST,
	BUTTON_ID,
	LOCALSTORAGE,
	MESSAGE_CONST,
	ORDER_TYPE,
	STATUS_CONST,
	getStorageParseDecrypt,
	getTransactionDetail,
	navigateFromTrxCondition,
	navigateWithQueryParams,
	numberToIDR,
	postCheckoutArriveConfirm,
	setStringifyLocalStorage,
	showToast,
} from 'helper';
import {
	IconInfoRed,
	IconHealthConsultationHistory,
	IconRefundRed,
	IconProductHistory,
} from '@icons';
import { ButtonHighlight, ImageLoading } from '@atoms';
import { ImgDefaultProduct } from '@images';
import TagManager from 'react-gtm-module';
import { AiFillClockCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetailTransaction } from 'redux/actions';

interface TransactionCardProps {
	classContainer: string;
	data?: any;
	token?: string;
	isLoading?: boolean;
	isPrescription?: boolean;
	activeTab?: number;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
	classContainer,
	data,
	token,
	isLoading = false,
	isPrescription = false,
	activeTab = -1,
}) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);

	const [isShowArrivedConfirm, setIsShowArrivedConfirm] = React.useState(false);

	const toggleArrivedConfirm = () => setIsShowArrivedConfirm(!isShowArrivedConfirm);

	const handleOrderConsul = () => getData();

	const getData = async () => {
		try {
			const temp = await getStorageParseDecrypt(LOCALSTORAGE.ORDER);
			const tempToken = router.query?.token ?? temp?.token;
			const currToken = tempToken;
			const res = await getTransactionDetail({
				id: data?.xid,
				token: tempToken,
			});
			if (res?.meta?.acknowledge) {
				if (res?.data?.payment_status == STATUS_CONST.CREATED) {
					router.replace({
						pathname: '/order/detail',
						query: {
							transaction_xid: data?.xid,
							token: tempToken,
						},
					});
				} else {
					const tmpData = res?.data;

					await setStringifyLocalStorage(LOCALSTORAGE.TRANSACTION, res?.data);

					const tagManagerArgs = {
						dataLayer: {
							transactionId: res.data?.transaction_id,
						},
						dataLayerName: 'PageDataLayer',
					};

					TagManager.dataLayer(tagManagerArgs);

					navigateFromTrxCondition(tmpData, currToken);
				}
			}
		} catch (error) {
			console.log('error on get data trx : ', error);
		}
	};

	const badgeType: BadgePaymentStatusProps['type'] = useMemo(() => {
		return data?.payment_status != STATUS_CONST.CREATED &&
			data?.payment_status != STATUS_CONST.PENDING &&
			data?.payment_status != STATUS_CONST.REFUNDED &&
			data?.payment_status != STATUS_CONST.EXPIRED &&
			isPrescription
			? data?.shipping_status
			: data?.payment_status == STATUS_CONST.PENDING &&
			  global.metaAt != null &&
			  data?.payment_expired_at != null &&
			  moment(global.metaAt).isAfter(moment(data?.payment_expired_at))
			? STATUS_CONST.EXPIRED
			: data?.payment_status;
	}, [data]);

	const buttonType = useMemo(() => {
		const type = {
			id: BUTTON_ID.BUTTON_TRANSACTION_LIST,
			text: BUTTON_CONST.START_CONSULTATION,
			handleSubmit: (e: any) => {
				Router.push({
					pathname: '/onboarding',
					query: { token: data?.token, transaction_xid: data?.xid, rf: 1 },
				});
				e.stopPropagation();
			},
			btnClassName: '',
			btnColor: 'primary',
			no: 0,
		};

		if (data?.payment_status == 'SUCCESS' && data?.consultation_status === 'STARTED') {
			type.text = BUTTON_CONST.CONTINUE_CONSULTATION;
			type.no = 1;
		} else if (data?.payment_status == 'PENDING') {
			type.text = BUTTON_CONST.CHECK_PAYMENT;
			type.handleSubmit = (e: any) => {
				Router.push({
					pathname: '/payment/waiting-payment',
					query: {
						token: token,
						transaction_xid: data?.xid,
						checked: 1,
						...(Router?.query?.presc ? { presc: Router?.query?.presc } : {}),
					},
				});
				e.stopPropagation();
			};
			type.no = 2;
		} else if (
			(data?.payment_status == 'SUCCESS' &&
				data?.consultation_status != 'READY' &&
				data?.consultation_status != 'STARTED' &&
				data?.consultation_status != 'DONE') ||
			data?.payment_status == 'REFUNDED' ||
			data?.payment_status == 'EXPIRED'
		) {
			type.text = BUTTON_CONST.ORDER_AGAIN;
			type.btnColor = 'grey';
			type.handleSubmit = (e: any) => {
				Router.push({
					pathname: '/order',
					query: { token },
				});
				e.stopPropagation();
			};
			type.no = 3;
		} else if (data?.payment_status == 'FAILED' || data?.payment_status == 'CANCELLED') {
			type.text = BUTTON_CONST.TRY_AGAIN;
			type.btnColor = 'primary';
			type.handleSubmit = (e: any) => {
				handleOrderConsul();
				e.stopPropagation();
			};
			type.no = 4;
		} else if (data?.payment_status === 'SUCCESS' && data?.consultation_status === 'DONE') {
			type.text = BUTTON_CONST.LIHAT_RINGKASAN;
			type.btnColor = 'primary';
			type.handleSubmit = (e: any) => {
				Router.push({
					pathname: '/prescription-detail',
					query: {
						token: data?.consultation_token ?? data?.token,
					},
				});
				e.stopPropagation();
			};
			type.no = 5;
		}

		return type;
	}, [data]);

	const handleNavigate = () => {
		if (
			(activeTab > -1 && activeTab === 1) ||
			(activeTab == -1 && Router?.query.type == ORDER_TYPE.PRODUCT)
		) {
			navigateWithQueryParams(
				`/transaction/product/${data?.xid}`,
				{ token: data?.transaction_token ?? token, presc: 1 },
				'href',
			);
		} else {
			navigateWithQueryParams(
				`/transaction/${data?.xid}`,
				{ token: data?.transaction_token ?? token },
				'href',
			);
		}
	};

	const handleCheckProductTransaction = () => {
		const params = { id: data?.xid, token: data?.transaction_token };
		const payload = {
			params,
			callback: (productTransactionDetail) =>
				navigateFromTrxCondition(
					{
						...productTransactionDetail?.result,
						xid: productTransactionDetail?.result?.xid ?? data?.xid,
					},
					data?.transaction_token,
					ORDER_TYPE.PRODUCT,
				),
		};
		dispatch(fetchProductDetailTransaction(payload));
	};

	const buttonTypePrescription = useMemo(() => {
		let type = {
			id: '',
			text: '',
			onClick: (e: any) => {
				//
				e.stopPropagation();
			},
			btnColor: 'primary',
		};

		if (badgeType === 'REJECTED' || badgeType === 'REFUNDED') {
			type = null;
		} else if (badgeType === 'ARRIVE') {
			type.id = badgeType;
			type.text = 'PESANAN DITERIMA';
			type.onClick = (e: any) => {
				toggleArrivedConfirm();
				e.stopPropagation();
			};
		} else if (badgeType === 'PENDING') {
			type.id = badgeType;
			type.text = 'CEK STATUS PEMBAYARAN';
			type.onClick = (e: any) => {
				Router.push({
					pathname: '/payment/waiting-payment',
					query: {
						token: data?.transaction_token ?? token,
						transaction_xid: data?.xid,
						checked: 1,
						...(Router?.query?.presc || isPrescription ? { presc: 1 } : {}),
					},
				});
				e.stopPropagation();
			};
		} else if (badgeType === 'FAILED' || badgeType === 'EXPIRED') {
			type.id = badgeType;
			type.text = 'COBA LAGI';
			type.onClick = (e: any) => {
				handleCheckProductTransaction();
				e.stopPropagation();
			};
		} else if (badgeType === 'ON_PROCESS' || badgeType === 'CREATED') {
			type.id = badgeType;
			type.text = 'LIHAT STATUS PESANAN';
			type.onClick = (e: any) => {
				Router.push({
					pathname: '/order/track',
					query: {
						token: data?.transaction_token ?? token,
						transaction_xid: data?.xid,
						transaction_id: data?.xid,
					},
				});
				e.stopPropagation();
			};
		} else if (badgeType === 'COMPLETED') {
			type.id = badgeType;
			type.text = 'PESAN KONSULTASI LAGI';
			type.onClick = (e: any) => {
				handleCheckProductTransaction();
				e.stopPropagation();
			};
			type.btnColor = 'grey';
		} else if (badgeType === 'SENT') {
			type.id = badgeType;
			type.text = 'LACAK PESANAN';
			type.onClick = (e: any) => {
				Router.push({
					pathname: '/order/track/shipping',
					query: {
						token: data?.transaction_token ?? token,
						transaction_xid: data?.xid,
						transaction_id: data?.xid,
					},
				});
				e.stopPropagation();
			};
		} else if (badgeType === 'COMPLAIN') {
			type.id = badgeType;
			type.text = 'LIHAT DETAIL';
			type.onClick = (e: any) => {
				handleNavigate();
				e.stopPropagation();
			};
		}

		return type;
	}, [data]);

	const handleButtonPrescClick = () => {
		if (data?.payment_status === STATUS_CONST.SUCCESS) {
			switch (data?.shipping_status) {
				case STATUS_CONST.SENT:
					Router.push({
						pathname: '/order/track/shipping',
						query: {
							token: data?.transaction_token ?? token,
							transaction_xid: data?.xid,
							transaction_id: data?.xid,
						},
					});
					break;
				case STATUS_CONST.ARRIVED:
					toggleArrivedConfirm();
					break;

				default:
					break;
			}
		} else if (data?.payment_status === STATUS_CONST.PENDING) {
			Router.push({
				pathname: '/payment/waiting-payment',
				query: {
					token: data?.transaction_token ?? token,
					transaction_xid: data?.xid,
					checked: 1,
					...(Router?.query?.presc || isPrescription ? { presc: 1 } : {}),
				},
			});
		}
	};

	const goToRefundFormPage = () => {
		Router.push({
			pathname: '/transaction/product/refund',
			query: {
				token: data?.transaction_token ?? token,
				transaction_id: data?.xid,
			},
		});
	};

	const handleOnConfirm = async () => {
		try {
			const res = await postCheckoutArriveConfirm({
				xid: data?.xid,
				token: data?.token_order ?? token,
			});
			if (res?.meta?.acknowledge) {
				Router.reload();
			} else {
				showToast(res?.meta?.message ?? MESSAGE_CONST.SOMETHING_WENT_WRONG);
			}
		} catch (error) {
			console.log('error on handle on confirm : ', error);
			showToast(MESSAGE_CONST.SOMETHING_WENT_WRONG);
		} finally {
			Router.reload();
		}
	};

	const renderProducts = () => {
		if (data?.products && data?.products?.length) {
			return (
				<div onClick={handleNavigate}>
					<div className={styles.productWrapper}>
						<div className={styles.productImage}>
							<ImageLoading
								className="tw-rounded tw-h-10 tw-w-10"
								data={{ url: data?.products[0]?.image }}
								fallbackImg={ImgDefaultProduct.src}
							/>
						</div>
						<div className="tw-ml-4">
							<p className="title-14-medium tw-mb-0">{data?.products[0]?.name}</p>
							<p className="body-12-regular tw-mt-1 tw-text-tpy-700 tw-mb-0">
								{data?.products[0]?.qty} barang
							</p>
						</div>
					</div>
					{data?.products?.length > 1 ? (
						<p className={styles.otherProductLabel}>dan 1 produk lainnya</p>
					) : null}
					<div className="tw-py-4">
						<div className="line-break-dashed"></div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const handleShippingStatus = () => {
		if (data?.payment_status === STATUS_CONST.SUCCESS) {
			switch (data?.shipping_status) {
				case STATUS_CONST.CREATED:
					return 'Menunggu Konfirmasi';
				case STATUS_CONST.ON_PROCESS:
					return 'Diproses';
				case STATUS_CONST.SENT:
					return 'Sedang Dikirim';
				case STATUS_CONST.ARRIVED:
					return 'Tiba di Tujuan';
				case STATUS_CONST.COMPLETED:
					return 'Selesai';
				case STATUS_CONST.REJECTED:
					return 'Dibatalkan';
				case STATUS_CONST.COMPLAIN:
					return 'Dikomplain';
				default:
					return;
			}
		}
	};

	const handleButonLabel = () => {
		if (data?.payment_status === STATUS_CONST.SUCCESS) {
			switch (data?.shipping_status) {
				case STATUS_CONST.SENT:
					return 'LACAK PESANAN';
				case STATUS_CONST.ARRIVED:
					return 'PESANAN DITERIMA';
				default:
					return;
			}
		} else if (
			data?.payment_status === STATUS_CONST.CREATED ||
			data?.payment_status === STATUS_CONST.PENDING
		) {
			return BUTTON_CONST.VIEW_HOW_TO_PAY;
		}
	};

	const renderPrescriptionContent = () => {
		return (
			<div>
				{badgeType === 'REJECTED' && (
					<div className="tw-mb-4">
						<div className={styles.refundFormWrapper}>
							<div className="tw-flex tw-items-center">
								<span className="tw-mr-2">
									<IconInfoRed />
								</span>
								<p className="body-12-regular tw-mb-0 tw-mr-2">
									{data?.refund_data
										? `Refund diajukan pada ${data?.refund_request_at}. Waktu proses max. 14 hari`
										: 'Anda perlu isi form refund untuk pengembalian dana Anda'}
								</p>
							</div>
							{!data?.refund_data && !data?.refund_request_at && (
								<p onClick={goToRefundFormPage} className={styles.fillForm}>
									Isi Form
								</p>
							)}
						</div>
					</div>
				)}

				{badgeType !== 'PENDING' ? (
					renderProducts()
				) : (
					<div>
						<div onClick={handleNavigate} className="tw-flex tw-items-center tw-gap-4">
							<div className="tw-relative tw-min-h-[40px] tw-min-w-[40px] ">
								<ImageLoading
									className="tw-rounded tw-h-10 tw-w-10 tw-my-auto !tw-object-contain"
									data={{ url: data?.payment_method?.logo_url }}
									fallbackImg={ImgDefaultProduct.src}
								/>
							</div>
							<div className="tw-flex-1">
								<p className="tw-font-roboto tw-font-medium tw-mb-0">
									{data?.payment_method?.title}
								</p>
								{data?.payment_method?.group_title?.toLowerCase() == 'pembayaran instan' ||
								data?.payment_method?.group_title?.toLowerCase() ==
									'pembayaran instant' ? null : (
									<p className="tw-text-tpy-700 tw-mb-0">
										{data?.payment_method?.va_number ||
											data?.va_number ||
											data?.payment_method?.customer_number ||
											'-'}
									</p>
								)}
							</div>
						</div>
						<div className="tw-py-4">
							<div className="line-break-dashed"></div>
						</div>
					</div>
				)}

				<div className="tw-flex tw-justify-between tw-gap-3 tw-items-center">
					<div className="label-14-medium" style={{ width: '35%' }}>
						{numberToIDR(data?.paid_amount ?? data?.total_price)}
					</div>
					{buttonTypePrescription && buttonTypePrescription?.text && (
						<ButtonHighlight
							onClick={buttonTypePrescription?.onClick}
							id={buttonTypePrescription?.id}
							text={buttonTypePrescription?.text}
							color={buttonTypePrescription?.btnColor}
							classNameBtn={`label-12-medium tw-h-9`}
							btnStyle={{
								height: 'auto',
								fontSize: 12,
								lineHeight: '1rem',
								letterSpacing: 0.5,
							}}
						/>
					)}
				</div>
			</div>
		);
	};
	const renderButton = () => {
		if (buttonType.text === BUTTON_CONST.ORDER_AGAIN && data?.order_only_from_partner)
			return null;
		return (
			<ButtonHighlight
				id={buttonType.id}
				classNameBtn={`label-12-medium tw-h-9 ${buttonType.btnClassName}`}
				onClick={(e) => buttonType.handleSubmit(e)}
				text={buttonType.text}
				color={buttonType.btnColor}
				btnStyle={{ height: 'auto', fontSize: 12, lineHeight: '1rem', letterSpacing: 0.5 }}
			/>
		);
	};

	const renderConsultationContent = () => {
		return (
			<>
				<div className="tw-flex-col font-14 tw-justify-between">
					<div className="tw-font-roboto tw-font-medium">
						{isLoading ? <Skeleton width={140} /> : `Konsultasi ${data?.specialist}`}
					</div>
					{/* <div className="tw-font-roboto tw-font-medium">
						{isLoading ? (
							<Skeleton width={60} />
						) : (
							data?.consultation_status &&
							!(
								data?.payment_status === STATUS_CONST.EXPIRED ||
								data?.payment_status === STATUS_CONST.FAILED ||
								data?.payment_status === STATUS_CONST.CANCELLED
							) && <BadgeStatusConsul type={data?.consultation_status} />
						)}
					</div> */}
					{data?.consultation_status === STATUS_CONST.STARTED &&
					data?.consultation_active_until ? (
						<div
							className={`body-12-regular tw-mt-1 tw-flex-1 tw-flex tw-justify-center tw-px-2 tw-py-1 tw-rounded-full tw-items-center tw-text-error-600 tw-bg-error-100`}
						>
							<div className="tw-mr-2">
								<AiFillClockCircle color="#B00020" size={14} />
							</div>
							{'Konsultasi Berakhir'}
							<b className="label-12-medium tw-ml-1">
								{data?.consultation_active_until != null
									? moment(data?.consultation_active_until).format(
											'DD MMM YYYY [jam] HH:mm',
									  )
									: '-'}
							</b>
						</div>
					) : null}
				</div>
				{isLoading ? (
					<Skeleton className={'tw-mt-4'} height={34} />
				) : (
					<div className="tw-flex tw-justify-between tw-gap-3 tw-items-center tw-mt-4">
						<div className="label-14-medium" style={{ width: '35%' }}>
							{numberToIDR(data?.paid_amount ?? data?.total_price)}{' '}
							{/* {JSON.stringify(buttonType)} */}
							{/* {JSON.stringify(data.payment_status)} */}
						</div>
						{data?.payment_status !== 'CREATED' && renderButton()}
					</div>
				)}
			</>
		);
	};

	return (
		<div className={cx(styles.mainContainer, classContainer)}>
			{badgeType === 'PENDING' ? <InfoCardTop dateTime={data?.payment_expired_at} /> : null}
			<div className={styles.cardWrapper}>
				<div className={styles.cardHead} onClick={handleNavigate}>
					<div className={styles.cardRow}>
						{isLoading ? (
							<Skeleton width={24} height={24} />
						) : data?.payment_status !== 'REFUNDED' ? (
							isPrescription ? (
								<IconProductHistory />
							) : (
								<IconHealthConsultationHistory />
							)
						) : (
							<IconRefundRed />
						)}
						<div>
							<div className={styles.labelWrapper}>
								{isLoading ? (
									<Skeleton width={120} />
								) : data?.payment_status == 'REFUNDED' && !isPrescription ? (
									'Refund Konsultasi Kesehatan'
								) : data?.payment_status == 'REFUNDED' && isPrescription ? (
									'Refund Tebus Resep'
								) : isPrescription ? (
									'Tebus Resep'
								) : (
									'Konsultasi Kesehatan'
								)}
							</div>
							<div className={styles.dateLabel}>
								{badgeType === 'PENDING' ? null : isLoading ? (
									<Skeleton width={140} />
								) : (
									moment(data?.created_at ?? data?.order_at).format(
										'DD MMM YYYY [jam] HH:mm',
									)
								)}
							</div>
						</div>
					</div>
					<div className="tw-text-right">
						{!isPrescription && data?.payment_status === 'SUCCESS' ? (
							<div>
								<BadgeStatusConsul type={data?.consultation_status} />
							</div>
						) : data?.payment_status !== 'REFUNDED' ? (
							<div>
								<BadgePaymentStatus type={badgeType} />
							</div>
						) : null}
					</div>
				</div>
				<div className="tw-py-4" onClick={handleNavigate}>
					<div className="line-break-dashed"></div>
				</div>
				{isPrescription ? renderPrescriptionContent() : renderConsultationContent()}
			</div>

			<PopupBottomsheetArrivedConfirmation
				onConfirm={handleOnConfirm}
				onDecline={() => toggleArrivedConfirm()}
				isOpenBottomsheet={isShowArrivedConfirm}
				setIsOpenBottomsheet={setIsShowArrivedConfirm}
			/>
		</div>
	);
};

export default TransactionCard;
