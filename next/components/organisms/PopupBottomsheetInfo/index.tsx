import React from 'react';
import { connect } from 'react-redux';
import PopupBottomsheet from '../PopupBottomsheet';
import { Spinner } from 'reactstrap';
import { LABEL_CONST } from 'helper';

type Props = {
	data?: {
		title?: string;
		desc?: string;
		body?: React.ReactNode;
	};
	type?: 'checking_payment' | 'info';
	footerComponent?: React.ReactNode;
	isDisabled?: boolean;
	isOpenBottomsheet?: boolean;
	setIsOpenBottomsheet?: (val: boolean) => void;
};

const PopupBottomsheetInfo = ({
	data = {},
	footerComponent = null,
	isDisabled = false,
	isOpenBottomsheet = false,
	setIsOpenBottomsheet,
	type = 'info',
}: Props) => {
	return (
		<PopupBottomsheet
			expandOnContentDrag={false}
			isSwipeableOpen={isOpenBottomsheet}
			setIsSwipeableOpen={(isOpen) => {
				if (!isOpen) {
					setIsOpenBottomsheet(false);
				}
			}}
			headerComponent={
				data?.title ? (
					<div className="tw-mt-[36px] tw-mx-4">
						<p className="title-20-medium tw-text-left">{data?.title}</p>
					</div>
				) : null
			}
			footerComponent={footerComponent}
		>
			<div className="tw-mb-4 tw-mt-[24px] ">
				{data?.desc != null ? (
					data?.desc
				) : data?.body != null ? (
					data?.body
				) : type === 'checking_payment' ? (
					<div className="tw-px-4 tw-flex tw-flex-col tw-items-center">
						<div className="tw-relative tw-mt-3 tw-mb-6">
							<div className="tw-absolute tw-h-18 tw-w-18 tw-rounded-full tw-border-solid tw-border-gray-200 tw-border-8" />
							<Spinner color="primary" className="tw-h-18 tw-w-18 tw-border-8" />
						</div>
						<p className="title-20-medium">{LABEL_CONST.CHECK_PAYMENT_STATUS}</p>
						<p>{LABEL_CONST.PLEASE_WAITING_THIS_PAGE}</p>
					</div>
				) : null}
			</div>
		</PopupBottomsheet>
	);
};

const mapStateToProps = (state) => ({
	general: state.general,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PopupBottomsheetInfo);
