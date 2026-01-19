import {
	SET_ADRESS,
	SET_CURRENT_ADRESS,
	SET_SHIPPING_LIST,
	SET_LAT_LONG,
	SET_PERMISSION_LOCATION,
	SET_MERCHECNT_LIST,
} from '../actions/seamlessPrescriptionAction';

const initialState = {
	adressList: {
		result: [],
		loading: false,
		error: false,
	},
	currentAddress: {
		postalCode: null,
		result: false,
		original: false,
		loading: true,
		error: false,
	},
	shippingList: {
		data: false,
		loading: true,
		error: false,
	},
	latLng: {
		lat: -6.175392,
		lng: 106.827153,
		currLat: -6.175392,
		currLng: 106.827153,
	},
	merchentList: {
		data: false,
		loading: true,
		error: false,
	},
	isPermissionLocation: '',
};

const seamlessReducer = (
	state = initialState,
	action: {
		type: string;
		payload: any;
	},
) => {
	switch (action.type) {
		case SET_ADRESS:
			return { ...state, adressList: action.payload };
		case SET_CURRENT_ADRESS:
			return { ...state, currentAddress: action.payload };
		case SET_SHIPPING_LIST:
			return { ...state, shippingList: action.payload };
		case SET_LAT_LONG:
			return { ...state, latLng: action.payload };
		case SET_PERMISSION_LOCATION:
			return { ...state, isPermissionLocation: action.payload };
		case SET_MERCHECNT_LIST:
			return { ...state, merchentList: action.payload };
		default:
			return { ...state };
	}
};

export default seamlessReducer;
