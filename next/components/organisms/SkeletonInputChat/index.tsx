import React from 'react';
import { Input, InputGroup, InputGroupText } from 'reactstrap';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconAddDisable, IconSendOff } from '../../../assets';

const SkeletonInputChat = () => {
	return (
		<div className="tw-flex tw-flex-1 tw-p-4">
			<div className="tw-flex tw-flex-1 tw-items-center tw-bg-white">
				<InputGroup
					className={
						'tw-mr-3 bg-gray tw-rounded-[28px] tw-overflow-x-clip tw-grid tw-grid-cols-12 '
					}
				>
					<Input
						type="textarea"
						className="form-control !tw-w-full tw-flex-1 tw-col-span-10 tw-b-0 tw-p-4 body-16-regular tw-mr-0 xs-screen-font"
						name="InputArea"
						placeholder="Berikan pesan disini…"
						rows={1}
						style={{ resize: 'none' }}
						maxLength={2200}
						disabled={true}
					/>

					<InputGroupText className="link-cursor bg-gray tw-p-4 tw-b-0 tw-ml-0 tw-rounded-[8px]">
						<IconAddDisable className="tw-self-end" />
					</InputGroupText>
				</InputGroup>
				<div className={'tw-rounded-[50%] img-56 tw-self-end tw-p-4'}>
					<IconSendOff />
				</div>
			</div>
		</div>
	);
};

export default SkeletonInputChat;
