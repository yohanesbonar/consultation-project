import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { setErrorAlertRedux } from '../../../redux/trigger';

type ErrType = {
	data?: {
		message?: string;
	};
	danger?: boolean;
};

type Props = {
	className?: string;
	timeout?: any; // TODO: unused prop
	alertMessage?: any; // TODO: unused prop
	err?: ErrType;
};

const PopupErrorAlert = ({ className = '', timeout = 3000, alertMessage = '', err }: Props) => {
	useEffect(() => {
		if (err?.data) {
			setTimeout(() => {
				setErrorAlertRedux({ danger: true, data: null });
			}, 3000);
		}
	}, [err]);

	return (
		err?.data && (
			<div
				className={
					'tw-fixed tw-bottom-0 tw-left-4 tw-right-4 tw-z-[9000] tw-flex tw-justify-center'
				}
			>
				<div style={{ width: '468px' }}>
					<Alert
						color="danger"
						className="tw-bg-error-def"
						toggle={() => setErrorAlertRedux({ danger: true, data: null })}
					>
						<p className="tw-mb-0">{err?.data?.message}</p>
					</Alert>
				</div>
			</div>
		)
	);
};

const mapStateToProps = (state) => ({
	err: state.general.errorAlert,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupErrorAlert);
