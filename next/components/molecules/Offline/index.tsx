import React from 'react';
import { connect } from 'react-redux';
import { IconNoConnection } from '../../../assets';
import { OFFLINE_CONST } from '../../../helper';

const Offline = () => {
	return (
		<div className="tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center tw-text-center tw-mx-8 tw-mt-10">
			<IconNoConnection />
			<p className="title-20-medium tw-mt-6">{OFFLINE_CONST.NO_INTERNET_CONNECTION}</p>
			<p className="title-16-medium tw-mt-4">{OFFLINE_CONST.CHECK_YOUR_CONNECTION}</p>
		</div>
	);
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Offline);
