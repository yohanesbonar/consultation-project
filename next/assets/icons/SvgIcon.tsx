import React from 'react';

import IconBack from './ic-back';
import IconCalendar from './ic-calendar';
import IconTimeGreen from './ic-time-green';
import IconTimeRed from './ic-time-red';
import IconDkonsul40 from './ic-dkonsul-40';
import IconAddBlue from './ic-add-blue';
import IconAddDisable from './ic-add-disable';
import IconRight from './ic-right';
import IconRightBlue from './ic-right-blue';
import IconRadioOff from './ic-radio-off';
import IconRadioOn from './ic-radio-on';
import IconSent from './ic-sent';
import IconDelivered from './ic-delivered';
import IconRead from './ic-read';
import IconSendOff from './ic-send-off';
import IconSendOn from './ic-send-on';
import IconCameraGray from './ic-camera-gray';
import IconFileGray from './ic-file-gray';
import IconFileBlue from './ic-file-blue';
import IconGalleryGray from './ic-gallery-gray';
import IconGalleryBlue from './ic-gallery-blue';
import IconReceiptApplied from './ic-resep-berlaku-24';
import IconReceiptNotApplied from './ic-resep-tidak-berlaku-24';
import IconReceiptNotes from './ic-catatan-31';
import IconEmptyImage from './ic-empty-img-produk-40';
import IconCloseRound from './ic-close-round';
import IconErrorRed from './ic-error-red';
import IconWarningGreen from './ic-warning-green';
import IconWarningOrange from './ic-warning-orange';
import IconEmptyProduct from './ic-empty-product';
import IconPrescriptionExpired from './ic-prescription-expired';
import IconFile from './ic-file';
import IconClear from './ic-clear';
import IconScrollDown from './ic-scroll-up-down-36';
import IconChatUnavailable from './ic-chat-unavailable';
import IconSearchDoctor from './ic-search-doctor';
import IconSearchDoctorNotFound from './ic-search-doctor-not-found';
import IconNoConnection from './ic-no-connection';
import IconInfo from './ic-info';
import IconInfoGray from './ic-info-gray';
import IconInfoYellow from './ic-info-yellow';
import IconDone from './ic-done';
import IconFailed from './ic-failed';
import IconCartDone from './ic-cart-done';
import IconCartDoneYellow from './ic-cart-done-yellow';
import IconCopy from './ic-copy';
import IconVoucher from './ic-voucher';
import IconMoreBlue from './ic-more-blue';
import IconContact from './ic-contact';
import IconRefund from './ic-refund';
import IconCancelPayment from './ic-cancel-payment';
import IconAlertSuccess from './ic-alert-success';
import IconPay from './ic-pay';
import IconClockOrange from './ic-clock-orange';
import IconClockOrangeLarge from './ic-clock-orange-large';
import IconClockGraySmall from './ic-clock-gray';
import IconCheckGreen from './ic-check-green';
import IconRpPayment from './ic-rp-payment';
import IconEmptyVoucher from './ic-empty-state-voucher';
import IconSearch from './ic-search-small';
import IconMapGray from './ic-map';
import IconCurrentLocationRed from './ic-current-location';
import IconMapMarker from './ic-map-marker';
import IconMapEmpty from './ic-map-empty';
import IconClearSearch from './ic-clear-search';
import IconBackEnable from './ic-back-enable';
import IconCurrentLocationCircle from './ic-current-location-circle';
import IconMapPoint from './ic-map-point';
import IconPlusBlue from './ic-plus-blue';
import IconPlusGray from './ic-plus-gray';
import IconMinusBlue from './ic-minus-blue';
import IconMinusGray from './ic-minus-gray';
import IconEdit from './ic-edit';
import IconTrash from './ic-trash';
import IconTrashDisable from './ic-trash-disable';
import IconWarning from './ic-warning';
import IconDelivery from './ic-delivery';
import IconMedicine from './ic-medicine';
import IconMedicineReject from './ic-medicine-reject';
import IconLink from './ic-link';
import IconDocumentWhite from './ic-document-white';
import IconDkonsulWhite from './ic-dkonsul-white';
import IconSpinner from './ic-spinner';
import IconOtherPayment from './ic-other-payment';
import IconXendit from './ic-xendit';
import IconBill from './ic-bill';
import IconCheckWhite from './ic-check-white';
import IconCopyBlue from './ic-copy-blue';
import IconConsultation from './ic-consultation';
import IconPrescription from './ic-prescription';
import IconInfoRed from './ic-info-red';
import IconInfoWarningLarge from './ic-info-warning-large';
import IconCloseThin from './ic-close-thin';
import IconSadGray from './ic-sad';
import IconPharmacyNotFound from './ic-pharmacy-not-found';
import IconDkonsulSmall from './ic-dkonsul-small';
import IconFormConsultation from './ic-form-consultation';
import IconCLose from './ic-close';
import IconChevronRightBlue from './ic-chevron-right-blue';
import IconArrowDownBlue from './ic-arrow-down-blue';
import IconArrowUpBlue from './ic-arrow-up-blue';
import IconResep from './ic-resep';
import IconDrugPlus from './ic-drug-plus';
import IconEmptyNotes from './ic-empty-notes';
import IconCopyWhite from './ic-copy-white';
import IconCloseGray from './ic-close-gray';
import IconInfoInvalidChat from './ic-info-invalid-chat';
import IconPerson from './ic-person';
import IconPrescPopup from './ic-presc-popup';
import IconConsulTimeout from './ic-consul-timout';
import IconDurationEnd from './ic-duration-end';
import IconArrowRightBlue from './ic-arrow-right-blue';
import IconCopyMessage from './ic-copy-message';
import IconMoreHorizontal from './ic-more-horizontal';
import IconReplyMessage from './ic-reply-message';
import IconFileSM from './ic-file-sm';
import IconThumbAttachmentLight from './ic-attachment-light';
import IconThumbAttachmentDark from './ic-attachment-dark';
import IconThumbImgLight from './ic-img-sm-light';
import IconThumbImgDark from './ic-img-sm-dark';
import IconFileSMWhite from './ic-file-white';
import IconSpinnerV2 from './ic-spinner-v2';

interface SvgIconProps {
	name: string;
	width?: string;
	height?: string;
}
const SvgIcon = ({ name, width, height }: SvgIconProps) => {
	const icons = {
		IconBack,
		IconCalendar,
		IconTimeGreen,
		IconTimeRed,
		IconDkonsul40,
		IconAddBlue,
		IconAddDisable,
		IconRight,
		IconRightBlue,
		IconRadioOff,
		IconRadioOn,
		IconSent,
		IconDelivered,
		IconRead,
		IconSendOff,
		IconSendOn,
		IconCameraGray,
		IconFileGray,
		IconFileBlue,
		IconGalleryGray,
		IconGalleryBlue,
		IconReceiptApplied,
		IconReceiptNotApplied,
		IconReceiptNotes,
		IconEmptyImage,
		IconCloseRound,
		IconErrorRed,
		IconWarningGreen,
		IconWarningOrange,
		IconEmptyProduct,
		IconPrescriptionExpired,
		IconFile,
		IconClear,
		IconScrollDown,
		IconChatUnavailable,
		IconSearchDoctor,
		IconSearchDoctorNotFound,
		IconNoConnection,
		IconInfo,
		IconInfoGray,
		IconInfoYellow,
		IconDone,
		IconFailed,
		IconCartDone,
		IconCartDoneYellow,
		IconCopy,
		IconVoucher,
		IconMoreBlue,
		IconContact,
		IconRefund,
		IconCancelPayment,
		IconAlertSuccess,
		IconPay,
		IconClockOrange,
		IconClockOrangeLarge,
		IconClockGraySmall,
		IconCheckGreen,
		IconRpPayment,
		IconEmptyVoucher,
		IconSearch,
		IconMapGray,
		IconCurrentLocationRed,
		IconMapMarker,
		IconMapEmpty,
		IconClearSearch,
		IconBackEnable,
		IconCurrentLocationCircle,
		IconMapPoint,
		IconPlusBlue,
		IconPlusGray,
		IconMinusBlue,
		IconMinusGray,
		IconEdit,
		IconTrash,
		IconTrashDisable,
		IconWarning,
		IconDelivery,
		IconMedicine,
		IconMedicineReject,
		IconLink,
		IconDocumentWhite,
		IconDkonsulWhite,
		IconSpinner,
		IconOtherPayment,
		IconXendit,
		IconBill,
		IconCheckWhite,
		IconCopyBlue,
		IconConsultation,
		IconPrescription,
		IconInfoRed,
		IconInfoWarningLarge,
		IconCloseThin,
		IconSadGray,
		IconPharmacyNotFound,
		IconDkonsulSmall,
		IconFormConsultation,
		IconCLose,
		IconChevronRightBlue,
		IconArrowDownBlue,
		IconArrowUpBlue,
		IconResep,
		IconDrugPlus,
		IconEmptyNotes,
		IconCopyWhite,
		IconCloseGray,
		IconInfoInvalidChat,
		IconPerson,
		IconPrescPopup,
		IconConsulTimeout,
		IconDurationEnd,
		IconArrowRightBlue,
		IconCopyMessage,
		IconMoreHorizontal,
		IconReplyMessage,
		IconFileSM,
		IconThumbAttachmentLight,
		IconThumbAttachmentDark,
		IconThumbImgLight,
		IconThumbImgDark,
		IconFileSMWhite,
		IconSpinnerV2,
	};

	const IconComponent = icons[name];

	if (!IconComponent) {
		return null;
	}

	return <IconComponent width={width} height={height} />;
};

// export {
// 	IconBack,
// 	IconCalendar,
// 	IconTimeGreen,
// 	IconTimeRed,
// 	IconDkonsul40,
// 	IconAddBlue,
// 	IconAddDisable,
// 	IconRight,
// 	IconRightBlue,
// 	IconRadioOff,
// 	IconRadioOn,
// 	IconSent,
// 	IconDelivered,
// 	IconRead,
// 	IconSendOff,
// 	IconSendOn,
// 	IconCameraGray,
// 	IconFileGray,
// 	IconFileBlue,
// 	IconGalleryGray,
// 	IconGalleryBlue,
// 	IconReceiptApplied,
// 	IconReceiptNotApplied,
// 	IconReceiptNotes,
// 	IconEmptyImage,
// 	IconCloseRound,
// 	IconErrorRed,
// 	IconWarningGreen,
// 	IconEmptyProduct,
// 	IconPrescriptionExpired,
// 	IconFile,
// 	IconClear,
// 	IconScrollDown,
// 	IconChatUnavailable,
// 	IconSearchDoctor,
// 	IconSearchDoctorNotFound,
// 	IconNoConnection,
// 	IconInfo,
// 	IconInfoGray,
// 	IconInfoYellow,
// 	IconDone,
// 	IconFailed,
// 	IconCartDone,
// 	IconCartDoneYellow,
// 	IconCopy,
// 	IconVoucher,
// 	IconMoreBlue,
// 	IconContact,
// 	IconRefund,
// 	IconCancelPayment,
// 	IconAlertSuccess,
// 	IconPay,
// 	IconClockOrange,
// 	IconClockOrangeLarge,
// 	IconClockGraySmall,
// 	IconCheckGreen,
// 	IconRpPayment,
// 	IconEmptyVoucher,
// 	IconSearch,
// 	IconMapGray,
// 	IconCurrentLocationRed,
// 	IconMapMarker,
// 	IconMapEmpty,
// 	IconClearSearch,
// 	IconBackEnable,
// 	IconCurrentLocationCircle,
// 	IconMapPoint,
// 	IconPlusBlue,
// 	IconPlusGray,
// 	IconMinusBlue,
// 	IconMinusGray,
// 	IconEdit,
// 	IconTrash,
// 	IconTrashDisable,
// 	IconWarning,
// 	IconDelivery,
// 	IconMedicine,
// 	IconMedicineReject,
// 	IconLink,
// 	IconDocumentWhite,
// 	IconDkonsulWhite,
// 	IconSpinner,
// 	IconOtherPayment,
// 	IconXendit,
// 	IconBill,
// 	IconCheckWhite,
// 	IconCopyBlue,
// 	IconConsultation,
// 	IconPrescription,
// 	IconInfoRed,
// 	IconInfoWarningLarge,
// 	IconCloseThin,
// 	IconSadGray,
// 	IconPharmacyNotFound,
// 	IconDkonsulSmall,
// 	IconFormConsultation,
// 	IconCLose,
// 	IconChevronRightBlue,
// 	IconWarningOrange,
// 	IconArrowDownBlue,
// 	IconArrowUpBlue,
// 	IconResep,
// 	IconDrugPlus,
// 	IconEmptyNotes,
// 	IconCopyWhite,
// 	IconCloseGray,
// 	IconInfoInvalidChat,
// 	IconPerson,
// 	IconPrescPopup,
// 	IconConsulTimeout,
// 	IconDurationEnd,
// 	IconArrowRightBlue,
// 	IconCopyMessage,
// 	IconMoreHorizontal,
// 	IconReplyMessage,
// 	IconFileSM,
// 	IconFileSMWhite,
// 	IconThumbAttachmentLight,
// 	IconThumbAttachmentDark,
// 	IconThumbImgLight,
// 	IconThumbImgDark,
// 	IconSpinnerV2,
// };

export default SvgIcon;
