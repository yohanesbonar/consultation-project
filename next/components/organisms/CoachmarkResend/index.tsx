import React, { useEffect, useState } from 'react';
import { Button, Popover } from 'reactstrap';

import { IconSendOn } from '../../../assets/index.js';

import { BUTTON_ID } from '../../../helper';

type Props = {
	children?: React.ReactNode;
	classNameContainer?: string;
	className?: string;
	isPopoverOpen?: boolean;
	onResendClick?: () => void;
	targetId?: string;
};

const CoachmarkResend = ({
	children,
	classNameContainer,
	className,
	isPopoverOpen = false,
	onResendClick = () => {
		/* intentional */
	},
	targetId = 'PopoverTarget',
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		setIsOpen(isPopoverOpen);
	}, [isPopoverOpen]);

	return (
		<div className={classNameContainer ?? 'tw-flex-1 tw-flex'}>
			<div id={targetId} className={(className ?? '') + (isOpen ? ' tw-z-10' : '')}>
				{children}
			</div>
			<Popover
				placement="bottom"
				isOpen={isOpen}
				target={targetId}
				hideArrow={true}
				popperClassName="popoverBody tw-p-2"
			>
				{/* <PopoverBody> */}
				<div
					style={{
						backgroundColor: 'white',
						width: 'fit-content',
						padding: '8px',
						display: 'block',
						marginLeft: 'auto',
						marginRight: '0',
						borderRadius: '10px',
					}}
				>
					<Button
						id={BUTTON_ID.BUTTON_CHAT_RESEND}
						className="tw-p-0 tw-px-[15px]"
						onClick={onResendClick}
						style={{
							color: 'dodgerblue',
							backgroundColor: 'transparent',
							border: 'none',
						}}
					>
						KIRIM ULANG
					</Button>
					<IconSendOn />
				</div>
				{/* </PopoverBody> */}
			</Popover>
		</div>
	);
};

export default CoachmarkResend;
