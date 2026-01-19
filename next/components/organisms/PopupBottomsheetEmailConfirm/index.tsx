import React from 'react';
import { connect } from 'react-redux';
import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { MdError } from 'react-icons/md';
import { IoMdMail } from 'react-icons/io';

type Props = {
	show?: boolean;
	toggle?: () => void;
	submit?: () => void;
	dataForm: any[];
};

const PopupBottomsheetEmailConfirm = ({ show, toggle, submit, dataForm }: Props) => {
	const email = dataForm?.find((val) => val.name === 'email')?.value;

	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={() => {
				toggle();
			}}
			footerComponent={
				<div className="tw-flex tw-flex-row tw-p-4 tw-gap-4">
					<ButtonHighlight
						id={'cancel'}
						color="grey"
						onClick={() => {
							toggle();
						}}
						text={'CEK LAGI'}
					/>
					<ButtonHighlight
						id={'accept'}
						onClick={() => {
							toggle();
							submit();
						}}
						text={'YAKIN'}
					/>
				</div>
			}
		>
			<div className="tw-mb-4 tw-mx-4 tw-mt-9 tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center tw-text-center">
				<div>
					<MdError size={100} color={'#FFB300'} />
					<p className="title-18-medium tw-mt-5">Anda Yakin Data Sudah Benar?</p>
					<div className="font-14 tw-font-normal tw-mt-2 tw-px-1">
						Pastikan semua data dan juga email Anda sudah benar karena notifikasi terkait
						konsultasi akan{' '}
						<div className="tw-font-semibold tw-inline">dikirim melalui email Anda</div>
					</div>
					<div className="tw-flex tw-py-3 tw-px-4 tw-mt-4 tw-flex-col tw-items-center tw-gap-1 tw-self-stretch tw-rounded-lg tw-border-2 tw-border-dashed tw-border-monochrome-50 tw-bg-monochrome-100">
						<div className="font-12 tw-text-tpy-700 tw-flex tw-gap-2 tw-items-center">
							<IoMdMail size={16} color={'#666666'} />
							<div>Email Terdaftar</div>
						</div>
						<div className="label-14-medium">{email ?? '-'}</div>
					</div>
				</div>
			</div>
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	// isChatExpired: state.general.isChatExpired,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetEmailConfirm);
