import React, { useEffect, useState } from 'react';
import { PreviewPdfTemplate } from '../components/index.js';
import { useRouter } from 'next/router';
import { getFile, getUrls } from '../helper/index.js';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import usePartnerInfo from 'hooks/usePartnerInfo';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PreviewPdf = (props) => {
	const router = useRouter();
	const [data, setData] = useState('');
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	// from local storage
	usePartnerInfo({ isByLocal: true });

	useEffect(() => {
		if (router.query) {
			getBlob();
		}
	}, [router.query]);

	const getBlob = async () => {
		try {
			const file = await getFile(router.query?.source);
			const temp = getUrls(file);
			setData(temp);
		} catch (error) {
			console.log('error get blob pdf preview : ', error);
		}
	};

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	return (
		<PreviewPdfTemplate
			{...props}
			data={data}
			onDocumentLoadSuccess={onDocumentLoadSuccess}
			pageNumber={pageNumber}
			setPageNumber={setPageNumber}
			numPages={numPages}
		/>
	);
};

export const getServerSideProps = async ({ req, res, query }) => {
	return { props: {} };
};

export default PreviewPdf;
