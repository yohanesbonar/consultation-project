import { OnboardingTemplate } from '@templates';
import usePartnerInfo from 'hooks/usePartnerInfo';
import { useRouter } from 'next/router';
import React from 'react';

const PreviewOnboarding = () => {
	const router = useRouter();
	const preview = JSON.parse(decodeURIComponent(String(router?.query?.preview)));
	usePartnerInfo({ isByLocal: true });

	return (
		<OnboardingTemplate
			footerComponent={() => <></>}
			tryagainComponent={() => <></>}
			error={false}
			timeLeft={null}
			data={null}
			handlePhoenixReceive={() => {
				//
			}}
			duration={null}
			handleTimeLeft={() => {
				//
			}}
			handleUpdateTime={() => {
				//
			}}
			logoUrl=""
			isLoadingLogo={false}
			preview={router?.query?.preview ? preview : null}
			isHaveFindingDoctor={false}
			backgroundColor={preview?.backgroundColor}
			textColor={preview?.textColor}
		/>
	);
};

export default PreviewOnboarding;
