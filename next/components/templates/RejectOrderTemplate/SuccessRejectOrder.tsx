import { IconAlertSuccess } from '@icons';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const SuccessRejectOrder = () => {
	const productTransactionDetail = useSelector(
		({ transaction }) => transaction?.productTransactionDetail,
	);

	const contentRef = useRef(null);
	const [marginTop, setMarginTop] = useState(0);

	useEffect(() => {
		if (contentRef.current) {
			const contentHeight = contentRef.current.getBoundingClientRect().height;
			setMarginTop(window.innerHeight / 2 - contentHeight);
		}
	}, []);

	return (
		<div
			ref={contentRef}
			className="tw-flex tw-flex-col tw-items-center tw-text-center"
			style={{ marginTop: marginTop }}
		>
			<IconAlertSuccess />
			<p className="tw-mb-0 tw-mt-7 title-18-medium ">Refund Sudah Diajukan</p>
			<p className="tw-mb-0 tw-mt-2 body-14-regular">
				Setelah refund berhasil, kami akan menginfokan kepada Anda melalui email
				<span className="label-14-medium tw-ml-1">
					{productTransactionDetail?.result?.patient_email ?? ''}
				</span>
			</p>
		</div>
	);
};

export default SuccessRejectOrder;
