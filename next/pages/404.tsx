import React from 'react';
import { PAGE_ID } from '../helper';
import { Img404 } from '../assets';
import ErrorPageTemplate from '../components/templates/ErrorPageTemplate';
import usePartnerInfo from 'hooks/usePartnerInfo';

const Custom404 = () => {
	usePartnerInfo({ isByLocal: true });
	return (
		<ErrorPageTemplate
			id={PAGE_ID.NOT_FOUND}
			image={Img404.src}
			title={'Halaman Tidak Ditemukan'}
			description={'Maaf, halaman ini tidak tersedia.'}
		/>
	);
};

export default Custom404;
