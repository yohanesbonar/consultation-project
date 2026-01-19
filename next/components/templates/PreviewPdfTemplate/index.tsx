import { Wrapper } from '../../index.js';
import { PAGE_ID } from '../../../helper/index.js';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from 'reactstrap';

type PdfType = {
	numPages?: number;
};

type Props = {
	data?: string;
	onDocumentLoadSuccess?: (pdf: PdfType) => void;
	pageNumber?: number;
	numPages?: number;
	setPageNumber?: (num: number) => void;
};

const PreviewPdfTemplate = ({
	data,
	onDocumentLoadSuccess,
	pageNumber,
	numPages,
	setPageNumber,
}: Props) => {
	return (
		<Wrapper
			additionalId={PAGE_ID.PREVIEW_PDF}
			title={'Pratinjau PDF'}
			header={true}
			footer={false}
		>
			<div className="height-dynamic tw-w-full">
				{data && (
					<Document
						className="custom-pdf-container"
						file={data}
						onLoadSuccess={onDocumentLoadSuccess}
						onLoadError={() => {
							console.log('error');
						}}
						onLoadProgress={() => {
							console.log('progress');
						}}
					>
						<Page
							pageNumber={pageNumber}
							renderTextLayer={false}
							renderAnnotationLayer={false}
						/>

						{numPages && numPages > 1 ? (
							<div className="tw-absolute tw-bottom-6 !tw-left-0 !tw-right-0 tw-z-50">
								<div className="tw-flex tw-justify-center tw-bg-transparent tw-opacity-70">
									<Button
										color="white"
										onClick={() =>
											setPageNumber(pageNumber > 1 ? pageNumber - 1 : pageNumber)
										}
									>
										{'<'}
									</Button>
									<div className=" tw-rounded-[8px] tw-p-4 tw-mx-1  tw-bg-background-300 tw-text-xs">
										{pageNumber} of {numPages}
									</div>
									<Button
										color="white"
										onClick={() =>
											setPageNumber(pageNumber < numPages ? pageNumber + 1 : pageNumber)
										}
									>
										{'>'}
									</Button>
								</div>
							</div>
						) : null}
					</Document>
				)}
			</div>
		</Wrapper>
	);
};

export default PreviewPdfTemplate;
