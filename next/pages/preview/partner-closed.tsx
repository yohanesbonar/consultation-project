import { ImgPartnerClosed } from '@images';
import { Wrapper } from '@organisms';
import { PartnerClosedTemplate } from '@templates';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';
import React from 'react';

const PreviewPartnerClosed = () => {
	const router = useRouter();
	const preview = JSON.parse(decodeURIComponent(String(router?.query?.preview)));

	usePartnerInfo({ isByLocal: true });

	return (
		<Wrapper
			title=""
			additionalStyleContent={{
				height: '100vh',
			}}
			additionalClassNameContent="!tw-relative tw-pb-22"
			header={false}
			footer
			isPreview
			preview={preview}
			backgroundColor={preview?.backgroundColor}
		>
			<PartnerClosedTemplate
				preview={router?.query?.preview ? preview : null}
				ImgPartnerClosed={ImgPartnerClosed}
				scheduleMapped={[
					{
						days: ['Senin'],
						hour_from: '14:14',
						hour_to: '20:16',
					},
					{
						days: ['Selasa'],
						hour_from: '00:00',
						hour_to: '23:23',
					},
					{
						days: ['Kamis'],
						hour_from: '00:00',
						hour_to: '23:11',
					},
				]}
				textColor={preview?.textColor}
			/>
		</Wrapper>
	);
};

export default PreviewPartnerClosed;
