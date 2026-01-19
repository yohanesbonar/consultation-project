/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { ButtonHighlight } from '@atoms';

type Props = {
	children?: React.ReactNode;
	idNext?: string;
	idPrev?: string;
	classNameContainer?: string;
	className?: string;
	isPopoverOpen?: boolean;
	data?: any; // TODO: unused prop
	onChange?: any; // TODO: unused prop
	dotActivePosition?: number;
	dotLength?: number;
	title?: string;
	desc?: string;
	onClickNext?: () => void;
	onClickPrev?: () => void;
	targetId?: string;
	isOverlay?: boolean;
};

const Coachmark = ({
	children,
	idNext = '',
	idPrev = '',
	classNameContainer,
	className,
	isPopoverOpen = false,
	data,
	onChange = () => {},
	dotActivePosition = 1,
	dotLength = 3,
	title = '',
	desc = '',
	onClickNext = () => {},
	onClickPrev,
	targetId = 'PopoverTarget',
	isOverlay,
}: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	useEffect(() => {
		setIsOpen(isPopoverOpen);
	}, [isPopoverOpen]);

	return (
		<div className={classNameContainer ?? 'tw-flex-1 tw-flex tw-relative'}>
			<div id={targetId} className={(className ?? '') + (isOpen ? ' tw-z-10' : '')}>
				{children}
			</div>
			<Popover placement="bottom" isOpen={isOpen} target={targetId}>
				<PopoverBody>
					<div className="tw-text-black tw-flex-1 tw-w-full">
						<p className="title-20-medium">{title}</p>
						<p className="body-16-regular tw-mt-4">{desc}</p>
						<div className="tw-flex-1 tw-flex tw-items-center tw-mt-4">
							<p className="body-16-regular tw-flex-1">
								{dotActivePosition + ' dari ' + dotLength}
							</p>

							{onClickPrev != null && (
								<div className="tw-w-18 tw-mr-8">
									<ButtonHighlight
										id={idPrev}
										color="grey"
										onClick={onClickPrev}
										text="KEMBALI"
									/>
								</div>
							)}
							<div className="tw-w-18 tw-mr-2">
								<ButtonHighlight
									id={idNext}
									onClick={onClickNext}
									text={dotLength == dotActivePosition ? 'SELESAI' : 'LANJUT'}
								/>
							</div>
						</div>
					</div>
				</PopoverBody>
			</Popover>
			{isOverlay && <div className="absolute-0 tw-bg-black tw-bg-opacity-80 tw-z-1" />}
		</div>
	);
};

export default Coachmark;
