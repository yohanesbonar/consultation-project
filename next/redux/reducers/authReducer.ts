import { SET_VERIFY_DATA } from '../actions/authAction';

let initialState = {
	verifyData: {},
};

if (typeof window !== 'undefined') {
	initialState = {
		verifyData: {},
	};
}

const authReducer = (
	state = initialState,
	action: {
		type: string;
		payload: any;
	},
) => {
	switch (action.type) {
		case SET_VERIFY_DATA:
			return { ...state, verifyData: action.payload };
		default:
			return { ...state };
	}
};

export default authReducer;
