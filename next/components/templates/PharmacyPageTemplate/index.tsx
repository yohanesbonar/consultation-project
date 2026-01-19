import * as React from 'react';
import { CardPharmacy, PopupBottomSheetDetailPharmacy, Wrapper } from '@organisms';
import { checkoutCart, MESSAGE_CONST, navigateWithQueryParams } from 'helper';
import { useRouter } from 'next/router';
import useBrowserNavigation from 'hooks/useBrowserNavigation';
import { useSelector } from 'react-redux';
import useFetchEprescription from 'hooks/useFetchEprescription';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';

export default function PharmacyPageTemplate() {
	const router = useRouter();
	const store = useSelector(({ seamless }) => seamless);
	const merchent = store?.merchentList;
	const merchentSelected = router.query?.selectedMerchent;

	const [isShowDetailPharmacy, setIsShowDetailPharmacy] = React.useState<boolean>(false);
	const [data, setData] = React.useState<any>(null);
	const [selectedId, setSelectedId] = React.useState(null);

	const { prescription }: any = useFetchEprescription();

	const toggleDetailPharmacy = (dataParams: any) => {
		setIsShowDetailPharmacy(!isShowDetailPharmacy);
		setData(dataParams);
	};

	const handleBackButton = () => {
		navigateWithQueryParams('/transaction/cart', { ...router.query }, 'href');
	};

	useBrowserNavigation(() => {
		handleBackButton();
	});

	const submitCheckoutCart = async (id?: number) => {
		setSelectedId(id);
		const bodyReq = {
			merchant_id: id ?? data?.merchant?.id,
			prescription_id: prescription?.id,
			address: prescription?.patient_data?.patient_address,
			detail_address: prescription?.patient_data?.patient_detail_address ?? '',
			phone_number: prescription?.patient_data?.patient_phonenumber,
			postal_code: prescription?.patient_data?.patient_postal_code,
			latitude: prescription?.patient_data?.patient_latitude,
			longitude: prescription?.patient_data?.patient_longitude,
			products: prescription?.prescriptions?.map((items: any) => {
				return {
					product_id: parseInt(items?.productId),
					quantity: items?.qty,
				};
			}),
		};
		try {
			const res = await checkoutCart({
				data: bodyReq,
				token: router?.query?.token_order,
			});
			if (res?.meta?.acknowledge) {
				setSelectedId(null);
				handleBackButton();
			} else {
				toast.error(res?.meta?.message, {
					style: { background: '#B00020', color: '#FFFFFF' },
				});
			}
		} catch (error) {
			setSelectedId(null);
			toast.error(MESSAGE_CONST.SOMETHING_WENT_WRONG, {
				style: { background: '#B00020', color: '#FFFFFF' },
			});
			console.log(error);
		}
	};

	return (
		<Wrapper onClickBack={handleBackButton} title="Opsi Apotek" metaTitle="Opsi Apotek">
			<div className="tw-pt-4 tw-px-4">
				<p className="title-16-medium tw-mb-0">Pilih Apotek untuk Beli Obat</p>
				<p className="body-12-regular tw-mb-4">menampilkan {merchent?.data?.length} apotek</p>
				{merchent?.loading && <Skeleton height={150} />}
				{merchent?.data &&
					merchent?.data?.map((item: any, index: number) => (
						<CardPharmacy
							key={index}
							item={item}
							isSelected={merchentSelected == item?.merchant?.id}
							onClickDetail={() => toggleDetailPharmacy(item)}
							onChoose={(id) => submitCheckoutCart(id)}
							loading={!isShowDetailPharmacy ? selectedId : false}
						/>
					))}
			</div>

			<PopupBottomSheetDetailPharmacy
				disabled={merchentSelected == data?.merchant?.id}
				data={data}
				show={isShowDetailPharmacy}
				loading={isShowDetailPharmacy ? selectedId : false}
				onShow={toggleDetailPharmacy}
				onSubmit={() => submitCheckoutCart(data?.merchant?.id)}
			/>
		</Wrapper>
	);
}
