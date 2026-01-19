import { connect } from 'react-redux';
import React from 'react';
import { IconDurationEnd } from '../../../assets';
import { getFormattedDate } from 'helper';

interface Props {
	data?: {
		consultationType?: string;
		expiredAt?: string | Date;
		closed_at?: string | Date;
	};
	hasPresc?: boolean;
	patientData?: {
		email?: string;
	};
}

const ExpiredChat = ({ data, patientData, hasPresc = false }: Props) => {
	return (
		<div className="tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center tw-text-center tw-mx-[32px]">
			<IconDurationEnd />
			<p className="tw-mt-2 title-18-medium">Telekonsultasi Sudah Berakhir</p>
			<p className="body-14-regular tw-mt-2 tw-break-words">
				Telekonsultasi berakhir
				{data?.closed_at != null ? ' pada ' + getFormattedDate(data?.closed_at) : ''}.{' '}
				{hasPresc ? 'Resep dan catatan' : 'Ringkasan telekonsultasi'} sudah dikirim ke email{' '}
				{patientData?.email != null ? (
					<strong className="tw-break-all"> {patientData?.email}</strong>
				) : null}
				. Terima kasih sudah menggunakan dkonsul.
			</p>
		</div>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExpiredChat);
