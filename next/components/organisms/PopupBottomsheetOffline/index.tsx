import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BUTTON_CONST, COMPONENT_CONST } from '../../../helper';
import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { setIsOpenOfflineBottomsheet as setIsOpenOfflineBottomsheetRedux } from '../../../redux/trigger';

type GeneralType = {
	networkState?: {
		isOnline?: boolean;
		isDetected?: boolean;
	};
	isOpenOfflineBottomsheet?: boolean;
	timeLeft?: number;
};

type Props = {
	callback?: () => void;
	isDisabled?: boolean;
	general: GeneralType;
};

const PopupBottomsheetOffline = ({
	callback = () => {
		/* intentional */
	},
	isDisabled = false,
	general,
}: Props) => {
	const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(general?.isOpenOfflineBottomsheet);

	useEffect(() => {
		setIsOpenBottomsheet(general?.isOpenOfflineBottomsheet);
	}, [general?.isOpenOfflineBottomsheet]);

	useEffect(() => {
		if (!general?.networkState?.isOnline && general?.networkState?.isDetected) {
			setIsOpenOfflineBottomsheetRedux(!general?.networkState?.isOnline);
			// setIsOpenBottomsheet(!general?.networkState?.isOnline);
		}
		if (general?.networkState?.isOnline) {
			setIsOpenOfflineBottomsheetRedux(false);
			// setIsOpenBottomsheet(false);
		}
	}, [general?.networkState]);

	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={isOpenBottomsheet}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) {
					setIsOpenOfflineBottomsheetRedux(false);
					callback();
				}
			}}
			footerComponent={
				<div className="tw-p-4">
					<ButtonHighlight
						onClick={() => {
							setIsOpenOfflineBottomsheetRedux(false);
							setIsOpenBottomsheet(false);
						}}
						text={BUTTON_CONST.CLOSE}
						isDisabled={isDisabled}
					/>
				</div>
			}
		>
			<div className="tw-mb-4 tw-mx-4 tw-mt-9 tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center tw-text-center">
				{COMPONENT_CONST.BOTTOMSHEET_OFFLINE_COMPONENT}
			</div>
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetOffline);
