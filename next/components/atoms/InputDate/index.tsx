import React from 'react';

import { Button, Input } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/id';
import { IconCalendar } from '../../../assets';
import { calculateAge } from '../../../helper';

export interface IInputDateProps {
	data: any;
	onChange: (value: any) => void;
}

export default function InputDate(props: IInputDateProps) {
	const { data, onChange } = props;
	return (
		<div className="tw-relative tw-overflow-clip tw-flex tw-m-0 tw-py-4.5 tw-px-4 tw-bg-monochrome-150 tw-rounded tw-cursor-pointer tw-items-center">
			<p className="tw-mb-0 tw-flex-1 text-break body-16-regular">
				{data?.value
					? moment(data?.value ?? new Date()).format('DD MMMM YYYY') +
					  ' (' +
					  calculateAge(data?.value ?? new Date()) +
					  ' Tahun)'
					: data?.placeholder ?? 'Pilih Tanggal'}
			</p>
			<Button color="gray" className="tw-border-0 tw-p-0">
				<IconCalendar />
			</Button>
			<Input type="date" id="inputDate" onChange={(e) => onChange(e.target.value)} />
		</div>
	);
}
