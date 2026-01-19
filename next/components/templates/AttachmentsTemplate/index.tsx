import React from 'react';
import { Wrapper } from '../../index.js';
import { CHAT_CONST, PAGE_ID, copyValue, fetchMetadataInfo } from '../../../helper/index.js';
import { IconCloseGray, IconCopyWhite } from '@icons';
import { useRouter } from 'next/router.js';
import cx from 'classnames';

type Props = {
	data?: any;
};

const AttachmentsTemplate = ({ data }: Props) => {
	const router = useRouter();
	const isWebView = router.query?.type == CHAT_CONST.WEB_VIEW;
	const [metaData, setMetaData] = React.useState<any>({});
	const [isShowFlag, setIsShowFlag] = React.useState(true);

	const isLink = data?.type?.toUpperCase() == CHAT_CONST.LINK;
	const title = data?.label ?? metaData?.title ?? '';
	const desc = isLink || (isWebView && title) ? 'Tautan' : null;
	const src = data?.value ?? data?.src;

	const getMetaData = async () => {
		const meta = await fetchMetadataInfo(src);
		setMetaData(meta);
	};
	React.useEffect(() => {
		if (isWebView) getMetaData();
	}, [data, router.query]);

	return (
		<Wrapper
			additionalId={PAGE_ID.ATTACHMENTS}
			title={title}
			desc={desc}
			header={true}
			footer={false}
			additionalStyleContent={{ overflowY: 'hidden' }}
			titleClassName="title-16-medium"
			customRightBtn={
				isWebView && (
					<div
						onClick={() => copyValue(src, 'Link url berhasil di salin')}
						className="tw-mr-4 tw-cursor-pointer"
					>
						<IconCopyWhite />
					</div>
				)
			}
		>
			<iframe
				className={cx('tw-w-full', isShowFlag && isWebView ? 'tw-h-[88%]' : 'tw-h-full')}
				src={src}
			/>
			{isShowFlag && isWebView ? (
				<div
					onClick={() => setIsShowFlag(false)}
					className="tw-bg-info-50 tw-flex tw-items-center tw-py-2 tw-px-4 tw-bottom-0 tw-fixed tw-z-50 tw-max-w-500"
				>
					<p className="body-12-regular tw-mb-0">
						Jika link tidak dapat dibuka, Anda dapat copy link tersebut dan{' '}
						<span className="label-12-medium">membuka di browser langsung</span>
					</p>
					<div className="tw-w-6 tw-ml-3 ">
						<IconCloseGray />
					</div>
				</div>
			) : null}
		</Wrapper>
	);
};

export default AttachmentsTemplate;
