import React, { useEffect, useState } from 'react';
import {
	IconArrowRightGray,
	IconCameraColor,
	IconDocsColor,
	IconGaleryColor,
} from '../../../assets';
import { PopupAlert } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import InputFile from '../../atoms/InputFile';
import {
	BUTTON_ID,
	FILE_CONST,
	FILE_TYPE,
	showToast,
	validateSize,
	validateType,
} from '../../../helper';
import IconCloseGray from 'assets/icons/ic-close-gray';

interface Props {
	data?: {
		value?: string;
	};
	isSwipeableOpen: boolean;
	setIsSwipeableOpen: (open?: boolean) => void;
	onChange: (type?: string, files?: any, fileType?: string) => void;
}

const FilePicker = ({ data, isSwipeableOpen = false, setIsSwipeableOpen, onChange }: Props) => {
	const [alertMessage, setAlertMessage] = useState('');

	const buttons = [
		{
			icon: <IconCameraColor />,
			name: 'Kamera',
			subname: 'Ambil gambar',
			label: FILE_CONST.PHOTO,
			accept: 'image/jpeg, image/png',
			capture: 'environment',
			limit: 10,
			idComponent: BUTTON_ID.BUTTON_CHAT_CAMERA_PICKER,
			fileType: FILE_TYPE.CAMERA,
		},
		{
			icon: <IconGaleryColor />,
			iconActive: <IconGaleryColor />,
			name: 'Pilih Gambar di Galeri',
			subname: 'Format berupa png, jpg.',
			label: FILE_CONST.PHOTO,
			accept: 'image/jpeg, image/png',
			limit: 10,
			idComponent: BUTTON_ID.BUTTON_CHAT_GALLERY_PICKER,
			fileType: FILE_TYPE.GALLERY,
		},
		{
			icon: <IconDocsColor />,
			iconActive: <IconDocsColor />,
			name: 'Dokumen',
			subname: 'Format berupa pdf. Max 5 MB/file',
			label: FILE_CONST.FILE,
			accept: 'application/pdf',
			limit: 3,
			idComponent: BUTTON_ID.BUTTON_CHAT_FILE_PICKER,
			fileType: FILE_TYPE.DOCS,
		},
	];

	useEffect(() => {
		console.log('swipeable changed');
	}, [isSwipeableOpen]);

	const handleOnChange = (element, filesParams) => {
		const files = [...filesParams];
		console.log('files', files, files.length);
		if (files.length > element?.limit) {
			setAlertMessage('Batas pilihan maksimum ' + element?.limit + ' ' + element?.label + '.');
			return;
		}

		const resTypeValidation = validateType(files, element?.label);
		if (!resTypeValidation.isValid) {
			setAlertMessage(resTypeValidation?.message);
			return;
		}

		const resValidation = validateSize(files);
		if (resValidation.isValid) {
			onChange(element.label, files, element?.fileType);
			if (element?.fileType === FILE_TYPE.CAMERA) {
				showToast('Ukuran gambar disesuaikan otomatis.', { marginBottom: 80 }, 'success');
			}
		} else {
			setAlertMessage(resValidation?.message);
		}
	};

	return (
		<PopupBottomsheet
			isSwipeableOpen={isSwipeableOpen}
			setIsSwipeableOpen={(isOpen) => setIsSwipeableOpen(isOpen)}
			idCloseSuffix={BUTTON_ID.FILE_PICKER}
		>
			<div className="tw-mt-4 tw-flex flex-column">
				<div
					onClick={() => setIsSwipeableOpen(!isSwipeableOpen)}
					className="tw-flex tw-mb-4 tw-ml-4"
				>
					<IconCloseGray />
					<p className="tw-mb-0 tw-ml-4 title-18-medium">Lampiran</p>
				</div>
				<div className="tw-flex tw-flex-col tw-mb-5">
					{buttons.map((element, index) => {
						return (
							<InputFile
								key={'inputFile' + index}
								id={element?.idComponent}
								data={data}
								acceptedType={element?.accept}
								capture={element?.capture as boolean | 'user' | 'environment' | undefined}
								onChange={(val: any) => handleOnChange(element, val)}
								className="hover-gray"
								body={
									<div className="tw-flex tw-justify-between tw-w-full tw-items-center tw-pb-4 tw-px-4">
										<div className="tw-flex tw-items-center">
											<div className="tw-mb-1.5 tw-flex-1">{element.icon}</div>
											<div className="tw-ml-3">
												<p className="label-14-medium tw-mb-0 tw-text-black">
													{element.name}
												</p>
												<p className="body-12-regular tw-mb-0 tw-text-tpy-700">
													{element.subname}
												</p>
											</div>
										</div>

										<IconArrowRightGray />
									</div>
								}
							/>
						);
					})}
				</div>
				<PopupAlert
					alertMessage={alertMessage}
					setAlertMessage={(msg) => setAlertMessage(msg)}
				/>
			</div>
		</PopupBottomsheet>
	);
};

export default FilePicker;
