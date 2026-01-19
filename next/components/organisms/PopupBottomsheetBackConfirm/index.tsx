import React from 'react';
import { connect } from 'react-redux';
import { ButtonHighlight } from '../../atoms';
import PopupBottomsheet from '../PopupBottomsheet';
import { MdError } from 'react-icons/md';

type Props = {
	show?: boolean;
	toggle?: () => void;
	submit?: () => void;
	emailSent?: string;
	body?: React.ReactNode;
};

const PopupBottomsheetBackConfirm = ({ show, toggle, submit, emailSent, body }: Props) => {
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={show}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) toggle();
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
					<p className="title-18-medium tw-mt-5">Anda Akan Kembali ke Formulir Konsultasi</p>
					<div className="font-14 tw-font-normal tw-mt-2 tw-px-1">
						{body ? (
							body
						) : (
							<>
								Invoice sudah dikirim ke email Anda
								<div className="tw-font-semibold tw-inline">
									{emailSent ? ' ' + emailSent : ''}.
								</div>{' '}
								Anda akan mendapatkan email notifikasi saat pembayaran Anda berhasil.
							</>
						)}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetBackConfirm);
