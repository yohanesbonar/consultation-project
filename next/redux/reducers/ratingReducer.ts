import { SET_RATE_LIST } from '../actions/ratingAction';

const initialState = {
	rating: {
		data: [],
		loading: false,
		error: false,
	},
};

const ratingReducer = (
	state = initialState,
	action: {
		type: string;
		payload: any;
	},
) => {
	switch (action.type) {
		case SET_RATE_LIST:
			return { ...state, rating: action.payload };
		default:
			return { ...state };
	}
};

export default ratingReducer;
