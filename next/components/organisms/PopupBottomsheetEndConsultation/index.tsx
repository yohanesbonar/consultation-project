import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setIsOpenBottomsheetEndConsul as setIsOpenBottomsheetEndConsulRedux } from '../../../redux/trigger';
import { getDocComplete } from '../../../helper';
import { setEndConsultation } from '../../../redux/actions';
import { CustomPopup } from '@molecules';
import { IconWarning } from '@icons';

type Props = {
	openBottomsheetEndConsul?: boolean;
	email?: string;
	isPresc?: boolean;
	setPopupFeedback?: (_val: boolean) => void;
	endConsultation?: (_orderNumber: string | number, body: any) => void;
};

const PopupBottomsheetEndConsultation = ({
	openBottomsheetEndConsul,
	setPopupFeedback,
	endConsultation,
	email,
	isPresc = false,
}: Props) => {
	const [docComplete, setDocComplete] = useState(false);
	useEffect(() => {
		if (openBottomsheetEndConsul) {
			checkDoc(global.orderNumber);
		}
	}, [openBottomsheetEndConsul]);

	const checkDoc = async (orderNumber) => {
		const result = await getDocComplete(orderNumber);
		setDocComplete(result?.data?.documentComplete || false);
	};

	return (
		<CustomPopup
			close={() => setIsOpenBottomsheetEndConsulRedux(false)}
			icon={<IconWarning />}
			show={openBottomsheetEndConsul}
			title={
				isPresc
					? 'Untuk Tebus Resep Anda Perlu Akhiri Konsultasi. Akhiri Sekarang?'
					: 'Yakin Akhiri Konsultasi?'
			}
			desc={
				<span>
					Konsultasi Anda akan berakhir. Ringkasan resep dan catatan akan dikirim ke email{' '}
					<span className="label-14-medium">{email}</span>
				</span>
			}
			primaryButtonLabel={isPresc ? 'AKHIRI DAN LANJUT TEBUS RESEP' : 'AKHIRI'}
			primaryButtonAction={async () => {
				if (docComplete) {
					await endConsultation(global.orderNumber, {});
					setIsOpenBottomsheetEndConsulRedux(false);
				} else {
					await endConsultation(global.orderNumber, {});
					setIsOpenBottomsheetEndConsulRedux(false);
					setPopupFeedback(true);
				}
			}}
			secondaryButtonLabel="NANTI DULU"
			secondaryButtonAction={() => setIsOpenBottomsheetEndConsulRedux(false)}
		/>
	);
};

const mapStateToProps = (state) => ({
	openBottomsheetEndConsul: state.general.openBottomsheetEndConsul,
});

const mapDispatchToProps = (dispatch) => ({
	endConsultation: (orderNumber, body) => dispatch(setEndConsultation(orderNumber, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetEndConsultation);
