import React, { useEffect, useState } from 'react';
import Router from 'next/router';

import { ButtonHighlight, Wrapper } from '../components/index.js';
import { FindDoctor, NotFoundDoctor } from '../assets/index.js';
import { checkCookieSession, PhoenixClient } from '../helper/index.js';

export default function Index(props: any) {
	const [timeLeft, setTimeLeft] = useState(15);
	const [doctorDecline, setDoctorDecline] = useState(false);
	useEffect(() => {
		if (timeLeft > 0) {
			updateTimeLeft();
			// if (timeLeft == 1) {
			// 	Router.push({
			// 		pathname: '/chat-detail',
			// 	});
			// } else {
			// 	updateTimeLeft();
			// }
		} else {
			return;
		}
	}, [timeLeft]);

	const updateTimeLeft = () => {
		setTimeout(() => {
			if (doctorDecline) {
				return;
			}
			setTimeLeft(timeLeft - 1);
		}, 1000);
	};

	const onReceiveSocket = (res) => {
		if (res.body == 'approve') {
			Router.push({
				pathname: '/chat-detail',
			});
		} else if (res.body == 'decline') {
			console.log('decline');
			setDoctorDecline(true);
			// setTimeLeft(0);
		}
	};
	return (
		<Wrapper
			{...props}
			title="index"
			header={false}
			footer={true}
			footerComponent={
				<div className="tw-m-4">
					{timeLeft > 0 && !doctorDecline ? (
						<ButtonHighlight color="grey" text={'BATALKAN (' + timeLeft + ' DETIK)'} />
					) : (
						<div className="absolute-bottom-16 ">
							<ButtonHighlight
								text={'COBA LAGI'}
								onClick={() => {
									setTimeLeft(15);
									setDoctorDecline(false);
								}}
							/>
							<ButtonHighlight
								className="tw-mt-4"
								color="grey"
								text="INGATKAN JIKA SUDAH TERSEDIA"
							/>
						</div>
					)}
				</div>
			}
		>
			{timeLeft > 0 ? (
				<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
					<img src={FindDoctor.src} />
					<div className="tw-mx-[43px] tw-mt-[24px]">
						<p className="title-20-medium tw-mb-0 tw-text-center">Mohon Menunggu</p>
						<p className="tw-mt-4 tw-mb-0 font-16 tw-text-center">
							Kami sedang menghubungkan dengan dokter yang tersedia.
						</p>
					</div>
				</div>
			) : (
				<div className="tw-items-center tw-justify-center tw-h-full tw-w-full tw-flex tw-flex-col">
					<img src={NotFoundDoctor.src} />
					<div className="tw-mx-[43px] tw-mt-[24px]">
						<p className="title-20-medium tw-mb-0 tw-text-center">
							Maaf Dokter Belum Tersedia Saat Ini
						</p>
						<p className="tw-mt-4 tw-mb-0 font-16 tw-text-center">
							Anda mungkin menghubungi dokter di luar jam kerja atau semua dokter sedang
							sibuk.
						</p>
					</div>
				</div>
			)}
			<PhoenixClient
				onReceiveMessage={(res) => {
					onReceiveSocket(res);
					console.log('res onReceiveMessage index', res);
				}}
			/>
		</Wrapper>
	);
}

export const getServerSideProps = async ({ req, res }) => {
	const consulTime = await checkCookieSession(req, res);
	if (consulTime?.timeLeft > 0 && consulTime?.status == 'STARTED') {
		return {
			redirect: {
				destination: '/chat-detail',
				permanent: false,
			},
		};
	} else if (
		(consulTime?.status != null && consulTime?.status != 'STARTED') ||
		consulTime?.timeLeft < 1 ||
		!consulTime?.timeLeft
	) {
		return {
			notFound: true,
		};
	}
	return { props: {} };
};
