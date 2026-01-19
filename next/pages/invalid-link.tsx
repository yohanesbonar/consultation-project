import React, { useEffect, useState } from 'react';

import InfoPageTemplate from 'components/templates/InfoPageTemplate';
import { Wrapper } from '@organisms';
import { backHandling, getLocalStorage, LOCALSTORAGE } from 'helper';
import { ImgInvalidLink } from '@images';
import { useSelector } from 'react-redux';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';

const InvalidLink = () => {
	const [logoUrl, setLogoUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const { contactUrl, theme } = useSelector(({ general }: any) => general);
	const [backUrl, setbackUrl] = useState('');
	useEffect(() => {
		const backUrl = localStorage.getItem(LOCALSTORAGE.BACK_URL);
		if (backUrl) {
			setbackUrl(backUrl);
		}
	}, []);

	// from local storage
	usePartnerInfo({ isByLocal: true });

	useEffect(() => {
		getLogoUrl();
	}, []);

	const getLogoUrl = async () => {
		const logoUrl = await getLocalStorage(LOCALSTORAGE.LOGO);
		if (theme?.result?.data?.order?.partnerLogo) {
			setLogoUrl(theme?.result?.data?.order?.partnerLogo);
		} else {
			setLogoUrl(logoUrl != null && logoUrl != 'null' ? logoUrl : '');
		}
		setIsLoading(false);
	};

	const router = useRouter();
	const handleClickBack = backUrl
		? () => {
				console.debug('backUrl : ', backUrl);
				backHandling({
					router,
					backToPartner: backUrl,
				});
		  }
		: null;

	return (
		<Wrapper
			title="Halaman Tidak Dapat Diakses"
			header={true}
			footer={false}
			additionalStyleContent={{
				overflowY: 'hidden',
			}}
			onClickBack={handleClickBack}
		>
			<div className="tw-flex tw-h-full tw-flex-col">
				<InfoPageTemplate
					image={logoUrl}
					secondaryImage={ImgInvalidLink.src}
					isLoading={isLoading}
					title="Maaf, Akses Telekonsultasi Sudah Tidak Berlaku"
					description="Konsultasi sedang tidak tersedia saat ini atau kuota konsultasi sudah expired."
					hideDkonsulLogo
				/>
				<p className="tw-my-6 tw-text-center">
					Butuh Bantuan? Silakan{' '}
					<a href={contactUrl} className="tw-no-underline">
						Hubungi kami
					</a>
				</p>
			</div>
		</Wrapper>
	);
};

export default InvalidLink;
