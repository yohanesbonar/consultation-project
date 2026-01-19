import React from 'react';
import { ButtonHighlight } from '@atoms';
import { BrokenLamp } from '@images';
import { Wrapper } from '@organisms';
import { useRouter } from 'next/router';
import usePartnerInfo from 'hooks/usePartnerInfo';

const NotFoundPayment = () => {
	const router = useRouter();
	// from local storage
	usePartnerInfo({ isByLocal: true });

	return (
		<Wrapper title="Terjadi Kesalahan" metaTitle="Terjadi Kesalahan">
			<div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-20 tw-px-8">
				<img className="tw-w-[240px] tw-h-[240px]" src={BrokenLamp.src} alt="not-found" />
				<p className="title-18-medium">Oops Terjadi Kesalahan</p>
				<p className="title-14-medium tw-text-center tw-px-[15px]">
					Maaf terjadi kesalahan untuk halaman yang hendak Anda akses. Silakan coba lagi nanti
				</p>
				<div className="tw-w-full tw-h-[48px] tw-px-4 tw-mt-4">
					<ButtonHighlight
						text="COBA LAGI"
						onClick={() => router.back()}
						className="tw-h-[48px]"
					/>
				</div>
			</div>
		</Wrapper>
	);
};

export default NotFoundPayment;
