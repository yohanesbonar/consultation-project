import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CardBox } from '../../atoms';

import { ButtonHighlight } from '../../atoms';
import { IconMoreHorizontal, IconReceiptNotes } from '../../../assets/index.js';

import { BUTTON_ID, PRESCRIPTION_CONST } from '../../../helper';
import { ChatItem } from '../../../types/Chat';
import styles from './index.module.css';
import cx from 'classnames';

interface Props {
	noteDetail?: ChatItem;
	noteRef?: any;
	containerRef?: any;
	scrollToType?: (val?: string) => void;
	className?: string;
	showEmptyContent?: boolean;
	onClickMoreItems?: any;
}

const NotesPatient = ({
	noteDetail,
	noteRef,
	containerRef,
	scrollToType,
	className = '',
	showEmptyContent = false,
	onClickMoreItems,
}: Props) => {
	const [updated, setUpdated] = useState<boolean>(false);

	useEffect(() => {
		noteDetail?.statusMessage == 'EXPIRED' && setUpdated(true);
	}, [noteDetail?.statusMessage]);

	const bodyNotes = (
		<>
			<div ref={noteRef} className={cx('tw-pb-4', updated ? 'tw-opacity-30' : '')}>
				{(noteDetail?.data?.resume || showEmptyContent) && (
					<>
						<div className="tw-pb-3 title-14-medium tw-mb-0">Catatan Pasien</div>
						<p
							className={`body-14-regular tw-mb-4  ${
								noteDetail?.data?.resume == null && 'tw-text-error-600'
							}`}
						>
							{noteDetail?.data?.resume ?? PRESCRIPTION_CONST.NOT_GIVEN}
						</p>
					</>
				)}

				{(noteDetail?.data?.diagnoses?.length > 0 || showEmptyContent) && (
					<>
						<div className="tw-pb-3 title-14-medium tw-mb-0">
							Diagnosis berdasarkan ICD-10
						</div>
						<div className={`body-14-regular tw-mb-4`}>
							{noteDetail?.data?.diagnoses && noteDetail?.data?.diagnoses.length ? (
								noteDetail?.data?.diagnoses.map((val: any, i: number) =>
									val != null && val.code != null ? (
										<p key={i} className="body-14-regular tw-mb-0">
											{val.code} - {val.description}
										</p>
									) : (
										<p key={i} className="body-14-regular tw-mb-0">
											- {val}
										</p>
									),
								)
							) : (
								<p className="body-14-regular tw-mb-0 tw-text-error-600">
									{PRESCRIPTION_CONST.NOT_GIVEN}
								</p>
							)}
						</div>
						<div className="tw-pb-3 title-14-medium tw-mb-0">Saran Dokter</div>
						<p
							className={`body-14-regular tw-mb-0 ${
								noteDetail?.data?.resume == null && 'tw-text-error-600'
							}`}
						>
							{noteDetail?.data?.advice ?? PRESCRIPTION_CONST.NOT_GIVEN}
						</p>
					</>
				)}
			</div>
			{updated && (
				<div>
					<ButtonHighlight
						id={BUTTON_ID.BUTTON_CHAT_NOTE_SEE_CHANGES}
						color="grey"
						text="LIHAT TERBARU"
						onClick={() => scrollToType('NOTE')}
						classNameBtn="tw-bg-monochrome-100"
						childrenClassName="label-14-medium"
					/>
				</div>
			)}
		</>
	);

	const renderMoreAction = () => {
		if (!onClickMoreItems) return null;
		return (
			<div onClick={onClickMoreItems} className="tw-ml-2 tw-cursor-pointer">
				<IconMoreHorizontal />
			</div>
		);
	};

	return (
		<CardBox
			containerRef={containerRef}
			className={cx(styles.cardBoxClass, className)}
			icon={<IconReceiptNotes />}
			title={updated ? 'Catatan Pasien Diubah' : 'Catatan Pasien'}
			titleClass="card-chat-gray"
			body={bodyNotes}
			renderMoreAction={renderMoreAction}
		/>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NotesPatient);
