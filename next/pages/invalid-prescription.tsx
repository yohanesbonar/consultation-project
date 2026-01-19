import React from 'react';
import { InvalidPrescription } from '@images';
import { Wrapper } from '@organisms';
import { useRouter } from 'next/router';
import usePartnerInfo from 'hooks/usePartnerInfo';

const NotFoundPayment = () => {
	const router = useRouter();

	// from local storage
	usePartnerInfo({ isByLocal: true });

	return (
		<Wrapper title=" " metaTitle="Terjadi Kesalahan">
			<div className="tw-flex tw-h-full tw-pb-14 tw-flex-col tw-items-center tw-justify-center">
				<img
					className="tw-w-[240px] tw-h-[240px]"
					src={InvalidPrescription.src}
					alt="not-found"
				/>
				<p className="title-18-medium">Maaf, Tidak Dapat Tebus Resep</p>
				<p className="title-14-medium tw-text-center tw-px-[15px]">
					Resep sudah melewati tanggal expired
				</p>
			</div>
		</Wrapper>
	);
};

export default NotFoundPayment;
