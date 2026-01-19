import React, { useEffect } from 'react';
import { FileData } from '../../../types';
import { IconCloseRound } from '../../../assets/icons';
import { Gallery } from '../../organisms';

import { BUTTON_ID, FILE_CONST } from '../../../helper';

interface Props {
	data?: FileData[];
	activeIndex?: number;
	setData: (val?: FileData) => void;
}

const PreviewImage = ({ data, activeIndex = 0, setData }: Props) => {
	useEffect(() => {
		console.log('isShowing', data);
	}, [data]);

	if (!data) return null;
	return (
		<div className="tw-absolute tw-left-0 tw-top-0 tw-right-0 tw-bottom-0 tw-flex-1 tw-items-center tw-flex tw-flex-col tw-bg-black tw-z-50 tw-pb-[32px]">
			<Gallery
				onClose={() => setData(null)}
				data={{
					type: FILE_CONST.UPLOADED_PHOTO,
					files: data,
					activeIndex: activeIndex,
				}}
				idThumbnailPrefix={BUTTON_ID.BUTTON_PREVIEW}
			/>
			<IconCloseRound
				id={BUTTON_ID.BUTTON_CHAT_CLOSE_PREVIEW_IMAGE}
				className="tw-my-[32px] tw-cursor-pointer"
				onClick={() => {
					console.log('ke klik');
					setData(null);
				}}
			/>
		</div>
	);
};
export default PreviewImage;
