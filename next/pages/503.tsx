import React from 'react';
import { PAGE_ID } from '../helper';
import { Img503, BotImg } from '../assets';
import ErrorPageTemplate from '../components/templates/ErrorPageTemplate';
import { useRouter } from 'next/router';

const Custom503 = () => {
	const router = useRouter();

	let id = PAGE_ID.ERROR_503;
	let img = Img503.src;
	let title = 'Sedang Ada Perbaikan';
	let description =
		'Mohon maaf, kalo kamu kurang nyaman. Tim kami sedang memperbaikinya untukmu.';

	if (router.query.type == 'bot') {
		id = PAGE_ID.ACCESS_DENIED;
		img = BotImg.src;
		title = 'Akses Ditolak';
		description =
			'Kami mendeteksi aktivitas tidak biasa yang dicurigai sebagai bot sehingga Anda tidak dapat mengakses halaman ini.';
	}

	return (
		<ErrorPageTemplate
			id={id}
			image={img}
			title={title}
			description={description}
		/>
	);
};

export default Custom503;
