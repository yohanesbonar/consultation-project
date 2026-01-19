import React, { useEffect } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { IconCloseRound } from '../../../assets';
import { BUTTON_ID } from '../../../helper';
import cx from 'classnames';

type Props = {
	idCloseSuffix?: string;
	isSwipeableOpen?: boolean;
	setIsSwipeableOpen?: (val: boolean) => void;
	styleSwipeable?: any; // TODO: unused prop
	data?: any; // TODO: unused prop
	headerComponent?: React.ReactNode;
	footerComponent?: React.ReactNode;
	children?: React.ReactNode;
	isWithCloseButton?: boolean;
	expandOnContentDrag?: boolean;
	fixed?: boolean;
	scrollLocking?: boolean;
	additionalClassName?: string;
};

const PopupBottomsheet = ({
	idCloseSuffix = '',
	isSwipeableOpen = false,
	setIsSwipeableOpen = () => {
		/* intentional */
	},
	styleSwipeable,
	data,
	headerComponent,
	footerComponent,
	children = <div />,
	isWithCloseButton = false,
	expandOnContentDrag = true,
	fixed = false,
	scrollLocking = null,
	additionalClassName = '',
}: Props) => {
	useEffect(() => {
		console.log('isswipeableopen', isSwipeableOpen);
	}, [isSwipeableOpen]);

	const renderHeaderComponent = () => {
		return (
			<div>
				{isWithCloseButton && (
					<IconCloseRound
						id={BUTTON_ID.BUTTON_CLOSE_BOTTOMSHEET + idCloseSuffix}
						className="btn-floating-top-right tw-cursor-pointer"
						onClick={() => setIsSwipeableOpen(false)}
					/>
				)}
				{headerComponent}
			</div>
		);
	};

	return (
		<BottomSheet
			scrollLocking={scrollLocking}
			open={isSwipeableOpen}
			className={cx('tw-absolute tw-z-20', additionalClassName)}
			expandOnContentDrag={expandOnContentDrag}
			onDismiss={() => setIsSwipeableOpen(false)}
			snapPoints={({ minHeight, maxHeight }) => [
				fixed ? maxHeight - 16 : minHeight,
				!expandOnContentDrag
					? minHeight
					: isWithCloseButton
					? maxHeight * 0.9 - 32
					: maxHeight * 0.9,
			]}
			footer={footerComponent}
			header={renderHeaderComponent()}
		>
			{children}
		</BottomSheet>
	);
};

export default PopupBottomsheet;
