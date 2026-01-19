import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CardBoxReceipt } from '../../atoms';

import { ButtonHighlight } from '../../atoms';
import { IconEmptyNotes, IconReceiptNotes } from '../../../assets/index.js';

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
	isNotHaveBoth?: boolean;
}

const NotesPatient = ({
	noteDetail,
	noteRef,
	containerRef,
	scrollToType,
	className = '',
	showEmptyContent = false,
	isNotHaveBoth = false,
}: Props) => {
	const [updated, setUpdated] = useState<boolean>(false);

	useEffect(() => {
		noteDetail?.statusMessage == 'EXPIRED' && setUpdated(true);
	}, [noteDetail?.statusMessage]);

	const emptyNotes =
		!noteDetail?.data?.resume &&
		!noteDetail?.data?.diagnoses?.length &&
		!noteDetail?.data?.advice;

	const bodyNotes = emptyNotes ? (
		<div className="tw-flex tw-flex-row">
			<IconEmptyNotes />
			<div className="tw-flex tw-flex-1 label-12-medium tw-ml-2 tw-text-error-def">
				Dokter tidak memberikan catatan khusus untuk pasien
			</div>
		</div>
	) : (
		<>
			<div ref={noteRef} className={`${updated ? 'gray-scale ' : ''} tw-pb-4`}>
				{(noteDetail?.data?.resume || showEmptyContent) && (
					<>
						<div className="label-12-medium tw-text-tpy-700">Catatan Pasien</div>
						<p
							className={`body-14-regular tw-mb-4 ${updated ? 'tw-line-through' : ''} ${
								noteDetail?.data?.resume == null && 'tw-text-error-600'
							}`}
						>
							{noteDetail?.data?.resume ?? PRESCRIPTION_CONST.NOT_GIVEN}
						</p>
					</>
				)}

				{(noteDetail?.data?.diagnoses?.length > 0 || showEmptyContent) && (
					<>
						<div className="tw-text-[12px] tw-font-roboto tw-font-medium tw-text-tpy-700">
							Diagnosis berdasarkan ICD-10
						</div>
						<div className={`body-14-regular tw-mb-4 ${updated ? 'tw-line-through' : ''}`}>
							{noteDetail?.data?.diagnoses && noteDetail?.data?.diagnoses.length ? (
								noteDetail?.data?.diagnoses.map((val, i) =>
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
						<div className="label-12-mediumtw-text-tpy-700">Saran Dokter</div>
						<p
							className={`body-14-regular tw-mb-0 ${updated ? 'tw-line-through' : ''} ${
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
						color="grey-link"
						text="LIHAT PERUBAHAN"
						onClick={() => scrollToType('NOTE')}
					/>
				</div>
			)}
		</>
	);

	return (
		<CardBoxReceipt
			containerRef={containerRef}
			className={cx(styles.cardBoxClass, className, isNotHaveBoth ? 'tw-pb-0' : '')}
			icon={<IconReceiptNotes />}
			title="Catatan Pasien"
			titleClass={''}
			body={bodyNotes}
			type="catatanPasien"
		/>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NotesPatient);
