/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';

import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { IconWarning } from '@icons';
import classNames from 'classnames';

type ChangeParamsType = {
	id?: number | string;
	valueText?: string;
};

type Props = {
	isShowing?: boolean;
	setIsShowing?: (val: boolean) => void;
	styleSwipeable?: any; // TODO: unused prop
	data?: any;
	body?: React.ReactNode;
	footer?: React.ReactNode;
};

const PopupModalInfo = ({
	isShowing = false,
	setIsShowing = (_val) => {},
	data,
	body,
	footer,
}: Props) => {
	const [dataTemp, setDataTemp] = useState(data);

	useEffect(() => {
		if (!isShowing) {
			setDataTemp(data);
		}
	}, [isShowing]);

	return (
		<Modal isOpen={isShowing} centered className="tw-border-none">
			<ModalBody
				className={classNames(
					' tw-px-5 tw-pt-5 tw-mx-4',
					'tw-rounded-t-lg tw-border-none',
					'tw-bg-white tw-flex tw-flex-col tw-gap-4',
					'tw-justify-center tw-items-center',
				)}
			>
				<IconWarning />
				{body}
			</ModalBody>
			<ModalFooter className="tw-bg-white tw-rounded-b-lg tw-border-none tw-px-5 tw-pb-5 tw-pt-0 tw-mx-4">
				{footer}
			</ModalFooter>
		</Modal>
	);
};

export default PopupModalInfo;
