import React, { useEffect, useState } from 'react';

import InfoPageTemplate from 'components/templates/InfoPageTemplate';
import { Wrapper } from '@organisms';
import { getLocalStorage, LOCALSTORAGE, TNC_CONST } from 'helper';
import { ImgBlock } from '@images';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const BlockedPage = () => {
	const [logoUrl, setLogoUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const contactUrl = useSelector(({ general }: any) => general.contactUrl);

	useEffect(() => {
		getLogoUrl();
	}, []);

	const getLogoUrl = async () => {
		const logoUrl = await getLocalStorage(LOCALSTORAGE.LOGO);
		setLogoUrl(logoUrl != null && logoUrl != 'null' ? logoUrl : '');
		setIsLoading(false);
	};

	return (
		<Wrapper
			header={false}
			footer={false}
			additionalStyleContent={{
				overflowY: 'hidden',
			}}
			onClickBack={() => {
				//
			}}
		>
			<div className="tw-flex tw-h-full tw-flex-col">
				<InfoPageTemplate
					image={logoUrl}
					secondaryImage={ImgBlock.src}
					isLoading={isLoading}
					title="Maaf, Akses Anda Diblokir"
					description={
						<>
							<div className="tw-mt-4 tw-text-[14px] tw-px-2">
								{'Maaf, akses Anda diblokir karena diduga adanya pelanggaran terhadap '}
								<Link href={`/tnc?type=${TNC_CONST.TNC}`}>
									<a>{'Syarat dan Ketentuan'}</a>
								</Link>
								{' kami.'}
							</div>
							<div className="tw-mt-4 tw-text-[14px] tw-px-2">
								{
									'Jika Anda merasa ada kekeliruan dan membutuhkan informasi lebih lanjut, silakan '
								}
								<Link href={contactUrl}>
									<a>{'Hubungi Kami'}</a>
								</Link>
							</div>
						</>
					}
				/>
			</div>
		</Wrapper>
	);
};

export default BlockedPage;
