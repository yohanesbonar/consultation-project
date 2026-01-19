import React from 'react';
import { connect } from 'react-redux';
import { BUTTON_CONST, TITLE_CONST } from '../../../helper';
import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { IconDone } from '../../../assets';

type Props = {
	isDisabled?: boolean;
	isOpenBottomsheet?: boolean;
	setIsOpenBottomsheet?: (val: boolean) => void;
};

const PopupBottomsheetConsultationInfo = ({
	isDisabled = false,
	isOpenBottomsheet = false,
	setIsOpenBottomsheet,
}: Props) => {
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={isOpenBottomsheet}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) {
					setIsOpenBottomsheet(false);
				}
			}}
			headerComponent={
				<div className="tw-mt-[36px] tw-mx-4">
					<p className="title-20-medium tw-text-left">
						{TITLE_CONST.TELECONSULTATION_INFORMATION}
					</p>
				</div>
			}
			footerComponent={
				<div className="tw-p-4">
					<ButtonHighlight
						onClick={() => {
							setIsOpenBottomsheet(false);
						}}
						text={BUTTON_CONST.I_UNDERSTAND}
						isDisabled={isDisabled}
					/>
				</div>
			}
		>
			<div className="tw-mb-4 tw-mx-4 tw-mt-[24px] tw-flex tw-flex-1 ">
				<IconDone />
				<p className="body-16-regular tw-ml-3 tw-mb-0">
					Ringkasan telekonsultasi telah dikirimkan ke email Anda.
				</p>
			</div>
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetConsultationInfo);
