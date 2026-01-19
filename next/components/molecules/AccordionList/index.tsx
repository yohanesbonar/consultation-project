import { TextStep } from '@atoms';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';

interface AccordionListProps {
	dataList?: any[];
	loading?: boolean;
}

const AccordionList: React.FC<AccordionListProps> = ({ dataList, loading = false }) => {
	const [open, setOpen] = useState('');
	const toggle = (id) => {
		if (open === id) {
			setOpen('');
		} else {
			setOpen(id);
		}
	};

	return (
		<div className="tw-mx-4 secondary-ic">
			{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
			{/* @ts-ignore */}
			<Accordion flush open={open} toggle={toggle}>
				{loading ? (
					<div className="tw-w-full tw-px-4">
						<Skeleton className="tw-mt-2 tw-w-full tw-h-12 tw-rounded-lg" />
						<Skeleton className="tw-mt-2 tw-w-full tw-h-12 tw-rounded-lg" />
					</div>
				) : (
					dataList?.length > 0 &&
					dataList?.map((data, index) => (
						<div
							key={'datalist' + index}
							className="tw-border-monochrome-300 tw-border-1 tw-rounded-lg tw-border-solid tw-overflow-clip tw-mt-3"
						>
							<AccordionItem key={index} className="tw-bg-white label-14-medium tw-mb-0">
								<AccordionHeader targetId={String(index)} className="title-16-medium">
									{data?.payment_category}
								</AccordionHeader>
								<AccordionBody accordionId={String(index)}>
									{data?.instruction?.map((e: string, i: number) => (
										<TextStep
											key={'text-step-' + i}
											data={{
												label: (i + 1).toString(),
												value: e,
											}}
										/>
									))}
								</AccordionBody>
							</AccordionItem>
						</div>
					))
				)}
			</Accordion>
		</div>
	);
};

export default AccordionList;
