import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	COMPONENT_CONST,
	getLocalStorage,
	LOCALSTORAGE,
	removeLocalStorage,
	setLocalStorage,
} from '../../../helper';
import { setIsChatExpired } from '../../../redux/trigger';
import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';

type DataType = {
	okButtonText?: string;
};

type Props = {
	data?: DataType;
	callback?: () => void;
	isDisabled?: boolean;
	isChatExpired?: boolean;
};

const PopupBottomsheetExpiredConsultation = ({
	data,
	callback = () => {
		/* intentional */
	},
	isDisabled = false,
	isChatExpired = false,
}: Props) => {
	const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(isChatExpired);
	useEffect(() => {
		if (isChatExpired) {
			checkifAlreadyShowing();
		}
	}, [isChatExpired]);

	const checkifAlreadyShowing = async () => {
		const res = await getLocalStorage(LOCALSTORAGE.CHAT_EXPIRED_ALREADY);
		console.log('global.orderNumber', global.orderNumber);
		if (!res || res != global.orderNumber) {
			setIsOpenBottomsheet(true);
			removeLocalStorage(LOCALSTORAGE.CHAT_EXPIRED_ALREADY);
		}
	};

	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={isOpenBottomsheet}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) callback();
			}}
			footerComponent={
				<div className="tw-p-4">
					<ButtonHighlight
						onClick={() => {
							callback();
							setIsChatExpired(false);
							setIsOpenBottomsheet(false);
							setLocalStorage(LOCALSTORAGE.CHAT_EXPIRED_ALREADY, global.orderNumber);
						}}
						text={data?.okButtonText ?? 'TUTUP'}
						isDisabled={isDisabled}
					/>
				</div>
			}
		>
			<div className="tw-mb-4 tw-mx-4 tw-mt-9 tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center tw-text-center">
				{COMPONENT_CONST.BOTTOMSHEET_EXPIRED_COMPONENT}
			</div>
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	isChatExpired: state.general.isChatExpired,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetExpiredConsultation);
