// TODO: fix these lints
/* eslint-disable react/prop-types */
import { Divider, TextLabel } from '@atoms';
import { IconPay } from '@icons';
import { VoucherDetailType } from '@types';
import Title from 'components/atoms/Title';
import { FaClock } from 'react-icons/fa';
import moment from 'moment';
import { numberToIDR } from 'helper';
import parse from 'html-react-parser';
import Skeleton from 'react-loading-skeleton';

interface VoucherDetailBoxProps {
	data: VoucherDetailType;
	isLoading?: boolean;
}

const VoucherDetailBox: React.FC<VoucherDetailBoxProps> = ({ data, isLoading = false }) => {
	return (
		<view className="tw-mx-4 tw-px-4 tw-py-5 tw-my-6 tw-flex-1 tw-flex tw-flex-col tw-z-1 tw-relative tw-bg-monochrome-100 tw-rounded-2xl tw-shadow-md">
			<Title title={data?.name} center isLoading={isLoading} />
			<div className="tw-flex tw-justify-around tw-mt-5">
				<TextLabel
					className="tw-flex tw-flex-col tw-text-center tw-gap-2"
					classNameTitle="tw-justify-center"
					Icon={<FaClock size={16} className="tw-text-tpy-700" />}
					data={{
						label: 'Berlaku Hingga',
						value: moment(data?.end_date).format('DD MMM YYYY'),
					}}
					isLoadingValue={isLoading}
				/>
				<TextLabel
					className="tw-flex tw-flex-col tw-text-center tw-gap-2"
					classNameTitle="tw-justify-center"
					Icon={<IconPay size={16} className="tw-text-tpy-700" />}
					data={{
						label: 'Minimal Transaksi',
						value: data?.min_transaction ? numberToIDR(data?.min_transaction) : '-',
					}}
					isLoadingValue={isLoading}
				/>
			</div>
			<Divider type="dashed" className="tw-border-t-2 tw-my-5" />
			<div>
				<p className="title-16-medium tw-text-tpy-700">Syarat dan Ketentuan</p>
				<div className="tw-mt-1 tw-flex tw-flex-col tw-gap-2 font-12">
					{isLoading ? <Skeleton count={3.5} /> : parse(data?.tnc ?? '')}
				</div>
			</div>
		</view>
	);
};

export default VoucherDetailBox;
