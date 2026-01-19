import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CHAT_CONST } from '../../../helper';

const SkeletonChat = () => {
	const renderChat = (type = CHAT_CONST.DOCTOR) => {
		return (
			<div
				className={
					' tw-mb-1.5 tw-flex ' +
					(type == CHAT_CONST.DOCTOR ? 'tw-justify-start' : 'tw-justify-end')
				}
			>
				<div className="tw-w-[80%] ">
					<Skeleton className="tw-h-[60px] !tw-rounded-[16px]" />
					<p className={type == CHAT_CONST.DOCTOR ? 'tw-text-left' : 'tw-text-right'}>
						<Skeleton className="!tw-w-[100px]" />
					</p>
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className="tw-flex tw-mt-4 tw-justify-center tw-items-center">
				<p
					className="title-14-medium tw-my-1.5 tw-text-tpy-700 tw-w-[150px]"
					style={{ textAlign: 'center' }}
				>
					<Skeleton className="!tw-leading-6" />
				</p>
			</div>

			<div>
				{renderChat(CHAT_CONST.DOCTOR)}
				{renderChat(CHAT_CONST.PATIENT)}
			</div>
		</div>
	);
};

export default SkeletonChat;
