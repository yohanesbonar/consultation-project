import parse from 'html-react-parser';
import { Wrapper } from '../../index.js';
import { PAGE_ID } from '../../../helper';

type Props = {
	tnc?: string;
};

const TNCTemplate = ({ tnc }: Props) => {
	return (
		<Wrapper additionalId={PAGE_ID.TNC} title={'T & C Telekonsultasi'} header={true}>
			<div className="tw-m-4 tw-p-4 bd-gray-2 tw-border-[1px] tw-border-solid tw-rounded-[8px] tw-overflow-y-scroll">
				{parse(tnc)}
			</div>
		</Wrapper>
	);
};

export default TNCTemplate;
