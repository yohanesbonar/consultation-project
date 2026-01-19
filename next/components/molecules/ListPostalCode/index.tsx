import React, { useEffect, useRef, useState } from 'react';
import { checkIsEmpty, getMasterPostalCode } from 'helper';
import { IconEmptySearch, IconSpinner } from '@icons';
import { useRouter } from 'next/router';
import debounce from 'debounce-promise';
import cx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

const debounceFetchPostCode = debounce(getMasterPostalCode, 1500);

export interface PostalCodeType {
	province: string;
	regency: string;
	district: string;
	village: string;
	code: string;
	id?: string;
}

interface IListPostalCodeProps {
	onSelect: (val: PostalCodeType) => void;
	selected: PostalCodeType;
	keyword: string;
}

export default function ListPostalCode(props: IListPostalCodeProps) {
	const router = useRouter();
	const { selected, onSelect, keyword } = props;
	const [isLoading, setIsLoading] = useState(false);
	const tokenOrder = useSelector(({ general }: any) => general?.tokenOrder);
	const [data, setData] = useState<PostalCodeType[]>([]);
	const pageRef = useRef<number>(1);
	const isLoadMoreRef = useRef<boolean>(false);
	const [isEmpty, setIsEmpty] = useState(false);
	const [fetchedAllData, setFetchedAllData] = useState(false);
	const limit = 10;

	const fetchPostCode = async (isLoadMore = false) => {
		if (!isLoadMore) setIsLoading(true);
		if (isLoadMore && fetchedAllData) return;
		setIsEmpty(false);
		try {
			const res = await debounceFetchPostCode(router.query?.token_order ?? tokenOrder, {
				keyword,
				page: pageRef.current ?? 1,
			});
			if (res?.meta?.acknowledge) {
				if (checkIsEmpty(res?.data) && (pageRef.current === 1 || !isLoadMore)) {
					setIsEmpty(true);
					setData([]);
				} else {
					setFetchedAllData(res?.data?.length < limit);
					const _data: PostalCodeType[] =
						!checkIsEmpty(pageRef.current) && pageRef.current > 1
							? [...(data ?? []), ...(res?.data ?? [])]
							: [...(res?.data ?? [])];
					_data.forEach((item: PostalCodeType) => {
						item.id = uuidv4();
					});
					setData(_data);
				}
			}
		} catch (error) {
			console.error('error: ', error);
		} finally {
			isLoadMoreRef.current = false;
			setIsLoading(false);
		}
	};

	useEffect(() => {
		pageRef.current = 1;
		setFetchedAllData(false);
		fetchPostCode();
	}, [keyword]);

	const handleLoadMore = (e: any) => {
		const isAtBottom = e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight;

		if (isAtBottom && !isLoadMoreRef.current) {
			isLoadMoreRef.current = true;
			pageRef.current += 1;
			fetchPostCode(true);
		}
	};

	return (
		<div
			className="tw-pb-4 tw-h-[60vh] tw-overflow-y-scroll scrollbar-hide"
			onScroll={handleLoadMore}
		>
			<div className="tw-px-4 tw-h-full">
				{isLoading ? (
					<div className="tw-h-[300px] tw-flex tw-justify-center tw-items-center">
						<div className="tw-animate-spin tw-h-max tw-w-max">
							<IconSpinner />
						</div>
					</div>
				) : isEmpty && checkIsEmpty(data) ? (
					<div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center">
						<IconEmptySearch />
						<p className="tw-mt-4 tw-mb-2 tw-text-lg tw-font-medium">Hasil Tidak Ditemukan</p>
						<p>Mohon gunakan kata kunci lainnya</p>
					</div>
				) : (
					<PostalCodeSelector
						data={data}
						selected={selected}
						setSelected={(selected: PostalCodeType) => onSelect(selected)}
					/>
				)}
				{!isLoading && !checkIsEmpty(data) && !isEmpty && !fetchedAllData ? (
					<div className="tw-h-12">
						<div className="tw-animate-spin tw-h-max tw-w-max tw-mx-auto">
							<IconSpinner />
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}

function PostalCodeSelector({
	data,
	selected,
	setSelected,
}: {
	data: PostalCodeType[];
	selected: PostalCodeType;
	setSelected: (selected: PostalCodeType) => void;
}) {
	return (
		<div className="tw-w-full tw-max-w-md tw-mx-auto">
			{data.map((item: PostalCodeType) => {
				const isSelected = selected?.id === item?.id;
				return (
					<div
						key={item.id}
						onClick={() => setSelected(item)}
						className={cx(
							'tw-mb-3 tw-flex tw-gap-4 tw-items-center tw-justify-between tw-border tw-border-solid tw-rounded-lg tw-py-2 tw-px-4 tw-cursor-pointer tw-transition-colors tw-duration-150',
							isSelected
								? 'tw-bg-secondary-50 tw-border-secondary-def'
								: 'tw-bg-white tw-border-gray-200 hover:tw-border-gray-400',
						)}
					>
						<div className="tw-flex-1">
							<div className={isSelected ? 'label-14-medium' : 'body-14-regular'}>
								{item.code}
							</div>
							<div className="body-12-regular tw-text-[#666666]">{`${item.village}, ${item.district}, ${item.regency}, ${item.province}`}</div>
						</div>
						<div
							className={`tw-w-5 tw-h-5 tw-rounded-full tw-border-2 tw-border-solid tw-flex tw-items-center tw-justify-center ${
								isSelected ? 'tw-border-primary-def' : 'tw-border-gray-400'
							}`}
						>
							{isSelected && (
								<div className="tw-w-2.5 tw-h-2.5 tw-bg-primary-def tw-rounded-full"></div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
