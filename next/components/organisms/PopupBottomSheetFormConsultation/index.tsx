// TODO: fix these lints
/* eslint-disable react/prop-types */
import FormConsultation from 'pages/form-consultation';
import { IconCLose } from '../../../assets';
import PopupBottomsheet from '../PopupBottomsheet';
import { showToast } from 'helper';

const PopupBottomsheetFormConsultation = ({ show, togglePopup, onSubmitted }) => {
	const onClose = () => {
		togglePopup(false);
		showToast('Formulir tersimpan sebagai draft', {}, 'success');
	};

	const headerComponent = (
		<div className="tw-mt-[36px] tw-mb-[20px] tw-mx-4 tw-flex tw-flex-row">
			<IconCLose onClick={onClose} />
			<p className="title-20-medium tw-text-left tw-ml-3">Formulir Konsultasi</p>
		</div>
	);

	const handleSwipeableOpen = (isOpen) => {
		if (!isOpen) {
			onClose();
		}
	};

	return (
		<PopupBottomsheet
			isSwipeableOpen={show}
			setIsSwipeableOpen={handleSwipeableOpen}
			headerComponent={headerComponent}
			scrollLocking={false}
		>
			<div className="tw-max-h-[85vh] tw-overflow-y-scroll">
				{show ? <FormConsultation onSubmitted={onSubmitted} bottomSheet={true} /> : null}
			</div>
			{/* <div ref={ref} tabIndex={-1}></div> */}
		</PopupBottomsheet>
	);
};

export default PopupBottomsheetFormConsultation;
