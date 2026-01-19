import { useEffect, useRef, useState } from 'react';

import { ButtonHighlight } from '@atoms';
import {
	IconEdit,
	IconFileSM,
	IconFluentCall,
	IconLocationGraySM,
	IconPlusGray,
	IconPostCode,
} from '@icons';
import { InputForm } from '@molecules';
import debounce from 'debounce-promise';
import Router from 'next/router';
import { FORM_CONSULTATION } from 'pages/form-consultation';
import Skeleton from 'react-loading-skeleton';
import { connect, useDispatch, useSelector } from 'react-redux';
import { clearShippingData, setCart, setUserInfo } from 'redux/actions';
import {
	BUTTON_CONST,
	checkIsEmpty,
	INPUTFORM_CONST,
	LABEL_CONST,
	SEAMLESS_CONST,
	validatePhone,
} from '../../../helper';
import PopupBottomsheet from '../PopupBottomsheet';
import SvgIcon from 'assets/icons/SvgIcon';
import { PostalCodeType } from 'components/molecules/ListPostalCode';
import PopupBottomsheetPostalCode from '../PopupBottomsheetPostalCode';

interface Props {
	isPageLoading?: boolean;
	editablePhone?: boolean;
	page?: 'cart' | 'summary';
	clearShippingLocal?: () => void;
	setForceChangePostCode?: (isShow: boolean) => void;
	isForcedPostCodeTrigger?: any;
}

const TransactionUserInfo = ({
	isPageLoading = false,
	editablePhone,
	page = 'cart',
	clearShippingLocal,
	setForceChangePostCode,
	isForcedPostCodeTrigger,
}: Props) => {
	const dispatch = useDispatch();
	const userInfo = useSelector(({ general }) => general?.userInfo);
	const cartData = useSelector(({ transaction }) => transaction?.cart);
	const [isShowBottomsheet, setIsShowBottomsheet] = useState(false);
	const [phoneTemp, setPhoneTemp] = useState();
	const [errPhoneTemp, setErrPhoneTemp] = useState('');
	const [isSyncPhone, setIsSyncPhone] = useState(false);
	const [isSyncDetailAddress, setIsSyncDetailAddress] = useState(false);
	const [isSyncPostalCode, setIsSyncPostalCode] = useState(false);

	const [showDetailAddressBottomsheet, setShowDetailAddressBottomsheet] = useState(false);
	const [showPostCodeBottomsheet, setShowPostCodeBottomsheet] = useState(false);
	const [tmpInputDetailAddess, setTmpInputDetailAddess] = useState('');
	const initializeUserInfo = useRef(false);

	const lastDetailAddress = useRef(null);

	useEffect(() => {
		if (isForcedPostCodeTrigger) setShowPostCodeBottomsheet(true);
	}, [isForcedPostCodeTrigger]);

	useEffect(() => {
		if (!checkIsEmpty(cartData?.result) && !checkIsEmpty(userInfo?.result)) {
			if (
				!checkIsEmpty(cartData?.result?.userInfo) &&
				(cartData?.result?.userInfo?.patient_phonenumber !=
					userInfo?.result?.patient_phonenumber ||
					cartData?.result?.userInfo?.patient_detail_address !=
						userInfo?.result?.patient_detail_address ||
					cartData?.result?.userInfo?.patient_postal_code !=
						userInfo?.result?.patient_postal_code)
			) {
				debounceSetCartData(true);
			} else {
				if (!initializeUserInfo.current) {
					initializeUserInfo.current = true;
					debounceSetCartData(false, false);
				}
			}
			setPhoneTemp(userInfo?.result?.patient_phonenumber);
			lastDetailAddress.current = userInfo?.result?.patient_detail_address;
		}
	}, [
		cartData?.result,
		userInfo?.result?.patient_detail_address,
		userInfo?.result?.patient_phonenumber,
	]);

	const setCartData = (sync = false, isUpdateUserInfo = true) => {
		if (cartData?.result) {
			dispatch(
				setCart(
					{
						result: { ...cartData?.result, userInfo: userInfo?.result },
						loading: false,
						error: false,
						sync: sync,
					},
					isSyncPhone || isSyncDetailAddress || isSyncPostalCode,
					isUpdateUserInfo, // isUpdateUserInfo
				),
			);
		}
	};

	const debounceSetCartData = debounce(setCartData, 500);

	const getShortAddres = () => {
		let res = '';
		const splitAddr = userInfo?.result?.patient_address?.split(' ');
		splitAddr?.forEach((e: any, i: number) => {
			if (i < 5) res += e + ' ';
		});
		return res.trim();
	};

	return (
		<div className="tw-px-4 tw-mt-4.5 tw-mb-4 tw-flex-1 tw-flex tw-flex-col tw-gap-3">
			<div className="tw-flex tw-items-center tw-gap-1 tw-text-tpy-700">
				<IconLocationGraySM />
				<p className="label-12-medium tw-text-tpy-700 tw-mb-0">{SEAMLESS_CONST.SEND_ADDRESS}</p>
			</div>
			<div className="tw-flex tw-items-center tw-gap-2">
				<div className="tw-flex-1">
					<p className="label-14-medium tw-mb-1">
						{isPageLoading ? <Skeleton /> : getShortAddres()}
					</p>
					<p className="body-12-regular tw-mb-0 tw-text-tpy-700 tw-break-words tw-line-clamp-2">
						{isPageLoading ? <Skeleton /> : userInfo?.result?.patient_address}
					</p>
				</div>
				<div
					className="tw-p-1 tw-h-full tw-text-secondary-def"
					onClick={() => {
						Router.replace({
							pathname: '/address',
							query: { ...Router?.query, [page]: 1 },
						});
					}}
				>
					{isPageLoading ? null : <IconEdit />}
				</div>
			</div>
			{isPageLoading ? (
				<Skeleton className="tw-w-full tw-h-[37px]" />
			) : (
				<div className="tw-flex tw-w-full">
					<InputForm
						className="!tw-mb-0"
						inputClassName="tw-py-2"
						onClick={() => {
							if (userInfo?.result?.patient_postal_code) {
								setForceChangePostCode(true);
							} else {
								setShowPostCodeBottomsheet(true);
							}
						}}
						data={{
							icon: <IconPostCode />,
							placeholder: 'Isi Kode POS',
							value: userInfo?.result?.patient_postal_code
								? `Kode POS ${userInfo?.result?.patient_postal_code}`
								: 'Isi Kode POS',
							type: INPUTFORM_CONST.bottomsheet,
							...(!userInfo?.result?.patient_postal_code && {
								inputStyle: {
									backgroundWrapper: 'tw-bg-info-50',
									borderWrapper: 'tw-border-info-def',
									valueColor: 'tw-text-info-def',
								},
							}),
						}}
					/>
					<InputForm
						className="!tw-mb-0 tw-ml-2 tw-w-max tw-max-w-[179px] tw-min-w-[123px] tw-text-ellipsis tw-overflow-hidden"
						inputClassName="tw-py-2"
						onClick={() => {
							setShowDetailAddressBottomsheet(true);
							setTimeout(() => {
								setTmpInputDetailAddess(userInfo?.result?.patient_detail_address);
							}, 200);
						}}
						data={{
							icon:
								userInfo?.result?.patient_detail_address &&
								userInfo?.result?.patient_detail_address?.length > 0 ? (
									<IconFileSM />
								) : (
									<IconPlusGray />
								),
							placeholder: 'Detail Alamat',
							value: userInfo?.result?.patient_detail_address?.length ? (
								<span>{userInfo?.result?.patient_detail_address}</span>
							) : null,
							type: INPUTFORM_CONST.bottomsheet,
							notUseArrow: true,
							inputStyle: {
								backgroundWrapper: 'tw-bg-white',
								borderWrapper: 'tw-border-monochrome-200',
								valueColor: userInfo?.result?.patient_detail_address?.length
									? 'tw-text-monochrome-700'
									: 'tw-text-monochrome-def',
							},
							bottomsheet: {
								show: showDetailAddressBottomsheet,
								onClose: () => {
									setShowDetailAddressBottomsheet(false);
									setTmpInputDetailAddess('');
								},
								header: (
									<div className="tw-m-4 tw-flex">
										<span
											onClick={() => {
												setShowDetailAddressBottomsheet(false);
												setTmpInputDetailAddess('');
											}}
										>
											<SvgIcon name="IconCloseGray" />
										</span>
										<p className="title-18-medium tw-ml-4 tw-mb-0">Detail Alamat</p>
									</div>
								),
								content: (
									<div className="tw-px-4">
										<InputForm
											className="!tw-mb-0"
											inputClassName="tw-py-2"
											data={{
												type: INPUTFORM_CONST.textarea,
												placeholder: 'Tulis Detail Alamat',
												value: tmpInputDetailAddess,
												max_length: 50,
												counter_visible: true,
											}}
											onChange={(val: any) => {
												setTmpInputDetailAddess(val?.value);
											}}
										/>
									</div>
								),
								footer: (
									<div className="tw-p-4 box-shadow-m">
										<ButtonHighlight
											isDisabled={!tmpInputDetailAddess?.length}
											onClick={() => {
												setIsSyncDetailAddress(true);
												dispatch(
													setUserInfo({
														...userInfo?.result,
														patient_detail_address:
															String(tmpInputDetailAddess).trim(),
													}),
												);
												setShowDetailAddressBottomsheet(false);
												setTmpInputDetailAddess('');
												dispatch(clearShippingData(clearShippingLocal));
											}}
											text={BUTTON_CONST.SAVE}
											circularContainerClassName="tw-h-4"
											circularClassName="circular-inner-16"
										/>
									</div>
								),
							},
						}}
					/>
				</div>
			)}
			{editablePhone ? (
				<div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
					<div className="tw-flex-1 tw-flex">
						<IconFluentCall />
						<p className="body-14-regular tw-mb-0 tw-w-24 tw-text-monochrome-700 tw-ml-1">
							{isPageLoading ? <Skeleton /> : 'No. Hp'}
						</p>
						<p className="title-14-medium tw-mb-1 tw-flex-1">
							{isPageLoading ? <Skeleton /> : userInfo?.result?.patient_phonenumber}
						</p>
					</div>
					<div className="tw-text-secondary-def" onClick={() => setIsShowBottomsheet(true)}>
						{isPageLoading ? null : <IconEdit />}
					</div>
				</div>
			) : null}

			<PopupBottomsheetPostalCode
				isOpen={showPostCodeBottomsheet}
				callback={(postalCode: PostalCodeType) => {
					setShowPostCodeBottomsheet(false);
					if (postalCode?.code) {
						setIsSyncPostalCode(true);
						dispatch(
							setUserInfo({
								...userInfo?.result,
								patient_postal_code: postalCode?.code,
							}),
						);
						setShowPostCodeBottomsheet(false);
						dispatch(clearShippingData(clearShippingLocal));
					}
				}}
			/>

			<PopupBottomsheet
				expandOnContentDrag={false}
				isSwipeableOpen={isShowBottomsheet}
				setIsSwipeableOpen={(isOpen) => {
					if (!isOpen) setIsShowBottomsheet(false);
				}}
				headerComponent={
					<div className="tw-mt-[36px] tw-mx-4">
						<p className="title-18-medium tw-text-left">{LABEL_CONST.EDIT_PHONE_NUMBER}</p>
					</div>
				}
				footerComponent={
					<div className="tw-flex tw-flex-row tw-p-4 tw-gap-4">
						<ButtonHighlight
							id={'save'}
							onClick={() => {
								const validatePhoneRes = validatePhone(phoneTemp);
								if (validatePhoneRes) {
									setErrPhoneTemp(validatePhoneRes);
								} else {
									setIsSyncPhone(true);
									setTimeout(() => {
										dispatch(
											setUserInfo({
												...userInfo?.result,
												patient_phonenumber: phoneTemp,
											}),
										);
										dispatch(clearShippingData(clearShippingLocal));
										setIsShowBottomsheet(false);
									}, 200);
								}
							}}
							text={BUTTON_CONST.SAVE}
						/>
					</div>
				}
			>
				<div className="tw-mt-5">
					<InputForm
						className="tw-mx-4 !tw-mb-1"
						inputClassName="tw-p-4"
						onChangeErrorMessage={(val: any) => {
							setErrPhoneTemp(val?.errorMessage);
						}}
						data={{
							name: FORM_CONSULTATION.PHONE,
							placeholder: 'No. Hp',
							value: phoneTemp,
							type: 'number',
							inputmode: 'numeric',
							max_length: 13,
							errorMessage: errPhoneTemp,
						}}
						onChange={(val: any) => {
							setErrPhoneTemp('');
							setPhoneTemp(val?.value);
						}}
					/>
				</div>
			</PopupBottomsheet>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	isPageLoading: state.general?.isPageLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionUserInfo);
