import Router from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconBack } from '../../../assets';
import { BUTTON_ID, PAGE_ID } from '../../../helper';

type Props = {
	id: string;
};

const SkeletonHeader = ({ id = PAGE_ID.CHAT_DETAIL }: Props) => {
	const renderHeaderContent = () => {
		if (id == PAGE_ID.CHAT_DETAIL || id == PAGE_ID.CHAT_HISTORY) {
			return (
				<div className="tw-flex tw-items-center tw-justify-between wd-100p">
					<div className={` tw-flex tw-flex-1 tw-p-1 rounded-28 link-cursor tw-items-center`}>
						<div className="menu-img online">
							<Skeleton circle={true} width={36} height={36} />
						</div>

						<div className="tw-flex-1 tw-mx-2">
							<p className="title-20-medium tx-white lh-24px tx-spacing-015 tw-mb-0 text-truncate wd-50p">
								<Skeleton />
							</p>
							<p className="tw-mt-0.5 tx-12 tx-white lh-13px tx-spacing-019 tw-mb-0 tw-font-roboto text-truncate wd-65p">
								<Skeleton />
							</p>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="tw-flex tw-items-center tw-justify-between wd-100p">
					<div className={` tw-flex tw-flex-1 tw-p-1 rounded-28 link-cursor tw-items-center`}>
						<div className=" tw-mx-2 wd-50p">
							<p className="title-20-medium tx-white lh-24px tx-spacing-015 tw-mb-0 text-truncate">
								<Skeleton />
							</p>
						</div>
					</div>
				</div>
			);
		}
	};

	return (
		<div className={'menu ' + (id == PAGE_ID.CHAT_HISTORY ? 'tw-mx-2' : '')}>
			{id != PAGE_ID.CHAT_HISTORY ||
				(id != PAGE_ID.CHAT_DETAIL && (
					<a
						id={BUTTON_ID.BUTTON_BACK + '-' + id}
						data-bs-display="static"
						className="menu-link"
						onClick={() => Router.back()}
					>
						<div className="menu-img online">
							<IconBack />
						</div>
					</a>
				))}
			{renderHeaderContent()}
		</div>
	);
};

export default SkeletonHeader;
