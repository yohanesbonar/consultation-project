import { ButtonHighlight } from '@atoms';
import { IconPharmacyNotFound } from '@icons';
import { LottieNearbyPharmacy } from '@lotties';
import { Wrapper } from '@organisms';
import {
	BUTTON_CONST,
	BUTTON_ID,
	LOCALSTORAGE,
	PAGE_ID,
	PARAMS_CONST,
	getParsedLocalStorage,
} from 'helper';
import Lottie from 'lottie-react';
import Router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

type Props = {
	finding: boolean;
	resubmit: () => void;
};

const FindNearbyPharmacyTemplate = ({ finding, resubmit }: Props) => {
	const store = useSelector(({ general }: any) => general);
	const contactUrl = store?.contactUrl;

	const helpToAdmin = async () => {
		const cartLocal = await getParsedLocalStorage(LOCALSTORAGE.CART);

		if (cartLocal?.data?.userInfo || cartLocal?.data?.data?.patient_data) {
			const uInfo = cartLocal?.data?.userInfo ?? cartLocal?.data?.data?.patient_data;
			const patientName = cartLocal?.data?.data?.patient?.find(
				(v: any) => v?.label === 'Nama Pasien',
			)?.value;

			const message = `Halo Tim Dkonsul, mohon %0abantuannya untuk proses penebusan %0aresep *${
				cartLocal?.orderNumber ?? '-'
			}* atas nama %0a*${patientName}* dengan detail pengiriman %0a%0aAlamat: *${
				uInfo?.patient_address ?? '-'
			}*%0aKode pos: *${uInfo?.patient_postal_code ?? '-'}* %0aDetail Alamat: *${
				uInfo?.patient_detail_address ?? '-'
			}*`;
			window.location.href = contactUrl + `?text=${message}`;
		}
	};

	const footerComponent = () => {
		if (finding) {
			return null;
		}
		return (
			<div className="tw-mx-4 tw-pb-4">
				<ButtonHighlight
					idBtn={BUTTON_ID.BUTTON_CHANGE_ADDRESS}
					onClick={() => backToPrevious(PARAMS_CONST.FINDING_PHARMACY)}
					text={BUTTON_CONST.CHANGE_SEND_ADDRESS}
				/>
				<div className="tw-flex tw-justify-center tw-py-3 tw-mt-2">
					<p className="body-14-regular tw-mb-0">Tetap kirim ke lokasi Anda?</p>
					<p
						onClick={helpToAdmin}
						className="label-14-medium tw-text-secondary-def tw-mb-0 tw-ml-1"
					>
						Minta Bantuan Admin
					</p>
				</div>
			</div>
		);
	};

	const backToPrevious = (from?: string) => {
		let url = `/address/${Router.query?.backto == 'maps' ? 'maps' : ''}?token=${
			Router.query.token
		}&id=${Router?.query?.id}&fromPage=${from ? from : PARAMS_CONST.ADDRESS}${
			Router.query?.cart ? '&cart=1' : '&summary=1'
		}&token_order=${Router.query?.token_order}`;

		if (Router?.query?.fromPresc) {
			url += '&fromPresc=' + Router?.query?.fromPresc;
		}

		if (Router?.query?.checkout_instant && Router?.query?.checkout_instant == '0') {
			url += '&checkout_instant=' + Router?.query?.checkout_instant;
		}

		Router.replace(url);
	};

	const contentRef = useRef(null);
	const [marginTop, setMarginTop] = useState(0);

	useEffect(() => {
		if (contentRef.current) {
			const contentHeight = contentRef.current.getBoundingClientRect().height;
			setMarginTop(window.innerHeight / 2 - contentHeight + 60);
		}
	}, [finding]);
	return (
		<Wrapper
			additionalId={PAGE_ID.FINDING_PHARMACY}
			title="Mencari Apotek"
			header={!finding}
			footer={true}
			additionalStyleContent={{ overflowY: 'auto' }}
			footerComponent={footerComponent()}
			onClickBack={() => {
				if (
					Router.query?.fromPage === PARAMS_CONST.TRANSACTION_SUMMARY ||
					Router.query?.fromPage === PARAMS_CONST.FINDING_PHARMACY ||
					!Router.query?.token?.length
				) {
					if (Router.query?.wtoken == '1') {
						Router.push({
							pathname: '/prescription-detail',
							query: {
								token: Router.query?.token ?? '',
								token_order: Router.query?.token_order ?? '',
							},
						});
					} else {
						Router.push('/prescription-detail');
					}
				} else if (!Router.query?.fromPage) {
					Router.back();
				} else {
					backToPrevious();
				}
			}}
		>
			{finding ? (
				<div className="tw-overflow-y-hidden tw-flex tw-flex-col tw-p-5 tw-h-full">
					<div className="tw-m-auto tw-text-center">
						<div className="tw-relative tw-mx-auto tw-ml-[35px]" id="ic-finding-pharmacy">
							<Lottie
								loop={true}
								autoPlay={true}
								animationData={LottieNearbyPharmacy}
								style={{ width: 200, height: 200, marginLeft: 'auto', marginRight: 'auto' }}
							/>
						</div>

						<div className="tw-mt-4">
							<div className="title-20-medium">Mencari Apotek Terdekat</div>
							<div className="body-16-regular tw-mt-4">
								Harga obat dapat berbeda di setiap apotek
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="tw-overflow-y-hidden tw-flex tw-flex-col tw-p-5">
					<div ref={contentRef} className=" tw-text-center" style={{ marginTop: marginTop }}>
						<div className="tw-relative tw-mx-auto" id="ic-no-pharmachy-found">
							<IconPharmacyNotFound />
						</div>

						<div className="tw-mt-4">
							<div className="title-20-medium">Maaf, Apotek Tidak Ditemukan</div>
							<div className="body-16-regular tw-mt-4">
								Kami tidak menemukan apotek partner kami di sekitar alamat kirim Anda.
								Silakan coba lagi atau ubah lokasi Anda
							</div>
						</div>
					</div>
				</div>
			)}
		</Wrapper>
	);
};

export default FindNearbyPharmacyTemplate;
