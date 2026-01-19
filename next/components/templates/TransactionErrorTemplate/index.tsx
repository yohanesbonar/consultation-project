import { ButtonHighlight, Wrapper, ImageLoading } from '../../index.js';
import { BUTTON_CONST, BUTTON_ID, PAGE_ID, getTransactionDetail } from '../../../helper';
import { IconDkonsul40 } from '@icons';
import Skeleton from 'react-loading-skeleton';
import Router, { useRouter } from 'next/router.js';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DetailTransactionData } from '@types';
import moment from 'moment';
import { ImgInvalidLink } from '@images';

interface Props {
	isLoading?: boolean;
}

const TransactionErrorTemplate = ({ isLoading = false }: Props) => {
	const router = useRouter();
	const contactUrl = useSelector(({ general }: any) => general.contactUrl);
	const { token, transaction_xid } = router.query;
	const [data, setData] = useState<DetailTransactionData>();
	const [expiredAt, setExpiredAt] = useState('');

	useEffect(() => {
		(async () => {
			try {
				if (token && transaction_xid) {
					const res = await getTransactionDetail({
						id: String(transaction_xid),
						token: String(token),
					});

					if (res?.meta?.acknowledge) {
						setData(res?.data);
						const isExpired = new Date(res?.data?.consultation_expired_at) < new Date();
						if (isExpired) {
							setExpiredAt(
								` pada ${moment(data?.consultation_expired_at).format('D MMM YYYY')}`,
							);
						}
					}
				}
			} catch (error) {
				//
			}
		})();
	}, [token, transaction_xid]);

	const renderFooterButton = () => {
		return (
			<div className="tw-p-4 ">
				<div className="tw-flex tw-flex-col tw-flex-1 ">
					{data?.order_only_from_partner ? null : (
						<ButtonHighlight
							id={BUTTON_ID.BUTTON_ORDER_AGAIN}
							onClick={() => {
								Router.replace({
									pathname: '/order',
									query: Router.query,
								});
							}}
							text={BUTTON_CONST.ORDER_AGAIN}
							isLoading={false}
							circularContainerClassName="tw-h-[16px]"
							circularClassName="circular-inner-16"
						/>
					)}

					<p className="tw-mt-4 tw-text-center">
						Butuh Bantuan? Silakan{' '}
						<a href={contactUrl} className="tw-no-underline" id={BUTTON_ID.BUTTON_CONTACT_US}>
							Hubungi kami
						</a>
					</p>
				</div>
			</div>
		);
	};

	return (
		<Wrapper
			additionalId={PAGE_ID.TRANSACTION_ERROR}
			title={'Halaman Tidak Dapat Diakses'}
			header={true}
			footer={true}
			additionalStyleContent={{
				overflow: 'auto',
				display: 'flex',
			}}
			headClass={'tw-fixed tw-w-full tw-top-0 tw-bg-white tw-bg-opacity-90 tw-z-[2]'}
		>
			<div className="tw-mt-header tw-pt-5 tw-flex tw-justify-center tw-flex-col tw-px-7 tw-flex-1 ">
				<div className="tw-self-center">
					{isLoading ? <Skeleton className="tw-h-[90px] tw-z-[1]" /> : <IconDkonsul40 />}
				</div>
				<div className="tw-self-center tw-justify-center tw-items-center tw-flex-1 tw-flex tw-flex-col">
					<div className="tw-w-[240px] tw-h-[240px] tw-relative tw-mx-auto">
						<ImageLoading data={{ url: ImgInvalidLink.src }} />
					</div>
					<p className="title-20-medium tw-text-center tw-mb-2 tw-mt-8">
						Maaf, Akses Telekonsultasi Sudah Tidak Berlaku
					</p>
					<p className="tw-text-center ">{'Kuota Anda sudah expired' + expiredAt}</p>
				</div>
				{renderFooterButton()}
			</div>
		</Wrapper>
	);
};

export default TransactionErrorTemplate;
