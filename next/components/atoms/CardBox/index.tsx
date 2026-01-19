import React from 'react';

interface Props {
	className?: string;
	icon?: React.ReactNode;
	title?: string | React.ReactNode;
	titleClass?: string;
	body?: React.ReactNode;
	classNameBody?: string;
	containerRef?: any;
	renderMoreAction?: any;
}

const CardBox = ({
	className,
	icon,
	title,
	titleClass = 'card-chat-gray',
	body,
	classNameBody,
	containerRef,
	renderMoreAction,
}: Props) => {
	return (
		<div className={className} style={{ width: '100%' }} ref={containerRef}>
			{title && (
				<div className={`${titleClass} tw-flex tw-p-3 tw-justify-between tw-items-center`}>
					<div className="tw-flex tw-items-center">
						<div className="tw-pr-3">{icon}</div>
						<div className="tw-text-[16px] tw-font-roboto tw-font-medium tw-tracking-[.15px]">
							{title}
						</div>
					</div>
					{renderMoreAction && renderMoreAction()}
				</div>
			)}
			<div className={'tw-p-4 ' + classNameBody}>{body}</div>
		</div>
	);
};
export default CardBox;
